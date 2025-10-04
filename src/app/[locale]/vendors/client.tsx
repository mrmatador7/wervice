'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch, FiFilter, FiHeart, FiMessageCircle, FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Vendor, VendorFilters, VendorCity, VendorCategory, VENDOR_CATEGORIES, VENDOR_CITIES, SORT_OPTIONS, getAllVendors, filterVendors, sortVendors, paginateVendors } from '@/lib/vendors';

interface VendorDirectoryClientProps {
  initialVendors: Vendor[];
  initialFilters: VendorFilters;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// Vendor Card Component
function VendorCard({ vendor }: { vendor: Vendor }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  const whatsappUrl = vendor.whatsapp ? `https://wa.me/${vendor.whatsapp}` : null;

  return (
    <div className="bg-white rounded-2xl border border-[var(--stroke)] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
      {/* Image */}
      <div className="relative h-[200px] md:h-[210px] lg:h-[220px] overflow-hidden">
        <Image
          src={vendor.coverImage}
          alt={vendor.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 rounded-full">
            {vendor.category}
          </span>
        </div>

        {/* Featured/New badges */}
        {vendor.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 bg-[#D7FF1F] text-[var(--wervice-lime-ink)] text-xs font-semibold rounded-full">
              Featured
            </span>
          </div>
        )}

        {/* Tags */}
        {vendor.tags && vendor.tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1">
            {vendor.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="inline-flex items-center px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--ink)] text-lg mb-1 truncate group-hover:text-[var(--wervice-lime-ink)] transition-colors">
              {vendor.name}
            </h3>
            <p className="text-[var(--sub)] text-sm">
              {vendor.category} • {vendor.city}
            </p>
          </div>

          {/* Rating */}
          {vendor.rating && (
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <FiStar className="w-4 h-4 fill-[#D7FF1F] text-[#D7FF1F]" />
              <span className="text-sm font-medium text-[var(--ink)]">{vendor.rating}</span>
              {vendor.reviewsCount && (
                <span className="text-xs text-[var(--sub)]">({vendor.reviewsCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Price */}
        {vendor.startingPrice && (
          <p className="text-[var(--ink)] font-medium mb-4">
            Starting at {vendor.startingPrice.toLocaleString()} MAD
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/${currentLocale}/vendors/${vendor.slug}`}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-[var(--stroke)] text-[var(--ink)] font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            View Profile
          </Link>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-[#D7FF1F] text-[var(--wervice-lime-ink)] font-medium rounded-xl hover:brightness-95 transition-all duration-200"
              aria-label={`Contact ${vendor.name} on WhatsApp`}
            >
              <FiMessageCircle className="w-4 h-4" />
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-400 font-medium rounded-xl cursor-not-allowed"
              aria-label="WhatsApp not available"
            >
              <FiMessageCircle className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`inline-flex items-center justify-center px-3 py-2 border border-[var(--stroke)] rounded-xl hover:bg-slate-50 transition-colors ${
              isBookmarked ? 'text-red-500' : 'text-slate-400'
            }`}
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            <FiHeart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Search and Filters Component
function SearchAndFilters({
  filters,
  onFiltersChange,
  totalCount
}: {
  filters: VendorFilters;
  onFiltersChange: (filters: VendorFilters) => void;
  totalCount: number;
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<VendorFilters>) => {
    const updated = { ...localFilters, ...newFilters, page: 1 }; // Reset to page 1 when filtering
    setLocalFilters(updated);
    onFiltersChange(updated);
  }, [localFilters, onFiltersChange]);

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsFiltersOpen(false);
  };

  const clearFilters = () => {
    const cleared = { sort: 'recommended' as const, page: 1 };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  return (
    <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search vendors or keywords"
              value={localFilters.q || ''}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, q: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full pl-10 pr-4 py-3 border border-[var(--stroke)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent"
            />
          </div>

          {/* Quick Filters */}
          <select
            value={localFilters.city || ''}
            onChange={(e) => updateFilters({ city: (e.target.value as VendorCity) || undefined })}
            className="px-4 py-3 border border-[var(--stroke)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] bg-white"
          >
            <option value="">All Cities</option>
            {VENDOR_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={localFilters.category || ''}
            onChange={(e) => updateFilters({ category: (e.target.value as VendorCategory) || undefined })}
            className="px-4 py-3 border border-[var(--stroke)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] bg-white"
          >
            <option value="">All Categories</option>
            {VENDOR_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={localFilters.sort || 'recommended'}
            onChange={(e) => updateFilters({ sort: e.target.value as VendorFilters['sort'] })}
            className="px-4 py-3 border border-[var(--stroke)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] bg-white"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="p-3 border border-[var(--stroke)] rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#D7FF1F]"
            aria-label="Toggle filters"
          >
            <FiFilter className="w-4 h-4" />
          </button>
        </div>

        {/* Results count and clear filters */}
        <div className="flex items-center justify-between">
          <p className="text-[var(--sub)] text-sm">
            {totalCount} vendor{totalCount !== 1 ? 's' : ''} found
          </p>

          {(filters.q || filters.city || filters.category || filters.minPrice || filters.maxPrice) && (
            <button
              onClick={clearFilters}
              className="text-sm text-black hover:text-gray-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {isFiltersOpen && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-[var(--stroke)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--ink)] mb-2">
                  Min Price (MAD)
                </label>
                <input
                  type="number"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, minPrice: e.target.value ? parseInt(e.target.value) : undefined }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-[var(--stroke)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7FF1F]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--ink)] mb-2">
                  Max Price (MAD)
                </label>
                <input
                  type="number"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, maxPrice: e.target.value ? parseInt(e.target.value) : undefined }))}
                  placeholder="No limit"
                  className="w-full px-3 py-2 border border-[var(--stroke)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7FF1F]"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={applyFilters}
                  className="w-full px-4 py-2 bg-[#D7FF1F] text-[var(--wervice-lime-ink)] font-semibold rounded-lg hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:ring-offset-2"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const showPages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  const endPage = Math.min(totalPages, startPage + showPages - 1);

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-[var(--stroke)] rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 border border-[var(--stroke)] rounded-lg hover:bg-slate-50"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 border rounded-lg ${
            page === currentPage
              ? 'bg-[#D7FF1F] text-[var(--wervice-lime-ink)] border-[#D7FF1F]'
              : 'border-[var(--stroke)] hover:bg-slate-50'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 border border-[var(--stroke)] rounded-lg hover:bg-slate-50"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-[var(--stroke)] rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// Empty State Component
function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiSearch className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-[var(--ink)] mb-2">No vendors found</h3>
      <p className="text-[var(--sub)] mb-6 max-w-md mx-auto">
        Try adjusting your search criteria or clearing filters to see more results.
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-3 bg-[#D7FF1F] text-[var(--wervice-lime-ink)] font-semibold rounded-xl hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:ring-offset-2"
      >
        Clear Filters
      </button>
    </div>
  );
}

// Loading Skeleton
function VendorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[var(--stroke)] shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="p-5">
        <div className="h-5 bg-slate-200 rounded mb-2" />
        <div className="h-4 bg-slate-200 rounded mb-4 w-3/4" />
        <div className="h-4 bg-slate-200 rounded mb-4 w-1/2" />
        <div className="flex gap-2">
          <div className="h-10 bg-slate-200 rounded-xl flex-1" />
          <div className="h-10 bg-slate-200 rounded-xl w-10" />
          <div className="h-10 bg-slate-200 rounded-xl w-10" />
        </div>
      </div>
    </div>
  );
}

export default function VendorDirectoryClient({
  initialVendors,
  initialFilters,
  totalCount,
  totalPages,
  currentPage
}: VendorDirectoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vendors, setVendors] = useState(initialVendors);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [hasHandledSearchNavigation, setHasHandledSearchNavigation] = useState(false);

  // Sync filters with URL parameters and refetch data
  useEffect(() => {
    const category = searchParams.get('category') || undefined;
    const city = searchParams.get('city') || undefined;
    const q = searchParams.get('q') || undefined;
    const minPrice = searchParams.get('min') ? parseInt(searchParams.get('min')!) : undefined;
    const maxPrice = searchParams.get('max') ? parseInt(searchParams.get('max')!) : undefined;
    const sort = (searchParams.get('sort') as VendorFilters['sort']) || 'recommended';
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam) : 1;

    const urlFilters: VendorFilters = {
      category: category as VendorCategory,
      city: city as VendorCity,
      q,
      minPrice,
      maxPrice,
      sort,
      page
    };

    // Only update if filters have actually changed and we're not in the middle of a programmatic navigation
    const hasChanged = JSON.stringify(filters) !== JSON.stringify(urlFilters);
    if (hasChanged && !isLoading) {
      setFilters(urlFilters);
      setIsLoading(true);

      // Simulate API call - in real app this would fetch from server
      setTimeout(() => {
        // Apply client-side filtering to mock data
        const allVendors = getAllVendors();
        const filtered = filterVendors(allVendors, urlFilters);
        const sorted = sortVendors(filtered, urlFilters.sort);
        const paginated = paginateVendors(sorted, urlFilters.page);

        setVendors(paginated.vendors);
        setIsLoading(false);
      }, 300);
    }
  }, [searchParams, isLoading, filters]);

  // Update URL when filters change
  const updateUrl = useCallback((newFilters: VendorFilters) => {
    const params = new URLSearchParams();

    if (newFilters.q) params.set('q', newFilters.q);
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.minPrice) params.set('min', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('max', newFilters.maxPrice.toString());
    if (newFilters.sort && newFilters.sort !== 'recommended') params.set('sort', newFilters.sort);
    if (newFilters.page && newFilters.page !== 1) {
      params.set('page', newFilters.page.toString());
    }

    const queryString = params.toString();
    // Use relative path to maintain locale context
    router.push(queryString ? `?${queryString}` : '', { scroll: false });
  }, [router]);

  // Handle filter changes
  const handleFiltersChange = useCallback(async (newFilters: VendorFilters) => {
    setIsLoading(true);
    setFilters(newFilters);
    updateUrl(newFilters);

    // Apply client-side filtering to mock data
    setTimeout(() => {
      const allVendors = getAllVendors();
      const filtered = filterVendors(allVendors, newFilters);
      const sorted = sortVendors(filtered, newFilters.sort);
      const paginated = paginateVendors(sorted, newFilters.page);

      setVendors(paginated.vendors);
      setIsLoading(false);
    }, 300);
  }, [updateUrl]);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    setIsLoading(true);
    updateUrl(newFilters);

    // Immediately update the vendors for the new page
    setTimeout(() => {
      const allVendors = getAllVendors();
      const filtered = filterVendors(allVendors, newFilters);
      const sorted = sortVendors(filtered, newFilters.sort);
      const paginated = paginateVendors(sorted, newFilters.page);

      setVendors(paginated.vendors);
      setIsLoading(false);
    }, 300);
  }, [filters, updateUrl]);

  // Handle search navigation from homepage
  useEffect(() => {
    const categoryParam = searchParams.get('category');

    // Check if this is a search navigation (has category param and we haven't handled it yet)
    if (categoryParam && !hasHandledSearchNavigation && !isLoading) {
      setHasHandledSearchNavigation(true);

      // Track analytics for search navigation
      const analytics = {
        track: (event: string, data: Record<string, unknown>) => {
          console.log('Analytics:', event, data);
          // In real app: analytics.track(event, data);
        }
      };

      analytics.track('search_submitted', {
        source: 'home',
        category: categoryParam,
        timestamp: new Date().toISOString(),
      });

      // Focus the vendors grid heading for accessibility
      setTimeout(() => {
        const heading = document.querySelector('h1, h2') as HTMLElement;
        if (heading) {
          heading.focus();
          // Scroll to make sure it's visible
          heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [searchParams, hasHandledSearchNavigation, isLoading]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16 md:pb-20 pt-8 md:pt-12">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--ink)] mb-4">
                Find Wedding Vendors in Morocco
              </h1>
              <p className="text-lg md:text-xl text-[var(--sub)] max-w-2xl mx-auto">
                Browse verified vendors by city, category, and budget.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <SearchAndFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          totalCount={totalCount}
        />

        {/* Vendor Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VendorCardSkeleton key={i} />
                ))}
              </div>
            ) : vendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <VendorCard key={vendor.slug} vendor={vendor} />
                ))}
              </div>
            ) : (
              <EmptyState onClearFilters={() => handleFiltersChange({ sort: 'recommended', page: 1 })} />
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
