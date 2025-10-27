'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import CustomSelect from '@/components/vendors/CustomSelect';
import { capitalizeCity } from '@/lib/utils';
import { labelForCategory } from '@/lib/categories';

const CATEGORIES = [
  { slug: 'venues', label: 'Venues', icon: '/categories/venues.png' },
  { slug: 'catering', label: 'Catering', icon: '/categories/Catering.png' },
  { slug: 'photo_video', label: 'Photo & Video', icon: '/categories/photo.png' },
  { slug: 'event_planner', label: 'Event Planner', icon: '/categories/Event Planner.png' },
  { slug: 'beauty', label: 'Beauty', icon: '/categories/beauty.png' },
  { slug: 'decor', label: 'Decor', icon: '/categories/decor.png' },
  { slug: 'music', label: 'Music', icon: '/categories/music.png' },
  { slug: 'dresses', label: 'Dresses', icon: '/categories/Dresses.png' },
];

const CITIES = [
  'Casablanca',
  'Marrakech',
  'Rabat',
  'Fez',
  'Tangier',
  'Agadir',
  'Meknes',
  'El Jadida',
];

const PRICE_RANGES = [
  { value: '', label: 'Any Price' },
  { value: '0-10000', label: 'Under 10,000 MAD' },
  { value: '10000-20000', label: '10,000 - 20,000 MAD' },
  { value: '20000-50000', label: '20,000 - 50,000 MAD' },
  { value: '50000-100000', label: '50,000 - 100,000 MAD' },
  { value: '100000+', label: '100,000+ MAD' },
];

const RATINGS = [
  { value: '', label: 'Any Rating' },
  { value: '4', label: '4+ Stars' },
  { value: '4.5', label: '4.5+ Stars' },
  { value: '5', label: '5 Stars' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

type Vendor = {
  id: string;
  slug: string;
  business_name: string;
  category: string;
  city: string;
  starting_price?: number | null;
  profile_photo_url?: string | null;
  rating?: number;
};

export default function FeaturedVendorsSection({ locale = 'en' }: { locale?: string }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedCity) params.set('city', selectedCity); // Don't convert to lowercase - database has capitalized cities
        if (selectedRating) params.set('rating', selectedRating);
        if (selectedSort) params.set('sort', selectedSort);
        params.set('limit', '10');

        const res = await fetch(`/api/vendors?${params.toString()}`);
        const data = await res.json();
        setVendors(data.vendors || []);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [selectedCategory, selectedCity, selectedPrice, selectedRating, selectedSort]);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(selectedCategory === slug ? '' : slug);
  };

  const handleVendorClick = (vendor: Vendor) => {
    router.push(`/${locale}/vendors/${vendor.slug}`);
  };

  const handleViewAll = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCity) params.set('city', selectedCity); // Don't convert to lowercase
    if (selectedSort) params.set('sort', selectedSort);
    
    router.push(`/${locale}/vendors?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
          Featured Wedding Vendors
        </h2>
        <p className="mt-2 text-lg text-zinc-600">
          Discover the perfect vendors for your special day
        </p>
      </div>

      {/* Category Icons */}
      <div className="mb-8 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className={`flex flex-col items-center gap-2 transition-all ${
                selectedCategory === category.slug ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full border-4 bg-white transition-all ${
                  selectedCategory === category.slug
                    ? 'border-[#D9FF0A] shadow-xl shadow-[#D9FF0A]/50'
                    : 'border-zinc-200 shadow-md hover:border-zinc-300'
                }`}
              >
                <Image
                  src={category.icon}
                  alt={category.label}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span
                className={`text-xs font-semibold ${
                  selectedCategory === category.slug ? 'text-zinc-900' : 'text-zinc-600'
                }`}
              >
                {category.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <CustomSelect
          value={selectedCity}
          onChange={(value) => setSelectedCity(value as string)}
          options={[
            { value: '', label: 'All Cities' },
            ...CITIES.map((city) => ({ value: city, label: city })),
          ]}
          placeholder="Location"
        />

        <CustomSelect
          value={selectedPrice}
          onChange={(value) => setSelectedPrice(value as string)}
          options={PRICE_RANGES}
          placeholder="Price Range"
        />

        <CustomSelect
          value={selectedRating}
          onChange={(value) => setSelectedRating(value as string)}
          options={RATINGS}
          placeholder="Rating"
        />

        <CustomSelect
          value={selectedSort}
          onChange={(value) => setSelectedSort(value as string)}
          options={SORT_OPTIONS}
          placeholder="Sort By"
        />
      </div>

      {/* Vendor Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100"
            />
          ))}
        </div>
      ) : vendors.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {vendors.map((vendor) => (
              <button
                key={vendor.id}
                onClick={() => handleVendorClick(vendor)}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-xl hover:border-zinc-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-zinc-100">
                  {vendor.profile_photo_url ? (
                    <Image
                      src={vendor.profile_photo_url}
                      alt={vendor.business_name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                      <span className="text-4xl text-zinc-400">
                        {vendor.business_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 backdrop-blur-sm">
                    {labelForCategory(vendor.category)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-bold text-zinc-900 line-clamp-1">
                    {vendor.business_name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <MapPin className="h-4 w-4" />
                    <span>{capitalizeCity(vendor.city)}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-zinc-900">
                        {vendor.rating || '5.0'}
                      </span>
                    </div>

                    {vendor.starting_price && (
                      <span className="text-sm font-semibold text-zinc-900">
                        From {vendor.starting_price.toLocaleString()} MAD
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl"
            >
              View All Vendors
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-zinc-500">No vendors found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}

