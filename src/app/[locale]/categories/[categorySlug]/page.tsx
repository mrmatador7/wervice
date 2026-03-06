import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import NewCategoryClient from '../components/NewCategoryClient';
import CategorySeoBlocks from '@/components/category/CategorySeoBlocks';
import { formatCategoryName } from '@/lib/format';
import { slugToDbCategory, VALID_CATEGORY_SLUGS } from '@/lib/categories';
import { cityToSlug } from '@/lib/vendor-url';
import { getListingIndexingDecision } from '@/lib/seo/indexing';
import { fetchPublishedVendorCount } from '@/lib/supabase/vendors';

interface PageProps {
  params: Promise<{ locale: string; categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const city = typeof resolvedSearchParams.city === 'string' ? resolvedSearchParams.city : undefined;
  const categoryName = formatCategoryName(categorySlug);
  const hasCity = Boolean(city && city !== 'all');
  const cityLabel = hasCity ? ` in ${city}` : ' in Morocco';
  const canonical = hasCity
    ? `https://wervice.com/${locale}/${cityToSlug(city as string)}/${categorySlug}`
    : `https://wervice.com/${locale}/categories/${categorySlug}`;
  const vendorCount = await fetchPublishedVendorCount({
    city: hasCity ? city : undefined,
    category: slugToDbCategory(categorySlug) || categorySlug,
  });
  const indexing = getListingIndexingDecision({
    searchParams: resolvedSearchParams,
    vendorCount,
    // This legacy query-based category page should not be indexed as primary URL.
    forceNoindex: !hasCity,
  });

  return {
    title: `Wedding ${categoryName}${cityLabel} | Wervice`,
    description: `Find verified ${categoryName.toLowerCase()} professionals${cityLabel}. Compare prices, view portfolios, and contact vendors directly for your wedding.`,
    alternates: {
      canonical,
    },
    robots: {
      index: indexing.shouldIndex,
      follow: indexing.shouldFollow,
    },
    openGraph: {
      title: `Wedding ${categoryName}${cityLabel} | Wervice`,
      description: `Discover top-rated ${categoryName.toLowerCase()} for your Moroccan wedding.`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { locale, categorySlug } = await params;
  const searchParamsResolved = await searchParams;

  // Redirect legacy /venue to /venues
  if (categorySlug === 'venue') {
    const qs = new URLSearchParams();
    Object.entries(searchParamsResolved).forEach(([k, v]) => {
      if (v === undefined) return;
      if (Array.isArray(v)) v.forEach((val) => qs.append(k, val));
      else qs.append(k, v);
    });
    const qsStr = qs.toString();
    redirect(`/${locale}/categories/venues${qsStr ? `?${qsStr}` : ''}`);
  }

  if (!VALID_CATEGORY_SLUGS.includes(categorySlug as (typeof VALID_CATEGORY_SLUGS)[number])) {
    notFound();
  }

  const city = typeof searchParamsResolved.city === 'string' ? searchParamsResolved.city : undefined;

  return (
    <main className="min-h-screen bg-white">
      <NewCategoryClient
        category={categorySlug}
        initialSearchParams={searchParamsResolved}
        seoBlocks={
          <CategorySeoBlocks
            categorySlug={categorySlug}
            city={city}
            locale={locale}
          />
        }
      />
    </main>
  );
}

export async function generateStaticParams() {
  return VALID_CATEGORY_SLUGS.map((categorySlug) => ({ categorySlug }));
}
