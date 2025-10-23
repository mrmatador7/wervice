'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Minus, Plus } from 'lucide-react';
import { capitalizeCity } from '@/lib/utils';
import CustomSelect from './CustomSelect';

interface ModernFilterBarProps {
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
  hideCategoryFilter?: boolean;
}

const CATEGORIES = [
  { value: '', label: 'All Categories' },
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

const PRICE_RANGES_MIN = [
  { value: 0, label: 'Min Price' },
  { value: 5000, label: '5,000 MAD' },
  { value: 10000, label: '10,000 MAD' },
  { value: 20000, label: '20,000 MAD' },
  { value: 50000, label: '50,000 MAD' },
  { value: 100000, label: '100,000 MAD' },
  { value: 200000, label: '200,000 MAD' },
];

const PRICE_RANGES_MAX = [
  { value: 0, label: 'Max Price' },
  { value: 10000, label: '10,000 MAD' },
  { value: 20000, label: '20,000 MAD' },
  { value: 50000, label: '50,000 MAD' },
  { value: 100000, label: '100,000 MAD' },
  { value: 200000, label: '200,000 MAD' },
  { value: 500000, label: '500,000 MAD' },
];

const GUEST_COUNTS = [
  { value: 0, label: 'Any' },
  { value: 50, label: '50+' },
  { value: 100, label: '100+' },
  { value: 200, label: '200+' },
  { value: 300, label: '300+' },
  { value: 500, label: '500+' },
];

export default function ModernFilterBar({
  initialFilters,
  cities = [],
  onChange,
  hideCategoryFilter = false,
}: ModernFilterBarProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [searchValue, setSearchValue] = useState(initialFilters.q || '');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [guestCount, setGuestCount] = useState(0);

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
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onChange(newFilters);
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      handleChange('priceMin', value || undefined);
    } else {
      handleChange('priceMax', value || undefined);
    }
  };

  const incrementGuestCount = () => {
    setGuestCount((prev) => prev + 50);
  };

  const decrementGuestCount = () => {
    setGuestCount((prev) => Math.max(0, prev - 50));
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search vendors by name, service..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm font-medium placeholder:text-zinc-400 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-colors"
          />
        </div>

        {/* City Dropdown */}
        <CustomSelect
          value={filters.city || ''}
          onChange={(value) => handleChange('city', value as string)}
          options={[
            { value: '', label: 'All Cities' },
            ...cities.map((city) => ({
              value: city,
              label: capitalizeCity(city),
            })),
          ]}
          placeholder="All Cities"
        />

        {/* Category Dropdown - Hidden on category pages */}
        {!hideCategoryFilter && (
          <CustomSelect
            value={filters.category || ''}
            onChange={(value) => handleChange('category', value as string)}
            options={CATEGORIES.map((cat) => ({
              value: cat.value,
              label: cat.label,
            }))}
            placeholder="All Categories"
          />
        )}

        {/* Min Price */}
        <CustomSelect
          value={filters.priceMin || 0}
          onChange={(value) => handlePriceChange('min', value as number)}
          options={PRICE_RANGES_MIN}
          placeholder="Min Price"
        />

        {/* Max Price */}
        <CustomSelect
          value={filters.priceMax || 0}
          onChange={(value) => handlePriceChange('max', value as number)}
          options={PRICE_RANGES_MAX}
          placeholder="Max Price"
        />

        {/* Guests Counter (like Floor area in the image) */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm">
          <span className="text-sm font-semibold text-zinc-900">Guests:</span>
          <button
            onClick={decrementGuestCount}
            className="grid h-5 w-5 place-content-center rounded hover:bg-zinc-100 transition-colors"
            aria-label="Decrease guests"
          >
            <Minus className="h-3 w-3 text-zinc-600" />
          </button>
          <span className="min-w-[2.5rem] text-center text-sm font-semibold text-zinc-900">
            {guestCount === 0 ? 'Any' : guestCount}
          </span>
          <button
            onClick={incrementGuestCount}
            className="grid h-5 w-5 place-content-center rounded hover:bg-zinc-100 transition-colors"
            aria-label="Increase guests"
          >
            <Plus className="h-3 w-3 text-zinc-600" />
          </button>
        </div>

        {/* More Button */}
        <button
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold shadow-sm transition-colors ${
            showMoreFilters
              ? 'border-zinc-900 bg-zinc-900 text-white'
              : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          More
        </button>
      </div>

      {/* More Filters Panel */}
      {showMoreFilters && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((option) => {
                  const isActive = filters.sort === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleChange('sort', option.value)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-zinc-900 text-white shadow-sm'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Guest Capacity</h3>
              <div className="flex flex-wrap gap-2">
                {GUEST_COUNTS.map((count) => {
                  const isActive = guestCount === count.value;
                  return (
                    <button
                      key={count.value}
                      onClick={() => setGuestCount(count.value)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-zinc-900 text-white shadow-sm'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {count.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
              <button
                onClick={() => {
                  setFilters({ sort: 'newest' });
                  setSearchValue('');
                  setGuestCount(0);
                  onChange({ sort: 'newest' });
                }}
                className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Reset all filters
              </button>
              <button
                onClick={() => setShowMoreFilters(false)}
                className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 shadow-sm transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

