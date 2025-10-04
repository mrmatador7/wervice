// Query types and interfaces

export interface QueryResult<T> {
  data: T | null;
  error: any;
  count?: number;
}

export interface PaginatedQueryResult<T> extends QueryResult<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface QueryFilters {
  search?: string;
  status?: string;
  type?: string;
  category?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ProfileFilters extends QueryFilters {
  user_type?: 'user' | 'vendor' | 'admin' | 'super_admin';
  user_status?: 'active' | 'inactive' | 'pending' | 'banned';
  city?: string;
  country?: string;
}

export interface CategoryFilters extends QueryFilters {
  is_active?: boolean;
  is_featured?: boolean;
  parent_id?: string;
}

export interface BusinessTypeFilters extends QueryFilters {
  // Add specific filters for business types if needed
}
