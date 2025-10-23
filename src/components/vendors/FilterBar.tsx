'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { VALID_CATEGORY_SLUGS } from '@/lib/categories';
import { capitalizeCity } from '@/lib/utils';

interface FilterBarProps {
  initialFilters: {
    q?: string;
    category?: string;
    city?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
  };
  cities?: string[];
  onChange: (filters: any) => void;
  hideCategoryFilter?: boolean; // Hide category pills (e.g., when on a category page)
}

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'venues', label: 'Venues' },
  { value: 'catering', label: 'Catering' },
  { value: 'photo_video', label: 'Photo & Video' },
  { value: 'event_planner', label: 'Planning' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'decor', label: 'Decor' },
  { value: 'music', label: 'Music' },
  { value: 'dresses', label: 'Dresses' },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function FilterBar({ initialFilters, cities = [], onChange, hideCategoryFilter = false }: FilterBarProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [searchValue, setSearchValue] = useState(initialFilters.q || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.q) {
        handleChange('q', searchValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { sort: 'newest', city: undefined, category: '', priceMin: undefined, priceMax: undefined, q: undefined };
    setFilters(resetFilters);
    setSearchValue('');
    onChange(resetFilters);
  };

  return (
    <div className="space-y-4">
      {/* Top Row: Search + Sort + Mobile Toggle */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        {/* Sort Dropdown */}
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="hidden rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 md:block"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="rounded-xl border border-zinc-200 bg-white p-2 md:hidden"
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Filters Section (collapsible on mobile) */}
      <div className={`space-y-3 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
        {/* Category Pills - Hide if on a category page */}
        {!hideCategoryFilter && (
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = filters.category === cat.value || (!filters.category && cat.value === '');
              return (
                <button
                  key={cat.value}
                  onClick={() => handleChange('category', cat.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                  aria-pressed={isActive}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* City Pills */}
        {cities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-zinc-600 py-1.5">City:</span>
            <button
              onClick={() => handleChange('city', undefined)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                !filters.city
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
              aria-pressed={!filters.city}
            >
              All Cities
            </button>
            {cities.map((city) => {
              const isActive = filters.city === city;
              return (
                <button
                  key={city}
                  onClick={() => handleChange('city', city)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                  aria-pressed={isActive}
                >
                  {capitalizeCity(city)}
                </button>
              );
            })}
          </div>
        )}

        {/* Price Range */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="priceMin" className="text-xs font-medium text-zinc-600">
              Price (MAD):
            </label>
            <input
              id="priceMin"
              type="number"
              placeholder="Min"
              value={filters.priceMin || ''}
              onChange={(e) => handleChange('priceMin', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-24 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
            <span className="text-zinc-400">–</span>
            <input
              id="priceMax"
              type="number"
              placeholder="Max"
              value={filters.priceMax || ''}
              onChange={(e) => handleChange('priceMax', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-24 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <button
            onClick={handleReset}
            className="ml-auto rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Reset
          </button>
        </div>

        {/* Mobile Sort */}
        <div className="md:hidden">
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

