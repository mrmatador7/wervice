import { NextRequest, NextResponse } from 'next/server';
import { fetchVendors, type VendorFilters } from '@/lib/supabase/vendors';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Normalize city and category to lowercase for case-insensitive comparison
    const cityParam = searchParams.get('city');
    const categoryParam = searchParams.get('category');

    const filters: VendorFilters = {
      q: searchParams.get('q') || undefined,
      city: cityParam ? cityParam.toLowerCase() : undefined,
      category: categoryParam ? categoryParam.toLowerCase() : undefined,
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
