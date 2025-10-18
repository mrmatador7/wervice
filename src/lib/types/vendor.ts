// Vendor-related type definitions for Wervice

export type CurrencyCode = 'MAD' | 'EUR' | 'USD';

export interface Vendor {
  id: string;
  slug: string;
  business_name: string;
  category: string;
  city: string;
  rating: number;
  starting_price?: number;
  profile_photo_url?: string;
  gallery_urls?: string[];
  description?: string;
  is_featured?: boolean;
  phone?: string;
  email?: string;
  plan_tier: string;
  published: boolean;
  created_at: string;
}

export interface VendorFilters {
  q?: string;
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: 'relevance' | 'rating_desc' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
}

export interface VendorSearchResult {
  vendors: Vendor[];
  total: number;
  currentPage: number;
  totalPages: number;
  filters: VendorFilters;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  vendorCount?: number;
}

// City data for filters
export interface CityInfo {
  id: string;
  name: string;
  slug: string;
  region?: string;
  vendorCount?: number;
}

// Vendor categories
export const VENDOR_CATEGORIES = [
  'venues',
  'catering',
  'photo-video',
  'planning',
  'beauty',
  'decor',
  'music',
  'dresses'
] as const;

export type VendorCategory = typeof VENDOR_CATEGORIES[number];

// Sort options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating_desc', label: 'Rating (high to low)' },
  { value: 'price_asc', label: 'Price (low to high)' },
  { value: 'price_desc', label: 'Price (high to low)' },
  { value: 'newest', label: 'Newest' }
] as const;

export type SortOption = typeof SORT_OPTIONS[number]['value'];

// Moroccan cities for filters (matches database schema)
export const MOROCCAN_CITIES = [
  { value: 'all', label: 'All Cities' },
  { value: 'marrakech', label: 'Marrakech' },
  { value: 'casablanca', label: 'Casablanca' },
  { value: 'rabat', label: 'Rabat' },
  { value: 'tangier', label: 'Tangier' },
  { value: 'agadir', label: 'Agadir' },
  { value: 'fes', label: 'Fès' },
  { value: 'meknes', label: 'Meknes' },
  { value: 'elJadida', label: 'El Jadida' },
  { value: 'kenitra', label: 'Kenitra' }
] as const;

export type MoroccanCity = typeof MOROCCAN_CITIES[number];
