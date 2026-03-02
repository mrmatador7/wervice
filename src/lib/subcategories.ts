import { slugToDbCategory } from './categories';

export interface Subcategory {
  name: string;
  slug: string;
}

export interface CategoryWithSubcategories {
  category: string;
  subcategories: Subcategory[];
}

/** URL slug or DB category → subcategories. Keys are DB category values for lookup. */
export const SUBCATEGORIES: CategoryWithSubcategories[] = [
  {
    category: 'venues',
    subcategories: [
      { name: 'Wedding Halls', slug: 'wedding-halls' },
      { name: 'Riads & Villas', slug: 'riads-villas' },
      { name: 'Hotels & Resorts', slug: 'hotels-resorts' },
      { name: 'Beach Venues', slug: 'beach-venues' },
      { name: 'Outdoor Gardens', slug: 'outdoor-gardens' },
      { name: 'Luxury Palaces', slug: 'luxury-palaces' },
      { name: 'Farm & Countryside Venues', slug: 'farm-countryside' },
      { name: 'Rooftop & City View Venues', slug: 'rooftop-city-view' },
    ],
  },
  {
    category: 'catering',
    subcategories: [
      { name: 'Moroccan Cuisine', slug: 'moroccan-cuisine' },
      { name: 'International Cuisine', slug: 'international-cuisine' },
      { name: 'Pastry & Dessert Services', slug: 'pastry-desserts' },
      { name: 'Wedding Cakes', slug: 'wedding-cakes' },
      { name: 'Buffet Service', slug: 'buffet-service' },
      { name: 'Seated Dinner Service', slug: 'seated-dinner' },
      { name: 'Food Trucks', slug: 'food-trucks' },
      { name: 'Beverage & Juice Bars', slug: 'beverage-juice-bars' },
    ],
  },
  {
    category: 'photography',
    subcategories: [
      { name: 'Wedding Photographer', slug: 'wedding-photographer' },
      { name: 'Videographer', slug: 'videographer' },
      { name: 'Drone & Aerial Shoots', slug: 'drone-aerial' },
      { name: 'Pre-Wedding Sessions', slug: 'pre-wedding-sessions' },
      { name: 'Studio Photography', slug: 'studio-photography' },
      { name: 'Instant Photo Booths', slug: 'photo-booths' },
      { name: 'Live Streaming', slug: 'live-streaming' },
      { name: 'Editing & Retouching Services', slug: 'editing-retouching' },
    ],
  },
  {
    category: 'event-planner',
    subcategories: [
      { name: 'Full Wedding Planning', slug: 'full-wedding-planning' },
      { name: 'Day-of Coordination', slug: 'day-of-coordination' },
      { name: 'Destination Wedding Planning', slug: 'destination-wedding' },
      { name: 'Partial Planning', slug: 'partial-planning' },
      { name: 'Decor & Theme Design', slug: 'decor-theme-design' },
      { name: 'Budget & Vendor Management', slug: 'budget-vendor-management' },
      { name: 'Traditional Moroccan Ceremony Specialist', slug: 'moroccan-ceremony' },
      { name: 'Engagement Party Organizer', slug: 'engagement-party' },
    ],
  },
  {
    category: 'beauty',
    subcategories: [
      { name: 'Makeup Artist', slug: 'makeup-artist' },
      { name: 'Hair Stylist', slug: 'hair-stylist' },
      { name: 'Henna Artist', slug: 'henna-artist' },
      { name: 'Nail & Spa Services', slug: 'nail-spa' },
      { name: 'Skin Care & Pre-Wedding Treatments', slug: 'skincare-treatments' },
      { name: 'Barber & Groom Styling', slug: 'barber-groom' },
      { name: 'Beauty Packages for the Bride', slug: 'beauty-packages' },
    ],
  },
  {
    category: 'decor',
    subcategories: [
      { name: 'Floral Design', slug: 'floral-design' },
      { name: 'Lighting & Ambience', slug: 'lighting-ambience' },
      { name: 'Stage Design', slug: 'stage-design' },
      { name: 'Traditional Moroccan Decor', slug: 'moroccan-decor' },
      { name: 'Table & Chair Rentals', slug: 'table-chair-rentals' },
      { name: 'Centerpieces & Balloons', slug: 'centerpieces-balloons' },
      { name: 'Candle & Scents Styling', slug: 'candle-scents' },
    ],
  },
  {
    category: 'music',
    subcategories: [
      { name: 'Moroccan Bands & Artists', slug: 'moroccan-bands' },
      { name: 'DJs', slug: 'djs' },
      { name: 'Gnawa & Traditional Groups', slug: 'gnawa-traditional' },
      { name: 'Andalusian or Classical Music', slug: 'andalusian-classical' },
      { name: 'Sound & Lighting Equipment', slug: 'sound-lighting' },
      { name: 'Wedding MC / Host', slug: 'wedding-mc' },
      { name: 'Zaffa & Entrance Performers', slug: 'zaffa-entrance' },
    ],
  },
  {
    category: 'dresses',
    subcategories: [
      { name: 'Bridal Dresses', slug: 'bridal-dresses' },
      { name: 'Traditional Caftans', slug: 'traditional-caftans' },
      { name: 'Takchita Designers', slug: 'takchita-designers' },
      { name: 'Groom Outfits', slug: 'groom-outfits' },
      { name: 'Dress Rentals', slug: 'dress-rentals' },
      { name: 'Custom Tailoring', slug: 'custom-tailoring' },
      { name: 'Accessories & Jewelry', slug: 'accessories-jewelry' },
    ],
  },
  { category: 'florist', subcategories: [] },
  { category: 'negafa', subcategories: [] },
  { category: 'cakes', subcategories: [] },
];

// Helper: URL slug → subcategories (maps slug to DB category for lookup)
export function getSubcategoriesForCategory(categorySlug: string): Subcategory[] {
  const dbCategory = slugToDbCategory(categorySlug) || categorySlug;
  const categoryData = SUBCATEGORIES.find((c) => c.category === dbCategory);
  return categoryData?.subcategories || [];
}

// Helper function to get subcategory name from slug
export function getSubcategoryName(categorySlug: string, subcategorySlug: string): string | null {
  const subcategories = getSubcategoriesForCategory(categorySlug);
  const subcategory = subcategories.find(s => s.slug === subcategorySlug);
  return subcategory?.name || null;
}

// Helper function to check if a subcategory exists
export function isValidSubcategory(categorySlug: string, subcategorySlug: string): boolean {
  const subcategories = getSubcategoriesForCategory(categorySlug);
  return subcategories.some(s => s.slug === subcategorySlug);
}

