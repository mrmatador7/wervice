'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';

interface CategoryFiltersProps {
  initialFilters?: {
    q?: string;
    min?: string;
    max?: string;
    sort?: string;
  };
}

const SORT_OPTIONS = [
  { value: 'best', label: 'Best match' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export function CategoryFilters({ initialFilters }: CategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(initialFilters?.q || '');
  const [minPrice, setMinPrice] = useState(initialFilters?.min || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters?.max || '');
  const [sortBy, setSortBy] = useState(initialFilters?.sort || 'best');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Update search
    if (debouncedSearch.trim()) {
      params.set('q', debouncedSearch.trim());
    } else {
      params.delete('q');
    }

    // Update price filters
    if (minPrice) {
      params.set('min', minPrice);
    } else {
      params.delete('min');
    }

    if (maxPrice) {
      params.set('max', maxPrice);
    } else {
      params.delete('max');
    }

    // Update sort
    if (sortBy && sortBy !== 'best') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }

    // Reset page when filters change
    params.delete('page');

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newUrl, { scroll: false });
  }, [debouncedSearch, minPrice, maxPrice, sortBy, searchParams, pathname, router]);

  // Check if any filters are active
  const hasActiveFilters = searchQuery || minPrice || maxPrice || sortBy !== 'best';

  const clearAllFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('best');
  };

  return (
    <div className="sticky top-14 z-30 border-b border-[#E9E6E2] bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-none sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full border border-[#E9E6E2] bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A] transition-colors"
            />
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-sm text-neutral-600">MAD</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-20 h-10 px-3 rounded-full border border-[#E9E6E2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A] transition-colors"
              />
            </div>
            <span className="text-neutral-400">-</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-20 h-10 px-3 rounded-full border border-[#E9E6E2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A] transition-colors"
              />
              <span className="text-sm text-neutral-600">MAD</span>
            </div>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-4 rounded-full border border-[#E9E6E2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A] transition-colors"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white hover:bg-[#F3F1EE] border border-[#E9E6E2] text-sm text-neutral-600 hover:text-[#11190C] transition-colors"
            >
              <FiX className="h-4 w-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
