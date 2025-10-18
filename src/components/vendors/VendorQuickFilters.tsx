'use client';

import { VendorFilters } from '@/lib/types/vendor';

interface VendorQuickFiltersProps {
  onFilterChange: (filters: Partial<VendorFilters>) => void;
  activeFilters: VendorFilters;
}

export default function VendorQuickFilters({
  onFilterChange,
  activeFilters
}: VendorQuickFiltersProps) {
  const popularCities = ['marrakech', 'casablanca', 'rabat', 'tangier'];
  const priceRanges = [
    { label: 'Under MAD 5K', min: 0, max: 5000 },
    { label: 'MAD 5K–15K', min: 5000, max: 15000 },
    { label: 'MAD 15K–50K', min: 15000, max: 50000 },
    { label: 'Over MAD 50K', min: 50000, max: undefined },
  ];

  const handleCityClick = (city: string) => {
    if (activeFilters.city === city) {
      // Remove filter if already active
      onFilterChange({ city: undefined });
    } else {
      onFilterChange({ city });
    }
  };

  const handlePriceClick = (min: number, max?: number) => {
    if (activeFilters.minPrice === min && activeFilters.maxPrice === max) {
      // Remove filter if already active
      onFilterChange({ minPrice: undefined, maxPrice: undefined });
    } else {
      onFilterChange({ minPrice: min, maxPrice: max });
    }
  };

  const getCityLabel = (cityValue: string) => {
    const cityLabels: Record<string, string> = {
      marrakech: 'Marrakech',
      casablanca: 'Casablanca',
      rabat: 'Rabat',
      tangier: 'Tangier',
    };
    return cityLabels[cityValue] || cityValue;
  };

  return (
    <div className="relative">
      {/* Scroll fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide px-6 -mx-6">
        {/* Cities */}
        {popularCities.map((city) => (
          <button
            key={city}
            onClick={() => handleCityClick(city)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilters.city === city
                ? 'bg-black text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getCityLabel(city)}
          </button>
        ))}

        {/* Price Ranges */}
        {priceRanges.map((range, index) => {
          const isActive =
            activeFilters.minPrice === range.min &&
            activeFilters.maxPrice === range.max;

          return (
            <button
              key={index}
              onClick={() => handlePriceClick(range.min, range.max)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
