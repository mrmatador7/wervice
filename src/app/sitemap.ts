import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { WERVICE_CATEGORIES } from '@/lib/categories';
import { cityToSlug } from '@/lib/vendor-url';
import { getAll } from '@/data/articles';
import { toAbsoluteUrl } from '@/lib/seo/site-url';

type VendorRow = {
  slug: string | null;
  city: string | null;
  category: string | null;
  created_at: string | null;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const LOCALES = ['en', 'fr', 'ar'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const staticLocalizedPaths = [
    '/',
    '/home',
    '/vendors',
    '/blog',
    '/checklist',
    '/how-it-works',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
    '/showcase',
    '/guides/planning',
  ];

  for (const locale of LOCALES) {
    for (const path of staticLocalizedPaths) {
      entries.push({
        url: toAbsoluteUrl(`/${locale}${path}`),
        changeFrequency: path === '/' || path === '/vendors' ? 'daily' : 'weekly',
        priority: path === '/' ? 0.9 : 0.7,
      });
    }

    const articles = getAll(locale);
    for (const article of articles) {
      entries.push({
        url: toAbsoluteUrl(`/${locale}/blog/${article.slug}`),
        lastModified: article.date ? new Date(article.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

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

  for (const row of rows) {
    const city = (row.city || '').trim();
    const dbCategory = (row.category || '').trim().toLowerCase();
    const slug = (row.slug || '').trim();
    if (!city || !dbCategory || !slug) continue;

    const categorySlug = dbCategoryToSlug.get(dbCategory);
    if (!categorySlug) continue;

    const lastModified = row.created_at ? new Date(row.created_at) : new Date();
    for (const locale of LOCALES) {
      entries.push({
        url: toAbsoluteUrl(`/${locale}/${cityToSlug(city)}/${categorySlug}/${slug}`),
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
