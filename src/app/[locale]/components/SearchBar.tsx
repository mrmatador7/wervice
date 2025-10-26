'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { SimpleItem } from '@/data/wervice-data';

function CustomDropdown({
  label,
  selected,
  items,
  onSelect,
}: {
  label: string;
  selected: SimpleItem | null;
  items: SimpleItem[];
  onSelect: (item: SimpleItem | null) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex-1 overflow-visible">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 sm:py-3 text-left"
      >
              <span className="text-sm font-medium text-gray-700">
                {selected ? selected.name : label}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3">
                  <h3 className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                    {label === 'Categories' ? 'CATEGORIES' : 'LOCATION'}
                  </h3>
            <div className="mt-2 space-y-1 max-h-[300px] overflow-y-auto">
              {items.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors rounded-lg ${
                    selected?.slug === item.slug ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm text-gray-700">{item.name}</span>
                  {selected?.slug === item.slug && (
                    <span className="text-xs text-gray-500">Selected</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchBar({
  cities,
  categories,
  locale = 'en',
}: {
  cities: SimpleItem[];
  categories: SimpleItem[];
  locale?: string;
}) {
  const router = useRouter();
  const [city, setCity] = React.useState<SimpleItem | null>(null);
  const [category, setCategory] = React.useState<SimpleItem | null>(null);

  const onSearch = () => {
    // Routing logic: prefer both; fallback to category or city
    if (city && category) router.push(`/${locale}/categories/${category.slug}?city=${city.slug}`);
    else if (category) router.push(`/${locale}/categories/${category.slug}`);
    else if (city) router.push(`/${locale}/cities/${city.slug}`);
    else router.push(`/${locale}/categories/venues`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-2 sm:px-4 relative z-30">
      <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 bg-white/95 backdrop-blur-sm rounded-full shadow-xl p-2">
          {/* Category Dropdown */}
          <CustomDropdown
            label="Categories"
            selected={category}
            items={categories}
            onSelect={setCategory}
          />

        {/* Divider - hidden on mobile */}
        <div className="hidden sm:block w-px bg-gray-200 my-2"></div>

        {/* City Dropdown */}
        <CustomDropdown
          label="All Cities"
          selected={city}
          items={cities}
          onSelect={setCity}
        />

        {/* Search Button */}
        <button
          onClick={onSearch}
          className="px-6 sm:px-8 py-3 bg-[#d9ff0a] hover:bg-[#d9ff0a] text-black font-semibold text-sm rounded-full transition-colors flex items-center justify-center gap-2 shadow-md flex-shrink-0"
        >
          Search
        </button>
      </div>
    </div>
  );
}
