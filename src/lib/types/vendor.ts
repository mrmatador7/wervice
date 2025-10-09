// Vendor-related type definitions for Wervice

export type CurrencyCode = 'MAD' | 'EUR' | 'USD';

export interface Vendor {
  id: string;
  name: string;
  city: string;
  category: string;
  cover: string;
  images?: string[];
  rating: number;
  reviews: number;
  tags: string[];
  priceFromMAD?: number; // base price in Moroccan Dirhams
  isFeatured?: boolean;
  slug: string;
  description?: string;
}

export interface VendorFilters {
  q?: string;
  city?: string;
  min?: number;
  max?: number;
  sort?: 'best' | 'rating' | 'price_asc' | 'price_desc' | 'newest';
  currency?: CurrencyCode;
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
  { value: 'best', label: 'Best match' },
  { value: 'rating', label: 'Rating (high to low)' },
  { value: 'price_asc', label: 'Price (low to high)' },
  { value: 'price_desc', label: 'Price (high to low)' },
  { value: 'newest', label: 'Newest' }
] as const;

export type SortOption = typeof SORT_OPTIONS[number]['value'];

// Moroccan cities for filters
export const MOROCCAN_CITIES = [
  'All Cities',
  'Casablanca',
  'Marrakech',
  'Rabat',
  'Tangier',
  'Agadir',
  'Fès',
  'Meknes',
  'El Jadida',
  'Kenitra',
  'Ouarzazate',
  'Chefchaouen',
  'Essaouira',
  'Salé',
  'Tétouan'
] as const;

export type MoroccanCity = typeof MOROCCAN_CITIES[number];
