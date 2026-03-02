'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import CustomSelect from '@/components/vendors/CustomSelect';
import { capitalizeCity } from '@/lib/utils';
import { vendorUrl } from '@/lib/vendor-url';
import { labelForCategory, WERVICE_CATEGORIES, slugToDbCategory } from '@/lib/categories';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';

// Mini card with auto-sliding carousel used inside this section
function FeaturedVendorCard({ vendor, onClick }: { vendor: any; onClick: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const images: string[] = [];
  const gallery = vendor.gallery_urls || vendor.gallery_photos || [];
  if (Array.isArray(gallery) && gallery.length > 0) {
    images.push(...gallery.filter((url: string) => url && url.trim()));
  }
  if (vendor.profile_photo_url?.trim()) images.push(vendor.profile_photo_url.trim());

  const total = images.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => setActiveIndex((p) => (p + 1) % total), 3000);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <button
      onClick={onClick}
      className="group flex flex-col rounded-[28px] border border-zinc-200 bg-white p-4 text-left shadow-[0_4px_20px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(17,25,12,0.14)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-neutral-100">
        {total > 0 ? (
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ width: `${total * 100}%`, transform: `translateX(-${(activeIndex * 100) / total}%)` }}
          >
            {images.map((src, i) => (
              <div key={i} className="relative h-full flex-shrink-0" style={{ width: `${100 / total}%` }}>
                <Image
                  src={src}
                  alt={`${vendor.business_name} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 25vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
            <span className="text-4xl font-bold text-zinc-300">{vendor.business_name.charAt(0)}</span>
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-2xl bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#11190C]">
            {labelForCategory(vendor.category)}
          </span>
        </div>

        {total > 1 && (
          <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#11190C] sm:text-xl">
          {vendor.business_name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-[#aaa]" />
          <span className="text-sm font-medium text-[#888]">{capitalizeCity(vendor.city)}</span>
        </div>
      </div>
    </button>
  );
}


const CITIES = MOROCCAN_CITIES.filter((c) => c.value !== 'all').map((c) => c.label);

const CATEGORY_ICONS: Record<string, string> = {
  florist: '/categories/decor.png',
  dresses: '/categories/Dresses.png',
  venue: '/categories/venues.png',
  beauty: '/categories/beauty.png',
  'photo-film': '/categories/photo.png',
  caterer: '/categories/Catering.png',
  decor: '/categories/decor.png',
  negafa: '/categories/beauty.png',
  artist: '/categories/music.png',
  'event-planner': '/categories/event-planner.png',
  cakes: '/categories/Catering.png',
};
const CATEGORIES = WERVICE_CATEGORIES.map((c) => ({ slug: c.slug, label: c.label, icon: CATEGORY_ICONS[c.slug] || '/categories/venues.png' }));

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
  gallery_urls?: string[] | null;
  gallery_photos?: string[] | null;
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
        if (selectedCategory) params.set('category', slugToDbCategory(selectedCategory) || selectedCategory);
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
    if (!vendor.slug) {
      console.warn('Vendor missing slug:', vendor);
      return;
    }
    router.push(vendorUrl(vendor, locale));
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
              <div className="aspect-[4/3] rounded-[20px] bg-gray-200" />
              <div className="space-y-3 px-1 pt-5">
                <div className="h-6 w-3/4 rounded bg-gray-200" />
                <div className="h-12 rounded-2xl bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : vendors.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vendors.map((vendor) => (
              <FeaturedVendorCard
                key={vendor.id}
                vendor={vendor}
                onClick={() => handleVendorClick(vendor)}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 rounded-full bg-[#11190C] px-8 py-3 text-sm font-bold uppercase tracking-wide text-[#D9FF0A] shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
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

