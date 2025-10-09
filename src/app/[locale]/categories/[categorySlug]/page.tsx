import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Hero from '@/components/category/Hero';
import CategoryClient from '@/components/category/CategoryClient';
import { formatCategoryName } from '@/lib/format';

interface PageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const categoryName = formatCategoryName(categorySlug);

  return {
    title: `Wedding ${categoryName} in Morocco | Wervice`,
    description: `Find verified ${categoryName.toLowerCase()} professionals in Morocco. Compare prices, ratings, and availability to plan your perfect wedding.`,
    openGraph: {
      title: `Wedding ${categoryName} | Wervice`,
      description: `Discover top-rated ${categoryName.toLowerCase()} for your Moroccan wedding.`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { categorySlug } = await params;
  const searchParamsResolved = await searchParams;

  // Basic validation
  const validCategories = ['venues', 'catering', 'photo-video', 'planning', 'beauty', 'decor', 'music', 'dresses'];
  if (!validCategories.includes(categorySlug)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-wv-gray1">
      <Hero
        categorySlug={categorySlug}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Vendors', href: '/vendors' },
          { label: formatCategoryName(categorySlug) },
        ]}
      />

      {/* Client component to handle state */}
      <CategoryClient
        category={categorySlug}
        initialSearchParams={searchParamsResolved}
      />
    </main>
  );
}

// Generate static params for all categories
export async function generateStaticParams() {
  const validCategories = ['venues', 'catering', 'photo-video', 'planning', 'beauty', 'decor', 'music', 'dresses'];
  return validCategories.map((categorySlug) => ({
    categorySlug,
  }));
}
