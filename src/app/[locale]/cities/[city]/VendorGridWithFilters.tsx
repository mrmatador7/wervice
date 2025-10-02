'use client';

import { useEffect, useState } from 'react';
import CategoryFilters from '@/components/city/CategoryFilters';
import SubcategoryFilter from '@/components/filters/SubcategoryFilter';
import VendorGrid from '@/components/city/VendorGrid';

interface VendorGridWithFiltersProps {
  city: any;
}

export default function VendorGridWithFilters({ city }: VendorGridWithFiltersProps) {
  const [category, setCategory] = useState('all');
  const [subcategory, setSubcategory] = useState('all');

  useEffect(() => {
    // Get filters from URL on mount and URL changes
    const updateFilters = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category') || 'all';
      const subcategoryParam = urlParams.get('subcategory') || 'all';

      setCategory(categoryParam);
      setSubcategory(subcategoryParam);
    };

    updateFilters();

    // Listen for URL changes
    const handlePopState = () => updateFilters();
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    // Auto-clear subcategory when category changes
    setSubcategory('all');
  };

  const handleClearFilters = () => {
    // Clear all filters from URL
    const newUrl = window.location.pathname;
    window.history.replaceState(null, '', newUrl);
    setCategory('all');
    setSubcategory('all');
  };

  return (
    <>
      {/* Filters */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryFilters
            cityName={city.name}
            onCategoryChange={handleCategoryChange}
          />
          {/* Subcategory Filter */}
          <SubcategoryFilter mainCategory={category === 'all' ? undefined : category} />
        </div>
      </section>

      {/* Vendor Grid */}
      <section className="py-12 sm:py-16 bg-wervice-shell/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VendorGrid
            city={city}
            category={category}
            subcategory={subcategory}
            onClearFilters={handleClearFilters}
          />
        </div>
      </section>
    </>
  );
}
