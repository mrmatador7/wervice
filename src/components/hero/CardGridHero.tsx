'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch, FiMapPin, FiStar, FiArrowRight } from 'react-icons/fi';

const categories = [
  { id: 'venues', name: 'Venues', icon: '/categories/venues.png' },
  { id: 'dresses', name: 'Dresses', icon: '/categories/dresses.png' },
  { id: 'catering', name: 'Catering', icon: '/categories/catering.png' },
  { id: 'photo-video', name: 'Photo & Video', icon: '/categories/photo.png' },
  { id: 'planning', name: 'Planning', icon: '/categories/event planner.png' },
  { id: 'beauty', name: 'Beauty', icon: '/categories/beauty.png' },
  { id: 'decor', name: 'Decor', icon: '/categories/decor.png' },
  { id: 'music', name: 'Music', icon: '/categories/music.png' },
];

const cities = [
  'Casablanca', 'Marrakech', 'Rabat', 'Tangier', 'Agadir', 'Fes', 'Meknes', 'El Jadida', 'Kenitra'
];

// Featured vendor for the first card
const featuredVendor = {
  id: '1',
  name: 'Sahara Palace',
  category: 'Venues',
  city: 'Marrakech',
  image: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  rating: 4.8,
  price: '15,000 MAD',
};

// Cities data for carousel
const citiesData = [
  {
    name: 'Casablanca',
    image: '/cities/Casablanca.jpg',
    vendors: 245,
  },
  {
    name: 'Marrakech',
    image: '/cities/Marrakech.jpg',
    vendors: 312,
  },
  {
    name: 'Rabat',
    image: '/cities/Rabat.jpg',
    vendors: 189,
  },
  {
    name: 'Tangier',
    image: '/cities/tanger.jpg',
    vendors: 156,
  },
  {
    name: 'Agadir',
    image: '/cities/Agadir.jpg',
    vendors: 134,
  },
  {
    name: 'Fes',
    image: '/cities/Fes.jpg',
    vendors: 121,
  },
  {
    name: 'Meknes',
    image: '/cities/meknes.jpg',
    vendors: 77,
  },
  {
    name: 'El Jadida',
    image: '/cities/El Jadida.jpg',
    vendors: 55,
  },
];

export default function CardGridHero() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('venues');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    router.push(`/categories/${categoryId}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (selectedCategory) params.set('category', selectedCategory);

    router.push(`/vendors?${params.toString()}`);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Background with blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Moroccan wedding background"
          className="w-full h-full object-cover opacity-5"
        />
      </div>

      {/* Category Pills */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-3 pb-2 justify-center snap-x snap-mandatory">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap snap-center ${
                activeCategory === category.id
                  ? 'bg-[#D7FF1F] border-[#D7FF1F] text-black font-medium shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {category.icon && (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-4 h-4 rounded"
                />
              )}
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Compact Search Bar */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-3 bg-white rounded-full border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,.07)] px-3 md:px-4 h-12 md:h-14">
          {/* City Select */}
          <div className="flex items-center gap-3">
            <FiMapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 leading-tight">City</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-sm font-medium bg-transparent border-0 p-0 focus:outline-none cursor-pointer"
              >
                <option value="">All cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200"></div>

          {/* Category Select */}
          <div className="flex items-center gap-3">
            {selectedCategory && categories.find(c => c.id === selectedCategory)?.icon && (
              <img
                src={categories.find(c => c.id === selectedCategory)?.icon}
                alt=""
                className="w-4 h-4 rounded flex-shrink-0"
              />
            )}
            {!selectedCategory && <div className="w-4 h-4 rounded bg-slate-200 flex-shrink-0"></div>}
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 leading-tight">Category</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm font-medium bg-transparent border-0 p-0 focus:outline-none cursor-pointer"
              >
                <option value="">All categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-[#D7FF1F] text-black font-semibold h-10 md:h-11 px-5 md:px-6 rounded-full hover:bg-[#D7FF1F]/90 transition-colors duration-200 flex items-center gap-2"
          >
            <FiSearch className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Hero Card Grid - 2 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
        {/* Card 1: New Vendors Near You */}
        <div className="rounded-3xl bg-white border border-slate-200/70 shadow-[0_8px_30px_rgba(0,0,0,.07)] overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(0,0,0,.10)]">
          <div className="relative aspect-[4/3]">
            <img
              src={featuredVendor.image}
              alt={featuredVendor.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Rating Badge */}
            <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
              <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-900">{featuredVendor.rating}</span>
            </div>
          </div>

          <div className="p-5 flex flex-col min-h-[300px]">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">New Vendors Near You</h3>
              <p className="text-slate-600 text-sm mb-4">Freshly joined & highly rated</p>

              <div className="mb-5">
                <h4 className="font-semibold text-gray-900">{featuredVendor.name}</h4>
                <p className="text-sm text-slate-600">{featuredVendor.category} • {featuredVendor.city}</p>
                <p className="text-lg font-semibold text-[#D7FF1F] mt-1">{featuredVendor.price}</p>
              </div>
            </div>

            <Link
              href={`/vendors/${featuredVendor.id}`}
              className="w-full bg-[#D7FF1F] text-gray-900 font-semibold py-3 px-4 rounded-full hover:bg-[#D7FF1F]/90 transition-colors duration-200 flex items-center justify-center gap-2 group"
            >
              View Vendor
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Card 2: Build Your Wedding Package */}
        <div className="rounded-3xl bg-white border border-slate-200/70 shadow-[0_10px_30px_rgba(0,0,0,.08)] overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(0,0,0,.10)]">
          <div className="p-5 flex flex-col h-full min-h-[520px] md:min-h-[560px]">
            {/* Category Icons Row */}
            <div className="flex justify-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                <img src="/categories/venues.png" alt="Venues" className="w-6 h-6 rounded" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                <img src="/categories/photo.png" alt="Photo & Video" className="w-6 h-6 rounded" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                <img src="/categories/music.png" alt="Music" className="w-6 h-6 rounded" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                <img src="/categories/decor.png" alt="Decor" className="w-6 h-6 rounded" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 leading-tight">Build Your Wedding Package</h3>
              <p className="text-slate-600 text-sm max-w-[40ch]">Pick categories, compare, request one quote.</p>
            </div>

            {/* CTA - Sticky to bottom */}
            <div className="mt-auto pt-6">
              <Link
                href="/packages/start"
                className="w-full bg-[#D7FF1F] text-gray-900 font-semibold py-3 px-4 rounded-full hover:bg-[#D7FF1F]/90 transition-colors duration-200 flex items-center justify-center gap-2 group"
              >
                Get Started
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Capsule */}
      <div className="absolute bottom-6 right-6 z-20 md:static md:bottom-auto md:right-auto md:flex md:justify-center md:mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,.07)] px-4 py-3 flex items-center gap-4 max-w-sm">
          {/* Overlapping Avatars */}
          <div className="flex -space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
              +
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900 text-sm">Trusted Vendors</h4>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-3 h-3 text-[#F59E0B] fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500">10k+ happy couples in Morocco</p>
          </div>
        </div>
      </div>

      {/* Cities Carousel */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Popular Cities</h2>
            <p className="text-slate-500 text-sm mt-1">Discover wedding vendors across Morocco</p>
          </div>
          <Link
            href="/cities"
            className="text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center gap-1 text-sm"
          >
            See all
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Scrollable Carousel */}
        <div className="overflow-x-auto scroll-snap-x-mandatory snap-x">
          <div className="flex gap-6 pb-4">
            {citiesData.map((city, index) => (
              <Link
                key={city.name}
                href={`/vendors?city=${city.name}`}
                className="flex-shrink-0 w-72 scroll-snap-align-start"
              >
                <div className="rounded-3xl bg-white border border-slate-200 shadow-[0_6px_20px_rgba(0,0,0,.06)] overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,.08)] transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative h-48">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* City Info Overlay */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{city.name}</h3>
                      <p className="text-sm text-white/80">{city.vendors} vendors</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
