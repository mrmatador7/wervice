'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VendorsHero from '@/components/vendors/VendorsHero';
import VendorsCategoryChips from '@/components/vendors/VendorsCategoryChips';
import VendorsFeaturedBlock from '@/components/vendors/VendorsFeaturedBlock';
import VendorsResultsGrid from '@/components/vendors/VendorsResultsGrid';
import { Vendor, VendorFilters, VendorCity, VendorCategory, getAllVendors, filterVendors, sortVendors } from '@/lib/vendors';

interface VendorDirectoryClientProps {
  initialVendors: Vendor[];
  initialFilters: VendorFilters;
}

export default function VendorDirectoryClient({
  initialVendors,
  initialFilters,
}: VendorDirectoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [vendors, setVendors] = useState(initialVendors);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with URL params and update data
  useEffect(() => {
    const urlFilters: VendorFilters = {
      q: searchParams.get('q') || undefined,
      city: (searchParams.get('city') as VendorCity) || undefined,
      category: (searchParams.get('category') as VendorCategory) || undefined,
      minPrice: searchParams.get('min') ? parseInt(searchParams.get('min')!) : undefined,
      maxPrice: searchParams.get('max') ? parseInt(searchParams.get('max')!) : undefined,
      sort: (searchParams.get('sort') as VendorFilters['sort']) || 'recommended',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    };

    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) {
      setFilters(urlFilters);
      setIsLoading(true);

      // Fetch new data based on URL filters
      const allVendors = getAllVendors();
      const filteredVendors = filterVendors(allVendors, urlFilters);
      const sortedVendors = sortVendors(filteredVendors, urlFilters.sort);

      setVendors(sortedVendors);
      setIsLoading(false);
    }
  }, [searchParams, filters]);

  // Handle category changes from chips
  const handleCategoryChange = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    // Remove page param when changing filters
    params.delete('page');

    const queryString = params.toString();
    const url = `/${locale}/vendors${queryString ? `?${queryString}` : ''}`;

    router.push(url);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    router.push(`/${locale}/vendors`);
  };

  // Determine if we should show featured block
  const shouldShowFeatured = !filters.q && !filters.city && (!filters.category || filters.category === 'Venues');

  // Get featured vendors (top 6 for display)
  const featuredVendors = shouldShowFeatured ? vendors.slice(0, 6) : [];

  // Get results vendors (all if no featured, or remaining after featured)
  const resultsVendors = shouldShowFeatured ? vendors.slice(6) : vendors;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <VendorsHero initialFilters={filters} />

        {/* Category Chips */}
        <VendorsCategoryChips
          activeCategory={filters.category || undefined}
          onCategoryChange={handleCategoryChange}
        />

        {/* Featured Block (if applicable) */}
        {shouldShowFeatured && featuredVendors.length > 0 && (
          <VendorsFeaturedBlock
            vendors={featuredVendors}
            city={filters.city}
            category={filters.category}
          />
        )}

        {/* Results Grid */}
        <VendorsResultsGrid
          vendors={resultsVendors}
          isLoading={isLoading}
          onClearFilters={handleClearFilters}
        />
      </main>
      <Footer />
    </>
  );
}