import { NextRequest, NextResponse } from 'next/server';
import { fetchVendors, type VendorFilters } from '@/lib/supabase/vendors';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Handle multiple city and category parameters
    const cityParams = searchParams.getAll('city');
    const categoryParams = searchParams.getAll('category');

    // Don't convert to lowercase - keep original case for proper matching
    const cities = cityParams.length > 0 ? cityParams : undefined;
    const categories = categoryParams.length > 0 ? categoryParams.map(c => c.toLowerCase()) : undefined;

    const filters: VendorFilters = {
      q: searchParams.get('q') || undefined,
      city: cities && cities.length > 1 ? cities : cities?.[0], // Single value or array
      category: categories && categories.length > 1 ? categories : categories?.[0], // Single value or array
      priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
      sort: (searchParams.get('sort') as VendorFilters['sort']) || 'newest',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 24,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };

    const result = await fetchVendors(filters);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error fetching vendors:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch vendors',
        details: error?.message || 'Unknown error',
        vendors: [],
        total: 0,
        hasMore: false,
      },
      { status: 500 }
    );
  }
}
