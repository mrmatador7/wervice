'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

const CITIES = [
  { value: 'marrakech', label: 'Marrakech' },
  { value: 'casablanca', label: 'Casablanca' },
  { value: 'rabat', label: 'Rabat' },
  { value: 'tangier', label: 'Tangier' },
  { value: 'agadir', label: 'Agadir' },
  { value: 'fes', label: 'Fes' },
];

const CATEGORIES = [
  { value: 'venues', label: 'Venues' },
  { value: 'catering', label: 'Catering' },
  { value: 'photo-video', label: 'Photo & Video' },
  { value: 'planning', label: 'Planning' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'decor', label: 'Decor' },
  { value: 'music', label: 'Music' },
];

export default function HeroNew() {
  const router = useRouter();
  const [city, setCity] = React.useState('marrakech');
  const [category, setCategory] = React.useState('venues');

  const handleExplore = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (category) params.set('category', category);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-h)+12px)] sm:pt-[calc(var(--header-h)+16px)] pb-8 sm:pb-10 min-h-[46vh] grid place-items-start">
        {/* Subtle gradient background blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[radial-gradient(60%_60%_at_50%_40%,#D9FF0A33,transparent_60%)] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(50%_50%_at_90%_80%,#F3F1EE,transparent_70%)] rounded-full blur-3xl"></div>
        </div>

        <div className="w-full text-center max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="mt-0 text-4xl sm:text-5xl lg:text-6xl font-bold text-wervice-ink mb-4 sm:mb-6 leading-tight">
            Plan your wedding,{' '}
            <span className="text-wervice-lime">your way.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-lg sm:text-xl text-wervice-taupe mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Compare trusted vendors, read reviews, and book fast — all in one place.
          </p>

          {/* Search Card */}
          <div className="max-w-2xl mx-auto mt-5 sm:mt-6 bg-white rounded-2xl shadow-lg ring-1 ring-wervice-sand/60 border-0 p-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* City Dropdown */}
              <div className="space-y-2">
                <label htmlFor="city-select" className="block text-sm font-medium text-wervice-ink">
                  City
                </label>
                <select
                  id="city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 bg-wervice-shell border border-wervice-sand/70 text-wervice-ink rounded-xl focus:ring-2 focus:ring-wervice-sand/40 focus:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/80"
                >
                  {CITIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <label htmlFor="category-select" className="block text-sm font-medium text-wervice-ink">
                  Category
                </label>
                <select
                  id="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-wervice-shell border border-wervice-sand/70 text-wervice-ink rounded-xl focus:ring-2 focus:ring-wervice-sand/40 focus:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/80"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* CTA Button */}
              <div className="flex items-end">
                <button
                  onClick={handleExplore}
                  aria-label="Explore vendors with selected city and category"
                  className="rounded-xl bg-wervice-lime text-wervice-ink font-semibold px-4 py-3 shadow-sm transition hover:brightness-[.96] active:scale-[.985] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-wervice-lime"
                >
                  Explore vendors
                </button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-wervice-shell px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-wervice-taupe">Verified vendors</span>
              </div>
              <div className="flex items-center gap-2 bg-wervice-shell px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-wervice-taupe">Real reviews</span>
              </div>
              <div className="flex items-center gap-2 bg-wervice-shell px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span className="text-wervice-taupe">Instant booking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
