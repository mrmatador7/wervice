'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FiSearch, FiSliders } from 'react-icons/fi';

interface CategoryFiltersProps {
  initialFilters: {
    categorySlug: string;
    q?: string;
    city?: string;
    budgetMin?: number;
    budgetMax?: number;
    sort?: string;
    page?: number;
  };
  totalVendors: number;
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Best Match' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function CategoryFilters({ initialFilters, totalVendors }: CategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(initialFilters.q || '');
  const [minPrice, setMinPrice] = useState(initialFilters.budgetMin?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.budgetMax?.toString() || '');
  const [sortBy, setSortBy] = useState(initialFilters.sort || 'relevance');

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when filters change
  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    // Update search
    if (debouncedSearch.trim()) {
      params.set('q', debouncedSearch.trim());
    } else {
      params.delete('q');
    }

    // Update price range
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
    if (sortBy && sortBy !== 'relevance') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }

    // Reset page when filters change
    params.delete('page');

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl, { scroll: false });
  }, [debouncedSearch, minPrice, maxPrice, sortBy, searchParams, pathname, router]);

  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Left side - Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 border border-[#E9E6E2] rounded-xl focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A] transition-colors"
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
              className="w-20 px-2 py-2 border border-[#E9E6E2] rounded-lg focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A] text-sm"
            />
          </div>
          <span className="text-neutral-400">-</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-20 px-2 py-2 border border-[#E9E6E2] rounded-lg focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A] text-sm"
            />
            <span className="text-sm text-neutral-600">MAD</span>
          </div>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-[#E9E6E2] rounded-lg focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A] text-sm bg-white"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right side - Results count and filters toggle */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-neutral-600">
          <span className="font-medium text-[#11190C]">{totalVendors.toLocaleString()}</span> vendors found
        </div>

        {/* Future: Advanced filters toggle */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-[#11190C] transition-colors">
          <FiSliders className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>
    </div>
  );
}
