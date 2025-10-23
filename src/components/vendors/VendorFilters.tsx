'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { VendorFilters as VendorFiltersType } from '@/lib/types/vendor';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';
import { VALID_CATEGORY_SLUGS } from '@/lib/categories';

interface VendorFiltersProps {
  initialFilters: VendorFiltersType;
}

export default function VendorFilters({ initialFilters }: VendorFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<VendorFiltersType>(initialFilters);

  const updateURL = (newFilters: VendorFiltersType) => {
    const params = new URLSearchParams();
    
    if (newFilters.q) params.set('q', newFilters.q);
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.minPrice) params.set('minPrice', String(newFilters.minPrice));
    if (newFilters.maxPrice) params.set('maxPrice', String(newFilters.maxPrice));
    if (newFilters.sort) params.set('sort', newFilters.sort);
    if (newFilters.page && newFilters.page > 1) params.set('page', String(newFilters.page));
    
    const queryString = params.toString();
    router.push(`/en/vendors${queryString ? `?${queryString}` : ''}`);
  };

  const handleFilterChange = (key: keyof VendorFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 }; // Reset to page 1 on filter change
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: VendorFiltersType = {
      sort: 'newest',
      page: 1,
    };
    setFilters(clearedFilters);
    router.push('/en/vendors');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-xs text-gray-500 hover:text-gray-900 transition"
        >
          Clear all
        </button>
      </div>

      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-xs font-medium text-gray-500 mb-2">
          Search
        </label>
        <input
          id="search"
          type="text"
          placeholder="Business name or keyword"
          value={filters.q || ''}
          onChange={(e) => handleFilterChange('q', e.target.value || undefined)}
          className="w-full rounded-xl border-gray-200 text-sm px-3 py-2 focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-xs font-medium text-gray-500 mb-2">
          City
        </label>
        <select
          id="city"
          value={filters.city || ''}
          onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
          className="w-full rounded-xl border-gray-200 text-sm px-3 py-2 focus:ring-2 focus:ring-black/10"
        >
          <option value="">All Cities</option>
          {MOROCCAN_CITIES.map((city) => (
            <option key={city.value} value={city.value}>
              {city.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-xs font-medium text-gray-500 mb-2">
          Category
        </label>
        <select
          id="category"
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
          className="w-full rounded-xl border-gray-200 text-sm px-3 py-2 focus:ring-2 focus:ring-black/10"
        >
          <option value="">All Categories</option>
          {VALID_CATEGORY_SLUGS.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">
          Price Range (MAD)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
            className="rounded-xl border-gray-200 text-sm px-3 py-2 focus:ring-2 focus:ring-black/10"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
            className="rounded-xl border-gray-200 text-sm px-3 py-2 focus:ring-2 focus:ring-black/10"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label htmlFor="sort" className="block text-xs font-medium text-gray-500 mb-2">
          Sort By
        </label>
        <select
          id="sort"
          value={filters.sort || 'newest'}
          onChange={(e) => handleFilterChange('sort', e.target.value as VendorFiltersType['sort'])}
          className="w-full rounded-xl border-gray-200 text-sm px-3 py-2 focus:ring-2 focus:ring-black/10"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
