import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export type VendorDetail = {
  id: string;
  business_name: string;
  slug: string;
  category: string;
  city: string;
  phone: string | null;
  email: string | null;
  description: string | null;
  profile_photo_url: string | null;
  gallery_photos: string[] | null;
  plan: string | null;
  published: boolean;
  starting_price: number | null;
  created_at: string;
};

export type SimilarVendor = {
  id: string;
  business_name: string;
  slug: string;
  category: string;
  city: string;
  profile_photo_url: string | null;
  gallery_photos: string[] | null;
  starting_price: number | null;
  plan: string | null;
};

export async function getVendorBySlug(slug: string): Promise<VendorDetail | null> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    
    const { data, error } = await supabase
      .from('vendors')
      .select('id, business_name, slug, category, city, phone, email, description, profile_photo_url, gallery_photos, plan, published, starting_price, created_at')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    if (error) {
      // PGRST116 means no rows returned - this is expected when vendor doesn't exist
      if (error.code === 'PGRST116') {
        console.log(`Vendor with slug "${slug}" not found or not published`);
        return null;
      }
      // Actual database error
      console.error('Error fetching vendor by slug:', error);
      return null;
    }
    
    return data as VendorDetail;
  } catch (error) {
    console.error('Database error in getVendorBySlug:', error);
    return null;
  }
}

export async function getSimilarVendors(
  category: string,
  city: string,
  currentId: string,
  limit = 4
): Promise<SimilarVendor[]> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    
    // Fetch more than needed to prioritize same city
    const { data, error } = await supabase
      .from('vendors')
      .select('id, business_name, slug, category, city, profile_photo_url, gallery_photos, starting_price, plan')
      .eq('category', category)
      .eq('published', true)
      .neq('id', currentId)
      .order('created_at', { ascending: false })
      .limit(limit * 2);
    
    if (error || !data) {
      console.error('Error fetching similar vendors:', error);
      return [];
    }
    
    // Prioritize same city, then others
    const prioritized = [
      ...data.filter(v => v.city?.toLowerCase() === city?.toLowerCase()),
      ...data.filter(v => v.city?.toLowerCase() !== city?.toLowerCase()),
    ];
    
    return prioritized.slice(0, limit) as SimilarVendor[];
  } catch (error) {
    console.error('Database error in getSimilarVendors:', error);
    return [];
  }
}

