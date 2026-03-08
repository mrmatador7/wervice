import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Search } from 'lucide-react';
import { formatCategoryName } from '@/lib/format';
import { labelForCategory, slugToDbCategory, VALID_CATEGORY_SLUGS, WERVICE_CATEGORIES } from '@/lib/categories';
import { getListingIndexingDecision } from '@/lib/seo/indexing';
import { fetchPublishedVendorCount, fetchVendors } from '@/lib/supabase/vendors';
import { slugToCityName, vendorUrl } from '@/lib/vendor-url';
import { localeAlternates, toAbsoluteUrl } from '@/lib/seo/site-url';
import DashboardShell from '@/components/home/DashboardShell';
import InfiniteVendorGrid from '@/components/home/InfiniteVendorGrid';
import CategorySeoBlocks from '@/components/category/CategorySeoBlocks';
import { localizeCityLabel } from '@/lib/types/vendor';

interface CityCategoryPageProps {
  params: Promise<{ locale: string; city: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: CityCategoryPageProps): Promise<Metadata> {
  const { locale, city: citySlug, category } = await params;
  const resolvedSearchParams = await searchParams;
  const cityName = slugToCityName(citySlug);

  if (!cityName || !VALID_CATEGORY_SLUGS.includes(category as (typeof VALID_CATEGORY_SLUGS)[number])) {
    return {
      title: 'Page Not Found | Wervice',
      robots: { index: false, follow: true },
    };
  }

  const canonical = toAbsoluteUrl(`/${locale}/${citySlug}/${category}`);
  const categoryName = labelForCategory(category, locale) || formatCategoryName(category);
  const cityLabel = localizeCityLabel(cityName, locale);
  const vendorCount = await fetchPublishedVendorCount({
    city: cityName,
    category: slugToDbCategory(category) || category,
  });
  const indexing = getListingIndexingDecision({
    searchParams: resolvedSearchParams,
    vendorCount,
  });

  return {
    title: `${categoryName} ${locale === 'ar' ? `في ${cityLabel}` : `in ${cityLabel}`} | Wervice`,
    description: `Find verified ${categoryName.toLowerCase()} vendors in ${cityLabel}. Compare portfolios, prices, and availability for your wedding.`,
    alternates: {
      canonical,
      languages: localeAlternates(`/${citySlug}/${category}`),
    },
    robots: {
      index: indexing.shouldIndex,
      follow: indexing.shouldFollow,
    },
    openGraph: {
      title: `${categoryName} ${locale === 'ar' ? `في ${cityLabel}` : `in ${cityLabel}`} | Wervice`,
      description: `Discover top ${categoryName.toLowerCase()} vendors in ${cityLabel}.`,
      url: canonical,
    },
  };
}

export default async function CityCategoryPage({ params, searchParams }: CityCategoryPageProps) {
  const { locale, city: citySlug, category } = await params;
  const cityName = slugToCityName(citySlug);

  if (!cityName) notFound();
  if (!VALID_CATEGORY_SLUGS.includes(category as (typeof VALID_CATEGORY_SLUGS)[number])) notFound();

  const resolvedSearchParams = await searchParams;
  const q = (Array.isArray(resolvedSearchParams.q) ? resolvedSearchParams.q[0] : resolvedSearchParams.q)?.trim() || '';
  const categoryName = labelForCategory(category, locale) || formatCategoryName(category);
  const cityLabel = localizeCityLabel(cityName, locale);
  const dbCategory = slugToDbCategory(category) || category;

  const { vendors, hasMore } = await fetchVendors({
    city: cityName,
    category: dbCategory,
    q: q || undefined,
    sort: 'newest',
    limit: q ? 24 : 60,
  });

  const currentCategory = WERVICE_CATEGORIES.find((c) => c.slug === category);
  const relatedCategories = WERVICE_CATEGORIES.filter(
    (c) => c.slug !== category && c.dbCategory !== currentCategory?.dbCategory
  ).slice(0, 6);

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
  const copy = getCityCategoryCopy(locale);

  return (
    <DashboardShell locale={locale} savedCards={savedCards}>
      <section className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5f6f84]">
            {cityLabel}
          </p>
          <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">
            {locale === 'ar' ? `${categoryName} في ${cityLabel}` : `${categoryName} in ${cityLabel}`}
          </h1>
          <p className="mt-3 text-lg text-[#4a5c74]">
            {copy.subTitle(categoryName, cityLabel)}
          </p>
        </header>

        <form className="max-w-3xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a99ad]" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder={copy.searchPlaceholder(categoryName, cityLabel)}
              className="h-14 w-full rounded-2xl border border-[#d7deea] bg-white pl-12 pr-4 text-base outline-none transition focus:border-[#1f6bd6]"
            />
          </div>
        </form>

        <div className="flex flex-wrap gap-2.5">
          {relatedCategories.map((item) => (
            <Link
              key={item.slug}
              href={`/${locale}/${citySlug}/${item.slug}`}
              className="rounded-full border border-[#d2d9e5] bg-white px-4 py-2 text-sm font-semibold text-[#33475f] transition hover:bg-[#eef2f8]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/${citySlug}`}
            className="rounded-full bg-[#0b5d4b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#094739]"
          >
            {copy.allCategories(cityLabel)}
          </Link>
        </div>

        {vendors.length === 0 ? (
          <div className="rounded-2xl border border-[#d7deea] bg-white p-6 text-[#5f6f84]">
            {copy.noVendors(categoryName, cityLabel)}
          </div>
        ) : (
          <InfiniteVendorGrid
            locale={locale}
            initialVendors={vendors}
            initialHasMore={hasMore}
            city={cityName}
            category={dbCategory}
            q={q || undefined}
          />
        )}

        <CategorySeoBlocks
          categorySlug={category}
          city={cityName}
          citySlug={citySlug}
          locale={locale}
        />
      </section>
    </DashboardShell>
  );
}

function getCityCategoryCopy(locale: string) {
  const lc = (locale || 'en').toLowerCase();
  if (lc === 'fr') {
    return {
      subTitle: (category: string, city: string) =>
        `Comparez les prestataires ${category.toLowerCase()} vérifiés, leurs portfolios et leurs tarifs à ${city}.`,
      searchPlaceholder: (category: string, city: string) =>
        `Rechercher ${category.toLowerCase()} à ${city}...`,
      allCategories: (city: string) => `Toutes les catégories à ${city}`,
      noVendors: (category: string, city: string) =>
        `Aucun prestataire ${category.toLowerCase()} trouvé à ${city}. Essayez une autre recherche ou une ville proche.`,
    };
  }
  if (lc === 'ar') {
    return {
      subTitle: (category: string, city: string) =>
        `قارن مزوّدي ${category} الموثوقين، الأعمال السابقة، والأسعار في ${city}.`,
      searchPlaceholder: (category: string, city: string) =>
        `ابحث عن ${category} في ${city}...`,
      allCategories: (city: string) => `كل الفئات في ${city}`,
      noVendors: (category: string, city: string) =>
        `لا يوجد مزوّدون ضمن فئة ${category} في ${city}. جرّب بحثًا آخر أو مدينة قريبة.`,
    };
  }
  return {
    subTitle: (category: string, city: string) =>
      `Compare verified ${category.toLowerCase()} vendors, portfolios, and pricing in ${city}.`,
    searchPlaceholder: (category: string, city: string) =>
      `Search ${category.toLowerCase()} in ${city}...`,
    allCategories: (city: string) => `All categories in ${city}`,
    noVendors: (category: string, city: string) =>
      `No ${category.toLowerCase()} vendors found in ${city}. Try another search or nearby city.`,
  };
}
