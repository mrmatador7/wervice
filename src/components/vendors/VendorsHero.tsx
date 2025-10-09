'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import CityDropdown from '@/components/ui/CityDropdown';
import CategoryDropdown from '@/components/ui/CategoryDropdown';
import { FiSearch, FiMapPin, FiTag } from 'react-icons/fi';

interface VendorsHeroProps {
  initialFilters?: {
    city?: string;
    category?: string;
    q?: string;
  };
}

const CITIES = [
  "All Cities", "Casablanca", "Marrakech", "Rabat", "Tangier", "Agadir", "Fès", "Meknes", "El Jadida", "Kenitra"
];

const CATEGORIES = [
  "All Categories", "Venues", "Dresses", "Catering", "Photo & Video", "Planning", "Beauty", "Decor", "Music"
];

export default function VendorsHero({ initialFilters }: VendorsHeroProps) {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [selectedCity, setSelectedCity] = useState<string>(initialFilters?.city || "All Cities");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilters?.category || "All Categories");
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters?.q || "");
  const [isLoading, setIsLoading] = useState(false);

  // Sync with URL params
  useEffect(() => {
    const cityParam = searchParams.get('city');
    const categoryParam = searchParams.get('category');
    const qParam = searchParams.get('q');

    setSelectedCity(cityParam || "All Cities");
    setSelectedCategory(categoryParam || "All Categories");
    setSearchQuery(qParam || "");
  }, [searchParams]);

  const handleSearch = () => {
    setIsLoading(true);

    const params = new URLSearchParams();

    if (selectedCity && selectedCity !== "All Cities") {
      params.set('city', selectedCity.toLowerCase());
    }

    if (selectedCategory && selectedCategory !== "All Categories") {
      // Convert display name to slug
      const categorySlugMap: Record<string, string> = {
        'Venues': 'venues',
        'Dresses': 'dresses',
        'Catering': 'catering',
        'Photo & Video': 'photo-video',
        'Planning': 'planning',
        'Beauty': 'beauty',
        'Decor': 'decor',
        'Music': 'music'
      };
      const categorySlug = categorySlugMap[selectedCategory];
      if (categorySlug) {
        params.set('category', categorySlug);
      }
    }

    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }

    const queryString = params.toString();
    const url = `/${locale}/vendors${queryString ? `?${queryString}` : ''}`;

    router.push(url);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#11190C]/95 via-[#1A2412]/90 to-[#2A3B1A]/95">
      {/* Background with subtle blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop)',
          filter: 'blur(2px)'
        }}
      />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/categories/venues.png"
          alt=""
          className="absolute top-20 left-8 w-12 h-12 sm:w-16 sm:h-16 opacity-15 rotate-12 animate-float"
        />
        <img
          src="/categories/dresses.png"
          alt=""
          className="absolute top-32 right-12 sm:right-20 w-10 h-10 sm:w-14 sm:h-14 opacity-12 -rotate-6 animate-float-delayed"
        />
        <img
          src="/categories/photo.png"
          alt=""
          className="absolute bottom-32 left-16 sm:left-24 w-11 h-11 sm:w-15 sm:h-15 opacity-10 rotate-45 animate-float"
        />
        <img
          src="/categories/catering.png"
          alt=""
          className="absolute bottom-20 right-8 sm:right-16 w-9 h-9 sm:w-13 sm:h-13 opacity-15 -rotate-12 animate-float-delayed"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[420px] sm:min-h-[460px] lg:min-h-[480px] items-center justify-center">
          <div className="text-center space-y-8 max-w-4xl">
            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find Wedding Vendors in{' '}
              <span className="text-[#D9FF0A]">Morocco</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#CAC4B7] max-w-2xl mx-auto leading-relaxed">
              Browse verified vendors by city, category, and budget. From venues to catering, find your perfect wedding professionals.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              {/* City Select */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMapPin className="h-5 w-5 text-[#787664]" />
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#CAC4B7] rounded-2xl text-[#11190C] placeholder-[#787664] focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A] transition-all duration-200 text-base appearance-none"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Select */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiTag className="h-5 w-5 text-[#787664]" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#CAC4B7] rounded-2xl text-[#11190C] placeholder-[#787664] focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A] transition-all duration-200 text-base appearance-none"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#D9FF0A] hover:bg-[#D9FF0A]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#11190C] font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 focus:ring-2 focus:ring-[#D9FF0A] focus:ring-offset-2 focus:ring-offset-[#11190C]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#11190C]/30 border-t-[#11190C] rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSearch className="w-5 h-5" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
