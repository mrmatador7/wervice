'use client';

import { useEffect, useState } from 'react';
import FilterBar from './FilterBar';
import VendorGrid from './VendorGrid';
import { CurrencyCode, MOROCCAN_CITIES } from '@/lib/types/vendor';
import { getVendors } from '@/lib/vendors-server';
import { Vendor } from '@/lib/types/vendor';
import { labelForCategory } from '@/lib/categories';

interface CategoryClientProps {
  category: string;
  initialSearchParams: { [key: string]: string | string[] | undefined };
}

export default function CategoryClient({ category, initialSearchParams }: CategoryClientProps) {
  const [currency, setCurrency] = useState<CurrencyCode>('MAD');
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorCount, setVendorCount] = useState(0);

  // Fetch vendors from public table
  const fetchVendors = async (filters?: any) => {
    try {
      setIsLoading(true);
      const city = filters?.city || initialSearchParams.city as string;
      const searchQuery = filters?.q || initialSearchParams.q as string;

      // Map URL slugs to normalized category slugs
      const urlSlugToCategory: Record<string, string> = {
        'photo-video': 'photo_video',
        'planning': 'event_planner',
      };
      const categoryParam = urlSlugToCategory[category] || category;
      const cityParam = city && city !== 'All Cities' ? city.toLowerCase() : undefined;

      // Fetch from our API route
      const response = await fetch(`/api/vendors${categoryParam ? `?category=${categoryParam}` : ''}${cityParam ? `${categoryParam ? '&' : '?'}city=${cityParam}` : ''}&limit=50`, {
        next: { tags: ['vendors'] }
      });
      const fetchedVendors = await response.json();

      // Apply client-side search filter if needed
      let filteredVendors = fetchedVendors.vendors || fetchedVendors;
      if (searchQuery) {
        filteredVendors = filteredVendors.filter((vendor: any) =>
          vendor.business_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Convert Vendor format to the format expected by VendorGrid
      const formattedVendors = filteredVendors.map((vendor: any) => ({
        id: vendor.id,
        name: vendor.business_name,
        slug: vendor.slug,
        city: vendor.city,
        category: vendor.category,
        cover: vendor.profile_photo_url || '/placeholder-vendor.jpg',
        images: vendor.gallery_urls || [],
        rating: vendor.rating,
        reviews: Math.floor(Math.random() * 200) + 10, // TODO: Add reviews count to schema
        tags: [labelForCategory(vendor.category)], // TODO: Add tags to schema
        priceFromMAD: vendor.starting_price || 1000, // TODO: Add pricing to schema
        isFeatured: vendor.is_featured || false, // TODO: Add featured flag to schema
      }));

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
    await fetchVendors(filters);
  };

  // Initial load
  useEffect(() => {
    const initialFilters = {
      city: initialSearchParams.city || 'All Cities',
      q: initialSearchParams.q || '',
    };
    fetchVendors(initialFilters);
  }, [category]);

  return (
    <>
      <FilterBar
        cities={MOROCCAN_CITIES.map(city => city.label)}
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
