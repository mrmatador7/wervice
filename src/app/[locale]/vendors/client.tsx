'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VendorHero from '@/components/vendors/VendorHero';
import VendorQuickFilters from '@/components/vendors/VendorQuickFilters';
import VendorFilters from '@/components/vendors/VendorFilters';
import VendorGrid from '@/components/vendors/VendorGrid';
import { Vendor, VendorFilters as VendorFiltersType } from '@/lib/types/vendor';
import { labelForCategory } from '@/lib/categories';

interface VendorDirectoryClientProps {
  initialVendors: Vendor[];
  initialFilters: VendorFiltersType;
  totalCount: number;
  initialTotal: number;
  initialTotalPages: number;
  category?: string;
  isCategoryPage?: boolean;
}

export default function VendorDirectoryClient({
  initialVendors,
  initialFilters,
  totalCount,
  initialTotal,
  initialTotalPages,
  category,
  isCategoryPage = false,
}: VendorDirectoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [vendors, setVendors] = useState(initialVendors);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [showFilters, setShowFilters] = useState(false);

  // Sync filters with URL params
  useEffect(() => {
    const urlFilters: VendorFiltersType = {
      q: searchParams.get('q') || undefined,
      city: searchParams.get('city') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      sort: (searchParams.get('sort') as VendorFiltersType['sort']) || 'relevance',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    };

    if (category) {
      urlFilters.category = category;
    }

    setFilters(urlFilters);
  }, [searchParams, category]);

  // Fetch vendors when filters change
  const fetchVendors = useCallback(async (newFilters: VendorFiltersType) => {
    setIsLoading(true);
    try {
      const queryString = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryString.set(key, String(value));
        }
      });

      const response = await fetch(`/api/vendors?${queryString.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }

      const result = await response.json();
      setVendors(result.vendors);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update URL and fetch new data when filters change
  const updateFilters = useCallback((newFilters: Partial<VendorFiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset page on filter change

    const params = new URLSearchParams(searchParams.toString());

    // Update params
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    // Remove category from params if we're on a category page
    if (category) {
      params.delete('category');
    }

    const queryString = params.toString();
    const url = category
      ? `/${locale}/vendors/${category}${queryString ? `?${queryString}` : ''}`
      : `/${locale}/vendors${queryString ? `?${queryString}` : ''}`;

    router.push(url);
    fetchVendors(updatedFilters);
  }, [filters, searchParams, category, locale, router, fetchVendors]);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<VendorFiltersType>) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    const baseFilters: VendorFiltersType = {
      sort: 'relevance',
      page: 1,
    };

    if (category) {
      baseFilters.category = category;
    }

    updateFilters(baseFilters);
  }, [category, updateFilters]);

  // Get hero title and subtitle
  const getHeroContent = () => {
    if (category) {
      const categoryLabel = labelForCategory(category);
      return {
        title: `${categoryLabel} Vendors`,
        subtitle: `Find the best ${categoryLabel.toLowerCase()} vendors in Morocco`,
      };
    }

    return {
      title: 'Wedding Vendors in Morocco',
      subtitle: 'Find verified venues, catering, photography, and more',
    };
  };

  const heroContent = getHeroContent();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <VendorHero
          title={heroContent.title}
          subtitle={heroContent.subtitle}
          totalCount={totalCount}
        />

        {/* Quick Filters */}
        {!isCategoryPage && (
          <VendorQuickFilters
            onFilterChange={handleFilterChange}
            activeFilters={filters}
          />
        )}

        {/* Main Layout */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Filters Sidebar */}
            <motion.aside
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="hidden lg:block">
                <VendorFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  totalResults={total}
                  isMobile={false}
                  isCategoryPage={isCategoryPage}
                />
              </div>
            </motion.aside>

            {/* Vendors Grid */}
            <section className="lg:col-span-9">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-500">
                  Showing {total > 0 ? `${((filters.page || 1) - 1) * 12 + 1}-${Math.min((filters.page || 1) * 12, total)} of ${total.toLocaleString()}` : '0'} vendors
                </p>
                <select
                  value={filters.sort || 'relevance'}
                  onChange={(e) => handleFilterChange({ sort: e.target.value as VendorFiltersType['sort'] })}
                  className="border border-gray-200 rounded-lg text-sm px-3 py-2 hover:shadow-xs transition-shadow"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating_desc">Rating (High to Low)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Vendor Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <VendorGrid
                  vendors={vendors}
                  isLoading={isLoading}
                  totalPages={totalPages}
                  currentPage={filters.page || 1}
                  onPageChange={handlePageChange}
                  onClearFilters={handleClearFilters}
                />
              </motion.div>
            </section>
          </div>

          {/* Floating Filter Button (Mobile) */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setShowFilters(true)}
            className="fixed bottom-6 right-6 lg:hidden bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-colors z-40"
            aria-label="Open filters"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </motion.button>
        </div>

        {/* Mobile Filters Sheet */}
        {showFilters && (
          <VendorFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            totalResults={total}
            isMobile={true}
            isCategoryPage={isCategoryPage}
            onClose={() => setShowFilters(false)}
          />
        )}
      </main>
      <Footer />
    </>
  );
}