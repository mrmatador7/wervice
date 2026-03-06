import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategorySeoBlocks from '@/components/category/CategorySeoBlocks';
import NewCategoryClient from '@/app/[locale]/categories/components/NewCategoryClient';
import { formatCategoryName } from '@/lib/format';
import { slugToDbCategory, VALID_CATEGORY_SLUGS } from '@/lib/categories';
import { getListingIndexingDecision } from '@/lib/seo/indexing';
import { fetchPublishedVendorCount } from '@/lib/supabase/vendors';
import { slugToCityName } from '@/lib/vendor-url';

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

  const canonical = `https://wervice.com/${locale}/${citySlug}/${category}`;
  const categoryName = formatCategoryName(category);
  const vendorCount = await fetchPublishedVendorCount({
    city: cityName,
    category: slugToDbCategory(category) || category,
  });
  const indexing = getListingIndexingDecision({
    searchParams: resolvedSearchParams,
    vendorCount,
  });

  return {
    title: `${categoryName} in ${cityName} | Wervice`,
    description: `Find verified ${categoryName.toLowerCase()} vendors in ${cityName}. Compare portfolios, prices, and availability for your wedding.`,
    alternates: {
      canonical,
    },
    robots: {
      index: indexing.shouldIndex,
      follow: indexing.shouldFollow,
    },
    openGraph: {
      title: `${categoryName} in ${cityName} | Wervice`,
      description: `Discover top ${categoryName.toLowerCase()} vendors in ${cityName}.`,
      url: canonical,
    },
  };
}

export default async function CityCategoryPage({ params, searchParams }: CityCategoryPageProps) {
  const { locale, city: citySlug, category } = await params;
  const resolvedSearchParams = await searchParams;
  const cityName = slugToCityName(citySlug);

  if (!cityName) notFound();
  if (!VALID_CATEGORY_SLUGS.includes(category as (typeof VALID_CATEGORY_SLUGS)[number])) notFound();

  const mergedSearchParams = {
    ...resolvedSearchParams,
    city: cityName,
  };

  return (
    <main className="min-h-screen bg-white">
      <NewCategoryClient
        category={category}
        initialSearchParams={mergedSearchParams}
        seoBlocks={(
          <CategorySeoBlocks
            categorySlug={category}
            city={cityName}
            locale={locale}
          />
        )}
      />
    </main>
  );
}
