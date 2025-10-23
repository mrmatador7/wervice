'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { capitalizeCity } from '@/lib/utils';

interface CityCarouselProps {
  cities: string[];
  activeCity?: string;
  onSelect: (city: string) => void;
}

export default function CityCarousel({ cities, activeCity, onSelect }: CityCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const allCities = ['All Cities', ...cities];

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-1.5 shadow-md hover:bg-zinc-50 md:grid md:place-content-center"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:px-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allCities.map((city) => {
          const isActive = activeCity === city || (!activeCity && city === 'All Cities');
          return (
            <button
              key={city}
              onClick={() => onSelect(city === 'All Cities' ? '' : city)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
              aria-pressed={isActive}
            >
              {city === 'All Cities' ? city : capitalizeCity(city)}
            </button>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-1.5 shadow-md hover:bg-zinc-50 md:grid md:place-content-center"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

