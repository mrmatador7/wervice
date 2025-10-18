import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export interface PublicVendor {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  phone: string;
  email?: string;
  description?: string;
  profile_photo_url?: string;
  gallery_urls?: string[];
  plan_tier: string;
  rating: number;
  published: boolean;
  created_at: string;
}

export async function getVendors(options?: {
  category?: string;
  city?: string;
  limit?: number;
  offset?: number;
}): Promise<PublicVendor[]> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  let query = supabase
    .from('vendors')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (options?.category) {
    query = query.eq('category', options.category.toLowerCase());
  }

  if (options?.city) {
    query = query.eq('city', options.city.toLowerCase());
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }

  return data || [];
}

export async function getVendorBySlug(slug: string): Promise<PublicVendor | null> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching vendor:', error);
    return null;
  }

  return data;
}