'use client';

import CategoryRail from './CategoryRail';

type ListingItem = {
  id: string;
  name: string;
  city: string;
  category: string;
  coverImage: string;
  avatarImage?: string;
  rating?: number;
  priceFrom?: number;
  isFavorite?: boolean;
};

type CategoryKey = "venues" | "catering" | "photo-video" | "planning" | "beauty" | "decor" | "music" | "dresses";

interface CategoryRailsProps {
  data?: Record<CategoryKey, ListingItem[]>;
  title?: string;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

// Mock data for all categories
const mockCategoryData: Record<CategoryKey, ListingItem[]> = {
  venues: [
    {
      id: 'v1',
      name: 'Palais des Congrès',
      city: 'Casablanca',
      category: 'venues',
      coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop',
      rating: 4.8,
      priceFrom: 15000,
    },
    {
      id: 'v2',
      name: 'Dar Moha',
      city: 'Marrakech',
      category: 'venues',
      coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      rating: 4.9,
      priceFrom: 25000,
    },
    {
      id: 'v3',
      name: 'Royal Palace',
      city: 'Rabat',
      category: 'venues',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      rating: 4.9,
      priceFrom: 30000,
    },
    {
      id: 'v4',
      name: 'Garden Villa',
      city: 'Tangier',
      category: 'venues',
      coverImage: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop',
      rating: 4.7,
      priceFrom: 12000,
    },
    {
      id: 'v5',
      name: 'Desert Oasis',
      city: 'Agadir',
      category: 'venues',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      rating: 4.6,
      priceFrom: 18000,
    },
  ],
  catering: [
    {
      id: 'c1',
      name: 'Traditional Tagine',
      city: 'Marrakech',
      category: 'catering',
      coverImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b7ef?w=400&h=300&fit=crop',
      rating: 4.8,
      priceFrom: 9500,
    },
    {
      id: 'c2',
      name: 'Chefs Marocains',
      city: 'Casablanca',
      category: 'catering',
      coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      rating: 4.6,
      priceFrom: 8000,
    },
    {
      id: 'c3',
      name: 'Mediterranean Feast',
      city: 'Tangier',
      category: 'catering',
      coverImage: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop',
      rating: 4.7,
      priceFrom: 7500,
    },
    {
      id: 'c4',
      name: 'Royal Cuisine',
      city: 'Rabat',
      category: 'catering',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      rating: 4.9,
      priceFrom: 12000,
    },
  ],
  "photo-video": [
    {
      id: 'pv1',
      name: 'Golden Moments',
      city: 'Casablanca',
      category: 'photo-video',
      coverImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      rating: 4.9,
      priceFrom: 5000,
    },
    {
      id: 'pv2',
      name: 'Studio Lumière',
      city: 'Rabat',
      category: 'photo-video',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      rating: 4.7,
      priceFrom: 3500,
    },
    {
      id: 'pv3',
      name: 'Desert Lens',
      city: 'Marrakech',
      category: 'photo-video',
      coverImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b7ef?w=400&h=300&fit=crop',
      rating: 4.8,
      priceFrom: 4500,
    },
    {
      id: 'pv4',
      name: 'Coastal Capture',
      city: 'Tangier',
      category: 'photo-video',
      coverImage: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop',
      rating: 4.6,
      priceFrom: 3800,
    },
  ],
  planning: [
    {
      id: 'p1',
      name: 'Wedding Dreams Co.',
      city: 'Casablanca',
      category: 'planning',
      coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      rating: 4.8,
      priceFrom: 12000,
    },
    {
      id: 'p2',
      name: 'Desert Rose Events',
      city: 'Marrakech',
      category: 'planning',
      coverImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b7ef?w=400&h=300&fit=crop',
      rating: 4.7,
      priceFrom: 10000,
    },
    {
      id: 'p3',
      name: 'Moroccan Magic',
      city: 'Rabat',
      category: 'planning',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      rating: 4.9,
      priceFrom: 15000,
    },
  ],
  beauty: [
    {
      id: 'b1',
      name: 'Glow Beauty Studio',
      city: 'Casablanca',
      category: 'beauty',
      coverImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
      rating: 4.7,
      priceFrom: 800,
    },
    {
      id: 'b2',
      name: 'Mediterranean Beauty',
      city: 'Marrakech',
      category: 'beauty',
      coverImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
      rating: 4.6,
      priceFrom: 600,
    },
    {
      id: 'b3',
      name: 'Desert Rose Spa',
      city: 'Agadir',
      category: 'beauty',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      rating: 4.8,
      priceFrom: 700,
    },
  ],
  decor: [
    {
      id: 'd1',
      name: 'Moroccan Elegance',
      city: 'Casablanca',
      category: 'decor',
      coverImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      rating: 4.8,
      priceFrom: 6000,
    },
    {
      id: 'd2',
      name: 'Andalusian Decor',
      city: 'Fes',
      category: 'decor',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      rating: 4.7,
      priceFrom: 7500,
    },
    {
      id: 'd3',
      name: 'Traditional Touches',
      city: 'Meknes',
      category: 'decor',
      coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      rating: 4.6,
      priceFrom: 5500,
    },
  ],
  music: [
    {
      id: 'm1',
      name: 'Atlas Orchestra',
      city: 'Casablanca',
      category: 'music',
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      rating: 4.8,
      priceFrom: 4500,
    },
    {
      id: 'm2',
      name: 'Sahara Wedding Band',
      city: 'Marrakech',
      category: 'music',
      coverImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b7ef?w=400&h=300&fit=crop',
      rating: 4.7,
      priceFrom: 3800,
    },
    {
      id: 'm3',
      name: 'Mediterranean Melodies',
      city: 'Tangier',
      category: 'music',
      coverImage: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop',
      rating: 4.6,
      priceFrom: 3200,
    },
  ],
  dresses: [
    {
      id: 'dr1',
      name: 'Belle Mariée',
      city: 'Casablanca',
      category: 'dresses',
      coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop',
      rating: 4.9,
      priceFrom: 1500,
    },
    {
      id: 'dr2',
      name: 'Traditional Touches',
      city: 'Marrakech',
      category: 'dresses',
      coverImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b7ef?w=400&h=300&fit=crop',
      rating: 4.8,
      priceFrom: 1200,
    },
    {
      id: 'dr3',
      name: 'Moroccan Couture',
      city: 'Rabat',
      category: 'dresses',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      rating: 4.7,
      priceFrom: 1800,
    },
  ],
};

const categories = [
  { key: 'venues' as CategoryKey, title: 'Venues', slug: 'venues' },
  { key: 'catering' as CategoryKey, title: 'Catering', slug: 'catering' },
  { key: 'photo-video' as CategoryKey, title: 'Photo & Video', slug: 'photo-video' },
  { key: 'planning' as CategoryKey, title: 'Planning', slug: 'planning' },
  { key: 'beauty' as CategoryKey, title: 'Beauty', slug: 'beauty' },
  { key: 'decor' as CategoryKey, title: 'Decor', slug: 'decor' },
  { key: 'music' as CategoryKey, title: 'Music', slug: 'music' },
  { key: 'dresses' as CategoryKey, title: 'Dresses', slug: 'dresses' },
];

export default function CategoryRails({
  data = mockCategoryData,
  title = "Explore by Category",
  onToggleFavorite
}: CategoryRailsProps) {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 bg-[#F7F8FB]">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Discover amazing wedding vendors across all categories
          </p>
        </div>

        {/* Category Rails */}
        <div className="space-y-10 md:space-y-12">
          {categories.map(({ key, title, slug }) => (
            <CategoryRail
              key={key}
              title={title}
              slug={slug}
              items={data[key] || []}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
