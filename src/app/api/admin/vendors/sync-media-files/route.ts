import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidateTag } from 'next/cache';

type VendorLeadRow = {
  id: string;
  business_name: string;
  logo_url: string | null;
  gallery_urls: string[] | null;
};

type MediaFileRow = {
  vendor_name: string | null;
  file_key: string;
  mime_type: string | null;
};

function normalizeName(value: string | null | undefined): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isVideo(fileKey: string, mimeType: string | null): boolean {
  if (mimeType?.startsWith('video/')) return true;
  return /\.(mp4|mov|webm|avi|m4v)$/i.test(fileKey);
}

function buildMediaUrl(fileKey: string): string {
  const base = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || 'https://media.wervice.com').replace(/\/+$/, '');
  const encoded = fileKey
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return `${base}/${encoded}`;
}

function findBestMediaGroup(vendorName: string, grouped: Map<string, MediaFileRow[]>): MediaFileRow[] {
  const key = normalizeName(vendorName);
  const exact = grouped.get(key);
  if (exact && exact.length > 0) return exact;

  let best: { rows: MediaFileRow[]; score: number } | null = null;
  for (const [groupKey, rows] of grouped.entries()) {
    if (!groupKey) continue;
    if (groupKey.includes(key) || key.includes(groupKey)) {
      const score = Math.min(groupKey.length, key.length);
      if (!best || score > best.score) {
        best = { rows, score };
      }
    }
  }

  return best?.rows || [];
}

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { success: false, message: 'Missing Supabase server credentials' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: vendors, error: vendorsError } = await supabase
      .from('vendor_leads')
      .select('id,business_name,logo_url,gallery_urls');

    // Fetch all media_files in pages to avoid API row limits (default can be 1000).
    const pageSize = 1000;
    let from = 0;
    const mediaAccumulator: MediaFileRow[] = [];
    while (true) {
      const to = from + pageSize - 1;
      const { data, error } = await supabase
        .from('media_files')
        .select('vendor_name,file_key,mime_type')
        .range(from, to);
      if (error) throw error;
      const chunk = (data || []) as MediaFileRow[];
      if (chunk.length === 0) break;
      mediaAccumulator.push(...chunk);
      if (chunk.length < pageSize) break;
      from += pageSize;
    }

    if (vendorsError) throw new Error(vendorsError.message);

    const vendorList = (vendors || []) as VendorLeadRow[];
    const mediaList = mediaAccumulator;

    if (vendorList.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No vendors found to sync',
        processed: 0,
        updated: 0,
        skipped: 0,
        matched: 0,
        results: [],
      });
    }

    const grouped = new Map<string, MediaFileRow[]>();
    for (const row of mediaList) {
      const key = normalizeName(row.vendor_name);
      if (!key) continue;
      const bucket = grouped.get(key) || [];
      bucket.push(row);
      grouped.set(key, bucket);
    }

    let processed = 0;
    let updated = 0;
    let matched = 0;
    let skipped = 0;
    const results: Array<{
      vendor: string;
      images: number;
      videos: number;
      updated: boolean;
      reason?: string;
    }> = [];

    for (const vendor of vendorList) {
      processed++;
      const matchedRows = findBestMediaGroup(vendor.business_name, grouped);
      if (!matchedRows.length) {
        skipped++;
        results.push({ vendor: vendor.business_name, images: 0, videos: 0, updated: false, reason: 'No media match' });
        continue;
      }

      matched++;
      const sorted = [...matchedRows].sort((a, b) => a.file_key.localeCompare(b.file_key));
      const images = sorted.filter((r) => !isVideo(r.file_key, r.mime_type)).map((r) => buildMediaUrl(r.file_key));
      const videos = sorted.filter((r) => isVideo(r.file_key, r.mime_type)).map((r) => buildMediaUrl(r.file_key));

      if (images.length === 0 && videos.length === 0) {
        skipped++;
        results.push({ vendor: vendor.business_name, images: 0, videos: 0, updated: false, reason: 'Matched but no usable files' });
        continue;
      }

      const profileUrl = images[0] || vendor.logo_url || null;
      const galleryUrls = [...images.slice(1), ...videos];

      const { error: updateError } = await supabase
        .from('vendor_leads')
        .update({
          logo_url: profileUrl,
          gallery_urls: galleryUrls,
          updated_at: new Date().toISOString(),
        })
        .eq('id', vendor.id);

      if (updateError) {
        skipped++;
        results.push({
          vendor: vendor.business_name,
          images: images.length,
          videos: videos.length,
          updated: false,
          reason: updateError.message,
        });
        continue;
      }

      updated++;
      results.push({
        vendor: vendor.business_name,
        images: images.length,
        videos: videos.length,
        updated: true,
      });
    }

    revalidateTag('vendors');

    return NextResponse.json({
      success: true,
      message: `Processed ${processed} vendors. Updated ${updated} with images/videos.`,
      processed,
      updated,
      skipped,
      matched,
      results,
    });
  } catch (error) {
    console.error('Error syncing media_files to vendor_leads:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to sync media files',
      },
      { status: 500 }
    );
  }
}
