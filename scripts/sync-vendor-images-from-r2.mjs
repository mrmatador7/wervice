#!/usr/bin/env node
/**
 * Sync vendor pictures from R2 (Cloudflare) via the media_files table.
 * Reads media_files (vendor_name, file_key, mime_type), builds R2 URLs using
 * NEXT_PUBLIC_MEDIA_BASE_URL, matches to vendor_leads by business_name, and
 * updates logo_url + gallery_urls.
 *
 * Usage: node scripts/sync-vendor-images-from-r2.mjs [--dry-run]
 * Requires: .env.local with NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *           and optionally NEXT_PUBLIC_MEDIA_BASE_URL (default https://media.wervice.com)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

for (const name of ['.env.local', '.env']) {
  try {
    const envPath = resolve(process.cwd(), name);
    const env = readFileSync(envPath, 'utf8');
    for (const line of env.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
    break;
  } catch (e) {
    if (name === '.env') {
      console.error('Could not load .env.local or .env.');
      process.exit(1);
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || 'https://media.wervice.com').replace(/\/+$/, '');

function normalizeName(value) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isVideo(fileKey, mimeType) {
  if (mimeType?.startsWith('video/')) return true;
  return /\.(mp4|mov|webm|avi|m4v)$/i.test(fileKey);
}

function buildMediaUrl(fileKey) {
  const encoded = fileKey
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return `${MEDIA_BASE}/${encoded}`;
}

function findBestMediaGroup(vendorName, grouped) {
  const key = normalizeName(vendorName);
  const exact = grouped.get(key);
  if (exact && exact.length > 0) return exact;

  let best = null;
  for (const [groupKey, rows] of grouped.entries()) {
    if (!groupKey) continue;
    if (groupKey.includes(key) || key.includes(groupKey)) {
      const score = Math.min(groupKey.length, key.length);
      if (!best || score > best.score) best = { rows, score };
    }
  }
  return best?.rows || [];
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  if (dryRun) console.log('DRY RUN – no changes will be written.\n');

  console.log('Media base URL:', MEDIA_BASE);
  console.log('Fetching vendor_leads and media_files...\n');

  const { data: vendors, error: vendorsError } = await supabase
    .from('vendor_leads')
    .select('id, business_name, logo_url, gallery_urls');

  if (vendorsError) {
    console.error('Failed to fetch vendor_leads:', vendorsError.message);
    process.exit(1);
  }

  let from = 0;
  const pageSize = 1000;
  const mediaList = [];
  while (true) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from('media_files')
      .select('vendor_name, file_key, mime_type')
      .range(from, to);
    if (error) {
      console.error('Failed to fetch media_files:', error.message);
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.error('\nThe media_files table may not exist. Create it in Supabase with columns: vendor_name (text), file_key (text), mime_type (text).');
      }
      process.exit(1);
    }
    if (!data?.length) break;
    mediaList.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  const grouped = new Map();
  for (const row of mediaList) {
    const k = normalizeName(row.vendor_name);
    if (!k) continue;
    const bucket = grouped.get(k) || [];
    bucket.push(row);
    grouped.set(k, bucket);
  }

  const vendorList = vendors || [];
  let updated = 0;
  let skipped = 0;
  let matched = 0;

  for (const vendor of vendorList) {
    const rows = findBestMediaGroup(vendor.business_name, grouped);
    if (!rows.length) {
      skipped++;
      continue;
    }
    matched++;

    const sorted = [...rows].sort((a, b) => a.file_key.localeCompare(b.file_key));
    const images = sorted.filter((r) => !isVideo(r.file_key, r.mime_type)).map((r) => buildMediaUrl(r.file_key));
    const videos = sorted.filter((r) => isVideo(r.file_key, r.mime_type)).map((r) => buildMediaUrl(r.file_key));

    if (images.length === 0 && videos.length === 0) {
      skipped++;
      continue;
    }

    const profileUrl = images[0] || vendor.logo_url || null;
    const galleryUrls = [...images.slice(1), ...videos];

    if (dryRun) {
      console.log(`  ${vendor.business_name} → profile: ${profileUrl ? 'yes' : 'no'}, gallery: ${galleryUrls.length}`);
      updated++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('vendor_leads')
      .update({
        logo_url: profileUrl,
        gallery_urls: galleryUrls,
        updated_at: new Date().toISOString(),
      })
      .eq('id', vendor.id);

    if (updateError) {
      console.warn(`  ${vendor.business_name}: ${updateError.message}`);
      skipped++;
    } else {
      updated++;
    }
  }

  console.log('\nDone.');
  console.log('  Vendors in DB:', vendorList.length);
  console.log('  media_files rows:', mediaList.length);
  console.log('  Matched:', matched);
  console.log('  Updated:', updated);
  console.log('  Skipped:', skipped);
  if (dryRun) console.log('  (Dry run – run without --dry-run to apply updates)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
