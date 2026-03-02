import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
const VIDEO_EXT = ['.mp4', '.mov', '.webm', '.avi'];

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.avi': 'video/x-msvideo',
};

function getExt(filename: string): string {
  const i = filename.lastIndexOf('.');
  return i >= 0 ? filename.slice(i).toLowerCase() : '';
}

/**
 * Normalize for matching: lowercase, keep letters/numbers/spaces, collapse spaces.
 */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * STRICT 1:1 matching to avoid duplicate/wrong assignments.
 * - Exact match (after normalize): always accept
 * - Folder equals vendor: accept
 * - Avoid loose matches that could match multiple vendors (e.g. "Flowers" -> many)
 * Returns match score 0-100; 0 = no match. Only use if score >= 85.
 */
function matchScore(vendorName: string, folderName: string): number {
  if (!vendorName || !folderName) return 0;
  const v = norm(vendorName);
  const f = norm(folderName);
  if (v.length < 2 || f.length < 2) return 0;

  // Exact match
  if (v === f) return 100;

  // Folder must be substantial to avoid "A" matching "ABC Company"
  if (f.length < 4) return 0;

  // One is contained in the other - only if the shorter is at least 70% of longer
  const shorter = v.length <= f.length ? v : f;
  const longer = v.length > f.length ? v : f;
  if (longer.includes(shorter)) {
    const ratio = shorter.length / longer.length;
    if (ratio >= 0.7) return 90; // "Flower Shop" in "Flower Shop Dubai"
    if (ratio >= 0.5 && shorter.length >= 8) return 80;
  }

  // Word overlap: folder words must mostly appear in vendor (exact word match)
  const fw = f.split(' ').filter((w) => w.length >= 2);
  const vw = new Set(v.split(' ').filter((w) => w.length >= 2));
  if (fw.length >= 2) {
    const matched = fw.filter((w) => vw.has(w)).length;
    if (matched === fw.length && fw.length >= 2) return 85;
  }

  return 0;
}

/**
 * For each folder, find the single best vendor. Each vendor is used at most once.
 */
function assignFoldersToVendors(
  folderNames: string[],
  vendors: { id: string; business_name: string }[]
): Map<string, { id: string; business_name: string }> {
  const assigned = new Map<string, { id: string; business_name: string }>();
  const usedVendorIds = new Set<string>();

  // Sort folders by name length (more specific first)
  const sorted = [...folderNames].sort((a, b) => b.length - a.length);

  for (const folder of sorted) {
    let best: { vendor: { id: string; business_name: string }; score: number } | null = null;
    for (const vendor of vendors) {
      if (usedVendorIds.has(vendor.id)) continue;
      const score = matchScore(vendor.business_name, folder);
      if (score >= 85 && (!best || score > best.score)) {
        best = { vendor, score };
      }
    }
    if (best) {
      assigned.set(folder, best.vendor);
      usedVendorIds.add(best.vendor.id);
    }
  }
  return assigned;
}

function sortMedia(
  files: { name: string; file: File }[]
): { images: { name: string; file: File }[]; videos: { name: string; file: File }[] } {
  const images: { name: string; file: File }[] = [];
  const videos: { name: string; file: File }[] = [];
  for (const f of files) {
    const ext = getExt(f.name);
    if (IMAGE_EXT.includes(ext)) images.push(f);
    else if (VIDEO_EXT.includes(ext)) videos.push(f);
  }
  images.sort((a, b) => {
    const aNum = (a.name.match(/\s*(\d+)\s*\./i) || [])[1];
    const bNum = (b.name.match(/\s*(\d+)\s*\./i) || [])[1];
    if (!aNum && bNum) return -1;
    if (aNum && !bNum) return 1;
    if (!aNum && !bNum) return 0;
    return parseInt(aNum, 10) - parseInt(bNum, 10);
  });
  return { images, videos };
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { success: false, message: 'Server misconfigured: missing Supabase credentials' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const formData = await request.formData();

    const byFolder = new Map<string, { name: string; file: File }[]>();
    for (const [path, value] of formData.entries()) {
      if (value instanceof File && path.includes('/')) {
        const parts = path.split('/');
        const folderName = parts[0];
        const fileName = parts[parts.length - 1];
        if (!folderName || !fileName) continue;
        const list = byFolder.get(folderName) ?? [];
        list.push({ name: fileName, file: value });
        byFolder.set(folderName, list);
      }
    }

    if (byFolder.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'No files found. Select a folder whose subfolders are named after vendors (e.g. MyFolder/VendorName/image.jpg).',
        },
        { status: 400 }
      );
    }

    const { data: vendors, error: vendorError } = await supabase
      .from('vendor_leads')
      .select('id, business_name');

    if (vendorError || !vendors?.length) {
      return NextResponse.json(
        { success: false, message: 'No vendors found in database' },
        { status: 400 }
      );
    }

    const folderToVendor = assignFoldersToVendors([...byFolder.keys()], vendors);
    const results: { folder: string; vendor: string; profile: boolean; gallery: number; error?: string }[] = [];
    let processed = 0;
    let uploaded = 0;

    for (const [folderName, files] of byFolder.entries()) {
      const vendor = folderToVendor.get(folderName);
      if (!vendor) {
        results.push({ folder: folderName, vendor: '-', profile: false, gallery: 0, error: 'No matching vendor' });
        continue;
      }

      const { images, videos } = sortMedia(files);
      if (images.length === 0 && videos.length === 0) {
        results.push({ folder: folderName, vendor: vendor.business_name, profile: false, gallery: 0, error: 'No images/videos' });
        continue;
      }

      let logoUrl: string | null = null;
      const galleryUrls: string[] = [];

      if (images.length > 0) {
        const { file } = images[0];
        const ext = getExt(images[0].name);
        const storagePath = `vendors/${vendor.id}/profile`;
        const contentType = CONTENT_TYPES[ext] || 'image/jpeg';
        const { error: uploadErr } = await supabase.storage
          .from('vendor-files')
          .upload(storagePath, file, { contentType, upsert: true });
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('vendor-files').getPublicUrl(storagePath);
          logoUrl = urlData.publicUrl;
          uploaded++;
        }
      }

      for (let i = 1; i < images.length; i++) {
        const { file } = images[i];
        const ext = getExt(images[i].name);
        const storagePath = `vendors/${vendor.id}/gallery/${i + 1}`;
        const contentType = CONTENT_TYPES[ext] || 'image/jpeg';
        const { error: uploadErr } = await supabase.storage
          .from('vendor-files')
          .upload(storagePath, file, { contentType, upsert: true });
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('vendor-files').getPublicUrl(storagePath);
          galleryUrls.push(urlData.publicUrl);
          uploaded++;
        }
      }

      for (let v = 0; v < Math.min(videos.length, 2); v++) {
        const { file } = videos[v];
        const ext = getExt(videos[v].name);
        const storagePath = `vendors/${vendor.id}/video/${v + 1}`;
        const contentType = CONTENT_TYPES[ext] || 'video/mp4';
        const { error: uploadErr } = await supabase.storage
          .from('vendor-files')
          .upload(storagePath, file, { contentType, upsert: true });
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('vendor-files').getPublicUrl(storagePath);
          galleryUrls.push(urlData.publicUrl);
          uploaded++;
        }
      }

      const update: { logo_url?: string; gallery_urls?: string[] } = {};
      if (logoUrl) update.logo_url = logoUrl;
      if (galleryUrls.length > 0) update.gallery_urls = galleryUrls;

      if (Object.keys(update).length > 0) {
        const { error: updateErr } = await supabase
          .from('vendor_leads')
          .update(update)
          .eq('id', vendor.id);
        if (!updateErr) {
          processed++;
          results.push({ folder: folderName, vendor: vendor.business_name, profile: !!logoUrl, gallery: galleryUrls.length });
        } else {
          results.push({
            folder: folderName,
            vendor: vendor.business_name,
            profile: !!logoUrl,
            gallery: galleryUrls.length,
            error: updateErr.message,
          });
        }
      } else {
        results.push({ folder: folderName, vendor: vendor.business_name, profile: false, gallery: 0, error: 'Upload failed' });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Attached images to ${processed} vendor(s), ${uploaded} files uploaded.`,
      processed,
      uploaded,
      results,
    });
  } catch (error) {
    console.error('Attach from folder error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to attach images',
      },
      { status: 500 }
    );
  }
}
