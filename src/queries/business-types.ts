import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import type { QueryResult, PaginatedQueryResult, BusinessTypeFilters } from './types';

type BusinessType = Database['public']['Tables']['businesse_types']['Row'];
type BusinessTypeInsert = Database['public']['Tables']['businesse_types']['Insert'];
type BusinessTypeUpdate = Database['public']['Tables']['businesse_types']['Update'];

/**
 * Business Types query functions
 * Handles all database operations related to business types for vendors
 */

/**
 * Get a single business type by ID
 */
export async function getBusinessType(id: string): Promise<QueryResult<BusinessType>> {
  try {
    const { data, error } = await supabase
      .from('businesse_types')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error fetching business type:', error);
    return { data: null, error };
  }
}

/**
 * Get business type by name
 */
export async function getBusinessTypeByName(name: string): Promise<QueryResult<BusinessType>> {
  try {
    const { data, error } = await supabase
      .from('businesse_types')
      .select('*')
      .eq('name', name)
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error fetching business type by name:', error);
    return { data: null, error };
  }
}

/**
 * Get all business types with optional filtering and pagination
 */
export async function getBusinessTypes(
  filters: BusinessTypeFilters = {}
): Promise<PaginatedQueryResult<BusinessType>> {
  try {
    let query = supabase.from('businesse_types').select('*', { count: 'exact' });

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
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
      count,
      pagination: {
        page: currentPage,
        limit,
        total: count || 0,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching business types:', error);
    return {
      data: [],
      error,
      pagination: { page: 1, limit: 50, total: 0, totalPages: 1 }
    };
  }
}

/**
 * Create a new business type
 */
export async function createBusinessType(businessType: BusinessTypeInsert): Promise<QueryResult<BusinessType>> {
  try {
    const { data, error } = await supabase
      .from('businesse_types')
      .insert(businessType)
      .select()
      .single();

    if (data) {
      console.log('Business type created successfully:', data.id);
    }

    return { data, error };
  } catch (error) {
    console.error('Error creating business type:', error);
    return { data: null, error };
  }
}

/**
 * Update an existing business type
 */
export async function updateBusinessType(id: string, updates: BusinessTypeUpdate): Promise<QueryResult<BusinessType>> {
  try {
    const { data, error } = await supabase
      .from('businesse_types')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (data) {
      console.log('Business type updated successfully:', data.id);
    }

    return { data, error };
  } catch (error) {
    console.error('Error updating business type:', error);
    return { data: null, error };
  }
}

/**
 * Delete a business type (soft delete)
 */
export async function deleteBusinessType(id: string): Promise<QueryResult<BusinessType>> {
  try {
    const { data, error } = await supabase
      .from('businesse_types')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (data) {
      console.log('Business type soft deleted successfully:', data.id);
    }

    return { data, error };
  } catch (error) {
    console.error('Error deleting business type:', error);
    return { data: null, error };
  }
}

/**
 * Hard delete a business type (permanent deletion)
 */
export async function hardDeleteBusinessType(id: string): Promise<QueryResult<null>> {
  try {
    const { error } = await supabase
      .from('businesse_types')
      .delete()
      .eq('id', id);

    if (!error) {
      console.log('Business type hard deleted successfully:', id);
    }

    return { data: null, error };
  } catch (error) {
    console.error('Error hard deleting business type:', error);
    return { data: null, error };
  }
}

/**
 * Get business types for vendor profiles
 */
export async function getBusinessTypesForVendors(): Promise<QueryResult<BusinessType[]>> {
  try {
    const { data, error } = await supabase
      .from('businesse_types')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    return { data, error };
  } catch (error) {
    console.error('Error fetching business types for vendors:', error);
    return { data: null, error };
  }
}

/**
 * Search business types
 */
export async function searchBusinessTypes(searchTerm: string, limit = 20): Promise<QueryResult<BusinessType[]>> {
  try {
    const { data, error } = await supabase
      .from('businesse_types')
      .select('*')
      .is('deleted_at', null)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('name', { ascending: true })
      .limit(limit);

    return { data, error };
  } catch (error) {
    console.error('Error searching business types:', error);
    return { data: null, error };
  }
}

/**
 * Get business type statistics
 */
export async function getBusinessTypeStats(): Promise<QueryResult<{
  total: number;
  active: number;
}>> {
  try {
    const { data, error } = await supabase
      .from('businesse_types')
      .select('deleted_at');

    if (error) {
      return { data: null, error };
    }

    const stats = {
      total: data?.length || 0,
      active: data?.filter(bt => !bt.deleted_at).length || 0
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error getting business type stats:', error);
    return { data: null, error };
  }
}
