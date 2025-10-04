'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import CategoryFilters from '@/components/city/CategoryFilters';
import SubcategoryFilter from '@/components/filters/SubcategoryFilter';
import VendorGrid from '@/components/city/VendorGrid';
import { MainCategory, isMainCategory } from '@/lib/categories';

interface VendorGridWithFiltersProps {
  city: {
    name: string;
    description: string;
    image: string;
    tagline: string;
  };
}

export default function VendorGridWithFilters({ city }: VendorGridWithFiltersProps) {
  const [category, setCategory] = useState('all');
  const [subcategory, setSubcategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const hasHandledSearchRef = useRef(false);

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

  // Handle search navigation (from hero search)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const isFromSearch = categoryParam && !hasHandledSearchRef.current;

    if (isFromSearch) {
      hasHandledSearchRef.current = true;
      setIsLoading(true);

      // Reset page to 1 when coming from search
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('page');
      window.history.replaceState(null, '', newUrl.toString());

      // Simulate loading delay, then scroll and focus
      setTimeout(() => {
        setIsLoading(false);

        // Scroll to vendors section
        const vendorsSection = document.getElementById('vendors');
        if (vendorsSection) {
          vendorsSection.scrollIntoView({ behavior: 'smooth' });

          // Focus the grid heading after scroll
          setTimeout(() => {
            const heading = vendorsSection.querySelector('h2, h3') as HTMLElement;
            if (heading) {
              heading.focus();
            }
          }, 500);
        }
      }, 1000); // Simulate loading time
    }
  }, [searchParams]);

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
          <SubcategoryFilter mainCategory={category === 'all' ? undefined : isMainCategory(category) ? category : undefined} />
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
                isLoading={isLoading}
              />
            </div>
          </section>
    </>
  );
}
