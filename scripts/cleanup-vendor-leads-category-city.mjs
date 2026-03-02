#!/usr/bin/env node
/**
 * Fix vendor_leads rows where category or city contain description text, URLs, or other garbage.
 * Sets bad category to 'unidentified' and bad city to 'Unidentified' so admin can fix.
 *
 * Usage: node scripts/cleanup-vendor-leads-category-city.mjs [--dry-run]
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
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
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL and Supabase key in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const CANONICAL_CATEGORIES = ['florist', 'dresses', 'venues', 'beauty', 'photography', 'catering', 'decor', 'negafa', 'music', 'planning', 'cakes'];

function looksLikeGarbage(s) {
  if (!s || typeof s !== 'string') return true;
  const t = s.trim();
  if (t.length > 55) return true;
  if (/https?:\/\//i.test(t)) return true;
  if (/\b(and|the|our|for|with|your|you|we|they)\s+/i.test(t) && t.length > 20) return true;
  if (/^\d{5,}/.test(t)) return true;
  return false;
}

function categoryIsInvalid(cat) {
  if (!cat || looksLikeGarbage(cat)) return true;
  const lower = (cat || '').toLowerCase().trim();
  return !CANONICAL_CATEGORIES.includes(lower);
}

function cityIsInvalid(city) {
  if (!city) return true;
  if (looksLikeGarbage(city)) return true;
  if ((city || '').trim().length > 40) return true;
  return false;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  if (dryRun) console.log('DRY RUN – no changes will be written.\n');

  const { data: rows, error } = await supabase.from('vendor_leads').select('id, business_name, category, city');
  if (error) {
    console.error('Failed to fetch vendor_leads:', error.message);
    process.exit(1);
  }

  const toFix = [];
  for (const r of rows || []) {
    const badCategory = categoryIsInvalid(r.category);
    const badCity = cityIsInvalid(r.city);
    if (badCategory || badCity) toFix.push({ ...r, badCategory, badCity });
  }

  console.log(`Total vendor_leads: ${(rows || []).length}`);
  console.log(`Rows with bad category/city: ${toFix.length}`);
  if (toFix.length === 0) {
    console.log('Nothing to fix.');
    return;
  }

  if (dryRun) {
    toFix.slice(0, 15).forEach((r) => {
      console.log(`  ${r.business_name}`);
      if (r.badCategory) console.log(`    category: "${(r.category || '').slice(0, 50)}..." → unidentified`);
      if (r.badCity) console.log(`    city: "${(r.city || '').slice(0, 50)}..." → Unidentified`);
    });
    if (toFix.length > 15) console.log(`  ... and ${toFix.length - 15} more`);
    return;
  }

  let updated = 0;
  for (const r of toFix) {
    const updates = {};
    if (r.badCategory) updates.category = 'unidentified';
    if (r.badCity) updates.city = 'Unidentified';
    if (Object.keys(updates).length === 0) continue;
    const { error: upErr } = await supabase.from('vendor_leads').update(updates).eq('id', r.id);
    if (upErr) {
      console.warn(`Failed to update ${r.business_name}: ${upErr.message}`);
    } else {
      updated++;
    }
  }
  console.log(`\nUpdated ${updated} rows (bad category → unidentified, bad city → Unidentified).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
