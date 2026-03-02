// Wervice categories (11) – key = dbCategory for API/DB, name = display label
export const categoryPricing: { [key: string]: { name: string; price: number; icon: string } } = {
  florist: { name: 'Florist', price: 150, icon: '/categories/decor.png' },
  dresses: { name: 'Dresses', price: 150, icon: '/categories/Dresses.png' },
  venues: { name: 'Venue', price: 250, icon: '/categories/venues.png' },
  beauty: { name: 'Beauty', price: 150, icon: '/categories/beauty.png' },
  photography: { name: 'Photo & Film', price: 200, icon: '/categories/photo.png' },
  catering: { name: 'Caterer', price: 250, icon: '/categories/Catering.png' },
  decor: { name: 'Decor', price: 150, icon: '/categories/decor.png' },
  negafa: { name: 'Negafa', price: 150, icon: '/categories/beauty.png' },
  music: { name: 'Artist', price: 200, icon: '/categories/music.png' },
  planning: { name: 'Event Planner', price: 250, icon: '/categories/event planner.png' },
  cakes: { name: 'Cakes', price: 150, icon: '/categories/Catering.png' },
};

export const getPriceFromCategory = (categorySlug: string): number => {
  return categoryPricing[categorySlug]?.price ?? 0;
};

export const getCategoryData = (categorySlug: string) => {
  return categoryPricing[categorySlug];
};
