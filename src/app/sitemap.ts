import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { WERVICE_CATEGORIES } from '@/lib/categories';
import { cityToSlug } from '@/lib/vendor-url';

type VendorRow = {
  slug: string | null;
  city: string | null;
  category: string | null;
  created_at: string | null;
};

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wervice.com').replace(/\/+$/, '');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const MIN_VENDOR_COUNT = Number(process.env.SEO_MIN_VENDOR_COUNT || process.env.NEXT_PUBLIC_SEO_MIN_VENDOR_COUNT || '5');
const LOCALES = ['en', 'fr', 'ar'] as const;

function toAbsolute(path: string): string {
  return `${BASE_URL}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Locale home pages
  for (const locale of LOCALES) {
    entries.push({
      url: toAbsolute(`/${locale}`),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // If envs are unavailable (preview/build edge case), still return static locale pages.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return entries;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from('vendor_leads')
    .select('slug, city, category, created_at')
    .eq('published', true)
    .not('slug', 'is', null);

  if (error || !Array.isArray(data)) {
    return entries;
  }

  const rows = data as VendorRow[];
  const dbCategoryToSlug = new Map(WERVICE_CATEGORIES.map((category) => [category.dbCategory, category.slug]));
  const cityCounts = new Map<string, number>();
  const cityCategoryCounts = new Map<string, number>();

  for (const row of rows) {
    const city = (row.city || '').trim();
    const dbCategory = (row.category || '').trim().toLowerCase();
    if (!city || !dbCategory) continue;
    const categorySlug = dbCategoryToSlug.get(dbCategory);
    if (!categorySlug) continue;

    cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
    const cityCategoryKey = `${city}::${categorySlug}`;
    cityCategoryCounts.set(cityCategoryKey, (cityCategoryCounts.get(cityCategoryKey) || 0) + 1);
  }

  const indexableCities = Array.from(cityCounts.entries())
    .filter(([, count]) => count >= MIN_VENDOR_COUNT)
    .map(([city]) => city);

  for (const locale of LOCALES) {
    for (const city of indexableCities) {
      const citySlug = cityToSlug(city);
      entries.push({
        url: toAbsolute(`/${locale}/${citySlug}`),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }

  const indexableCityCategory = new Set<string>();
  for (const [key, count] of cityCategoryCounts.entries()) {
    if (count < MIN_VENDOR_COUNT) continue;
    indexableCityCategory.add(key);
  }

  for (const locale of LOCALES) {
    for (const key of indexableCityCategory) {
      const [city, categorySlug] = key.split('::');
      entries.push({
        url: toAbsolute(`/${locale}/${cityToSlug(city)}/${categorySlug}`),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }

  for (const row of rows) {
    const city = (row.city || '').trim();
    const dbCategory = (row.category || '').trim().toLowerCase();
    const slug = (row.slug || '').trim();
    if (!city || !dbCategory || !slug) continue;

    const categorySlug = dbCategoryToSlug.get(dbCategory);
    if (!categorySlug) continue;

    const key = `${city}::${categorySlug}`;
    if (!indexableCityCategory.has(key)) continue;

    const lastModified = row.created_at ? new Date(row.created_at) : new Date();
    for (const locale of LOCALES) {
      entries.push({
        url: toAbsolute(`/${locale}/${cityToSlug(city)}/${categorySlug}/${slug}`),
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  const deduped = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of entries) {
    deduped.set(entry.url, entry);
  }

  return Array.from(deduped.values());
}

