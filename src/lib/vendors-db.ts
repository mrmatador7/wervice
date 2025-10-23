import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { VendorFilters } from '@/lib/types/vendor';

const PAGE_SIZE = 12;

export type Vendor = {
  id: string;
  slug: string;
  business_name: string;
  category: string;
  city: string;
  starting_price: number | null;
  profile_photo_url: string | null;
  gallery_photos: string[] | null;
  description: string | null;
  published: boolean;
  created_at: string;
};

export type VendorsResult = {
  vendors: Vendor[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Fetch vendors from database with filters, sorting, and pagination
 */
export async function getVendors(filters: VendorFilters): Promise<VendorsResult> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    let query = supabase
      .from('vendors')
      .select('id, slug, business_name, category, city, starting_price, profile_photo_url, gallery_photos, description, published, created_at', { count: 'exact' })
      .eq('published', true);

    // Apply category filter
    if (filters.category) {
      query = query.eq('category', filters.category);
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

    // Apply sorting (default: newest first)
    const sort = filters.sort || 'newest';
    switch (sort) {
      case 'price_asc':
        query = query.order('starting_price', { ascending: true, nullsLast: true });
        break;
      case 'price_desc':
        query = query.order('starting_price', { ascending: false, nullsLast: true });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Get total count
    const { count } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);

    // Apply pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || PAGE_SIZE;
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data: vendors, error } = await query;

    if (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      vendors: vendors || [],
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    console.error('Database error in getVendors:', error);
    throw error;
  }
}

/**
 * Fetch a single vendor by slug
 */
export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from('vendors')
      .select('id, slug, business_name, category, city, starting_price, profile_photo_url, gallery_photos, description, published, created_at')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching vendor by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error in getVendorBySlug:', error);
    return null;
  }
}

/**
 * Get total vendor count
 */
export async function getVendorCount(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { count, error } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);

    if (error) {
      console.error('Error getting vendor count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Database error in getVendorCount:', error);
    return 0;
  }
}

