export type ListingItem = {
  id: string;
  name: string;
  city: string;
  category: string;
  coverImage: string;
  categoryImage?: string;
  rating?: number;
  priceFrom?: number;
  isFavorite?: boolean;
};

// Mock category images (using generic icons for now)
const categoryImages: Record<string, string> = {
  'Venues': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=40&h=40&fit=crop&crop=center',
  'Catering': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=40&h=40&fit=crop&crop=center',
  'Photo & Video': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=40&h=40&fit=crop&crop=center',
  'Event Planner': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=40&h=40&fit=crop&crop=center',
  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=40&h=40&fit=crop&crop=center',
  'Decor': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=40&h=40&fit=crop&crop=center',
  'Music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop&crop=center',
  'Dresses': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=40&h=40&fit=crop&crop=center',
};

export const mockListings: ListingItem[] = [
  {
    id: '1',
    name: 'Palais des Congrès',
    city: 'Casablanca',
    category: 'Venues',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Venues'],
    rating: 4.8,
    priceFrom: 15000,
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Dar Moha',
    city: 'Marrakech',
    category: 'Venues',
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Venues'],
    rating: 4.9,
    priceFrom: 25000,
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Studio Lumière',
    city: 'Rabat',
    category: 'Photo & Video',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Photo & Video'],
    rating: 4.7,
    priceFrom: 3500,
  },
  {
    id: '4',
    name: 'Chefs Marocains',
    city: 'Tangier',
    category: 'Catering',
    coverImage: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Catering'],
    rating: 4.6,
    priceFrom: 8000,
  },
  {
    id: '5',
    name: 'Wedding Dreams Co.',
    city: 'Agadir',
    category: 'Event Planner',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Event Planner'],
    rating: 4.8,
    priceFrom: 12000,
  },
  {
    id: '6',
    name: 'Belle Mariée',
    city: 'Fes',
    category: 'Dresses',
    coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Dresses'],
    rating: 4.9,
    priceFrom: 1500,
  },
  {
    id: '7',
    name: 'Glow Beauty Studio',
    city: 'Meknes',
    category: 'Beauty',
    coverImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Beauty'],
    rating: 4.7,
    priceFrom: 800,
  },
  {
    id: '8',
    name: 'Moroccan Elegance',
    city: 'El Jadida',
    category: 'Decor',
    coverImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Decor'],
    rating: 4.5,
    priceFrom: 6000,
  },
  {
    id: '9',
    name: 'Atlas Orchestra',
    city: 'Casablanca',
    category: 'Music',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Music'],
    rating: 4.8,
    priceFrom: 4500,
  },
  {
    id: '10',
    name: 'Royal Palace Venue',
    city: 'Rabat',
    category: 'Venues',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Venues'],
    rating: 4.9,
    priceFrom: 30000,
  },
  {
    id: '11',
    name: 'Traditional Tagine Catering',
    city: 'Marrakech',
    category: 'Catering',
    coverImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b7ef?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Catering'],
    rating: 4.8,
    priceFrom: 9500,
  },
  {
    id: '12',
    name: 'Golden Moments Photography',
    city: 'Tangier',
    category: 'Photo & Video',
    coverImage: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Photo & Video'],
    rating: 4.9,
    priceFrom: 5000,
  },
  {
    id: '13',
    name: 'Desert Rose Events',
    city: 'Agadir',
    category: 'Event Planner',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Event Planner'],
    rating: 4.7,
    priceFrom: 10000,
  },
  {
    id: '14',
    name: 'Mediterranean Beauty',
    city: 'Fes',
    category: 'Beauty',
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Beauty'],
    rating: 4.6,
    priceFrom: 600,
  },
  {
    id: '15',
    name: 'Andalusian Decor',
    city: 'Meknes',
    category: 'Decor',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Decor'],
    rating: 4.8,
    priceFrom: 7500,
  },
  {
    id: '16',
    name: 'Sahara Wedding Band',
    city: 'El Jadida',
    category: 'Music',
    coverImage: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=320&h=460&fit=crop',
    categoryImage: categoryImages['Music'],
    rating: 4.7,
    priceFrom: 3800,
  },
];

// Fixed set of listings for homepage to ensure SSR consistency
export const homepageListings: ListingItem[] = [
  mockListings[0], // Palais des Congrès
  mockListings[2], // Studio Lumière
  mockListings[4], // Wedding Dreams Co.
  mockListings[6], // Glow Beauty Studio
  mockListings[8], // Atlas Orchestra
  mockListings[10], // Traditional Tagine Catering
  mockListings[12], // Desert Rose Events
  mockListings[14], // Andalusian Decor
];

// Function to get randomized listings (can be called upstream or inside component)
export function getRandomListings(count: number = 16): ListingItem[] {
  const shuffled = [...mockListings].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, mockListings.length));
}
