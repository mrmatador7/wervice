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
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('vendor_leads')
      .select('id, business_name, slug, category, city, whatsapp, email, profile_description, logo_url, gallery_urls, published, profile_starting_price, starting_price, created_at')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    // Debug logging
    if (error && error.code !== 'PGRST116') {
      console.error('Vendor lookup error:', {
        slug,
        errorCode: error.code,
        errorMessage: error.message,
        errorDetails: error
      });
    }
    
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
    
    if (!data) {
      return null;
    }
    
    // Transform database columns to match VendorDetail type
    return {
      id: data.id,
      business_name: data.business_name,
      slug: data.slug || '',
      category: data.category,
      city: data.city,
      phone: data.whatsapp || null,
      email: data.email || null,
      description: data.profile_description || null,
      profile_photo_url: data.logo_url || null,
      gallery_photos: data.gallery_urls || null,
      plan: null, // plan_tier doesn't exist in vendor_leads
      published: data.published || false,
      starting_price: data.starting_price || data.profile_starting_price ? parseFloat(data.profile_starting_price || '0') : null,
      created_at: data.created_at,
    } as VendorDetail;
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
    const supabase = await createClient();
    
    // Fetch more than needed to prioritize same city
    const { data, error } = await supabase
      .from('vendor_leads')
      .select('id, business_name, slug, category, city, logo_url, gallery_urls, starting_price, profile_starting_price')
      .eq('category', category)
      .eq('published', true)
      .neq('id', currentId)
      .order('created_at', { ascending: false })
      .limit(limit * 2);
    
    if (error || !data) {
      console.error('Error fetching similar vendors:', error);
      return [];
    }
    
    // Transform and prioritize same city, then others
    const typedData = (data || []).map((v: any) => ({
      id: v.id,
      business_name: v.business_name,
      slug: v.slug || '',
      category: v.category,
      city: v.city,
      profile_photo_url: v.logo_url || null,
      gallery_photos: v.gallery_urls || null,
      starting_price: v.starting_price || (v.profile_starting_price ? parseFloat(v.profile_starting_price) : null),
      plan: null, // plan_tier doesn't exist in vendor_leads
    }));
    
    const prioritized = [
      ...typedData.filter(v => v.city?.toLowerCase() === city?.toLowerCase()),
      ...typedData.filter(v => v.city?.toLowerCase() !== city?.toLowerCase()),
    ];
    
    return prioritized.slice(0, limit) as SimilarVendor[];
  } catch (error) {
    console.error('Database error in getSimilarVendors:', error);
    return [];
  }
}

