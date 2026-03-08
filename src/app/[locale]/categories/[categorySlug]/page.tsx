import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Search } from 'lucide-react';
import DashboardShell from '@/components/home/DashboardShell';
import InfiniteVendorGrid from '@/components/home/InfiniteVendorGrid';
import CategorySeoBlocks from '@/components/category/CategorySeoBlocks';
import { formatCategoryName } from '@/lib/format';
import { labelForCategory, slugToDbCategory, VALID_CATEGORY_SLUGS, WERVICE_CATEGORIES } from '@/lib/categories';
import { fetchPublishedVendorCount, fetchVendors } from '@/lib/supabase/vendors';
import { getListingIndexingDecision } from '@/lib/seo/indexing';
import { cityToSlug, vendorUrl } from '@/lib/vendor-url';
import { localeAlternates, toAbsoluteUrl } from '@/lib/seo/site-url';
import { localizeCityLabel, MOROCCAN_CITIES } from '@/lib/types/vendor';

interface PageProps {
  params: Promise<{ locale: string; categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  if (!VALID_CATEGORY_SLUGS.includes(categorySlug as (typeof VALID_CATEGORY_SLUGS)[number])) {
    return {
      title: 'Page Not Found | Wervice',
      robots: { index: false, follow: true },
    };
  }

  const resolvedSearchParams = await searchParams;
  const categoryName = labelForCategory(categorySlug, locale) || formatCategoryName(categorySlug);
  const city = firstParam(resolvedSearchParams.city);
  const q = (firstParam(resolvedSearchParams.q) || '').trim();
  const dbCategory = slugToDbCategory(categorySlug) || categorySlug;
  const vendorCount = await fetchPublishedVendorCount({
    city: city && city !== 'all' ? city : undefined,
    category: dbCategory,
  });
  const indexing = getListingIndexingDecision({
    searchParams: resolvedSearchParams,
    vendorCount,
  });

  const basePath = `/${locale}/categories/${categorySlug}`;
  const canonical = city && city !== 'all' && !q
    ? toAbsoluteUrl(`/${locale}/${cityToSlug(city)}/${categorySlug}`)
    : toAbsoluteUrl(basePath);

  return {
    title: city && city !== 'all'
      ? `${categoryName} ${locale === 'ar' ? `في ${localizeCityLabel(city, locale)}` : `in ${localizeCityLabel(city, locale)}`} | Wervice`
      : `${categoryName} ${locale === 'fr' ? 'au Maroc' : locale === 'ar' ? 'في المغرب' : 'in Morocco'} | Wervice`,
    description: city && city !== 'all'
      ? `Browse verified ${categoryName.toLowerCase()} vendors in ${localizeCityLabel(city, locale)}. Compare portfolios, pricing, and availability.`
      : `Find trusted ${categoryName.toLowerCase()} vendors across Morocco. Compare options and contact the best match for your wedding.`,
    alternates: {
      canonical,
      languages: localeAlternates(`/categories/${categorySlug}`),
    },
    robots: {
      index: indexing.shouldIndex,
      follow: indexing.shouldFollow,
    },
    openGraph: {
      title: city && city !== 'all'
        ? `${categoryName} ${locale === 'ar' ? `في ${localizeCityLabel(city, locale)}` : `in ${localizeCityLabel(city, locale)}`} | Wervice`
        : `${categoryName} ${locale === 'fr' ? 'au Maroc' : locale === 'ar' ? 'في المغرب' : 'in Morocco'} | Wervice`,
      description: `Discover top ${categoryName.toLowerCase()} vendors on Wervice.`,
      url: canonical,
    },
  };
}

export default async function CategoryLandingPage({ params, searchParams }: PageProps) {
  const { locale, categorySlug } = await params;
  if (!VALID_CATEGORY_SLUGS.includes(categorySlug as (typeof VALID_CATEGORY_SLUGS)[number])) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const q = (firstParam(resolvedSearchParams.q) || '').trim();
  const city = firstParam(resolvedSearchParams.city);
  const cityFilter = city && city !== 'all' ? city : undefined;
  const categoryName = labelForCategory(categorySlug, locale) || formatCategoryName(categorySlug);
  const dbCategory = slugToDbCategory(categorySlug) || categorySlug;

  const { vendors, hasMore } = await fetchVendors({
    category: dbCategory,
    city: cityFilter,
    q: q || undefined,
    sort: 'newest',
    limit: q ? 24 : 60,
  });

  const savedCards = vendors.slice(0, 4).map((vendor) => ({
    id: vendor.id,
    title: vendor.business_name,
    image:
      vendor.profile_photo_url ||
      vendor.gallery_urls?.[0] ||
      vendor.gallery_photos?.[0] ||
      '/images/sample/venues-1.jpg',
    href: vendorUrl(vendor, locale),
  }));

  const cityOptions = MOROCCAN_CITIES.filter((entry) => entry.value !== 'all').slice(0, 12);
  const relatedCategories = WERVICE_CATEGORIES.filter((item) => item.slug !== categorySlug).slice(0, 8);
  const copy = getPageCopy(locale);

  return (
    <DashboardShell locale={locale} savedCards={savedCards}>
      <section className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5f6f84]">{copy.categoryLabel}</p>
          <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">
            {categoryName}
            {cityFilter
              ? locale === 'ar'
                ? ` في ${localizeCityLabel(cityFilter, locale)}`
                : ` in ${localizeCityLabel(cityFilter, locale)}`
              : locale === 'fr'
                ? ' au Maroc'
                : locale === 'ar'
                  ? ' في المغرب'
                  : ' in Morocco'}
          </h1>
          <p className="mt-3 text-lg text-[#4a5c74]">
            {copy.exploreLine(categoryName, cityFilter ? localizeCityLabel(cityFilter, locale) : null)}
          </p>
        </header>

        <form className="max-w-3xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a99ad]" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder={copy.searchPlaceholder(categoryName)}
              className="h-14 w-full rounded-2xl border border-[#d7deea] bg-white pl-12 pr-4 text-base outline-none transition focus:border-[#1f6bd6]"
            />
            {cityFilter && <input type="hidden" name="city" value={cityFilter} />}
          </div>
        </form>

        <div className="flex flex-wrap gap-2.5">
          {cityOptions.map((entry) => {
            const isActive = entry.value === cityFilter;
            return (
              <Link
                key={entry.value}
                href={isActive ? `/${locale}/categories/${categorySlug}` : `/${locale}/${cityToSlug(entry.value)}/${categorySlug}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#0b5d4b] text-white'
                    : 'border border-[#d2d9e5] bg-white text-[#33475f] hover:bg-[#eef2f8]'
                }`}
              >
                {localizeCityLabel(entry.label, locale)}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {relatedCategories.map((item) => (
            <Link
              key={item.slug}
              href={cityFilter ? `/${locale}/${cityToSlug(cityFilter)}/${item.slug}` : `/${locale}/categories/${item.slug}`}
              className="rounded-full border border-[#d2d9e5] bg-white px-4 py-2 text-sm font-semibold text-[#33475f] transition hover:bg-[#eef2f8]"
            >
              {labelForCategory(item.slug, locale)}
            </Link>
          ))}
        </div>

        {vendors.length === 0 ? (
          <div className="rounded-2xl border border-[#d7deea] bg-white p-6 text-[#5f6f84]">
            {copy.noVendors(categoryName)}
          </div>
        ) : (
          <InfiniteVendorGrid
            locale={locale}
            initialVendors={vendors}
            initialHasMore={hasMore}
            city={cityFilter}
            category={dbCategory}
            q={q || undefined}
          />
        )}

        <CategorySeoBlocks
          categorySlug={categorySlug}
          city={cityFilter || null}
          locale={locale}
        />
      </section>
    </DashboardShell>
  );
}

export async function generateStaticParams() {
  return VALID_CATEGORY_SLUGS.map((categorySlug) => ({ categorySlug }));
}

function getPageCopy(locale: string) {
  const lc = (locale || 'en').toLowerCase();
  if (lc === 'fr') {
    return {
      categoryLabel: 'Catégorie',
      exploreLine: (category: string, city: string | null) =>
        city
          ? `Découvrez des prestataires ${category.toLowerCase()} vérifiés à ${city}.`
          : `Découvrez des prestataires ${category.toLowerCase()} vérifiés dans tout le Maroc.`,
      searchPlaceholder: (category: string) => `Rechercher des prestataires ${category.toLowerCase()}...`,
      noVendors: (category: string) => `Aucun prestataire ${category.toLowerCase()} trouvé avec ce filtre.`,
    };
  }
  if (lc === 'ar') {
    return {
      categoryLabel: 'الفئة',
      exploreLine: (category: string, city: string | null) =>
        city
          ? `اكتشف مزوّدي ${category} الموثوقين في ${city}.`
          : `اكتشف مزوّدي ${category} الموثوقين في جميع أنحاء المغرب.`,
      searchPlaceholder: (category: string) => `ابحث عن مزوّدي ${category}...`,
      noVendors: (category: string) => `لا يوجد مزوّدون ضمن فئة ${category} حسب هذا الفلتر.`,
    };
  }
  return {
    categoryLabel: 'Category',
    exploreLine: (category: string, city: string | null) =>
      city
        ? `Explore verified ${category.toLowerCase()} vendors in ${city}.`
        : `Explore verified ${category.toLowerCase()} vendors across Morocco.`,
    searchPlaceholder: (category: string) => `Search ${category.toLowerCase()} vendors...`,
    noVendors: (category: string) => `No ${category.toLowerCase()} vendors found for this filter.`,
  };
}
