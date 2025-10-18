import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { VendorFilters } from '@/lib/types/vendor';
import { VALID_CATEGORY_SLUGS } from '@/lib/categories';
import { mockVendors } from '@/data/vendors.mock';

const PAGE_SIZE = 12;

// Transform mock vendor data to match our Vendor interface
function transformMockVendor(mockVendor: any) {
  return {
    id: mockVendor.slug, // Use slug as ID for mock data
    slug: mockVendor.slug,
    business_name: mockVendor.name,
    category: mockVendor.category,
    city: mockVendor.city,
    rating: mockVendor.rating || 0,
    starting_price: mockVendor.priceRange?.from || undefined,
    profile_photo_url: mockVendor.coverImage,
    gallery_urls: mockVendor.gallery || [],
    description: mockVendor.description,
    is_featured: mockVendor.featured || false,
    phone: mockVendor.phone,
    email: mockVendor.email,
    plan_tier: 'standard', // Default for mock data
    published: true,
    created_at: new Date().toISOString(),
  };
}

// Get vendors from mock data with filtering
function getVendorsFromMock(filters: VendorFilters) {
  let filteredVendors = mockVendors.map(transformMockVendor);

  // Apply category filter
  if (filters.category && VALID_CATEGORY_SLUGS.includes(filters.category as any)) {
    filteredVendors = filteredVendors.filter(v => v.category === filters.category);
  }

  // Apply city filter
  if (filters.city && filters.city !== 'all') {
    filteredVendors = filteredVendors.filter(v => v.city.toLowerCase() === filters.city?.toLowerCase());
  }

  // Apply search query
  if (filters.q) {
    const searchTerm = filters.q.toLowerCase();
    filteredVendors = filteredVendors.filter(v =>
      v.business_name.toLowerCase().includes(searchTerm) ||
      v.description?.toLowerCase().includes(searchTerm)
    );
  }

  // Apply price range filters
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    filteredVendors = filteredVendors.filter(v =>
      v.starting_price && v.starting_price >= filters.minPrice!
    );
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    filteredVendors = filteredVendors.filter(v =>
      v.starting_price && v.starting_price <= filters.maxPrice!
    );
  }

  // Apply rating filter
  if (filters.rating !== undefined && filters.rating > 0) {
    filteredVendors = filteredVendors.filter(v => v.rating >= filters.rating!);
  }

  // Apply sorting
  switch (filters.sort) {
    case 'rating_desc':
      filteredVendors.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'price_asc':
      filteredVendors.sort((a, b) => (a.starting_price || 0) - (b.starting_price || 0));
      break;
    case 'price_desc':
      filteredVendors.sort((a, b) => (b.starting_price || 0) - (a.starting_price || 0));
      break;
    case 'newest':
      filteredVendors.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'relevance':
    default:
      // Sort by rating, then by featured status
      filteredVendors.sort((a, b) => {
        if (a.is_featured !== b.is_featured) {
          return a.is_featured ? -1 : 1;
        }
        return (b.rating || 0) - (a.rating || 0);
      });
      break;
  }

  // Apply pagination
  const currentPage = filters.page || 1;
  const total = filteredVendors.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + PAGE_SIZE);

  return {
    vendors: paginatedVendors,
    total,
    currentPage,
    totalPages,
    filters,
  };
}

export async function GET(request: NextRequest) {
  // In development, use mock data by default for faster development
  // Remove this check when database is properly set up
  if (process.env.NODE_ENV === 'development') {
    console.log('API: Using mock data in development mode');
    const { searchParams } = new URL(request.url);

    const filters: VendorFilters = {
      q: searchParams.get('q') || undefined,
      city: searchParams.get('city') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      sort: (searchParams.get('sort') as VendorFilters['sort']) || 'relevance',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    };

    const result = getVendorsFromMock(filters);
    return NextResponse.json(result);
  }
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { searchParams } = new URL(request.url);

    // Parse filters from query params
    const filters: VendorFilters = {
      q: searchParams.get('q') || undefined,
      city: searchParams.get('city') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      sort: (searchParams.get('sort') as VendorFilters['sort']) || 'relevance',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    };

    let query = supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .eq('published', true);

    // Apply category filter
    if (filters.category && VALID_CATEGORY_SLUGS.includes(filters.category as any)) {
      query = query.eq('category', filters.category);
    }

    // Apply city filter
    if (filters.city && filters.city !== 'all') {
      query = query.eq('city', filters.city);
    }

    // Apply search query
    if (filters.q) {
      query = query.or(`business_name.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
    }

    // Apply price range filters
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      query = query.gte('starting_price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      query = query.lte('starting_price', filters.maxPrice);
    }

    // Apply rating filter
    if (filters.rating !== undefined && filters.rating > 0) {
      query = query.gte('rating', filters.rating);
    }

    // Get total count before pagination
    const { count } = await query.select('*', { count: 'exact', head: true });

    // Apply sorting
    switch (filters.sort) {
      case 'rating_desc':
        query = query.order('rating', { ascending: false });
        break;
      case 'price_asc':
        query = query.order('starting_price', { ascending: true, nullsLast: true });
        break;
      case 'price_desc':
        query = query.order('starting_price', { ascending: false, nullsLast: true });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'relevance':
      default:
        // For relevance, prioritize featured vendors, then by rating, then by creation date
        query = query
          .order('is_featured', { ascending: false })
          .order('rating', { ascending: false })
          .order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    const currentPage = filters.page || 1;
    const offset = (currentPage - 1) * PAGE_SIZE;
    query = query.range(offset, offset + PAGE_SIZE - 1);

    const { data: vendors, error, count: totalCount } = await query;

    if (error) {
      console.error('Error fetching vendors:', error);
      return NextResponse.json(
        { error: 'Failed to fetch vendors', details: error.message },
        { status: 500 }
      );
    }

    const total = totalCount || 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return NextResponse.json({
      vendors: vendors || [],
      total,
      currentPage,
      totalPages,
      filters,
    });
  } catch (error) {
    console.warn('Database query failed, falling back to mock data:', error);

    // Parse filters from query params for fallback
    const { searchParams } = new URL(request.url);
    const filters: VendorFilters = {
      q: searchParams.get('q') || undefined,
      city: searchParams.get('city') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      sort: (searchParams.get('sort') as VendorFilters['sort']) || 'relevance',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    };

    const result = getVendorsFromMock(filters);
    return NextResponse.json(result);
  }
}
