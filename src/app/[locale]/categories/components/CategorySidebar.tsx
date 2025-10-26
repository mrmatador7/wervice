'use client';

import { useState } from 'react';

interface FilterSection {
  title: string;
  items: { label: string; count: number; value: string }[];
}

interface CategorySidebarProps {
  cities: FilterSection;
  categories: FilterSection;
  priceRange: { min: number; max: number; currency: string };
  onFilterChange: (filters: any) => void;
  initialCategory?: string; // Add initial category prop
}

export default function CategorySidebar({ 
  cities, 
  categories, 
  priceRange,
  onFilterChange,
  initialCategory 
}: CategorySidebarProps) {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [] // Initialize with current category
  );
  const [minPrice, setMinPrice] = useState(priceRange.min);
  const [maxPrice, setMaxPrice] = useState(priceRange.max);
  const [showMoreCities, setShowMoreCities] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [priceChanged, setPriceChanged] = useState(false); // Track if user changed price

  const toggleCity = (city: string) => {
    const updated = selectedCities.includes(city)
      ? selectedCities.filter(c => c !== city)
      : [...selectedCities, city];
    setSelectedCities(updated);
    // Only send price filter if user actually changed it
    const filters: any = { cities: updated, categories: selectedCategories };
    if (priceChanged) {
      filters.minPrice = minPrice;
      filters.maxPrice = maxPrice;
    }
    onFilterChange(filters);
  };

  const toggleCategory = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    // Only send price filter if user actually changed it
    const filters: any = { cities: selectedCities, categories: updated };
    if (priceChanged) {
      filters.minPrice = minPrice;
      filters.maxPrice = maxPrice;
    }
    onFilterChange(filters);
  };

  const handlePriceChange = () => {
    setPriceChanged(true);
    onFilterChange({ cities: selectedCities, categories: selectedCategories, minPrice, maxPrice });
  };

  const resetFilters = () => {
    setSelectedCities([]);
    setSelectedCategories(initialCategory ? [initialCategory] : []); // Keep initial category selected
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setPriceChanged(false); // Reset price changed flag
    onFilterChange({ cities: [], categories: initialCategory ? [initialCategory] : [] }); // Don't send price on reset
  };

  const visibleCities = showMoreCities ? cities.items : cities.items.slice(0, 6);
  const visibleCategories = showMoreCategories ? categories.items : categories.items.slice(0, 6);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-4 space-y-6">
        {/* City Filter */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#11190C]">City</h3>
            <button 
              onClick={resetFilters}
              className="text-xs text-neutral-500 hover:text-[#11190C] transition-colors"
            >
              Reset
            </button>
          </div>
          
          <div className="space-y-3">
            {visibleCities.map((city) => (
              <label key={city.value} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2.5 flex-1">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedCities.includes(city.value)}
                      onChange={() => toggleCity(city.value)}
                      className="w-5 h-5 rounded border-2 border-neutral-300 text-[#11190C] focus:ring-2 focus:ring-[#D9FF0A] checked:bg-[#11190C] checked:border-[#11190C] cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-neutral-700 group-hover:text-[#11190C] transition-colors">
                    {city.label}
                  </span>
                </div>
                <span className="text-xs text-neutral-400 ml-2">{city.count}</span>
              </label>
            ))}
          </div>
          
          {cities.items.length > 6 && (
            <button 
              onClick={() => setShowMoreCities(!showMoreCities)}
              className="mt-4 w-full py-2 text-sm text-center text-[#11190C] hover:bg-neutral-50 rounded-lg transition-colors font-medium"
            >
              {showMoreCities ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#11190C]">Category</h3>
            <button 
              onClick={resetFilters}
              className="text-xs text-neutral-500 hover:text-[#11190C] transition-colors"
            >
              Reset
            </button>
          </div>
          
          <div className="space-y-3">
            {visibleCategories.map((category) => (
              <label key={category.value} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2.5 flex-1">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.value)}
                      onChange={() => toggleCategory(category.value)}
                      className="w-5 h-5 rounded border-2 border-neutral-300 text-[#11190C] focus:ring-2 focus:ring-[#D9FF0A] checked:bg-[#11190C] checked:border-[#11190C] cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-neutral-700 group-hover:text-[#11190C] transition-colors">
                    {category.label}
                  </span>
                </div>
                <span className="text-xs text-neutral-400 ml-2">{category.count}</span>
              </label>
            ))}
          </div>
          
          {categories.items.length > 6 && (
            <button 
              onClick={() => setShowMoreCategories(!showMoreCategories)}
              className="mt-4 w-full py-2 text-sm text-center text-[#11190C] hover:bg-neutral-50 rounded-lg transition-colors font-medium"
            >
              {showMoreCategories ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Price Range */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#11190C]">Price</h3>
            <button 
              onClick={() => {
                setMinPrice(priceRange.min);
                setMaxPrice(priceRange.max);
                handlePriceChange();
              }}
              className="text-xs text-neutral-500 hover:text-[#11190C] transition-colors"
            >
              Reset
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Price Range Slider */}
            <div className="relative pt-1">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                onMouseUp={handlePriceChange}
                onTouchEnd={handlePriceChange}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #11190C 0%, #11190C ${((maxPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, #e5e5e5 ${((maxPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, #e5e5e5 100%)`
                }}
              />
            </div>
            
            {/* Price Labels */}
            <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
              <span>{priceRange.currency} {priceRange.min.toLocaleString()}</span>
              <span>{priceRange.currency} {priceRange.max.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom slider thumb styles */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #11190C;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #11190C;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </aside>
  );
}

