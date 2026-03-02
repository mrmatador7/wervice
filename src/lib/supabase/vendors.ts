import { createClient } from '@/lib/supabase-server';

export type VendorFilters = {
  category?: string | string[]; // Support single or multiple categories
  subcategory?: string | string[]; // Support single or multiple subcategories
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
  gallery_urls?: string[] | null; // Also support gallery_urls for compatibility
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

type VendorLeadListRow = {
  id: string;
  slug: string | null;
  business_name: string;
  category: string;
  city: string;
  logo_url: string | null;
  profile_photo_url: string | null;
  gallery_urls: string[] | null;
  gallery_photos: string[] | null;
  description: string | null;
  published: boolean;
  created_at: string;
  starting_price: number | null;
};

type MediaFileRow = {
  vendor_name: string | null;
  file_key: string;
  mime_type: string | null;
};

function normalizeName(value: string | null | undefined): string {
  return (value || '').trim().toLowerCase();
}

function buildMediaUrl(fileKey: string): string {
  const base = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || 'https://media.wervice.com').replace(/\/+$/, '');
  const encoded = fileKey
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return `${base}/${encoded}`;
}

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

    // Subcategory filter
    if (filters.subcategory) {
      if (Array.isArray(filters.subcategory) && filters.subcategory.length > 0) {
        // Multiple subcategories - use in operator
        query = query.in('subcategory', filters.subcategory);
      } else if (!Array.isArray(filters.subcategory)) {
        // Single subcategory - use eq
        query = query.eq('subcategory', filters.subcategory);
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

    // Transform vendors: ensure slugs and map database fields to expected field names
    const vendorsWithSlugs = ((data || []) as VendorLeadListRow[]).map((vendor) => {
      if (!vendor.slug && vendor.business_name) {
        // Generate slug from business name as fallback
        const baseSlug = vendor.business_name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        vendor.slug = `${baseSlug}-${vendor.id.split('-')[0]}`;
      }
      
      // Map database fields to expected field names
      return {
        ...vendor,
        profile_photo_url: vendor.logo_url || vendor.profile_photo_url || null,
        gallery_photos: vendor.gallery_urls || vendor.gallery_photos || null,
        // Keep both field names for compatibility
        gallery_urls: vendor.gallery_urls || vendor.gallery_photos || null,
      };
    });

    // Bulk-load media files for visible vendors and prefer those R2 URLs
    const vendorNames = vendorsWithSlugs
      .map((v) => v.business_name)
      .filter(Boolean);
    const mediaByName = new Map<string, string[]>();
    if (vendorNames.length > 0) {
      const { data: mediaRows } = await supabase
        .from('media_files')
        .select('vendor_name,file_key,mime_type')
        .in('vendor_name', vendorNames);

      if (Array.isArray(mediaRows) && mediaRows.length > 0) {
        for (const row of mediaRows as MediaFileRow[]) {
          const key = normalizeName(row.vendor_name);
          if (!mediaByName.has(key)) mediaByName.set(key, []);
          if (row.mime_type?.startsWith('image/')) {
            mediaByName.get(key)!.push(buildMediaUrl(row.file_key));
          }
        }
      }
    }

    const vendorsWithMedia = vendorsWithSlugs.map((vendor) => {
      const media = mediaByName.get(normalizeName(vendor.business_name)) || [];
      if (media.length === 0) return vendor;
      return {
        ...vendor,
        profile_photo_url: media[0] || vendor.profile_photo_url || null,
        gallery_photos: media.slice(1),
        gallery_urls: media.slice(1),
      };
    });

    // Filter out vendors that don't have any images (gallery or profile photo)
    const vendorsWithImages = vendorsWithMedia.filter((vendor) => {
      const hasGallery = Array.isArray(vendor.gallery_urls) && vendor.gallery_urls.length > 0;
      const hasGalleryPhotos = Array.isArray(vendor.gallery_photos) && vendor.gallery_photos.length > 0;
      const hasProfilePhoto = vendor.profile_photo_url && vendor.profile_photo_url.trim() && 
                              vendor.profile_photo_url !== 'null' && vendor.profile_photo_url !== 'undefined';
      
      return hasGallery || hasGalleryPhotos || hasProfilePhoto;
    });

    // Update total count to reflect filtered results
    const filteredCount = vendorsWithImages.length;
    const originalCount = count || 0;
    const adjustedTotal = originalCount - (vendorsWithMedia.length - filteredCount);

    return {
      vendors: vendorsWithImages as unknown as Vendor[],
      total: adjustedTotal,
      hasMore: (offset + limit) < adjustedTotal,
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

export type CityStats = {
  city: string;
  vendorCount: number;
  publishedCount: number;
};

/**
 * Fetch all cities with vendor counts (total and published) for admin
 */
export async function fetchCitiesWithStats(): Promise<CityStats[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('vendor_leads')
      .select('city, published');

    if (error) {
      console.error('Error fetching cities with stats:', error);
      return [];
    }

    const byCity = new Map<string, { total: number; published: number }>();
    for (const row of data || []) {
      const city = (row as { city: string; published: boolean }).city;
      if (!city || typeof city !== 'string') continue;
      const current = byCity.get(city) ?? { total: 0, published: 0 };
      current.total += 1;
      if ((row as { published: boolean }).published) current.published += 1;
      byCity.set(city, current);
    }

    const result: CityStats[] = Array.from(byCity.entries())
      .map(([city, counts]) => ({
        city,
        vendorCount: counts.total,
        publishedCount: counts.published,
      }))
      .sort((a, b) => a.city.localeCompare(b.city));

    return result;
  } catch (error) {
    console.error('Database error in fetchCitiesWithStats:', error);
    return [];
  }
}

export type CategoryStats = {
  slug: string;
  label: string;
  dbCategory: string;
  vendorCount: number;
  publishedCount: number;
};

/**
 * Fetch Wervice categories (11) with vendor counts for admin
 */
export async function fetchCategoryStats(): Promise<CategoryStats[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('vendor_leads')
      .select('category, published');

    if (error) {
      console.error('Error fetching category stats:', error);
      return [];
    }

    const byCategory = new Map<string, { total: number; published: number }>();
    for (const row of data || []) {
      const category = (row as { category: string; published: boolean }).category;
      if (!category || typeof category !== 'string') continue;
      const key = category.toLowerCase().trim();
      const current = byCategory.get(key) ?? { total: 0, published: 0 };
      current.total += 1;
      if ((row as { published: boolean }).published) current.published += 1;
      byCategory.set(key, current);
    }

    const { WERVICE_CATEGORIES } = await import('@/lib/categories');
    const result: CategoryStats[] = WERVICE_CATEGORIES.map((c) => {
      const counts = byCategory.get(c.dbCategory) ?? { total: 0, published: 0 };
      return {
        slug: c.slug,
        label: c.label,
        dbCategory: c.dbCategory,
        vendorCount: counts.total,
        publishedCount: counts.published,
      };
    });
    return result;
  } catch (err) {
    console.error('Database error in fetchCategoryStats:', err);
    return [];
  }
}
