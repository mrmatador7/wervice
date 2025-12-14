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

export async function POST(request: NextRequest) {
  try {
    const { folderLink } = await request.json();

    if (!folderLink) {
      return NextResponse.json(
        { success: false, message: 'Folder link is required' },
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

    // Get all published vendors (we'll attach images to all of them, even if they have some)
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendor_leads')
      .select('id, business_name, logo_url, gallery_urls')
      .eq('published', true);

    if (vendorsError) {
      throw new Error(`Failed to fetch vendors: ${vendorsError.message}`);
    }

    if (!vendors || vendors.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No vendors found that need images',
        matched: 0,
        processed: 0,
        warnings: []
      });
    }

    // List all subfolders in the master folder
    const subfolders = await listSubfolders(folderId, apiKey);
    
    if (subfolders.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No subfolders found in the provided folder. Make sure the folder contains subfolders named after your vendors.',
        total: vendors.length,
        matched: 0,
        processed: 0,
        warnings: [`No subfolders found in folder. Found ${vendors.length} vendors but 0 subfolders to match.`]
      });
    }

    let matched = 0;
    let processed = 0;
    const warnings: string[] = [];
    const results: Array<{ vendor: string; folder: string; status: string }> = [];

    // Match vendors to folders and process images
    for (const vendor of vendors) {
      // Find matching folder
      const matchingFolder = subfolders.find(folder => 
        matchVendorToFolder(vendor.business_name, folder.name)
      );

      if (!matchingFolder) {
        warnings.push(`No matching folder found for "${vendor.business_name}"`);
        results.push({
          vendor: vendor.business_name,
          folder: 'Not found',
          status: 'No match'
        });
        continue;
      }

      matched++;

      try {
        // Get media from the matched folder
        const media = await findVendorMediaInFolder(matchingFolder.id, apiKey);

        let profilePhotoUrl = vendor.logo_url;
        let galleryUrls = vendor.gallery_urls || [];

        // Upload profile photo if not already set and folder has one
        if (!profilePhotoUrl && media.profile) {
          try {
            const storagePath = `vendors/${vendor.id}/profile`;
            const uploadResult = await downloadAndUploadImage(media.profile, storagePath, supabase);

            if (uploadResult.success && uploadResult.url) {
              profilePhotoUrl = uploadResult.url;
              await supabase
                .from('vendor_leads')
                .update({ logo_url: profilePhotoUrl })
                .eq('id', vendor.id);
            }
          } catch (error) {
            warnings.push(`Failed to upload profile photo for "${vendor.business_name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        // Upload gallery images if not already set
        if (galleryUrls.length === 0 && media.gallery.length > 0) {
          const newGalleryUrls: string[] = [];
          
          for (let j = 0; j < Math.min(media.gallery.length, 10); j++) {
            try {
              const storagePath = `vendors/${vendor.id}/gallery/${j + 1}`;
              const uploadResult = await downloadAndUploadImage(media.gallery[j], storagePath, supabase);

              if (uploadResult.success && uploadResult.url) {
                newGalleryUrls.push(uploadResult.url);
              }
            } catch (error) {
              warnings.push(`Failed to upload gallery image ${j + 1} for "${vendor.business_name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
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

        processed++;
        results.push({
          vendor: vendor.business_name,
          folder: matchingFolder.name,
          status: 'Success'
        });

      } catch (error) {
        warnings.push(`Error processing "${vendor.business_name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        results.push({
          vendor: vendor.business_name,
          folder: matchingFolder.name,
          status: 'Error'
        });
      }
    }

    // Revalidate cache
    if (processed > 0) {
      revalidateTag('vendors');
    }

    return NextResponse.json({
      success: matched > 0,
      message: matched > 0 
        ? `Matched ${matched} out of ${vendors.length} vendors and processed ${processed} successfully`
        : `No vendors matched. Found ${vendors.length} vendors and ${subfolders.length} folders, but no matches. Check folder names match vendor names.`,
      total: vendors.length,
      foldersFound: subfolders.length,
      matched,
      processed,
      warnings: warnings.length > 0 ? warnings : (matched === 0 ? [`No vendors matched. Found ${vendors.length} vendors and ${subfolders.length} folders. Make sure folder names in Google Drive match vendor business names.`] : []),
      results
    });

  } catch (error) {
    console.error('Error attaching images:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to attach images',
        matched: 0,
        processed: 0,
        warnings: []
      },
      { status: 500 }
    );
  }
}

