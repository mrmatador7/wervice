'use client';

import { useEffect, useState } from 'react';
import FilterBar from './FilterBar';
import VendorGrid from './VendorGrid';
import { CurrencyCode, MOROCCAN_CITIES } from '@/lib/types/vendor';

interface CategoryClientProps {
  category: string;
  initialSearchParams: { [key: string]: string | string[] | undefined };
}

export default function CategoryClient({ category, initialSearchParams }: CategoryClientProps) {
  const [currency, setCurrency] = useState<CurrencyCode>('MAD');
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorCount, setVendorCount] = useState(0);

  // Mock data - replace with real Supabase fetch
  const mockVendors = [
    {
      id: '1',
      name: 'Riad Dar Moha',
      slug: 'riad-dar-moha',
      city: 'Marrakech',
      category: 'Venues',
      cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop'],
      rating: 4.8,
      reviews: 127,
      tags: ['Indoor', 'Outdoor', 'Traditional'],
      priceFromMAD: 25000,
      isFeatured: true,
    },
    {
      id: '2',
      name: 'Authentic Moroccan Kitchen',
      slug: 'authentic-moroccan-kitchen',
      city: 'Marrakech',
      category: 'Catering',
      cover: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800&h=600&fit=crop'],
      rating: 4.9,
      reviews: 203,
      tags: ['Traditional', 'Moroccan', 'Catering'],
      priceFromMAD: 150,
      isFeatured: true,
    },
    {
      id: '3',
      name: 'Desert Dreams Photography',
      slug: 'desert-dreams-photography',
      city: 'Marrakech',
      category: 'Photography & Videography',
      cover: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop'],
      rating: 4.9,
      reviews: 312,
      tags: ['Photography', 'Cultural', 'Professional'],
      priceFromMAD: 8000,
      isFeatured: false,
    },
    {
      id: '4',
      name: 'Desert Beauty',
      slug: 'desert-beauty',
      city: 'Marrakech',
      category: 'Beauty & Hair',
      cover: 'https://images.unsplash.com/photo-1583393781828-e5c4e7b5f8c9?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1583393781828-e5c4e7b5f8c9?w=800&h=600&fit=crop'],
      rating: 4.8,
      reviews: 178,
      tags: ['Henna', 'Makeup', 'Traditional'],
      priceFromMAD: 600,
      isFeatured: false,
    },
  ];

  const handleFilterChange = async (filters: any) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Filter mock data based on category and filters
    let filteredVendors = mockVendors.filter(vendor => {
      // Category match
      if (category === 'venues' && vendor.category !== 'Venues') return false;
      if (category === 'catering' && vendor.category !== 'Catering') return false;
      if (category === 'photo-video' && vendor.category !== 'Photography & Videography') return false;
      if (category === 'planning' && vendor.category !== 'Wedding Planning') return false;
      if (category === 'beauty' && vendor.category !== 'Beauty & Hair') return false;
      if (category === 'decor' && vendor.category !== 'Decor & Styling') return false;
      if (category === 'music' && vendor.category !== 'Music & Entertainment') return false;
      if (category === 'dresses' && vendor.category !== 'Wedding Dresses') return false;

      // City filter
      if (filters.city && filters.city !== 'All Cities' && !vendor.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }

      // Search filter
      if (filters.q && !vendor.name.toLowerCase().includes(filters.q.toLowerCase())) {
        return false;
      }

      // Price filters
      if (filters.min && vendor.priceFromMAD && vendor.priceFromMAD < parseInt(filters.min)) {
        return false;
      }
      if (filters.max && vendor.priceFromMAD && vendor.priceFromMAD > parseInt(filters.max)) {
        return false;
      }

      return true;
    });

    // Apply sorting
    switch (filters.sort) {
      case 'Rating (high to low)':
        filteredVendors.sort((a, b) => b.rating - a.rating);
        break;
      case 'Price (low to high)':
        filteredVendors.sort((a, b) => (a.priceFromMAD || 0) - (b.priceFromMAD || 0));
        break;
      case 'Price (high to low)':
        filteredVendors.sort((a, b) => (b.priceFromMAD || 0) - (a.priceFromMAD || 0));
        break;
      default: // Best match
        filteredVendors.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
    }

    setVendors(filteredVendors);
    setVendorCount(filteredVendors.length);
    setIsLoading(false);
  };

  // Initial load
  useEffect(() => {
    const initialFilters = {
      city: initialSearchParams.city || 'All Cities',
      q: initialSearchParams.q || '',
      min: initialSearchParams.min || '',
      max: initialSearchParams.max || '',
      sort: initialSearchParams.sort || 'Best match',
      currency: 'MAD',
    };
    handleFilterChange(initialFilters);
  }, []);

  return (
    <>
      <FilterBar
        cities={[...MOROCCAN_CITIES]}
        currency={currency}
        setCurrency={setCurrency}
        onFilterChange={handleFilterChange}
        vendorCount={vendorCount}
      />

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <VendorGrid
          vendors={vendors}
          isLoading={isLoading}
          currency={currency}
        />
      </section>
    </>
  );
}
