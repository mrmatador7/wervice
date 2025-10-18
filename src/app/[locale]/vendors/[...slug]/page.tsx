import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VALID_CATEGORY_SLUGS, labelForCategory } from '@/lib/categories';
import { getVendors, getCategoryVendorCount } from '@/lib/vendors-server';
import { VendorFilters } from '@/lib/types/vendor';
import FilterPanel from '@/components/vendors/FilterPanel';
import ResultGrid from '@/components/vendors/ResultGrid';
import QuickChips from '@/components/vendors/QuickChips';

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parseSearchParams(searchParams: { [key: string]: string | string[] | undefined }): VendorFilters {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }
  });

  return {
    q: params.get('q') || undefined,
    city: params.get('city') || undefined,
    category: params.get('category') || undefined,
    minPrice: params.get('minPrice') ? parseInt(params.get('minPrice')!) : undefined,
    maxPrice: params.get('maxPrice') ? parseInt(params.get('maxPrice')!) : undefined,
    rating: params.get('rating') ? parseFloat(params.get('rating')!) : undefined,
    sort: (params.get('sort') as VendorFilters['sort']) || 'relevance',
    page: params.get('page') ? parseInt(params.get('page')!) : 1,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const firstSlug = slug[0];

  if (!VALID_CATEGORY_SLUGS.includes(firstSlug as any)) {
    return {
      title: 'Page Not Found | Wervice',
    };
  }

  const categoryLabel = labelForCategory(firstSlug);
  return {
    title: `${categoryLabel} Vendors in Morocco | Wervice`,
    description: `Find verified ${categoryLabel.toLowerCase()} vendors in Morocco. Browse professionals by city and budget.`,
    keywords: ['wedding vendors', categoryLabel.toLowerCase(), 'Morocco', 'wedding planning'],
    openGraph: {
      title: `${categoryLabel} Vendors in Morocco | Wervice`,
      description: `Find verified ${categoryLabel.toLowerCase()} vendors in Morocco. Browse professionals by city and budget.`,
      images: [{ url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&fit=crop' }],
      type: 'website',
    },
  };
}

export default async function DynamicVendorPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const firstSlug = slug[0];

  // Only handle category routes for now
  if (!VALID_CATEGORY_SLUGS.includes(firstSlug as any)) {
    notFound();
  }

  const filters = parseSearchParams(await searchParams);
  filters.category = firstSlug; // Force category filter

  // Fetch initial data on server
  const result = await getVendors(filters);
  const categoryCount = await getCategoryVendorCount(firstSlug);

  const categoryLabel = labelForCategory(firstSlug);

  return (
    <div className="min-h-screen bg-white">
      {/* Header + Chips */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="space-y-6 md:space-y-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
              {categoryLabel} Vendors in Morocco
            </h1>
            <p className="mt-2 text-gray-600">
              Find verified {categoryLabel.toLowerCase()} vendors in Morocco
            </p>
            <p className="mt-1 text-sm text-gray-500">{categoryCount} verified vendors</p>
          </header>

          {/* Quick chips */}
          <QuickChips />
        </div>
      </div>

      {/* Filters + Results */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex gap-6 md:gap-8">
          {/* Filter Rail */}
          <aside className="hidden md:block w-[280px] shrink-0">
            <div className="sticky top-[88px]">
              <FilterPanel />
            </div>
          </aside>

          {/* Results Area */}
          <section className="flex-1 min-w-0">
            <ResultGrid vendors={result.vendors} totalCount={result.total} currentFilters={filters} />
          </section>
        </div>
      </div>
    </div>
  );
}

// Generate static params for categories only
export async function generateStaticParams() {
  return VALID_CATEGORY_SLUGS.map((category) => ({
    slug: [category],
  }));
}
