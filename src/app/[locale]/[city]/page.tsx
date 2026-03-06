import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { WERVICE_CATEGORIES } from '@/lib/categories';
import { getListingIndexingDecision } from '@/lib/seo/indexing';
import { fetchCityCategoryVendorCounts, fetchPublishedVendorCount } from '@/lib/supabase/vendors';
import { slugToCityName } from '@/lib/vendor-url';

interface CityPageProps {
  params: Promise<{ locale: string; city: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: CityPageProps): Promise<Metadata> {
  const { locale, city: citySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const cityName = slugToCityName(citySlug);

  if (!cityName) {
    return {
      title: 'Page Not Found | Wervice',
      robots: { index: false, follow: true },
    };
  }

  const canonical = `https://wervice.com/${locale}/${citySlug}`;
  const vendorCount = await fetchPublishedVendorCount({ city: cityName });
  const indexing = getListingIndexingDecision({
    searchParams: resolvedSearchParams,
    vendorCount,
  });

  return {
    title: `Wedding Vendors in ${cityName} | Wervice`,
    description: `Browse verified wedding vendors in ${cityName}, Morocco. Discover trusted categories, compare options, and plan with confidence.`,
    alternates: {
      canonical,
    },
    robots: {
      index: indexing.shouldIndex,
      follow: indexing.shouldFollow,
    },
    openGraph: {
      title: `Wedding Vendors in ${cityName} | Wervice`,
      description: `Top wedding vendors in ${cityName}.`,
      url: canonical,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { locale, city: citySlug } = await params;
  const cityName = slugToCityName(citySlug);
  if (!cityName) notFound();

  const cityCategoryCounts = await fetchCityCategoryVendorCounts();
  const countsByDbCategory = new Map<string, number>();
  for (const row of cityCategoryCounts) {
    if (row.city !== cityName) continue;
    countsByDbCategory.set(row.category, row.vendorCount);
  }

  const categoryLinks = WERVICE_CATEGORIES
    .map((category) => ({
      slug: category.slug,
      label: category.label,
      vendorCount: countsByDbCategory.get(category.dbCategory) || 0,
    }))
    .filter((category) => category.vendorCount > 0)
    .sort((a, b) => b.vendorCount - a.vendorCount);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f7f7]">
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">
            Wedding Vendors in {cityName}
          </h1>
          <p className="mt-3 max-w-2xl text-[#4b5563]">
            Explore categories with active wedding vendors in {cityName}. Choose a category to see vendor profiles.
          </p>

          {categoryLinks.length === 0 ? (
            <div className="mt-10 rounded-xl border border-[#e5e7eb] bg-white p-6 text-[#6b7280]">
              No categories with published vendors are available for this city yet.
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryLinks.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${locale}/${citySlug}/${category.slug}`}
                  className="rounded-xl border border-[#e5e7eb] bg-white p-5 transition hover:border-[#111827] hover:shadow-sm"
                >
                  <div className="text-lg font-semibold text-[#111827]">{category.label}</div>
                  <div className="mt-2 text-sm text-[#6b7280]">{category.vendorCount} vendors</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

