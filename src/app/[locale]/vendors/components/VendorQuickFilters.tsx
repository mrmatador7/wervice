'use client';

import { VendorFilters } from '@/lib/types/vendor';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';

interface VendorQuickFiltersProps {
  onFilterChange: (filters: Partial<VendorFilters>) => void;
  activeFilters: VendorFilters;
}

function VendorQuickFilters({
  onFilterChange,
  activeFilters
}: VendorQuickFiltersProps) {
  const popularCities = ['marrakech', 'casablanca', 'rabat', 'tangier'];
  const priceRanges = [
    { label: 'Under MAD 5,000', min: 0, max: 5000 },
    { label: 'MAD 5K - 15K', min: 5000, max: 15000 },
    { label: 'MAD 15K - 50K', min: 15000, max: 50000 },
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
    const city = MOROCCAN_CITIES.find(c => c.value === cityValue);
    return city?.label || cityValue;
  };

  return (
    <section className="bg-white border-b border-wv-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Popular Cities */}
          <div>
            <h3 className="text-sm font-medium text-wv-text mb-3">Popular Cities</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {popularCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCityClick(city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilters.city === city
                      ? 'bg-wervice-lime text-wv-text'
                      : 'bg-wv-gray1 text-wv-sub hover:bg-gray-200'
                  }`}
                >
                  {getCityLabel(city)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Ranges */}
          <div>
            <h3 className="text-sm font-medium text-wv-text mb-3">Price Range</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {priceRanges.map((range, index) => {
                const isActive =
                  activeFilters.minPrice === range.min &&
                  activeFilters.maxPrice === range.max;

                return (
                  <button
                    key={index}
                    onClick={() => handlePriceClick(range.min, range.max)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-wervice-lime text-wv-text'
                        : 'bg-wv-gray1 text-wv-sub hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VendorQuickFilters;
