#!/usr/bin/env node
/**
 * Set all vendor_leads to published = true so they appear on the website.
 * Uses SUPABASE_SERVICE_ROLE_KEY from .env.local.
 *
 * Usage: node scripts/publish-all-vendors-to-website.mjs [--dry-run]
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
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

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  const { data: rows, error: countError } = await supabase
    .from('vendor_leads')
    .select('id, published');
  if (countError) {
    console.error('Failed to fetch vendor_leads:', countError.message);
    process.exit(1);
  }

  const total = rows?.length || 0;
  const alreadyPublished = (rows || []).filter((r) => !!r.published).length;

  if (dryRun) {
    console.log('DRY RUN – no changes will be written.');
    console.log(`  Total vendors: ${total}`);
    console.log(`  Already published: ${alreadyPublished}`);
    console.log(`  Would set published = true for all ${total}`);
    return;
  }

  const ids = (rows || []).map((r) => r.id);
  const CHUNK = 200;
  let updated = 0;
  for (let i = 0; i < ids.length; i += CHUNK) {
    const chunk = ids.slice(i, i + CHUNK);
    const { error: updateError } = await supabase
      .from('vendor_leads')
      .update({ published: true })
      .in('id', chunk);
    if (updateError) {
      console.error('Failed to update chunk:', updateError.message);
      process.exit(1);
    }
    updated += chunk.length;
  }

  console.log('Done.');
  console.log(`  Total vendors: ${total}`);
  console.log(`  Previously published: ${alreadyPublished}`);
  console.log(`  Updated: ${updated} – all are now published and visible on the website.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
