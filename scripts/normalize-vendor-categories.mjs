#!/usr/bin/env node
/**
 * Read "vendors list.csv" and update vendor_leads so each vendor's category
 * is set to the canonical Wervice category (e.g. negafa→negafa, photographers→photography,
 * catering/caterer→catering, makeup/beauty→beauty, event planners→planning).
 *
 * Usage: node scripts/normalize-vendor-categories.mjs [path/to/vendors list.csv]
 *         node scripts/normalize-vendor-categories.mjs --dry-run [path]
 * Default path: vendor/vendors list.csv (or vendors list.csv in project root)
 * --dry-run: only report what would be updated, do not write to DB
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync';

// Load .env.local or .env
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
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL and Supabase key in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

// Canonical dbCategory values in vendor_leads (11 Wervice categories)
const CANONICAL = ['florist', 'dresses', 'venues', 'beauty', 'photography', 'catering', 'decor', 'negafa', 'music', 'planning', 'cakes'];

// Raw category string (any case/spelling) → canonical dbCategory
function buildCategoryMap() {
  const m = new Map();

  const set = (keys, dbCat) => {
    keys.forEach((k) => {
      m.set(k.toLowerCase().trim(), dbCat);
      m.set(k.trim(), dbCat);
    });
  };

  set(['negafa', 'négafa', 'negafa traditionnelle'], 'negafa');

  set([
    'photographer', 'photographers', 'photography', 'videographer', 'videographers', 'videography',
    'photo', 'video', 'photo & film', 'photo and film', 'photo & video', 'photo and video',
    'photo_video', 'photo-video', 'photo film', 'photographe', 'vidéaste',
  ], 'photography');

  set([
    'caterer', 'caterers', 'catering', 'traiteur', 'traiteur wedding', 'catering service',
    'caterer / decor', 'caterer/decor',
  ], 'catering');

  set([
    'beauty', 'makeup', 'makeup artist', 'make-up', 'maquillage', 'coiffure', 'hair', 'hair stylist',
    'hair and makeup', 'beauty & makeup', 'spa', 'henna', 'henna artist',
  ], 'beauty');

  set([
    'event planner', 'event planners', 'event planning', 'planning', 'wedding planner', 'planner',
    'organisateur', 'organisatrice', 'coordination', 'day-of coordinator',
    'event planner / decor', 'event planner/decor',
  ], 'planning');

  set(['venue', 'venues', 'salle', 'lieu', 'reception venue', 'wedding venue', 'event space'], 'venues');

  set([
    'decor', 'decoration', 'décor', 'décoration', 'wedding decor', 'event decor',
    'lighting', 'stage design', 'table design',
  ], 'decor');

  set([
    'florist', 'florists', 'flowers', 'floral', 'fleurs', 'flower design', 'wedding flowers',
    'florist / decor', 'florist/decor',
  ], 'florist');

  set([
    'music', 'artist', 'artists', 'dj', 'djs', 'band', 'bands', 'orchestra', 'musique',
    'entertainment', 'singer', 'live music', 'gnawa', 'zaffa',
  ], 'music');

  set([
    'dresses', 'dress', 'bridal', 'wedding dress', 'caftan', 'caftans', 'takchita', 'robe',
    'tailoring', 'bridal wear',
  ], 'dresses');

  set(['cakes', 'cake', 'wedding cake', 'pastry', 'pâtisserie', 'dessert', 'gâteau'], 'cakes');

  return m;
}

const categoryMap = buildCategoryMap();

function normalizeToDbCategory(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const key = raw.toLowerCase().trim().replace(/\s+/g, ' ').replace(/_/g, ' ').replace(/-/g, ' ');
  const byKey = categoryMap.get(key) || categoryMap.get(key.replace(/\s+/g, '-'));
  if (byKey) return byKey;
  const byExact = categoryMap.get(raw.trim());
  if (byExact) return byExact;
  if (CANONICAL.includes(key) || CANONICAL.includes(raw.trim().toLowerCase())) return raw.trim().toLowerCase();
  return null;
}

function looksLikeGarbage(s) {
  if (!s || typeof s !== 'string') return true;
  const t = s.trim();
  if (t.length > 55) return true;
  if (/https?:\/\//i.test(t)) return true;
  if (/\b(and|the|our|for|with|your|you|we|they)\s+/i.test(t) && t.length > 20) return true;
  return false;
}

function getCol(record, ...names) {
  const r = record || {};
  for (const n of names) {
    const v = r[n];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  for (const key of Object.keys(r)) {
    if (names.some((n) => key.toLowerCase() === n.toLowerCase())) return String(r[key] || '').trim();
  }
  return '';
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const pathArg = args.filter((a) => a !== '--dry-run')[0];

  const candidates = pathArg
    ? [resolve(process.cwd(), pathArg)]
    : [
        resolve(process.cwd(), 'vendor/vendors.csv'),
        resolve(process.cwd(), 'vendor/vendors list.csv'),
        resolve(process.cwd(), 'vendors list.csv'),
      ];
  const path = candidates.find((p) => existsSync(p)) || null;
  if (!path) {
    console.error('CSV not found. Place "vendors.csv" or "vendors list.csv" in vendor/, or pass the path:');
    console.error('  node scripts/normalize-vendor-categories.mjs vendor/vendors.csv');
    process.exit(1);
  }

  if (dryRun) console.log('DRY RUN – no changes will be written.\n');

  console.log('Reading:', path);
  const content = readFileSync(path, 'utf8');
  let records;
  try {
    records = parse(content, { columns: true, skip_empty_lines: true, trim: true, relax_column_count: true });
  } catch (e) {
    console.error('CSV parse error:', e.message);
    process.exit(1);
  }
  if (!records.length) {
    console.error('CSV has no data rows.');
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;
  let noMatch = 0;
  const unmapped = new Set();

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const businessName = getCol(row, 'Vendor', 'vendor', 'business_name');
    const rawCategory = getCol(row, 'Category', 'category');
    const city = getCol(row, 'City', 'city');

    if (!businessName) {
      skipped++;
      continue;
    }
    if (looksLikeGarbage(businessName) || looksLikeGarbage(rawCategory)) {
      skipped++;
      continue;
    }

    const dbCategory = normalizeToDbCategory(rawCategory);
    if (!dbCategory) {
      unmapped.add(rawCategory || '(empty)');
      skipped++;
      continue;
    }

    if (dryRun) {
      updated++;
      if (i < 5 || i === records.length - 1) console.log(`  ${businessName} → ${dbCategory}`);
      continue;
    }

    // Case-insensitive match: find rows by business_name (and optional city) then update by id
    const escapeIlike = (s) => (s || '').replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
    let selectQuery = supabase
      .from('vendor_leads')
      .select('id')
      .ilike('business_name', escapeIlike(businessName));
    if (city) selectQuery = selectQuery.ilike('city', escapeIlike(city));

    const { data: rows, error: selectError } = await selectQuery;
    if (selectError) {
      console.warn(`Row ${i + 1} (${businessName}): ${selectError.message}`);
      skipped++;
      continue;
    }
    const ids = (rows || []).map((r) => r.id);
    if (ids.length === 0) {
      noMatch++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('vendor_leads')
      .update({ category: dbCategory })
      .in('id', ids);
    if (updateError) {
      console.warn(`Row ${i + 1} (${businessName}): ${updateError.message}`);
      skipped++;
      continue;
    }
    updated += ids.length;
  }

  console.log('\nDone.');
  if (dryRun) console.log('  Would update:', updated, 'rows (no changes written)');
  else console.log('  Updated:', updated, 'vendor_leads rows');
  if (!dryRun) {
    console.log('  No DB match:', noMatch);
    console.log('  Skipped (no name or unmapped category):', skipped);
  }
  if (unmapped.size > 0) {
    console.log('  Unmapped categories in CSV:', [...unmapped].slice(0, 30).join(', '));
    if (unmapped.size > 30) console.log('  ... and', unmapped.size - 30, 'more');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
