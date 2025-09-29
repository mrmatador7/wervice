import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import type { QueryResult, PaginatedQueryResult, ProfileFilters } from './types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Profiles query functions
 * Handles all database operations related to user profiles
 */

/**
 * Get a single profile by ID
 */
export async function getProfile(id: string): Promise<QueryResult<Profile>> {
  try {
    const { data, error } = await supabase
      .from('public.profiles')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { data: null, error };
  }
}

/**
 * Get profile by email
 */
export async function getProfileByEmail(email: string): Promise<QueryResult<Profile>> {
  try {
    const { data, error } = await supabase
      .from('public.profiles')
      .select('*')
      .eq('email', email)
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error fetching profile by email:', error);
    return { data: null, error };
  }
}

/**
 * Get all profiles with optional filtering and pagination
 */
export async function getProfiles(
  filters: ProfileFilters = {}
): Promise<PaginatedQueryResult<Profile>> {
  try {
    let query = supabase.from('public.profiles').select('*', { count: 'exact' });

    // Apply filters
    if (filters.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
    }

    if (filters.user_type) {
      query = query.eq('user_type', filters.user_type);
    }

    if (filters.user_status) {
      query = query.eq('user_status', filters.user_status);
    }

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters.country) {
      query = query.ilike('country', `%${filters.country}%`);
    }

    // Ordering
    const orderBy = filters.orderBy || 'created_at';
    const orderDirection = filters.orderDirection || 'desc';
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });

    // Pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    const totalPages = count ? Math.ceil(count / limit) : 1;
    const currentPage = Math.floor(offset / limit) + 1;

    return {
      data: data || [],
      error,
      count: count || undefined,
      pagination: {
        page: currentPage,
        limit,
        total: count || 0,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return {
      data: [],
      error,
      pagination: { page: 1, limit: 50, total: 0, totalPages: 1 }
    };
  }
}

/**
 * Create a new profile
 */
export async function createProfile(profile: ProfileInsert): Promise<QueryResult<Profile>> {
  try {
    const { data, error } = await supabase
      .from('public.profiles')
      .insert(profile)
      .select()
      .single();

    if (data) {
      console.log('Profile created successfully:', data.id);
    }

    return { data, error };
  } catch (error) {
    console.error('Error creating profile:', error);
    return { data: null, error };
  }
}

/**
 * Update an existing profile
 */
export async function updateProfile(id: string, updates: ProfileUpdate): Promise<QueryResult<Profile>> {
  try {
    const { data, error } = await supabase
      .from('public.profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (data) {
      console.log('Profile updated successfully:', data.id);
    }

    return { data, error };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
}

/**
 * Upsert a profile (insert or update)
 */
export async function upsertProfile(profile: ProfileInsert): Promise<QueryResult<Profile>> {
  try {
    const { data, error } = await supabase
      .from('public.profiles')
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single();

    if (data) {
      console.log('Profile upserted successfully:', data.id);
    }

    return { data, error };
  } catch (error) {
    console.error('Error upserting profile:', error);
    return { data: null, error };
  }
}

/**
 * Delete a profile (soft delete)
 */
export async function deleteProfile(id: string): Promise<QueryResult<Profile>> {
  try {
    const { data, error } = await supabase
      .from('public.profiles')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (data) {
      console.log('Profile soft deleted successfully:', data.id);
    }

    return { data, error };
  } catch (error) {
    console.error('Error deleting profile:', error);
    return { data: null, error };
  }
}

/**
 * Hard delete a profile (permanent deletion)
 */
export async function hardDeleteProfile(id: string): Promise<QueryResult<null>> {
  try {
    const { error } = await supabase
      .from('public.profiles')
      .delete()
      .eq('id', id);

    if (!error) {
      console.log('Profile hard deleted successfully:', id);
    }

    return { data: null, error };
  } catch (error) {
    console.error('Error hard deleting profile:', error);
    return { data: null, error };
  }
}

/**
 * Get vendor profiles
 */
export async function getVendors(filters: Omit<ProfileFilters, 'user_type'> = {}): Promise<PaginatedQueryResult<Profile>> {
  return getProfiles({ ...filters, user_type: 'vendor' });
}

/**
 * Get active users only
 */
export async function getActiveUsers(filters: Omit<ProfileFilters, 'user_status'> = {}): Promise<PaginatedQueryResult<Profile>> {
  return getProfiles({ ...filters, user_status: 'active' });
}

/**
 * Search profiles by location
 */
export async function searchProfilesByLocation(city?: string, country?: string, limit = 20): Promise<QueryResult<Profile[]>> {
  try {
    let query = supabase
      .from('public.profiles')
      .select('*')
      .eq('user_status', 'active')
      .limit(limit);

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (country) {
      query = query.ilike('country', `%${country}%`);
    }

    const { data, error } = await query;

    return { data, error };
  } catch (error) {
    console.error('Error searching profiles by location:', error);
    return { data: null, error };
  }
}

/**
 * Get profile statistics
 */
export async function getProfileStats(): Promise<QueryResult<{
  total: number;
  active: number;
  vendors: number;
  users: number;
  pending: number;
  banned: number;
}>> {
  try {
    const { data, error } = await supabase
      .from('public.profiles')
      .select('user_type, user_status');

    if (error) {
      return { data: null, error };
    }

    const stats = {
      total: data?.length || 0,
      active: data?.filter(p => p.user_status === 'active').length || 0,
      vendors: data?.filter(p => p.user_type === 'vendor').length || 0,
      users: data?.filter(p => p.user_type === 'user').length || 0,
      pending: data?.filter(p => p.user_status === 'pending').length || 0,
      banned: data?.filter(p => p.user_status === 'banned').length || 0
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error getting profile stats:', error);
    return { data: null, error };
  }
}
