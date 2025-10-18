'use client';

import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { VendorFilters as VendorFiltersType } from '@/lib/types/vendor';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';
import { CATEGORY_MAP, VALID_CATEGORY_SLUGS } from '@/lib/categories';

interface VendorFiltersProps {
  filters: VendorFiltersType;
  onFilterChange: (filters: Partial<VendorFiltersType>) => void;
  onClearFilters: () => void;
  totalResults: number;
  isMobile?: boolean;
  isCategoryPage?: boolean;
  onClose?: () => void;
}

export default function VendorFilters({
  filters,
  onFilterChange,
  onClearFilters,
  totalResults,
  isMobile = false,
  isCategoryPage = false,
  onClose,
}: VendorFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.q || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.q) {
        onFilterChange({ q: localSearch || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, filters.q, onFilterChange]);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
  };

  const handleCityChange = (city: string) => {
    onFilterChange({ city: city === 'all' ? undefined : city });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    onFilterChange({ [field]: numValue });
  };

  const handleRatingChange = (rating: string) => {
    const numRating = rating ? parseFloat(rating) : undefined;
    onFilterChange({ rating: numRating });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ category: category === 'all' ? undefined : category });
  };

  const activeFilterCount = [
    filters.q,
    filters.city,
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
    filters.category,
  ].filter(Boolean).length;

  const FilterContent = () => (
    <>
      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
          Search Vendors
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Business name or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
          City
        </label>
        <select
          value={filters.city || 'all'}
          onChange={(e) => handleCityChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
        >
          <option value="all">All Cities</option>
          {MOROCCAN_CITIES.map((city) => (
            <option key={city.value} value={city.value}>
              {city.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
          Price Range (MAD)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
          Minimum Rating
        </label>
        <select
          value={filters.rating || ''}
          onChange={(e) => handleRatingChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
        >
          <option value="">Any rating</option>
          <option value="4.5">4.5+ stars</option>
          <option value="4.0">4.0+ stars</option>
          <option value="3.5">3.5+ stars</option>
          <option value="3.0">3.0+ stars</option>
        </select>
      </div>

      {/* Category (only show on main /vendors page, not category pages) */}
      {!isCategoryPage && (
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
            Category
          </label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
          >
            <option value="all">All categories</option>
            {VALID_CATEGORY_SLUGS.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_MAP[category as keyof typeof CATEGORY_MAP]?.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected Filters */}
      {activeFilterCount > 0 && (
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
            Active Filters
          </label>
          <div className="flex flex-wrap gap-2">
            {filters.q && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                Search: {filters.q}
                <button
                  onClick={() => onFilterChange({ q: undefined })}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                {MOROCCAN_CITIES.find(c => c.value === filters.city)?.label}
                <button
                  onClick={() => onFilterChange({ city: undefined })}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                {filters.minPrice ? `MAD ${filters.minPrice}` : 'Any'} - {filters.maxPrice ? `MAD ${filters.maxPrice}` : 'Any'}
                <button
                  onClick={() => onFilterChange({ minPrice: undefined, maxPrice: undefined })}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.rating && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                {filters.rating}+ stars
                <button
                  onClick={() => onFilterChange({ rating: undefined })}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                {CATEGORY_MAP[filters.category as keyof typeof CATEGORY_MAP]?.label}
                <button
                  onClick={() => onFilterChange({ category: undefined })}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
        {totalResults.toLocaleString()} vendors found
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-wv-text">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          <FilterContent />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-wervice-lime text-wv-text font-medium rounded-lg hover:bg-wervice-limeDark transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className="lg:col-span-3 bg-gray-50 p-5 rounded-2xl h-fit sticky top-24 shadow-inner">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-800">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="space-y-4">
        <FilterContent />
      </div>
    </aside>
  );
}
