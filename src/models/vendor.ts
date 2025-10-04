export type VendorCategory =
  | 'Venues'
  | 'Catering'
  | 'Photo & Video'
  | 'Planning'
  | 'Beauty'
  | 'Decor'
  | 'Music'
  | 'Dresses';

export type VendorCity =
  | 'Casablanca'
  | 'Marrakech'
  | 'Rabat'
  | 'Tangier'
  | 'Agadir'
  | 'Fes'
  | 'Meknes'
  | 'El Jadida'
  | 'Kenitra';

export type Vendor = {
  slug: string;
  name: string;
  category: VendorCategory;
  city: VendorCity;
  coverImage: string;
  gallery?: string[];
  startingPrice?: number; // MAD
  rating?: number; // 0-5
  reviewsCount?: number;
  whatsapp?: string; // E.164 without plus
  featured?: boolean;
  tags?: string[];
  description?: string;
  website?: string;
  email?: string;
};

export type VendorFilters = {
  q?: string; // search query
  city?: VendorCity;
  category?: VendorCategory;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'recommended' | 'rating' | 'price-low' | 'price-high' | 'newest';
  page?: number;
};

export type VendorSortOption = {
  value: VendorFilters['sort'];
  label: string;
};
