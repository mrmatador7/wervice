'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface VendorGridProps {
  city: {
    name: string;
    description: string;
    image: string;
    tagline: string;
  };
  category?: string;
  subcategory?: string;
  onClearFilters?: () => void;
  isLoading?: boolean;
}

// Mock vendor data - in real app this would come from API
const mockVendors = [
  {
    id: '1',
    name: 'Palais des Congrès',
    category: 'Venues',
    location: 'Casablanca',
    priceRange: '15,000 - 25,000 MAD',
    rating: 4.8,
    reviewCount: 127,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
    categoryIcon: '/categories/venues.png',
  },
  {
    id: '2',
    name: 'Dar Moha',
    category: 'Venues',
    location: 'Marrakech',
    priceRange: '25,000 - 40,000 MAD',
    rating: 4.9,
    reviewCount: 203,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    categoryIcon: '/categories/venues.png',
  },
  {
    id: '3',
    name: 'Traditional Tagine',
    category: 'Catering',
    location: 'Marrakech',
    priceRange: '9,500 - 15,000 MAD',
    rating: 4.8,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
    categoryIcon: '/categories/Catering.png',
  },
  {
    id: '4',
    name: 'Chefs Marocains',
    category: 'Catering',
    location: 'Casablanca',
    priceRange: '8,000 - 12,000 MAD',
    rating: 4.6,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
    categoryIcon: '/categories/Catering.png',
  },
  {
    id: '5',
    name: 'Golden Moments',
    category: 'Photo & Video',
    location: 'Casablanca',
    priceRange: '5,000 - 8,000 MAD',
    rating: 4.9,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop',
    categoryIcon: '/categories/photo.png',
  },
  {
    id: '6',
    name: 'Studio Lumière',
    category: 'Photo & Video',
    location: 'Rabat',
    priceRange: '3,500 - 6,000 MAD',
    rating: 4.7,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    categoryIcon: '/categories/photo.png',
  },
  {
    id: '7',
    name: 'Moroccan Elegance',
    category: 'Dresses',
    location: 'Fes',
    priceRange: '2,500 - 8,000 MAD',
    rating: 4.8,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=800&auto=format&fit=crop',
    categoryIcon: '/categories/Dresses.png',
  },
  {
    id: '8',
    name: 'Royal Decor',
    category: 'Decor',
    location: 'Meknes',
    priceRange: '4,000 - 12,000 MAD',
    rating: 4.6,
    reviewCount: 54,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    categoryIcon: '/categories/decor.png',
  },
  {
    id: '9',
    name: 'Desert Beats',
    category: 'Music',
    location: 'Agadir',
    priceRange: '3,000 - 7,000 MAD',
    rating: 4.7,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
    categoryIcon: '/categories/music.png',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating})</span>
    </div>
  );
}

export default function VendorGrid({ city, category = 'all', subcategory = 'all', onClearFilters, isLoading: externalLoading = false }: VendorGridProps) {
  const [visibleVendors, setVisibleVendors] = useState(6);
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading || internalLoading;

  // Filter vendors by city, category, and subcategory (in real app this would be dynamic)
  const filteredVendors = mockVendors.filter(vendor => {
    const cityMatch = vendor.location.toLowerCase().includes(city.name.toLowerCase()) ||
                     city.name.toLowerCase() === 'marrakech' || // Show some vendors for Marrakech
                     city.name.toLowerCase() === 'casablanca';   // Show some vendors for Casablanca

    // Category filtering
    let categoryMatch = true;
    if (category !== 'all') {
      // Convert category slug to match vendor category format
      const categoryMap: Record<string, string> = {
        'photo-video': 'Photo & Video'
      };
      const vendorCategory = categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
      categoryMatch = vendor.category === vendorCategory;
    }

    // Subcategory filtering (only applies if a main category is selected)
    let subcategoryMatch = true;
    if (category !== 'all' && subcategory !== 'all') {
      // For demo purposes, we'll simulate subcategory matching
      // In a real app, vendors would have subcategory data
      subcategoryMatch = Math.random() > 0.5; // Random match for demo
    }

    return cityMatch && categoryMatch && subcategoryMatch;
  });

  // Reset pagination when category or subcategory filters change
  const [prevCategory, setPrevCategory] = useState(category);
  const [prevSubcategory, setPrevSubcategory] = useState(subcategory);

  if (prevCategory !== category || prevSubcategory !== subcategory) {
    setVisibleVendors(6);
    setPrevCategory(category);
    setPrevSubcategory(subcategory);
  }

  const loadMore = () => {
    setInternalLoading(true);
    setTimeout(() => {
      setVisibleVendors(prev => Math.min(prev + 6, filteredVendors.length));
      setInternalLoading(false);
    }, 500);
  };

  return (
    <div id="vendors" className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-wervice-ink mb-2">
          {category === 'all'
            ? `Featured Vendors in ${city.name}`
            : `${category.charAt(0).toUpperCase() + category.slice(1)} Vendors in ${city.name}`
          }
        </h2>
        <p className="text-wervice-taupe">
          {category === 'all'
            ? 'Discover the best wedding professionals in your city'
            : `Find the best ${category} services in ${city.name}`
          }
        </p>
      </div>

      {/* Loading Skeletons */}
      {externalLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
              <div className="aspect-[3/2] bg-gray-200" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : /* Vendor Grid */ !externalLoading && filteredVendors.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {filteredVendors.slice(0, visibleVendors).map((vendor) => (
              <Link
                key={vendor.id}
                href={`/vendors/${vendor.id}`}
                className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={vendor.image}
                    alt={vendor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <img
                        src={vendor.categoryIcon}
                        alt=""
                        className="w-3 h-3"
                      />
                      <span className="text-xs font-medium text-gray-700">{vendor.category}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-wervice-lime transition-colors">
                    {vendor.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vendor.location}
                  </div>

                  <div className="flex items-center justify-between">
                    <StarRating rating={vendor.rating} />
                    <span className="text-sm font-semibold text-wervice-ink">
                      {vendor.priceRange}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {visibleVendors < filteredVendors.length && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-wervice-sand/50 rounded-full text-wervice-ink font-medium hover:border-wervice-sand hover:shadow-sm transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Vendors
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : !externalLoading && (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-wervice-sand/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-wervice-taupe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-wervice-ink mb-2">
            {category === 'all'
              ? `No vendors found in ${city.name} yet`
              : `No ${category} vendors found in ${city.name}`
            }
          </h3>
          <p className="text-wervice-taupe max-w-md mx-auto mb-6">
            {category === 'all'
              ? "We're working on bringing amazing vendors to your city. Check back soon or explore vendors in nearby cities."
              : "Try selecting a different category or browse all vendors in this city."
            }
          </p>
          {category !== 'all' && onClearFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D9FF0A] text-black rounded-full font-medium hover:bg-[#c4e600] transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
