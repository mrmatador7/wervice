'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryBanner from './CategoryBanner';
import CategorySidebar from './CategorySidebar';
import NewVendorCard from './NewVendorCard';
import { CurrencyCode, MOROCCAN_CITIES } from '@/lib/types/vendor';
import { labelForCategory } from '@/lib/categories';
import { formatCategoryName } from '@/lib/format';
import { getSubcategoriesForCategory } from '@/lib/subcategories';

interface NewCategoryClientProps {
  category: string;
  initialSearchParams: { [key: string]: string | string[] | undefined };
}

// Fallback category cover images if not set in database
const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  'venues': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=800&fit=crop',
  'catering': 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=800&fit=crop',
  'photo-video': 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop',
  'planning': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop',
  'beauty': 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&h=800&fit=crop',
  'decor': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&fit=crop',
  'music': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=800&fit=crop',
  'dresses': 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&h=800&fit=crop',
};

// Get subcategories for each category from the centralized subcategories file
function getCategorySubcategories(category: string) {
  const subcategories = getSubcategoriesForCategory(category);
  return subcategories.map(sub => ({
    value: sub.slug,
    label: sub.name
  }));
}

export default function NewCategoryClient({ category, initialSearchParams }: NewCategoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  const [currency, setCurrency] = useState<CurrencyCode>('MAD');
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorCount, setVendorCount] = useState(0);
  const [sortBy, setSortBy] = useState('most-popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryData, setCategoryData] = useState<{ cover_url?: string; strapline?: string } | null>(null);
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filters, setFilters] = useState<{ cities?: string[]; subcategories?: string[] }>({});
  const [isCategoryTransitioning, setIsCategoryTransitioning] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch vendors from API
  const fetchVendors = async (filters?: any) => {
    try {
      setIsLoading(true);
      
      // Map URL slugs to database category names
      const urlSlugToCategory: Record<string, string> = {
        'photography': 'photography',
        'planning': 'planning',
        'venues': 'venues',
        'catering': 'catering',
        'beauty': 'beauty',
        'decor': 'decor',
        'music': 'music',
        'dresses': 'dresses',
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
      
      // Remove limit to get all vendors, apply pagination client-side
      // params.set('limit', '50');
      
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

      // Apply search filter
      if (searchQuery) {
        formattedVendors = formattedVendors.filter((vendor: any) =>
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply sorting
      if (sortBy === 'price-low-high') {
        formattedVendors.sort((a: any, b: any) => a.priceFromMAD - b.priceFromMAD);
      } else if (sortBy === 'price-high-low') {
        formattedVendors.sort((a: any, b: any) => b.priceFromMAD - a.priceFromMAD);
      } else if (sortBy === 'rating') {
        formattedVendors.sort((a: any, b: any) => b.rating - a.rating);
      }

      setVendors(formattedVendors);
      setVendorCount(formattedVendors.length);
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

  // Initial load and parse URL params
  useEffect(() => {
    // Parse city filters from URL
    const cityParams = searchParams.getAll('city');
    // Parse subcategory/type filters from URL
    const typeParams = searchParams.getAll('type');
    
    const initialFilters: { cities?: string[]; subcategories?: string[] } = {};
    
    if (cityParams.length > 0) {
      initialFilters.cities = cityParams;
    }
    
    if (typeParams.length > 0) {
      initialFilters.subcategories = typeParams;
    }
    
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
    }
    
    fetchVendors(initialFilters);
    fetchCategoryData();
  }, [category]);

  // Refetch when search or sort changes
  useEffect(() => {
    setDisplayCount(10); // Reset to 10 when filters change
    fetchVendors();
  }, [searchQuery, sortBy]);

  // Load more handler
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 10);
      setIsLoadingMore(false);
    }, 300);
  };

  // Get visible vendors
  const visibleVendors = vendors.slice(0, displayCount);
  const hasMore = displayCount < vendors.length;

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

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sort options
  const sortOptions = [
    { value: 'most-popular', label: 'Most Popular' },
    { value: 'highest-rated', label: 'Highest Rated' },
    { value: 'lowest-price', label: 'Lowest Price' },
    { value: 'highest-price', label: 'Highest Price' },
    { value: 'newest', label: 'Newest Vendors' },
    { value: 'alphabetical', label: 'Alphabetical (A–Z)' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Most Popular';

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

  const categoriesFilter = {
    title: 'Category',
    items: [
      { label: 'Venues', value: 'venues', count: 120 },
      { label: 'Catering', value: 'catering', count: 85 },
      { label: 'Photo & Video', value: 'photography', count: 95 },
      { label: 'Event Planner', value: 'planning', count: 45 },
      { label: 'Beauty', value: 'beauty', count: 67 },
      { label: 'Decor', value: 'decor', count: 53 },
      { label: 'Music', value: 'music', count: 38 },
      { label: 'Dresses', value: 'dresses', count: 72 },
    ]
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
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="space-y-2 sticky top-24">
                {[
                  { slug: 'venues', label: 'Venues', image: '/categories/venues.png' },
                  { slug: 'catering', label: 'Catering', image: '/categories/Catering.png' },
                  { slug: 'photography', label: 'Photo & Video', image: '/categories/photo.png' },
                  { slug: 'planning', label: 'Event Planner', image: '/categories/Event Planner.png' },
                  { slug: 'beauty', label: 'Beauty', image: '/categories/beauty.png' },
                  { slug: 'decor', label: 'Decor', image: '/categories/decor.png' },
                  { slug: 'music', label: 'Music', image: '/categories/music.png' },
                  { slug: 'dresses', label: 'Dresses', image: '/categories/Dresses.png' },
                ].map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`group relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg block w-full text-left ${
                      category === cat.slug ? 'bg-[#D9FF0A]' : 'bg-neutral-50 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center justify-between h-20 px-4">
                      {/* Title on Left */}
                      <div className="flex-1">
                        <h3 className="font-bold text-[#11190C] text-base uppercase tracking-tight italic">
                          {cat.label}
                        </h3>
                      </div>
                      
                      {/* Image on Right */}
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <img
                          src={cat.image}
                          alt={cat.label}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Right Content - Vendors */}
            <div className={`flex-1 min-w-0 transition-opacity duration-300 ${isCategoryTransitioning ? 'opacity-50' : 'opacity-100'}`}>
              
              {/* City Filter Buttons */}
              <div className="mb-6 animate-fade-in">
                <div className="flex flex-wrap gap-2">
                  {MOROCCAN_CITIES.filter(c => c.value !== 'all').map((city) => (
                    <button
                      key={city.value}
                      onClick={() => {
                        const currentCities = filters.cities || [];
                        const updated = currentCities.includes(city.value)
                          ? currentCities.filter(c => c !== city.value)
                          : [...currentCities, city.value];
                        setFilters({ ...filters, cities: updated });
                        handleFilterChange({ ...filters, cities: updated });
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        filters.cities?.includes(city.value)
                          ? 'bg-[#D9FF0A] text-[#11190C]'
                          : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories Filter + Sort By */}
              {getCategorySubcategories(category).length > 0 && (
                <div className="mb-6 animate-fade-in">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Type Label */}
                    <span className="text-sm font-medium text-neutral-700">Type:</span>
                    
                    {/* Subcategories */}
                    {getCategorySubcategories(category).map((sub) => (
                      <button
                        key={sub.value}
                        onClick={() => {
                          const currentSubs = filters.subcategories || [];
                          const updated = currentSubs.includes(sub.value)
                            ? currentSubs.filter(s => s !== sub.value)
                            : [...currentSubs, sub.value];
                          setFilters({ ...filters, subcategories: updated });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          filters.subcategories?.includes(sub.value)
                            ? 'bg-neutral-900 text-white'
                            : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}

                    {/* Sort By Dropdown */}
                    <div ref={sortDropdownRef} className="relative ml-auto">
                      <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:border-neutral-300 transition-all duration-200 whitespace-nowrap"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        <span>Sort by</span>
                        <svg 
                          className={`w-4 h-4 text-neutral-500 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Sort Dropdown Menu */}
                      {showSortDropdown && (
                        <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl overflow-hidden min-w-[220px] z-50 border border-neutral-100">
                          <div className="py-1">
                            {sortOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setShowSortDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${
                                  sortBy === option.value 
                                    ? 'bg-[#D9FF0A]/10 text-[#11190C] font-semibold' 
                                    : 'text-neutral-700'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Vendor Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-neutral-200 aspect-[3/4] rounded-xl mb-3"></div>
                      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : vendors.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
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
                        className="px-8 py-3 bg-[#11190C] text-white rounded-full font-semibold hover:bg-[#D9FF0A] hover:text-[#11190C] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoadingMore ? 'Loading...' : `Load More (${vendors.length - displayCount} remaining)`}
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
    
    <Footer />
    </>
  );
}

