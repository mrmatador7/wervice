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

// Wervice categories (11) – slugs used in URLs
export const VENDOR_CATEGORIES = [
  'florist',
  'dresses',
  'venues',
  'beauty',
  'photo-film',
  'caterer',
  'decor',
  'negafa',
  'artist',
  'event-planner',
  'cakes',
] as const;

export type VendorCategory = (typeof VENDOR_CATEGORIES)[number];

// Sort options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating_desc', label: 'Rating (high to low)' },
  { value: 'price_asc', label: 'Price (low to high)' },
  { value: 'price_desc', label: 'Price (high to low)' },
  { value: 'newest', label: 'Newest' }
] as const;

export type SortOption = typeof SORT_OPTIONS[number]['value'];

// Cities available on Wervice (canonical list for filters, forms, and admin)
export const MOROCCAN_CITIES = [
  { value: 'all', label: 'All Cities' },
  { value: 'Marrakech', label: 'Marrakech' },
  { value: 'Casablanca', label: 'Casablanca' },
  { value: 'Fes', label: 'Fes' },
  { value: 'Rabat', label: 'Rabat' },
  { value: 'Tanger', label: 'Tanger' },
  { value: 'Oujda', label: 'Oujda' },
  { value: 'Agadir', label: 'Agadir' },
  { value: 'Meknes', label: 'Meknes' },
  { value: 'Tetouan', label: 'Tetouan' },
  { value: 'Kenitra', label: 'Kenitra' },
  { value: 'El Jadida', label: 'El Jadida' },
  { value: 'Safi', label: 'Safi' },
  { value: 'Laayoune', label: 'Laayoune' },
  { value: 'El Hoceima', label: 'El Hoceima' },
  { value: 'Beni Mellal', label: 'Beni Mellal' },
] as const;

export type MoroccanCity = typeof MOROCCAN_CITIES[number];

type UiLocale = 'en' | 'fr' | 'ar';

const CITY_TRANSLATIONS: Record<string, { fr: string; ar: string }> = {
  'All Cities': { fr: 'Toutes les villes', ar: 'كل المدن' },
  Marrakech: { fr: 'Marrakech', ar: 'مراكش' },
  Casablanca: { fr: 'Casablanca', ar: 'الدار البيضاء' },
  Fes: { fr: 'Fès', ar: 'فاس' },
  Rabat: { fr: 'Rabat', ar: 'الرباط' },
  Tanger: { fr: 'Tanger', ar: 'طنجة' },
  Oujda: { fr: 'Oujda', ar: 'وجدة' },
  Agadir: { fr: 'Agadir', ar: 'أكادير' },
  Meknes: { fr: 'Meknès', ar: 'مكناس' },
  Tetouan: { fr: 'Tétouan', ar: 'تطوان' },
  Kenitra: { fr: 'Kénitra', ar: 'القنيطرة' },
  'El Jadida': { fr: 'El Jadida', ar: 'الجديدة' },
  Safi: { fr: 'Safi', ar: 'آسفي' },
  Laayoune: { fr: 'Laâyoune', ar: 'العيون' },
  'El Hoceima': { fr: 'Al Hoceïma', ar: 'الحسيمة' },
  'Beni Mellal': { fr: 'Béni Mellal', ar: 'بني ملال' },
};

export function localizeCityLabel(city: string, locale: string = 'en'): string {
  const normalized = (locale || 'en').toLowerCase() as UiLocale;
  if (normalized === 'en') return city;
  const translated = CITY_TRANSLATIONS[city];
  if (!translated) return city;
  return translated[normalized] || city;
}

export function getLocalizedMoroccanCities(locale: string = 'en') {
  return MOROCCAN_CITIES.map((city) => ({
    ...city,
    label: localizeCityLabel(city.label, locale),
  }));
}
