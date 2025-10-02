export type MainCategory = 'venues' | 'catering' | 'dresses' | 'photo-video' | 'event-planner' | 'beauty' | 'decor' | 'music';

export interface Subcategory {
  label: string;
  slug: string;
}

export interface CategoryData {
  label: string;
  slug: string;
  subcategories: Subcategory[];
}

// Main categories with their subcategories
export const CATEGORIES: Record<MainCategory, CategoryData> = {
  venues: {
    label: 'Venues',
    slug: 'venues',
    subcategories: [
      { label: 'Wedding Halls', slug: 'wedding-halls' },
      { label: 'Hotels', slug: 'hotels' },
      { label: 'Gardens', slug: 'gardens' },
      { label: 'Beach Venues', slug: 'beach-venues' },
      { label: 'Historic Sites', slug: 'historic-sites' },
      { label: 'Rooftop', slug: 'rooftop' },
    ],
  },
  catering: {
    label: 'Catering',
    slug: 'catering',
    subcategories: [
      { label: 'Moroccan Cuisine', slug: 'moroccan-cuisine' },
      { label: 'International', slug: 'international' },
      { label: 'Halal', slug: 'halal' },
      { label: 'Vegetarian', slug: 'vegetarian' },
      { label: 'Desserts', slug: 'desserts' },
      { label: 'Drinks', slug: 'drinks' },
    ],
  },
  dresses: {
    label: 'Dresses',
    slug: 'dresses',
    subcategories: [
      { label: 'Bridal Gowns', slug: 'bridal-gowns' },
      { label: 'Wedding Suits', slug: 'wedding-suits' },
      { label: 'Traditional', slug: 'traditional' },
      { label: 'Accessories', slug: 'accessories' },
      { label: 'Alterations', slug: 'alterations' },
    ],
  },
  'photo-video': {
    label: 'Photo & Video',
    slug: 'photo-video',
    subcategories: [
      { label: 'Photographers', slug: 'photographers' },
      { label: 'Videographers', slug: 'videographers' },
      { label: 'Photo Booths', slug: 'photo-booths' },
      { label: 'Drone Services', slug: 'drone-services' },
      { label: 'Photo Editing', slug: 'photo-editing' },
    ],
  },
  'event-planner': {
    label: 'Event Planners',
    slug: 'event-planner',
    subcategories: [
      { label: 'Full Service', slug: 'full-service' },
      { label: 'Day-of Coordination', slug: 'day-of-coordination' },
      { label: 'Ceremony Only', slug: 'ceremony-only' },
      { label: 'Reception Only', slug: 'reception-only' },
    ],
  },
  beauty: {
    label: 'Beauty',
    slug: 'beauty',
    subcategories: [
      { label: 'Hair Styling', slug: 'hair-styling' },
      { label: 'Makeup Artists', slug: 'makeup-artists' },
      { label: 'Nail Services', slug: 'nail-services' },
      { label: 'Spa Services', slug: 'spa-services' },
      { label: 'Tanning', slug: 'tanning' },
    ],
  },
  decor: {
    label: 'Decor',
    slug: 'decor',
    subcategories: [
      { label: 'Florists', slug: 'florists' },
      { label: 'Lighting', slug: 'lighting' },
      { label: 'Table Settings', slug: 'table-settings' },
      { label: 'Balloons', slug: 'balloons' },
      { label: 'Centerpieces', slug: 'centerpieces' },
      { label: 'Backdrops', slug: 'backdrops' },
    ],
  },
  music: {
    label: 'Music',
    slug: 'music',
    subcategories: [
      { label: 'DJs', slug: 'djs' },
      { label: 'Live Bands', slug: 'live-bands' },
      { label: 'String Quartets', slug: 'string-quartets' },
      { label: 'Traditional Music', slug: 'traditional-music' },
      { label: 'Sound Systems', slug: 'sound-systems' },
    ],
  },
};

/**
 * Get subcategories for a main category
 * @param mainCategory - The main category slug
 * @returns Array of subcategories or empty array if category not found
 */
export function getSubcategories(mainCategory?: MainCategory): Subcategory[] {
  if (!mainCategory || !CATEGORIES[mainCategory]) {
    return [];
  }
  return CATEGORIES[mainCategory].subcategories;
}

/**
 * Get category data by slug
 * @param categorySlug - The category slug
 * @returns CategoryData or null if not found
 */
export function getCategoryData(categorySlug: string): CategoryData | null {
  const category = Object.values(CATEGORIES).find(cat => cat.slug === categorySlug);
  return category || null;
}

/**
 * Get all main categories
 * @returns Array of all main category data
 */
export function getAllCategories(): CategoryData[] {
  return Object.values(CATEGORIES);
}
