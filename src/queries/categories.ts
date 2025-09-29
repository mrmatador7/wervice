import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import type { QueryResult, PaginatedQueryResult, CategoryFilters } from './types';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

/**
 * Categories query functions
 * Handles all database operations related to wedding categories
 */

/**
 * Get a single category by ID
 */
export async function getCategory(id: string): Promise<QueryResult<Category>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { data: null, error };
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<QueryResult<Category>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return { data: null, error };
  }
}

/**
 * Get all categories with optional filtering and pagination
 */
export async function getCategories(
  filters: CategoryFilters = {}
): Promise<PaginatedQueryResult<Category>> {
  try {
    let query = supabase.from('categories').select('*', { count: 'exact' });

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }

    if (filters.parent_id) {
      query = query.eq('parent_id', filters.parent_id);
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
    console.error('Error fetching categories:', error);
    return {
      data: [],
      error,
      pagination: { page: 1, limit: 50, total: 0, totalPages: 1 }
    };
  }
}

/**
 * Get main categories (no parent)
 */
export async function getMainCategories(filters: Omit<CategoryFilters, 'parent_id'> = {}): Promise<PaginatedQueryResult<Category>> {
  return getCategories({
    ...filters,
    parent_id: null as any // Categories with no parent
  });
}

/**
 * Get subcategories for a parent category
 */
export async function getSubcategories(parentId: string, filters: Omit<CategoryFilters, 'parent_id'> = {}): Promise<PaginatedQueryResult<Category>> {
  return getCategories({
    ...filters,
    parent_id: parentId
  });
}

/**
 * Get featured categories
 */
export async function getFeaturedCategories(limit = 10): Promise<QueryResult<Category[]>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data, error };
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    return { data: null, error };
  }
}

/**
 * Get active categories
 */
export async function getActiveCategories(filters: Omit<CategoryFilters, 'is_active'> = {}): Promise<PaginatedQueryResult<Category>> {
  return getCategories({ ...filters, is_active: true });
}

/**
 * Create a new category
 */
export async function createCategory(category: CategoryInsert): Promise<QueryResult<Category>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (data) {
      console.log('Category created successfully:', data.id);
    }

    return { data, error };
  } catch (error) {
    console.error('Error creating category:', error);
    return { data: null, error };
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(id: string, updates: CategoryUpdate): Promise<QueryResult<Category>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (data) {
      console.log('Category updated successfully:', data.id);
    }

    return { data, error };
  } catch (error) {
    console.error('Error updating category:', error);
    return { data: null, error };
  }
}

/**
 * Delete a category (soft delete)
 */
export async function deleteCategory(id: string): Promise<QueryResult<Category>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (data) {
      console.log('Category soft deleted successfully:', data.id);
    }

    return { data, error };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { data: null, error };
  }
}

/**
 * Hard delete a category (permanent deletion)
 */
export async function hardDeleteCategory(id: string): Promise<QueryResult<null>> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (!error) {
      console.log('Category hard deleted successfully:', id);
    }

    return { data: null, error };
  } catch (error) {
    console.error('Error hard deleting category:', error);
    return { data: null, error };
  }
}

/**
 * Get category hierarchy (parent + children)
 */
export async function getCategoryWithChildren(categoryId: string): Promise<QueryResult<{
  category: Category;
  children: Category[];
}>> {
  try {
    // Get the main category
    const { data: category, error: categoryError } = await getCategory(categoryId);

    if (categoryError || !category) {
      return { data: null, error: categoryError };
    }

    // Get subcategories
    const { data: children } = await getSubcategories(categoryId);

    return {
      data: {
        category,
        children: children || []
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching category with children:', error);
    return { data: null, error };
  }
}

/**
 * Get category statistics
 */
export async function getCategoryStats(): Promise<QueryResult<{
  total: number;
  active: number;
  featured: number;
  withChildren: number;
}>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('is_active, is_featured, parent_id');

    if (error) {
      return { data: null, error };
    }

    const stats = {
      total: data?.length || 0,
      active: data?.filter(c => c.is_active).length || 0,
      featured: data?.filter(c => c.is_featured).length || 0,
      withChildren: data?.filter(c => c.parent_id).length || 0
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error getting category stats:', error);
    return { data: null, error };
  }
}
