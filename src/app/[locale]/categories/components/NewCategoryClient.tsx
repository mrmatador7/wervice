'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryBanner from './CategoryBanner';
import CategorySidebar from './CategorySidebar';
import NewVendorCard from './NewVendorCard';
import { CurrencyCode, MOROCCAN_CITIES } from '@/lib/types/vendor';
import { labelForCategory, WERVICE_CATEGORIES } from '@/lib/categories';
import { formatCategoryName } from '@/lib/format';
import { getSubcategoriesForCategory } from '@/lib/subcategories';

interface NewCategoryClientProps {
  category: string;
  initialSearchParams: { [key: string]: string | string[] | undefined };
  seoBlocks?: React.ReactNode;
}

// Fallback category cover images if not set in database (keys = URL slugs)
const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  florist: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&fit=crop',
  dresses: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&h=800&fit=crop',
  venues: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=800&fit=crop',
  beauty: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&h=800&fit=crop',
  'photo-film': 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop',
  caterer: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=800&fit=crop',
  decor: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&fit=crop',
  negafa: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&h=800&fit=crop',
  artist: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=800&fit=crop',
  'event-planner': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop',
  cakes: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=800&fit=crop',
};

// Get subcategories for each category from the centralized subcategories file
function getCategorySubcategories(category: string) {
  const subcategories = getSubcategoriesForCategory(category);
  return subcategories.map(sub => ({
    value: sub.slug,
    label: sub.name
  }));
}

export default function NewCategoryClient({ category, initialSearchParams, seoBlocks }: NewCategoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  const [currency, setCurrency] = useState<CurrencyCode>('MAD');
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorCount, setVendorCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryData, setCategoryData] = useState<{ cover_url?: string; strapline?: string } | null>(null);
  const [displayCount, setDisplayCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filters, setFilters] = useState<{ cities?: string[]; subcategories?: string[] }>({});
  const [isCategoryTransitioning, setIsCategoryTransitioning] = useState(false);

  // Fetch vendors from API
  const fetchVendors = async (filters?: any) => {
    try {
      setIsLoading(true);
      
      // Map URL slugs to database category (canonical 11 categories)
      const urlSlugToCategory: Record<string, string> = {
        florist: 'florist',
        dresses: 'dresses',
        venues: 'venues',
        beauty: 'beauty',
        'photo-film': 'photography',
        caterer: 'catering',
        decor: 'decor',
        negafa: 'negafa',
        artist: 'music',
        'event-planner': 'planning',
        cakes: 'cakes',
      };
      
      // Build query params
      const params = new URLSearchParams();
      
      // Handle category filters
      // If user selected categories in filter AND it's different from current page, use those
      // Otherwise, always use the current page category
      if (filters?.categories?.length && !filters.categories.includes(category)) {
        // User selected different categories - use those
        filters.categories.forEach((cat: string) => {
          const mappedCat = urlSlugToCategory[cat] || cat;
          params.append('category', mappedCat);
        });
      } else {
        // Default to current page category (ignore category filter on same page)
        const categoryParam = urlSlugToCategory[category] || category;
        params.set('category', categoryParam);
      }
      
      // Fetch all vendors for this category (client-side progressive display handles pagination)
      params.set('limit', '500');
      
      if (filters?.cities?.length) {
        filters.cities.forEach((city: string) => params.append('city', city));
      }
      
      if (filters?.minPrice) params.set('priceMin', filters.minPrice.toString());
      if (filters?.maxPrice) params.set('priceMax', filters.maxPrice.toString());
      
      // Fetch from API route
      const apiUrl = `/api/vendors?${params.toString()}`;
      console.log('🔍 API Request:', apiUrl);
      console.log('📦 Filters passed:', filters);
      
      const response = await fetch(apiUrl);
      const fetchedVendors = await response.json();
      
      console.log('✅ API Response:', {
        total: fetchedVendors.total,
        vendorCount: fetchedVendors.vendors?.length || 0,
        firstVendor: fetchedVendors.vendors?.[0] ? {
          name: fetchedVendors.vendors[0].business_name,
          city: fetchedVendors.vendors[0].city,
          category: fetchedVendors.vendors[0].category
        } : null
      });

      // Format vendors
      let formattedVendors = (fetchedVendors.vendors || fetchedVendors).map((vendor: any) => ({
        id: vendor.id,
        name: vendor.business_name,
        slug: vendor.slug,
        city: vendor.city,
        category: vendor.category,
        cover: vendor.profile_photo_url || '/placeholder-vendor.jpg',
        images: vendor.gallery_urls || [],
        rating: vendor.rating,
        reviews: Math.floor(Math.random() * 200) + 10,
        tags: [labelForCategory(vendor.category)],
        priceFromMAD: vendor.starting_price || 1000,
        isFeatured: vendor.is_featured || false,
      }));

      setVendors(formattedVendors);
      setVendorCount(formattedVendors.length);
      setDisplayCount(12);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]);
      setVendorCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = async (filters: any) => {
    // Update URL with filter params
    const params = new URLSearchParams();
    
    // Add city filters
    if (filters.cities && filters.cities.length > 0) {
      filters.cities.forEach((city: string) => params.append('city', city));
    }
    
    // Add subcategory filters
    if (filters.subcategories && filters.subcategories.length > 0) {
      filters.subcategories.forEach((sub: string) => params.append('type', sub));
    }
    
    // Update URL without page reload
    const newUrl = params.toString() 
      ? `${pathname}?${params.toString()}`
      : pathname;
    
    router.push(newUrl, { scroll: false });
    
    await fetchVendors(filters);
  };

  // Fetch category data from database
  const fetchCategoryData = async () => {
    try {
      // Map URL slugs to database slugs
      const urlSlugToCategory: Record<string, string> = {
        'photo-video': 'photo_video',
        'planning': 'event_planner',
      };
      const categorySlug = urlSlugToCategory[category] || category;
      
      const response = await fetch(`/api/categories/${categorySlug}`);
      if (response.ok) {
        const data = await response.json();
        setCategoryData(data);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  // Initial load and re-run whenever the URL search params change (e.g. city links from SEO blocks)
  useEffect(() => {
    const cityParams = searchParams.getAll('city');
    const typeParams = searchParams.getAll('type');

    const urlFilters: { cities?: string[]; subcategories?: string[] } = {};

    if (cityParams.length > 0) {
      urlFilters.cities = cityParams;
    }
    if (typeParams.length > 0) {
      urlFilters.subcategories = typeParams;
    }

    setFilters(urlFilters);
    fetchVendors(urlFilters);
    fetchCategoryData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, searchParams]);

  // Reset display count when search query changes
  useEffect(() => {
    setDisplayCount(12);
  }, [searchQuery]);

  // Load more handler
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 12);
      setIsLoadingMore(false);
    }, 300);
  };

  // Filter vendors by search query client-side (instant, no re-fetch)
  const filteredVendors = searchQuery
    ? vendors.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : vendors;

  const visibleVendors = filteredVendors.slice(0, displayCount);
  const hasMore = displayCount < filteredVendors.length;

  // Handle category change with smooth transition
  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === category) return;
    
    setIsCategoryTransitioning(true);
    
    // Build URL with current city filters preserved
    const params = new URLSearchParams();
    if (filters.cities && filters.cities.length > 0) {
      filters.cities.forEach(city => params.append('city', city));
    }
    
    const queryString = params.toString();
    const url = queryString 
      ? `/${locale}/categories/${newCategory}?${queryString}`
      : `/${locale}/categories/${newCategory}`;
    
    router.push(url, { scroll: false });
  };

  // Prepare filter data - using static counts to avoid hydration errors
  const cityCountMap: Record<string, number> = {
    'Casablanca': 45,
    'Rabat': 32,
    'Marrakech': 38,
    'Fez': 28,
    'Tangier': 25,
    'Agadir': 22,
    'Meknes': 18,
    'Kenitra': 15,
    'All Cities': 0
  };

  const citiesFilter = {
    title: 'City',
    items: MOROCCAN_CITIES.map(city => ({
      label: city.label,
      value: city.value,
      count: cityCountMap[city.label] || 10
    }))
  };

  const CATEGORY_IMAGES: Record<string, string> = {
    florist:        '/categories/decor.png',
    dresses:        '/categories/Dresses.png',
    venues:         '/categories/venues.png',
    beauty:         '/categories/beauty.png',
    'photo-film':   '/categories/photo.png',
    caterer:        '/categories/Catering.png',
    decor:          '/categories/decor.png',
    negafa:         '/categories/beauty.png',
    artist:         '/categories/music.png',
    'event-planner':'/categories/event-planner.png',
    cakes:          '/categories/Catering.png',
  };
  const categoriesFilter = {
    title: 'Category',
    items: WERVICE_CATEGORIES.map((c) => ({ label: c.label, value: c.slug, count: 0 })),
  };

  const priceRange = {
    min: 100,
    max: 50000,
    currency: currency
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-white">
        {/* Hero Banner */}
        <CategoryBanner 
          categoryName={formatCategoryName(category)}
          imageUrl={categoryData?.cover_url || FALLBACK_CATEGORY_IMAGES[category]}
          category={category}
        />

        {/* Main Content - Two Column Layout */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Sidebar - Categories */}
            <aside className="w-full lg:w-56 flex-shrink-0">
              <div className="space-y-2 sticky top-24">
                {WERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`group block w-full text-left rounded-2xl transition-all duration-200 border ${
                      category === cat.slug
                        ? 'bg-[#D9FF0A] border-[#D9FF0A] shadow-sm'
                        : 'bg-white border-neutral-100 hover:border-neutral-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between px-5 py-4">
                      <h3 className={`font-black text-sm uppercase tracking-wide italic leading-none ${
                        category === cat.slug ? 'text-[#11190C]' : 'text-neutral-500 group-hover:text-[#11190C]'
                      } transition-colors`}>
                        {cat.label}
                      </h3>
                      <img
                        src={CATEGORY_IMAGES[cat.slug] || '/categories/venues.png'}
                        alt={cat.label}
                        className="w-9 h-9 object-contain flex-shrink-0"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Right Content - Vendors */}
            <div className={`flex-1 min-w-0 transition-opacity duration-300 ${isCategoryTransitioning ? 'opacity-50' : 'opacity-100'}`}>

              {/* Search Bar */}
              <div className="mb-5">
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vendors by name..."
                    className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-11 pr-10 text-sm text-[#11190C] placeholder-neutral-400 shadow-sm outline-none focus:border-neutral-400 focus:ring-0 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors" aria-label="Clear">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* City Filter Pills */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {MOROCCAN_CITIES.filter(c => c.value !== 'all').map((city) => (
                    <button
                      key={city.value}
                      onClick={() => {
                        const isSelected = filters.cities?.includes(city.value);
                        const updated = isSelected ? [] : [city.value];
                        setFilters({ ...filters, cities: updated });
                        handleFilterChange({ ...filters, cities: updated });
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                        filters.cities?.includes(city.value)
                          ? 'bg-[#11190C] text-white border-[#11190C]'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
              </div>


              {/* Vendor Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-[20px] border border-neutral-100 bg-white overflow-hidden shadow-sm">
                      <div className="aspect-[4/3] bg-neutral-200" />
                      <div className="px-4 py-4 space-y-2">
                        <div className="h-5 w-3/4 rounded-full bg-neutral-200" />
                        <div className="h-3.5 w-1/3 rounded-full bg-neutral-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : vendors.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
                    {visibleVendors.map((vendor, index) => (
                      <div 
                        key={vendor.id}
                        style={{ animationDelay: `${index * 50}ms` }}
                        className="animate-fade-in-up"
                      >
                        <NewVendorCard
                          vendor={vendor}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center mt-12">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-10 py-3.5 bg-white text-[#11190C] border border-neutral-300 rounded-full font-semibold hover:border-[#11190C] hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoadingMore ? 'Loading...' : `Load More (${filteredVendors.length - displayCount} remaining)`}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-neutral-600 text-lg">No vendors found</p>
                  <p className="text-neutral-500 text-sm mt-2">Try adjusting your filters</p>
                </div>
              )}
                </div>
          </div>
        </div>
    </div>

    {/* SEO content blocks (server-rendered, passed from page.tsx) */}
    {seoBlocks && (
      <div className="bg-[#F5F5F0] border-t border-gray-200 mt-10 pt-14">
        {seoBlocks}
      </div>
    )}

    <Footer />
    </>
  );
}

