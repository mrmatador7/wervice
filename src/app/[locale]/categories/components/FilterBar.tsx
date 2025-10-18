'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import { CurrencyCode, MOROCCAN_CITIES } from '@/lib/types/vendor';

const CITIES_ARRAY = MOROCCAN_CITIES.map(city => city.label);

interface FilterBarProps {
  cities: string[];
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  onFilterChange: (payload: any) => void;
  vendorCount: number;
  defaultCity?: string;
  defaultSort?: string;
}

export default function FilterBar({
  cities,
  currency,
  setCurrency,
  onFilterChange,
  vendorCount,
  defaultCity = 'All Cities',
  defaultSort = 'Best match'
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ref = useRef<HTMLDivElement | null>(null);

  const [isSticky, setSticky] = useState(false);
  const [city, setCity] = useState(defaultCity);
  const [q, setQ] = useState('');
  const [min, setMin] = useState<string>('');
  const [max, setMax] = useState<string>('');
  const [sort, setSort] = useState(defaultSort);

  // Monitor scroll for sticky behavior
  useEffect(() => {
    const onScroll = () => {
      const y = (ref.current?.getBoundingClientRect().top ?? 0);
      setSticky(y <= 8);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Debounced filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const filters = { q, city, min, max, sort, currency };
      onFilterChange(filters);

      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'All Cities' && value !== 'Best match' && value !== 'MAD') {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.delete('page'); // Reset pagination

      const queryString = params.toString();
      router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  }, [q, city, min, max, sort, currency]);

  const clearAllFilters = () => {
    setQ('');
    setMin('');
    setMax('');
    setSort('Best match');
    setCity('All Cities');
    setCurrency('MAD');
  };

  const hasActiveFilters = q || min || max || sort !== 'Best match' || city !== 'All Cities' || currency !== 'MAD';

  return (
    <div
      ref={ref}
      className={`w-full transition-all duration-200 ${
        isSticky
          ? 'sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-neutral-200'
          : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          {/* Left side - Filters */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Search */}
            <div className="col-span-2 md:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search this category..."
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-white pl-10 pr-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-wv-lime transition-colors"
                  aria-label="Search vendors"
                />
              </div>
            </div>

            {/* City Select */}
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-wv-lime transition-colors"
              aria-label="Select city"
            >
              {CITIES_ARRAY.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={min}
                onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))}
                placeholder="Min"
                className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-wv-lime transition-colors"
                aria-label="Minimum price"
              />
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={max}
                onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))}
                placeholder="Max"
                className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-wv-lime transition-colors"
                aria-label="Maximum price"
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-wv-lime transition-colors"
              aria-label="Sort options"
            >
              <option>Best match</option>
              <option>Rating (high to low)</option>
              <option>Price (low to high)</option>
              <option>Price (high to low)</option>
              <option>Newest</option>
            </select>
          </div>

          {/* Right side - Currency + Count */}
          <div className="flex items-center gap-3 justify-end">
            {/* Currency Toggle */}
            <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1">
              {(['MAD', 'EUR', 'USD'] as const).map(code => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`h-8 px-3 text-xs rounded-full transition-colors ${
                    currency === code ? 'bg-wv-lime text-wv-black font-medium' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                  aria-label={`Switch to ${code} currency`}
                  aria-pressed={currency === code}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Vendor Count Badge */}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <div className="w-2 h-2 rounded-full bg-wv-lime" />
              <span className="font-medium">
                {vendorCount.toLocaleString()} vendor{vendorCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-sm text-neutral-700 transition-colors"
                aria-label="Clear all filters"
              >
                <FiX className="h-4 w-4" />
                <span className="hidden sm:inline">Clear all</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
