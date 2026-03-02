'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FiMapPin } from 'react-icons/fi';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';

const CITY_OPTIONS = ['All Cities', ...MOROCCAN_CITIES.filter((c) => c.value !== 'all').map((c) => c.label)];

interface CitySelectProps {
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

export default function CitySelect({ selectedCity, onCityChange }: CitySelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleCityChange = (city: string) => {
    if (onCityChange) {
      onCityChange(city);
      return;
    }

    // Update URL
    const params = new URLSearchParams(searchParams);
    if (city === 'All Cities') {
      params.delete('city');
    } else {
      params.set('city', city);
    }
    params.delete('page'); // Reset page when changing city

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl, { scroll: false });
    setIsOpen(false);
  };

  const displayCity = selectedCity || 'All Cities';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E9E6E2] rounded-xl hover:border-[#D9FF0A] transition-colors"
      >
        <FiMapPin className="w-4 h-4 text-neutral-600" />
        <span className="text-sm font-medium text-[#11190C]">{displayCity}</span>
        <svg
          className={`w-4 h-4 text-neutral-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full mt-2 w-48 bg-white border border-[#E9E6E2] rounded-xl shadow-lg z-20 py-2">
            {CITY_OPTIONS.map((city) => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F3F1EE] transition-colors ${
                  displayCity === city ? 'bg-[#D9FF0A]/10 text-[#11190C] font-medium' : 'text-neutral-700'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
