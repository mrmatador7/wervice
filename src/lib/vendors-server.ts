import { createClient } from '@/lib/supabase-server';
import { Vendor, VendorFilters } from '@/lib/types/vendor';
import { VALID_CATEGORY_SLUGS } from '@/lib/categories';
import { mockVendors } from '@/data/vendors.mock';

export interface VendorSearchResult {
  vendors: Vendor[];
  total: number;
  currentPage: number;
  totalPages: number;
  filters: VendorFilters;
}

const PAGE_SIZE = 12;

// Transform mock vendor data to match our Vendor interface
function transformMockVendor(mockVendor: any): Vendor {
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
function getVendorsFromMock(filters: VendorFilters = {}): VendorSearchResult {
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

export async function getVendors(filters: VendorFilters = {}): Promise<VendorSearchResult> {
  try {
    const supabase = await createClient();

    console.log('Querying vendors from database with filters:', filters);

    let query = supabase
      .from('vendor_leads')
      .select('*', { count: 'exact' })
      .eq('published', true);

    // Apply category filter (case-insensitive)
    if (filters.category && VALID_CATEGORY_SLUGS.includes(filters.category as any)) {
      query = query.ilike('category', filters.category);
    }

    // Apply city filter (case-insensitive)
    if (filters.city && filters.city !== 'all') {
      query = query.ilike('city', filters.city);
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

    // Apply sorting first
    switch (filters.sort) {
      case 'rating_desc':
        query = query.order('rating', { ascending: false });
        break;
      case 'price_asc':
        query = query.order('starting_price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('starting_price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'relevance':
      default:
        // For relevance, prioritize featured vendors, then by rating, then by creation date
        query = query
          .order('rating', { ascending: false })
          .order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    const currentPage = filters.page || 1;
    const offset = (currentPage - 1) * PAGE_SIZE;
    query = query.range(offset, offset + PAGE_SIZE - 1);

    const { data: vendors, error, count } = await query;

    if (error) {
      console.error('Error fetching vendors from database:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error; // Re-throw to fall back to mock data
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    // Transform database vendors to match our interface
    const transformedVendors = (vendors || []).map((vendor: any) => ({
      id: vendor.id,
      slug: vendor.slug || vendor.business_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      business_name: vendor.business_name,
      category: vendor.category,
      city: vendor.city,
      rating: vendor.rating || 0,
      starting_price: vendor.starting_price || undefined,
      profile_photo_url: vendor.profile_photo_url,
      gallery_urls: vendor.gallery_photos || [],
      description: vendor.description,
      is_featured: vendor.is_featured || false,
      phone: vendor.phone,
      email: vendor.email,
      plan_tier: vendor.plan || 'basic',
      published: vendor.published,
      created_at: vendor.created_at,
    }));

    return {
      vendors: transformedVendors,
      total,
      currentPage,
      totalPages,
      filters,
    };
  } catch (error) {
    console.warn('Database query failed, falling back to mock data:', error);

    // Fall back to mock data with client-side filtering
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
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  try {
    const supabase = await createClient();

    const { data: vendor, error } = await supabase
      .from('vendor_leads')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      // PGRST116 means no rows returned - vendor doesn't exist
      if (error.code === 'PGRST116') {
        console.log(`Vendor with slug "${slug}" not found or not published`);
        return null;
      }
      console.error('Error fetching vendor by slug from database:', error);
      throw error;
    }

    // Transform database vendor to match our interface
    const vendorData = vendor as any;
    return {
      id: vendorData.id,
      slug: vendorData.slug || vendorData.business_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      business_name: vendorData.business_name,
      category: vendorData.category,
      city: vendorData.city,
      rating: vendorData.rating || 0,
      starting_price: vendorData.starting_price || undefined,
      profile_photo_url: vendorData.logo_url,
      gallery_urls: vendorData.gallery_photos || [],
      description: vendorData.description,
      is_featured: vendorData.is_featured || false,
      phone: vendorData.phone,
      email: vendorData.email,
      plan_tier: vendorData.plan_tier || 'basic',
      published: vendorData.published,
      created_at: vendorData.created_at,
    };
  } catch (error) {
    console.warn('Database query failed for vendor:', slug, error);
    return null;
  }
}

export async function getFeaturedVendors(limit: number = 6): Promise<Vendor[]> {
  const supabase = await createClient();

  const { data: vendors, error } = await supabase
    .from('vendor_leads')
    .select('*')
    .eq('published', true)
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured vendors:', error);
    return [];
  }

  // Transform database vendors to match our interface
  const transformedVendors = (vendors || []).map((vendor: any) => ({
    id: vendor.id,
    slug: vendor.slug || vendor.business_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    business_name: vendor.business_name,
    category: vendor.category,
    city: vendor.city,
    rating: vendor.rating || 0,
    starting_price: vendor.starting_price || undefined,
    profile_photo_url: vendor.logo_url,
    gallery_urls: vendor.gallery_photos || [],
    description: vendor.description,
    is_featured: vendor.is_featured || false,
    phone: vendor.phone,
    email: vendor.email,
    plan_tier: vendor.plan_tier || 'basic',
    published: vendor.published,
    created_at: vendor.created_at,
  }));

  return transformedVendors;
}

export async function getVendorCount(): Promise<number> {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from('vendor_leads')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);

    if (error) {
      console.error('Error fetching vendor count from database:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.warn('Database query failed for vendor count');
    return 0;
  }
}

export async function getCategoryVendorCount(category: string): Promise<number> {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from('vendor_leads')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)
      .ilike('category', category);

    if (error) {
      console.error('Error fetching category vendor count from database:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.warn('Database query failed for category count:', category);
    return 0;
  }
}
