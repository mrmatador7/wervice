import { Metadata } from 'next';
import { getVendors, getVendorCount } from '@/lib/vendors-server';
import { VendorFilters } from '@/lib/types/vendor';
import FilterPanel from '@/components/vendors/FilterPanel';
import ResultGrid from '@/components/vendors/ResultGrid';
import QuickChips from '@/components/vendors/QuickChips';

interface VendorsPageProps {
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

export async function generateMetadata({ searchParams }: VendorsPageProps): Promise<Metadata> {
  const filters = parseSearchParams(await searchParams);

  let title = 'Wedding Vendors in Morocco | Wervice';
  let description = 'Browse verified wedding vendors in Morocco. Find venues, catering, photo & video, event planners, beauty, decor, music, and dresses by city and budget.';

  if (filters.category) {
    title = `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Vendors in Morocco | Wervice`;
    description = `Find verified ${filters.category.toLowerCase()} vendors in Morocco. Browse professionals by city and budget.`;
  }

  if (filters.city && filters.city !== 'all') {
    const cityName = filters.city.charAt(0).toUpperCase() + filters.city.slice(1);
    title = `Wedding Vendors in ${cityName}, Morocco | Wervice`;
    description = `Browse wedding vendors in ${cityName}, Morocco. Find venues, catering, photography and more.`;
  }

  return {
    title,
    description,
    keywords: ['wedding vendors', 'Morocco', 'wedding planning', 'venues', 'catering', 'photography', 'event planners'],
    openGraph: {
      title,
      description,
      images: [{ url: 'https://images.unsplash.com/photo-1521337585-5b66dcdc0fbe?w=1200&h=630&fit=crop' }],
      type: 'website',
    },
  };
}

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
  const filters = parseSearchParams(await searchParams);

  // Fetch initial data on server
  const result = await getVendors(filters);
  const totalCount = await getVendorCount();

  return (
    <div className="min-h-screen bg-white">
      {/* Header + Chips */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="space-y-6 md:space-y-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
              Wedding Vendors in Morocco
            </h1>
            <p className="mt-2 text-gray-600">
              Find verified venues, catering, photography, and more
            </p>
            <p className="mt-1 text-sm text-gray-500">{totalCount} verified vendors</p>
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