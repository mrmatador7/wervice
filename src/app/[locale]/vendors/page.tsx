'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ModernFilterBar from '@/components/vendors/ModernFilterBar';
import CategoryCover from '@/components/vendors/CategoryCover';
import VendorCard from '@/components/vendors/VendorCard';
import SkeletonCard from '@/components/vendors/SkeletonCard';
import { Search } from 'lucide-react';
import { capitalizeCity } from '@/lib/utils';

import { Vendor } from '@/lib/types/vendor';

type Category = {
  id: string;
  name: string;
  slug: string;
  strapline: string | null;
  cover_url: string | null;
};

function VendorsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  // Parse filters from URL
  const filters = {
    q: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    city: searchParams.get('city') || undefined,
    priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
    priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
    sort: searchParams.get('sort') || 'newest',
  };

  // Fetch vendors
  const fetchVendors = async (append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set('q', filters.q);
      if (filters.category) params.set('category', filters.category);
      if (filters.city) params.set('city', filters.city);
      if (filters.priceMin) params.set('priceMin', String(filters.priceMin));
      if (filters.priceMax) params.set('priceMax', String(filters.priceMax));
      if (filters.sort) params.set('sort', filters.sort);
      params.set('limit', '24');
      params.set('offset', String(append ? offset : 0));

      const res = await fetch(`/api/vendors?${params.toString()}`);
      const data = await res.json();

      if (append) {
        // Deduplicate vendors by ID when appending
        setVendors((prev) => {
          const existingIds = new Set(prev.map(v => v.id));
          const newVendors = data.vendors.filter((v: Vendor) => !existingIds.has(v.id));
          return [...prev, ...newVendors];
        });
      } else {
        setVendors(data.vendors);
        setOffset(0);
      }

      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch category data
  const fetchCategory = async () => {
    if (!filters.category) {
      setCategory(null);
      return;
    }

    try {
      const res = await fetch(`/api/categories/${filters.category}`);
      if (res.ok) {
        const data = await res.json();
        setCategory(data);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  // Fetch cities
  const fetchCities = async () => {
    try {
      const res = await fetch('/api/vendors/cities');
      const data = await res.json();
      setCities(data.cities || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  // Initial load
  useEffect(() => {
    // Redirect to new category page structure if category parameter exists
    if (filters.category) {
      const categorySlug = filters.category;
      const params = new URLSearchParams();
      if (filters.city) params.set('city', filters.city);
      if (filters.q) params.set('q', filters.q);
      if (filters.priceMin) params.set('priceMin', String(filters.priceMin));
      if (filters.priceMax) params.set('priceMax', String(filters.priceMax));
      
      const queryString = params.toString();
      router.replace(`/en/categories/${categorySlug}${queryString ? `?${queryString}` : ''}`);
      return;
    }

    fetchVendors();
    fetchCategory();
    fetchCities();
  }, [searchParams]);

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    const params = new URLSearchParams();
    if (newFilters.q) params.set('q', newFilters.q);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.priceMin) params.set('priceMin', String(newFilters.priceMin));
    if (newFilters.priceMax) params.set('priceMax', String(newFilters.priceMax));
    if (newFilters.sort) params.set('sort', newFilters.sort);

    router.push(`/en/vendors?${params.toString()}`);
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    const newFilters = { ...filters, city: city || undefined };
    handleFilterChange(newFilters);
  };

  // Load more
  const handleLoadMore = () => {
    setOffset((prev) => prev + 24);
    fetchVendors(true);
  };

  // Clear all filters
  const handleClearAll = () => {
    router.push('/en/vendors');
  };

  const activeCity = filters.city ? capitalizeCity(filters.city) : 'All Cities';

  return (
    <main className="mx-auto max-w-[110rem] px-4 py-6 md:px-6 lg:px-8">
        {/* Category Cover */}
        {category && (
          <CategoryCover
            title={category.name}
            strapline={category.strapline}
            coverUrl={category.cover_url}
          />
        )}

        {/* Modern Filters Bar */}
        <div className="sticky top-14 z-30 mb-6 rounded-2xl border border-zinc-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur">
          <ModernFilterBar initialFilters={filters} cities={cities} onChange={handleFilterChange} />
        </div>

        {/* Heading + Count */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">
            🔥 Popular in {activeCity}
          </h2>
          <span className="text-sm text-zinc-500">{total} vendors</span>
        </div>

        {/* Grid */}
        {loading && offset === 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : vendors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {vendors.map((vendor, index) => (
                <VendorCard key={`${vendor.id}-${vendor.slug || index}`} vendor={vendor} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Show More'}
                </button>
              </div>
            )}
          </>
        ) : !loading ? (
          /* Only show empty state after loading is complete */
          <div className="mx-auto my-16 max-w-md text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-content-center rounded-full bg-zinc-100">
              <Search className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-zinc-900">
              No vendors found
            </h3>
            <p className="mb-4 text-sm text-zinc-500">
              Try changing the city, category, or price range.
            </p>
            <button
              onClick={handleClearAll}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Clear all filters
            </button>
          </div>
        ) : null}
    </main>
  );
}

export default function VendorsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className="mx-auto max-w-[110rem] px-4 py-6 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </main>
      }>
        <VendorsPageContent />
      </Suspense>
      <Footer />
    </>
  );
}
