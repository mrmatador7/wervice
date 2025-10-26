'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';

interface CategoryBannerProps {
  categoryName: string;
  imageUrl?: string;
  category?: string;
}

export default function CategoryBanner({ categoryName, imageUrl, category }: CategoryBannerProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate with search params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCity !== 'all') params.set('city', selectedCity);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative w-full h-[34vh] md:h-[38vh] bg-gradient-to-br from-neutral-900 to-neutral-700 overflow-hidden">
      {/* Background Image with Overlay */}
      {imageUrl && (
        <>
          <img 
            src={imageUrl} 
            alt={categoryName}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center max-w-4xl mb-3 drop-shadow-lg">
          {categoryName}
        </h1>
        <p className="text-white/90 text-sm md:text-base text-center max-w-2xl mb-6 drop-shadow-md">
          Discover the best wedding vendors in Morocco
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-2xl shadow-2xl p-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${categoryName.toLowerCase()} name or city...`}
                className="w-full pl-12 pr-4 py-3 text-neutral-900 placeholder-neutral-500 focus:outline-none rounded-xl"
              />
            </div>

            {/* City Dropdown */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 text-neutral-900 bg-neutral-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9FF0A] cursor-pointer min-w-[150px]"
            >
              <option value="all">All Cities</option>
              {MOROCCAN_CITIES.filter(c => c.value !== 'all').map(city => (
                <option key={city.value} value={city.value}>{city.label}</option>
              ))}
            </select>

            {/* Search Button */}
            <button
              type="submit"
              className="px-8 py-3 bg-[#D9FF0A] text-[#11190C] font-semibold rounded-xl hover:bg-[#11190C] hover:text-[#D9FF0A] transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Find {categoryName}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

