import { createClient } from '@/lib/supabase-server';

export type VendorFilters = {
  category?: string | string[]; // Support single or multiple categories
  city?: string | string[]; // Support single or multiple cities
  q?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: 'relevance' | 'rating_desc' | 'price_asc' | 'price_desc' | 'newest';
  limit?: number;
  offset?: number;
};

export type Vendor = {
  id: string;
  slug: string;
  business_name: string;
  category: string;
  city: string;
  plan: string | null;
  profile_photo_url: string | null;
  gallery_photos: string[] | null;
  description: string | null;
  published: boolean;
  created_at: string;
  starting_price: number | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  strapline: string | null;
  cover_url: string | null;
};

/**
 * Fetch vendors with filters and pagination
 */
export async function fetchVendors(filters: VendorFilters = {}) {
  try {
    console.log('fetchVendors called with filters:', JSON.stringify(filters, null, 2));
    const supabase = await createClient();

    let query = supabase
      .from('vendor_leads')
      .select('*', { count: 'exact' })
      .eq('published', true);

    // Category filter (case-insensitive)
    if (filters.category) {
      if (Array.isArray(filters.category) && filters.category.length > 0) {
        // Multiple categories - use in operator with lowercase values
        const categories = filters.category.map(c => c.toLowerCase());
        query = query.in('category', categories);
      } else if (!Array.isArray(filters.category)) {
        // Single category - use eq with lowercase
        query = query.eq('category', filters.category.toLowerCase());
      }
    }

    // City filter (exact match - database stores cities with proper capitalization)
    if (filters.city && filters.city !== 'all') {
      if (Array.isArray(filters.city) && filters.city.length > 0) {
        // Multiple cities - use in operator
        query = query.in('city', filters.city);
      } else if (!Array.isArray(filters.city)) {
        // Single city - use eq
        query = query.eq('city', filters.city);
      }
    }

    // Search filter
    if (filters.q) {
      query = query.or(
        `business_name.ilike.%${filters.q}%,description.ilike.%${filters.q}%`
      );
    }

    // Price range filters (only for non-null prices)
    if (filters.priceMin !== undefined && filters.priceMin > 0) {
      query = query.gte('starting_price', filters.priceMin);
    }
    if (filters.priceMax !== undefined && filters.priceMax > 0) {
      query = query.lte('starting_price', filters.priceMax);
    }

    // Sorting
    switch (filters.sort) {
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
        // Default: newest first
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Pagination
    const limit = filters.limit || 24;
    const offset = filters.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }

    console.log('Database query result:', { 
      vendorCount: data?.length || 0, 
      total: count,
      firstVendor: data?.[0] ? { 
        name: data[0].business_name, 
        category: data[0].category,
        city: data[0].city 
      } : null 
    });

    return {
      vendors: data as unknown as Vendor[],
      total: count || 0,
      hasMore: (offset + limit) < (count || 0),
    };
  } catch (error) {
    console.error('Database error in fetchVendors:', error);
    return {
      vendors: [],
      total: 0,
      hasMore: false,
    };
  }
}

/**
 * Fetch category by slug
 */
export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }

    return data as unknown as Category;
  } catch (error) {
    console.error('Database error in fetchCategoryBySlug:', error);
    return null;
  }
}

/**
 * Fetch distinct cities from vendors
 */
export async function fetchCities(): Promise<string[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('vendor_leads')
      .select('city')
      .eq('published', true);

    if (error) {
      console.error('Error fetching cities:', error);
      return [];
    }

    // Get unique cities
    const cities = [...new Set(data.map(v => v.city))].filter(Boolean);
    return cities.sort();
  } catch (error) {
    console.error('Database error in fetchCities:', error);
    return [];
  }
}

