import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import NewCategoryClient from '../components/NewCategoryClient';
import CategorySeoBlocks from '@/components/category/CategorySeoBlocks';
import { formatCategoryName } from '@/lib/format';
import { VALID_CATEGORY_SLUGS } from '@/lib/categories';

interface PageProps {
  params: Promise<{ locale: string; categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const { city } = await searchParams;
  const categoryName = formatCategoryName(categorySlug);
  const cityLabel = city && city !== 'all' ? ` in ${city}` : ' in Morocco';
  const canonical = `https://wervice.com/${locale}/categories/${categorySlug}${city && city !== 'all' ? `?city=${encodeURIComponent(city as string)}` : ''}`;

  return {
    title: `Wedding ${categoryName}${cityLabel} | Wervice`,
    description: `Find verified ${categoryName.toLowerCase()} professionals${cityLabel}. Compare prices, view portfolios, and contact vendors directly for your wedding.`,
    alternates: {
      canonical,
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
