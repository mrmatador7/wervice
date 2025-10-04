// Authoritative category to price mapping (single source of truth)
export const categoryPricing: { [key: string]: { name: string; price: number; icon: string } } = {
  'venues': { name: 'Venues', price: 250, icon: '/categories/venues.png' },
  'catering': { name: 'Catering', price: 250, icon: '/categories/Catering.png' },
  'planning': { name: 'Planning', price: 250, icon: '/categories/event planner.png' },
  'photo-video': { name: 'Photo & Video', price: 200, icon: '/categories/photo.png' },
  'music': { name: 'Music', price: 200, icon: '/categories/music.png' },
  'decor': { name: 'Decor', price: 150, icon: '/categories/decor.png' },
  'beauty': { name: 'Beauty', price: 150, icon: '/categories/beauty.png' },
  'dresses': { name: 'Dresses', price: 150, icon: '/categories/Dresses.png' }
};

// Helper function to get price from category slug
export const getPriceFromCategory = (categorySlug: string): number => {
  return categoryPricing[categorySlug]?.price || 0;
};

// Helper function to get category data from slug
export const getCategoryData = (categorySlug: string) => {
  return categoryPricing[categorySlug];
};
