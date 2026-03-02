#!/usr/bin/env node
/**
 * Import vendors from CSV to vendor_leads (and vendors) on Supabase.
 * Uses csv-parse so quoted fields with commas/newlines don't corrupt columns.
 * Validates category and city so description text isn't stored as category/city.
 *
 * Usage:
 *   node scripts/import-vendors-csv.mjs [path/to/file.csv]
 *   node scripts/import-vendors-csv.mjs --replace [path/to/file.csv]   # delete ALL vendors first, then import from CSV
 *
 * Default CSV path: vendor/vendors.csv
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
      console.error('Could not load .env.local or .env. Create .env.local with:');
      console.error('  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co');
      console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
      process.exit(1);
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL and (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local');
  process.exit(1);
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Using ANON key. Add SUPABASE_SERVICE_ROLE_KEY for full access (e.g. vendors table sync).');
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const CHUNK = 200;

async function deleteAllVendors() {
  const deleted = { vendor_gallery: 0, vendors: 0, vendor_leads: 0 };
  const { data: galleryRows } = await supabase.from('vendor_gallery').select('id');
  const galleryIds = galleryRows?.map((r) => r.id) ?? [];
  for (let i = 0; i < galleryIds.length; i += CHUNK) {
    const chunk = galleryIds.slice(i, i + CHUNK);
    if (chunk.length) await supabase.from('vendor_gallery').delete().in('id', chunk);
  }
  deleted.vendor_gallery = galleryIds.length;

  const { data: vendorRows } = await supabase.from('vendors').select('id');
  const vendorIds = vendorRows?.map((r) => r.id) ?? [];
  for (let i = 0; i < vendorIds.length; i += CHUNK) {
    const chunk = vendorIds.slice(i, i + CHUNK);
    if (chunk.length) await supabase.from('vendors').delete().in('id', chunk);
  }
  deleted.vendors = vendorIds.length;

  const { data: leadRows } = await supabase.from('vendor_leads').select('id');
  const leadIds = leadRows?.map((r) => r.id) ?? [];
  for (let i = 0; i < leadIds.length; i += CHUNK) {
    const chunk = leadIds.slice(i, i + CHUNK);
    if (chunk.length) await supabase.from('vendor_leads').delete().in('id', chunk);
  }
  deleted.vendor_leads = leadIds.length;
  return deleted;
}

/** Detect values that are clearly description/URL/text, not category or city */
function looksLikeGarbage(s) {
  if (!s || typeof s !== 'string') return true;
  const t = s.trim();
  if (t.length > 55) return true;
  if (/https?:\/\//i.test(t)) return true;
  if (/\b(and|the|our|for|with|your|you|we|they)\s+/i.test(t) && t.length > 20) return true;
  if (/^\d{5,}/.test(t)) return true; // starts with long number (postal code)
  return false;
}

// Canonical Wervice categories (same as normalize script and app)
const categoryMap = {
  Caterer: 'catering', caterer: 'catering', Catering: 'catering', Traiteur: 'catering', traiteur: 'catering',
  'Caterer / Decor': 'catering', 'caterer / decor': 'catering',
  Venue: 'venues', venue: 'venues', Venues: 'venues', Lieu: 'venues', lieu: 'venues', Salle: 'venues',
  Photographer: 'photography', photographer: 'photography', Photo: 'photography', photo: 'photography',
  'Photo & Film': 'photography', 'Photo & Video': 'photography', Videographer: 'photography',
  'Event Planner': 'planning', 'event planner': 'planning', 'Event Planning': 'planning',
  'Event Planner / Decor': 'planning', 'event planner / decor': 'planning',
  Planner: 'planning', planner: 'planning', Organisateur: 'planning',
  Beauty: 'beauty', beauty: 'beauty', Negafa: 'negafa', negafa: 'negafa',
  'Negafa / Dresses': 'negafa', 'negafa / dresses': 'negafa',
  Spa: 'beauty', spa: 'beauty',
  Makeup: 'beauty', makeup: 'beauty', Coiffure: 'beauty', coiffure: 'beauty', Hair: 'beauty',
  Decor: 'decor', decor: 'decor', Décoration: 'decor', décoration: 'decor', Decoration: 'decor',
  Flowers: 'florist', flowers: 'florist', Florist: 'florist', florist: 'florist', Fleurs: 'florist', fleurs: 'florist',
  Music: 'music', music: 'music', Artist: 'music', artist: 'music', DJ: 'music', dj: 'music',
  Band: 'music', band: 'music', Orchestra: 'music', Musique: 'music',
  Dresses: 'dresses', dresses: 'dresses', Robe: 'dresses', robe: 'dresses', 'Wedding Dress': 'dresses',
  Cakes: 'cakes', cakes: 'cakes', Cake: 'cakes', cake: 'cakes', Pastry: 'cakes', pastry: 'cakes',
};

const CANONICAL_CATEGORIES = ['florist', 'dresses', 'venues', 'beauty', 'photography', 'catering', 'decor', 'negafa', 'music', 'planning', 'cakes'];

const cityMap = {
  Fes: 'Fes', Fès: 'Fes', fes: 'Fes', FEZ: 'Fes',
  Meknes: 'Meknes', Meknès: 'Meknes', meknes: 'Meknes',
  Casablanca: 'Casablanca', casablanca: 'Casablanca', Casa: 'Casablanca',
  Marrakech: 'Marrakech', marrakech: 'Marrakech', Marrakesh: 'Marrakech',
  Rabat: 'Rabat', rabat: 'Rabat',
  Tangier: 'Tangier', Tanger: 'Tangier', tangier: 'Tangier', tanger: 'Tangier',
  Agadir: 'Agadir', agadir: 'Agadir',
  'El Jadida': 'El Jadida', ElJadida: 'El Jadida', eljadida: 'El Jadida', 'El jadida': 'El Jadida',
  Kenitra: 'Kenitra', kenitra: 'Kenitra',
  Bouskoura: 'Casablanca', bouskoura: 'Casablanca',
  Mohammedia: 'Mohammedia', mohammedia: 'Mohammedia',
  Oujda: 'Oujda', oujda: 'Oujda',
  Tétouan: 'Tetouan', Tetouan: 'Tetouan', tetouan: 'Tetouan',
  Essaouira: 'Essaouira', essaouira: 'Essaouira',
  'Rabat / Casablanca / Fes': 'Rabat',
};

const CANONICAL_CITIES = ['Marrakech', 'Casablanca', 'Fes', 'Rabat', 'Tanger', 'Oujda', 'Agadir', 'Meknes', 'Tetouan', 'Kenitra', 'El Jadida', 'Safi', 'Laayoune', 'El Hoceima', 'Beni Mellal'];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function generateUniqueSlug(businessName) {
  const base = slugify(businessName);
  const { data } = await supabase.from('vendor_leads').select('id').ilike('slug', base + '%').limit(1);
  if (!data?.length) return base;
  return `${base}-${Date.now().toString(36).slice(-6)}`;
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
  const replace = args[0] === '--replace';
  const csvPath = (replace ? args[1] : args[0]) || resolve(process.cwd(), 'vendor/vendors.csv');

  if (replace) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('--replace requires SUPABASE_SERVICE_ROLE_KEY in .env.local');
      process.exit(1);
    }
    console.log('Deleting all vendors (vendor_gallery, vendors, vendor_leads)...');
    const deleted = await deleteAllVendors();
    console.log(`  Deleted: ${deleted.vendor_gallery} gallery, ${deleted.vendors} vendors, ${deleted.vendor_leads} vendor_leads.\n`);
  }

  if (!existsSync(csvPath)) {
    console.error('File not found:', csvPath);
    process.exit(1);
  }
  console.log('Reading:', csvPath);
  const content = readFileSync(csvPath, 'utf8');
  let records;
  try {
    records = parse(content, { columns: true, skip_empty_lines: true, trim: true, relax_column_count: true });
  } catch (e) {
    console.error('CSV parse error:', e.message);
    process.exit(1);
  }
  if (!records.length) {
    console.error('CSV has no data rows');
    process.exit(1);
  }

  const escapeIlike = (s) => (s || '').replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const BATCH = 50;

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const businessName = getCol(row, 'Vendor', 'vendor', 'business_name');
    const categoryRaw = getCol(row, 'Category', 'category');
    const cityRaw = getCol(row, 'City', 'city');
    let phone = getCol(row, 'Phone', 'phone', 'whatsapp');
    const email = getCol(row, 'Email', 'email') || null;
    const description = getCol(row, 'Description', 'description') || null;
    const googleMaps = getCol(row, 'Google Maps', 'google_maps') || null;
    const instagram = getCol(row, 'IG', 'instagram') || null;

    if (!businessName) {
      skipped++;
      continue;
    }
    if (looksLikeGarbage(businessName)) {
      if (i < 5 || skipped < 10) console.warn(`Row ${i + 2}: Skipped (Vendor looks like description)`);
      skipped++;
      continue;
    }

    if (looksLikeGarbage(categoryRaw) || !categoryRaw) {
      if (i < 5 || skipped < 10) console.warn(`Row ${i + 2}: Skipped (Category missing or invalid: "${(categoryRaw || '').slice(0, 40)}...")`);
      skipped++;
      continue;
    }
    const category = categoryMap[categoryRaw] || categoryMap[categoryRaw.trim()] || categoryRaw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!CANONICAL_CATEGORIES.includes(category)) {
      if (i < 5 || skipped < 10) console.warn(`Row ${i + 2}: Skipped (Category not mapped: "${categoryRaw}")`);
      skipped++;
      continue;
    }

    if (looksLikeGarbage(cityRaw)) {
      if (i < 5 || skipped < 10) console.warn(`Row ${i + 2}: Skipped (City looks like description/URL)`);
      skipped++;
      continue;
    }
    const city = cityMap[cityRaw] || cityMap[cityRaw.trim()] || (cityRaw && cityRaw.length <= 30 ? cityRaw.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Unidentified');
    if (!city || city === 'Unidentified') {
      // allow Unidentified so we can fix later in admin
    }

    if (!phone) phone = email || 'To be confirmed';

    const updatePayload = {
      category,
      city,
      whatsapp: phone,
      email: email || 'no-email@example.com',
      instagram: instagram || null,
      profile_description: description,
      admin_notes: googleMaps ? `Google Maps: ${googleMaps}` : null,
    };

    const { data: existingRows } = await supabase
      .from('vendor_leads')
      .select('id, slug')
      .ilike('business_name', escapeIlike(businessName))
      .limit(1);
    const existing = existingRows?.[0] || null;

    if (existing) {
      const { error: updateError } = await supabase.from('vendor_leads').update(updatePayload).eq('id', existing.id);
      if (updateError) {
        console.warn(`Row ${i + 2} (${businessName}): ${updateError.message}`);
        skipped++;
        continue;
      }
      updated++;
    } else {
      const slug = await generateUniqueSlug(businessName);
      const payload = {
        first_name: 'Import',
        last_name: 'CSV',
        business_name: businessName,
        ...updatePayload,
        profile_starting_price: null,
        subscription_cadence: 'monthly',
        subscription_price_dhs: 200,
        logo_url: null,
        gallery_urls: [],
        service_area: [city],
        languages_spoken: ['en'],
        source: 'csv_import_script',
        status: 'approved',
        slug,
      };

      const { error } = await supabase.from('vendor_leads').insert([payload]);
      if (error) {
        console.warn(`Row ${i + 2} (${businessName}): ${error.message}`);
        skipped++;
        continue;
      }
      inserted++;

      try {
        await supabase.from('vendors').upsert({
          slug,
          business_name: businessName,
          category: category.toLowerCase(),
          city: city.toLowerCase(),
          phone,
          email,
          description,
          profile_photo_url: null,
          gallery_photos: null,
          plan: 'basic',
          published: true,
          created_at: new Date().toISOString(),
        }, { onConflict: 'slug', ignoreDuplicates: false });
      } catch (_) { /* optional */ }
    }

    const ok = inserted + updated;
    if (ok % BATCH === 0 && ok > 0) console.log(`  ... ${inserted} inserted, ${updated} updated`);
  }

  console.log(`\nDone: ${inserted} inserted, ${updated} updated, ${skipped} skipped (invalid/missing data)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
