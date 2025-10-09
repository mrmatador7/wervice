import { Metadata } from 'next';
import { Suspense } from 'react';
import VendorDirectoryClient from './client';
import { getAllVendors, filterVendors, sortVendors, VendorCity, VendorCategory } from '@/lib/vendors';
import { VendorFilters } from '@/models/vendor';

interface VendorDirectoryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parseSearchParams(searchParams: { [key: string]: string | string[] | undefined }): VendorFilters {
  const params = new URLSearchParams();

  // Convert searchParams to URLSearchParams for easier parsing
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }
  });

  return {
    q: params.get('q') || undefined,
    city: (params.get('city') as VendorCity) || undefined,
    category: (params.get('category') as VendorCategory) || undefined,
    minPrice: params.get('min') ? parseInt(params.get('min')!) : undefined,
    maxPrice: params.get('max') ? parseInt(params.get('max')!) : undefined,
    sort: (params.get('sort') as VendorFilters['sort']) || 'recommended',
    page: params.get('page') ? parseInt(params.get('page')!) : 1,
  };
}

function generateJsonLd(vendors: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Wedding Vendors in Morocco',
    description: 'Browse verified wedding vendors in Morocco by city, category, and budget',
    numberOfItems: vendors.length,
    itemListElement: vendors.slice(0, 10).map((vendor, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: vendor.name,
        description: vendor.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: vendor.city,
          addressCountry: 'Morocco'
        },
        priceRange: vendor.startingPrice ? `$${vendor.startingPrice}+` : undefined,
        aggregateRating: vendor.rating ? {
          '@type': 'AggregateRating',
          ratingValue: vendor.rating,
          reviewCount: vendor.reviewsCount
        } : undefined
      }
    }))
  };
}

export async function generateMetadata({ searchParams }: VendorDirectoryPageProps): Promise<Metadata> {
  const filters = parseSearchParams(await searchParams);
  const allVendors = getAllVendors();
  const filteredVendors = filterVendors(allVendors, filters);

  let title = 'Vendor Directory – Find Wedding Vendors in Morocco | Wervice';
  let description = 'Browse venues, catering, photo & video, planners and more by city and budget.';

  if (filters.category) {
    title = `${filters.category} Vendors in Morocco | Wervice`;
    description = `Find ${filters.category.toLowerCase()} vendors in Morocco. Browse verified professionals by city and budget.`;
  }

  if (filters.city) {
    title = `Wedding Vendors in ${filters.city}, Morocco | Wervice`;
    description = `Browse wedding vendors in ${filters.city}, Morocco. Find venues, catering, photography and more.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&fit=crop' }],
    },
    other: {
      'application/ld+json': JSON.stringify(generateJsonLd(filteredVendors))
    }
  };
}

export default async function VendorDirectoryPage({ searchParams }: VendorDirectoryPageProps) {
  const filters = parseSearchParams(await searchParams);
  const allVendors = getAllVendors();

  // Apply filters and sorting server-side for initial load
  const filteredVendors = filterVendors(allVendors, filters);
  const sortedVendors = sortVendors(filteredVendors, filters.sort);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VendorDirectoryClient
        initialVendors={sortedVendors}
        initialFilters={filters}
      />
    </Suspense>
  );
}