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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate with search params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full px-4 md:px-6 pt-6 pb-2">
      <div className="relative w-full h-[300px] md:h-[350px] bg-gradient-to-br from-neutral-900 to-neutral-700 overflow-hidden rounded-3xl">
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
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center max-w-4xl mb-3 drop-shadow-lg">
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
                  placeholder={`Search ${categoryName.toLowerCase()} name...`}
                  className="w-full pl-12 pr-4 py-3 text-neutral-900 placeholder-neutral-500 focus:outline-none rounded-xl"
                />
              </div>

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
    </div>
  );
}

