'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase-server';
import { downloadAndUploadImage, getGoogleDriveFolderId, isGoogleDriveApiConfigured } from '@/lib/supabase/image-utils';
import { findVendorMediaInFolder } from '@/lib/supabase/image-utils';
import { revalidateTag } from 'next/cache';

/**
 * List all subfolders in a Google Drive folder
 */
async function listSubfolders(folderId: string, apiKey: string): Promise<Array<{ id: string; name: string }>> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&fields=files(id,name)&key=${apiKey}&orderBy=name`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Google Drive API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return (data.files || []).map((file: any) => ({ id: file.id, name: file.name }));
  } catch (error) {
    console.error('Error listing subfolders:', error);
    throw error;
  }
}

/**
 * Match vendor name to folder name (fuzzy matching)
 */
function matchVendorToFolder(vendorName: string, folderName: string): boolean {
  if (!vendorName || !folderName) return false;
  
  // Normalize both names: lowercase, remove special chars, trim
  const normalize = (str: string) => 
    str.toLowerCase()
       .replace(/[^a-z0-9\s]/g, '')
       .replace(/\s+/g, ' ')
       .trim();
  
  const normalizedVendor = normalize(vendorName);
  const normalizedFolder = normalize(folderName);
  
  // Exact match
  if (normalizedVendor === normalizedFolder) return true;
  
  // Check if vendor name contains folder name or vice versa (more lenient)
  if (normalizedVendor.includes(normalizedFolder) || normalizedFolder.includes(normalizedVendor)) {
    return true;
  }
  
  // Check if they share significant words (at least 1 word match for short names, 2 for longer)
  const vendorWords = normalizedVendor.split(' ').filter(w => w.length > 2);
  const folderWords = normalizedFolder.split(' ').filter(w => w.length > 2);
  const matchingWords = vendorWords.filter(w => folderWords.includes(w));
  
  // More lenient matching: 1 word match is enough if names are short, or 2+ words for longer names
  if (matchingWords.length >= 2) return true;
  if (matchingWords.length === 1 && (vendorWords.length <= 3 || folderWords.length <= 3)) return true;
  
  // Check for partial word matches (e.g., "Traiteur" matches "Traiteur El Amane")
  for (const vWord of vendorWords) {
    for (const fWord of folderWords) {
      if (vWord.length >= 4 && fWord.length >= 4) {
        if (vWord.includes(fWord) || fWord.includes(vWord)) {
          return true;
        }
      }
    }
  }
  
  return false;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { folderLink } = await request.json();
    const resolvedParams = await params;
    const vendorId = resolvedParams.id;

    if (!folderLink) {
      return NextResponse.json(
        { success: false, message: 'Folder link is required' },
        { status: 400 }
      );
    }

    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    const folderId = getGoogleDriveFolderId(folderLink);
    if (!folderId) {
      return NextResponse.json(
        { success: false, message: 'Invalid Google Drive folder link' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!apiKey || !isGoogleDriveApiConfigured()) {
      return NextResponse.json(
        { success: false, message: 'Google Drive API is not configured. Please add GOOGLE_DRIVE_API_KEY to your .env.local file.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = await createClient();

    // Get the specific vendor
    const { data: vendor, error: vendorError } = await supabase
      .from('vendor_leads')
      .select('id, business_name, logo_url, gallery_urls')
      .eq('id', vendorId)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { success: false, message: `Vendor not found: ${vendorError?.message || 'Unknown error'}` },
        { status: 404 }
      );
    }

    let targetFolderId = folderId;
    let folderName = 'Direct folder';

    // Check if the folder is a master folder (contains subfolders) or a direct vendor folder
    // First, try to list subfolders
    const subfolders = await listSubfolders(folderId, apiKey);
    
    // If subfolders exist, try to find matching subfolder for this vendor
    if (subfolders.length > 0) {
      const matchingFolder = subfolders.find(folder => 
        matchVendorToFolder(vendor.business_name, folder.name)
      );

      if (matchingFolder) {
        targetFolderId = matchingFolder.id;
        folderName = matchingFolder.name;
      } else {
        // No matching subfolder found, but folder has subfolders
        // This might be a master folder but vendor name doesn't match
        return NextResponse.json({
          success: false,
          message: `No matching subfolder found for vendor "${vendor.business_name}" in the provided folder. Found ${subfolders.length} subfolders but none matched.`,
          folderName: 'Not found',
          warnings: [`No matching folder found for "${vendor.business_name}"`]
        });
      }
    }
    // If no subfolders, assume the provided folder is the direct vendor folder

    try {
      // Get media from the target folder
      const media = await findVendorMediaInFolder(targetFolderId, apiKey);

      let profilePhotoUrl = vendor.logo_url;
      let galleryUrls = vendor.gallery_urls || [];

      // Upload profile photo if folder has one (always update if new one is found)
      if (media.profile) {
        try {
          const storagePath = `vendors/${vendor.id}/profile`;
          const uploadResult = await downloadAndUploadImage(media.profile, storagePath, supabase);

          if (uploadResult.success && uploadResult.url) {
            profilePhotoUrl = uploadResult.url;
            await supabase
              .from('vendor_leads')
              .update({ logo_url: profilePhotoUrl })
              .eq('id', vendor.id);
          } else {
            return NextResponse.json({
              success: false,
              message: `Failed to upload profile photo: ${uploadResult.error || 'Unknown error'}`,
              folderName
            });
          }
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: `Failed to upload profile photo: ${error instanceof Error ? error.message : 'Unknown error'}`,
            folderName
          });
        }
      }

      // Upload gallery images (always update if new ones are found)
      if (media.gallery.length > 0) {
        const newGalleryUrls: string[] = [];
        
        for (let j = 0; j < Math.min(media.gallery.length, 10); j++) {
          try {
            const storagePath = `vendors/${vendor.id}/gallery/${j + 1}`;
            const uploadResult = await downloadAndUploadImage(media.gallery[j], storagePath, supabase);

            if (uploadResult.success && uploadResult.url) {
              newGalleryUrls.push(uploadResult.url);
            } else {
              console.warn(`Failed to upload gallery image ${j + 1} for "${vendor.business_name}": ${uploadResult.error || 'Unknown error'}`);
            }
          } catch (error) {
            console.warn(`Failed to upload gallery image ${j + 1} for "${vendor.business_name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        if (newGalleryUrls.length > 0) {
          galleryUrls = newGalleryUrls;
          await supabase
            .from('vendor_leads')
            .update({ gallery_urls: galleryUrls })
            .eq('id', vendor.id);
        }
      }

      // Revalidate cache
      revalidateTag('vendors');

      return NextResponse.json({
        success: true,
        message: `Successfully synced attachments for "${vendor.business_name}"`,
        vendor: vendor.business_name,
        folderName,
        profilePhotoUpdated: !!media.profile,
        galleryImagesCount: media.gallery.length,
        uploadedGalleryCount: galleryUrls.length
      });

    } catch (error) {
      return NextResponse.json({
        success: false,
        message: `Error processing "${vendor.business_name}": ${error instanceof Error ? error.message : 'Unknown error'}`,
        folderName
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error syncing attachments:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to sync attachments',
      },
      { status: 500 }
    );
  }
}
