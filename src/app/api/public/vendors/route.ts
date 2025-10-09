import { NextResponse } from 'next/server';
import { vendors } from '@/lib/vendors';

// Map category slugs to the enum values used in mock data
const categoryMap = {
  'venues': 'Venues',
  'catering': 'Catering',
  'photo-video': 'Photo & Video',
  'music': 'Music',
  'dresses': 'Dresses'
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get('category');
  const city = searchParams.get('city');
  const limit = Number(searchParams.get('limit') ?? '12');

  if (!categorySlug || !categoryMap[categorySlug as keyof typeof categoryMap]) {
    return NextResponse.json([], { status: 400 });
  }

  const category = categoryMap[categorySlug as keyof typeof categoryMap];

  // Filter vendors by category and optionally by city
  let filteredVendors = vendors.filter(vendor => vendor.category === category);

  if (city) {
    filteredVendors = filteredVendors.filter(vendor =>
      vendor.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Sort by rating (highest first) and limit results
  const sortedVendors = filteredVendors
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);

  // Transform to the expected API format
  const apiVendors = sortedVendors.map(vendor => ({
    id: vendor.slug, // Use slug as ID for now
    slug: vendor.slug,
    name: vendor.name,
    city: vendor.city,
    cover_url: vendor.coverImage,
    min_price: vendor.startingPrice,
    rating: vendor.rating,
    category: categorySlug
  }));

  return NextResponse.json(apiVendors);
}
