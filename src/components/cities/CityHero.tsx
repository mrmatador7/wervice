'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface CityHeroProps {
  city: {
    name: string;
    description: string;
    image: string;
  };
}

const CITIES = [
  "Casablanca", "Marrakech", "Rabat", "Tangier", "Agadir", "Fès", "Meknes", "El Jadida", "Kenitra"
];

const CATEGORIES = [
  "Venues", "Dresses", "Catering", "Photo & Video", "Planning", "Beauty", "Decor", "Music"
];

// City icon (pin)
const CityIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" className="shrink-0 opacity-80">
    <path d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12z" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="10" r="2" fill="currentColor" />
  </svg>
);

// Category icon (grid)
const CategoryIcon = () => (
  <img
    src="/categories/event planner.png"
    alt=""
    width="18"
    height="18"
    className="shrink-0 opacity-80"
    aria-hidden="true"
  />
);

export default function CityHero({ city }: CityHeroProps) {
  const router = useRouter();
  const p = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<string>(city.name);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const isDisabled = !selectedCity;

  const onSearch = () => {
    if (isDisabled) return;

    const q = new URLSearchParams();
    if (selectedCity) q.set("city", selectedCity.toLowerCase());
    if (selectedCategory) q.set("category", selectedCategory.toLowerCase().replace(/ & /g, "-and-").replace(/ /g, "-"));
    router.push(`/search?${q.toString()}`);
  };

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-wervice-shell via-wervice-shell/90 to-wervice-lime/20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={city.image}
          alt={city.name}
          fill
          className="object-cover opacity-20 blur-sm scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            Plan your wedding in{' '}
            <span className="text-wervice-lime">{city.name}</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Discover trusted vendors, venues, and planners in {city.description}
          </p>

          {/* Search Bar */}
          <div className="mx-auto w-full max-w-2xl">
            <div className="rounded-2xl bg-white/95 backdrop-blur-sm ring-1 ring-black/10 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] items-stretch gap-2 p-2">
                {/* CITY */}
                <div className="relative flex h-12 items-center gap-2 px-4 bg-white rounded-xl">
                  <CityIcon />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Choose city"
                    className="w-full bg-transparent text-[15px] font-semibold text-[#11190C] outline-none appearance-none">
                    <option value="">Choose city</option>
                    {CITIES.map(c => (<option key={c} value={c}>{c}</option>))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </div>

                {/* CATEGORY */}
                <div className="relative flex h-12 items-center gap-2 px-4 bg-white rounded-xl">
                  <CategoryIcon />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    aria-label="Choose category"
                    className="w-full bg-transparent text-[15px] font-semibold text-[#11190C] outline-none appearance-none">
                    <option value="">All categories</option>
                    {CATEGORIES.map(c => (<option key={c} value={c}>{c}</option>))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </div>

                {/* BUTTON */}
                <div className="flex h-12 items-center justify-center">
                  <button
                    aria-label="Search vendors"
                    className="h-full w-full rounded-xl bg-[#D9FF0A] text-[#11190C] font-semibold px-6 hover:brightness-95 active:scale-[.985] transition-all"
                    disabled={isDisabled}
                    onClick={onSearch}>
                    <svg width="18" height="18" viewBox="0 0 24 24" className="inline mr-2">
                      <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
