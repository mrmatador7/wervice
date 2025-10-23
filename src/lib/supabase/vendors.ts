import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export type VendorFilters = {
  category?: string;
  city?: string;
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
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    let query = supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .eq('published', true);

    // Category filter (case-insensitive using SQL lower function)
    if (filters.category) {
      query = query.ilike('category', filters.category);
    }

    // City filter (case-insensitive using ilike)
    if (filters.city && filters.city !== 'all') {
      query = query.ilike('city', filters.city);
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
        query = query.order('starting_price', { ascending: true, nullsFirst: true });
        break;
      case 'price_desc':
        query = query.order('starting_price', { ascending: false, nullsLast: true });
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

    return {
      vendors: data as Vendor[],
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
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

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

    return data as Category;
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
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from('vendors')
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

