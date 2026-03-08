import Link from 'next/link';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Search } from 'lucide-react';
import { WERVICE_CATEGORIES, labelForCategory, normalizeCategory, slugToDbCategory } from '@/lib/categories';
import { getListingIndexingDecision } from '@/lib/seo/indexing';
import { fetchCityCategoryVendorCounts, fetchPublishedVendorCount, fetchVendors } from '@/lib/supabase/vendors';
import { slugToCityName, vendorUrl } from '@/lib/vendor-url';
import DashboardShell from '@/components/home/DashboardShell';
import InfiniteVendorGrid from '@/components/home/InfiniteVendorGrid';
import { localeAlternates, toAbsoluteUrl } from '@/lib/seo/site-url';
import { localizeCityLabel } from '@/lib/types/vendor';

interface CityPageProps {
  params: Promise<{ locale: string; city: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: CityPageProps): Promise<Metadata> {
  const { locale, city: citySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const selectedCategorySlug = normalizeCategory(
    Array.isArray(resolvedSearchParams.category)
      ? resolvedSearchParams.category[0]
      : resolvedSearchParams.category
  );
  const cityName = slugToCityName(citySlug);
  const cityLabel = cityName ? localizeCityLabel(cityName, locale) : '';

  if (!cityName) {
    return {
      title: 'Page Not Found | Wervice',
      robots: { index: false, follow: true },
    };
  }

  const canonical = toAbsoluteUrl(`/${locale}/${citySlug}`);
  const vendorCount = await fetchPublishedVendorCount({ city: cityName });
  const indexing = getListingIndexingDecision({
    searchParams: resolvedSearchParams,
    vendorCount,
  });

  const selectedLabel = selectedCategorySlug ? labelForCategory(selectedCategorySlug, locale) : 'Wedding Vendors';

  return {
    title: `${cityLabel} ${selectedLabel} | Wervice`,
    description: `Browse verified wedding vendors in ${cityLabel}, Morocco. Discover trusted categories, compare options, and plan with confidence.`,
    alternates: {
      canonical,
      languages: localeAlternates(`/${citySlug}`),
    },
    robots: {
      index: indexing.shouldIndex,
      follow: indexing.shouldFollow,
    },
    openGraph: {
      title: `Wedding Vendors in ${cityLabel} | Wervice`,
      description: `Top wedding vendors in ${cityLabel}.`,
      url: canonical,
    },
  };
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const { locale, city: citySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const categoryParam = Array.isArray(resolvedSearchParams.category) ? resolvedSearchParams.category[0] : resolvedSearchParams.category;
  const q = (Array.isArray(resolvedSearchParams.q) ? resolvedSearchParams.q[0] : resolvedSearchParams.q)?.trim() || '';
  const selectedCategorySlug = normalizeCategory(categoryParam || null);
  const selectedDbCategory = selectedCategorySlug ? slugToDbCategory(selectedCategorySlug) : null;
  const cityName = slugToCityName(citySlug);
  if (!cityName) notFound();
  const cityLabel = localizeCityLabel(cityName, locale);

  if (selectedCategorySlug || q) {
    const qs = new URLSearchParams();
    qs.set('city', cityName);
    if (selectedCategorySlug) qs.set('category', selectedCategorySlug);
    if (q) qs.set('q', q);
    redirect(`/${locale}/vendors?${qs.toString()}`);
  }

  const cityCategoryCounts = await fetchCityCategoryVendorCounts();
  const countsByDbCategory = new Map<string, number>();
  for (const row of cityCategoryCounts) {
    if (row.city !== cityName) continue;
    countsByDbCategory.set(row.category, row.vendorCount);
  }

  const categoryLinks = WERVICE_CATEGORIES
    .map((category) => ({
      slug: category.slug,
      label: labelForCategory(category.slug, locale),
      vendorCount: countsByDbCategory.get(category.dbCategory) || 0,
    }))
    .filter((category) => category.vendorCount > 0)
    .sort((a, b) => b.vendorCount - a.vendorCount);

  const isForYouMode = !selectedCategorySlug && !q;
  const { vendors, hasMore } = await fetchVendors({
    city: cityName,
    category: selectedDbCategory || undefined,
    q: q || undefined,
    sort: 'newest',
    limit: isForYouMode ? 60 : 24,
  });

  const pageTitle = selectedCategorySlug
    ? `${cityLabel} ${labelForCategory(selectedCategorySlug, locale)}`
    : `${cityLabel} Wedding Vendors`;
  const vendorsByCategorySlug = new Map<string, typeof vendors>();
  for (const category of WERVICE_CATEGORIES) {
    vendorsByCategorySlug.set(category.slug, []);
  }
  for (const vendor of vendors) {
    const slug = normalizeCategory(vendor.category);
    if (!slug) continue;
    const bucket = vendorsByCategorySlug.get(slug);
    if (!bucket) continue;
    bucket.push(vendor);
  }

  const sections = categoryLinks
    .map((category) => ({
      ...category,
      vendors: vendorsByCategorySlug.get(category.slug) || [],
    }))
    .filter((section) => section.vendors.length > 0);

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

  return (
    <DashboardShell locale={locale} savedCards={savedCards}>
      <section className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">{pageTitle}</h1>
          <p className="mt-3 text-lg text-[#4a5c74]">
            Discover top wedding vendors in {cityLabel}, filtered by category and style.
          </p>

          <form className="mt-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a99ad]" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search venues, styles, or vendor names..."
                className="h-14 w-full rounded-2xl border border-[#d7deea] bg-white pl-12 pr-4 text-base outline-none transition focus:border-[#1f6bd6]"
              />
              {selectedCategorySlug && (
                <input type="hidden" name="category" value={selectedCategorySlug} />
              )}
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              href={`/${locale}/vendors`}
              className="rounded-full border border-[#d2d9e5] bg-white px-4 py-2 text-sm font-semibold text-[#33475f] transition hover:bg-[#eef2f8]"
            >
              All Vendors
            </Link>
            <Link
              href={`/${locale}/${citySlug}${q ? `?q=${encodeURIComponent(q)}` : ''}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !selectedCategorySlug
                  ? 'bg-[#0b5d4b] text-white'
                  : 'border border-[#d2d9e5] bg-white text-[#33475f] hover:bg-[#eef2f8]'
              }`}
            >
              For you
            </Link>
            {categoryLinks.map((category) => {
              const isActive = selectedCategorySlug === category.slug;
              const href = `/${locale}/${citySlug}?category=${category.slug}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
              return (
                <Link
                  key={category.slug}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[#0b5d4b] text-white'
                      : 'border border-[#d2d9e5] bg-white text-[#33475f] hover:bg-[#eef2f8]'
                  }`}
                >
                  {category.label}
                </Link>
              );
            })}
          </div>

          {vendors.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#d7deea] bg-white p-6 text-[#5f6f84]">
              No vendors found for this filter in {cityLabel}.
            </div>
          ) : isForYouMode ? (
            <div className="mt-8 space-y-10">
              {sections.map((section) => (
                <section key={section.slug}>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="text-3xl font-black tracking-tight text-[#11190C]">{section.label}</h2>
                    <Link
                      href={`/${locale}/categories/${section.slug}?city=${encodeURIComponent(cityName)}`}
                      className="rounded-full border border-[#d2d9e5] bg-white px-4 py-2 text-sm font-semibold text-[#33475f] transition hover:bg-[#eef2f8]"
                    >
                      See more
                    </Link>
                  </div>
                  <InfiniteVendorGrid
                    locale={locale}
                    initialVendors={section.vendors.slice(0, 6)}
                    initialHasMore={false}
                    city={cityName}
                    category={slugToDbCategory(section.slug) || undefined}
                    gridClassName="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    showStatusText={false}
                  />
                </section>
              ))}
            </div>
          ) : (
            <InfiniteVendorGrid
              locale={locale}
              initialVendors={vendors}
              initialHasMore={hasMore}
              city={cityName}
              category={selectedDbCategory || undefined}
              q={q || undefined}
            />
          )}
      </section>
    </DashboardShell>
  );
}
