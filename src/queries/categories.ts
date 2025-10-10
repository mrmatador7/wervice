// Database queries for categories and category-specific vendors

import { Vendor } from '@/models/vendor';
import { supabase } from '@/lib/supabase';

// Mock vendor data for categories
const MOCK_VENDORS: Vendor[] = [
  // Venues
  {
    name: 'Riad Dar Moha',
    slug: 'riad-dar-moha',
    category: 'Venues',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop'],
    startingPrice: 25000,
    rating: 4.8,
    reviewsCount: 127,
    featured: true,
    tags: ['Indoor', 'Outdoor', 'Traditional'],
  },
  {
    name: 'Nomad Marrakech',
    slug: 'nomad-marrakech',
    category: 'Venues',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'],
    startingPrice: 35000,
    rating: 4.6,
    reviewsCount: 89,
    featured: false,
    tags: ['Outdoor', 'Modern', 'Panoramic'],
  },
  {
    name: 'Kasbah Wedding Hall',
    slug: 'kasbah-wedding-hall',
    category: 'Venues',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'],
    startingPrice: 18000,
    rating: 4.4,
    reviewsCount: 76,
    featured: false,
    tags: ['Indoor', 'Traditional', 'Elegant'],
  },

  // Catering
  {
    name: 'Authentic Moroccan Kitchen',
    slug: 'authentic-moroccan-kitchen',
    category: 'Catering',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800&h=600&fit=crop'],
    startingPrice: 150,
    rating: 4.9,
    reviewsCount: 203,
    featured: true,
    tags: ['Traditional', 'Moroccan', 'Catering'],
  },
  {
    name: 'Mediterranean Feast',
    slug: 'mediterranean-feast',
    category: 'Catering',
    city: 'Casablanca',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'],
    startingPrice: 200,
    rating: 4.7,
    reviewsCount: 156,
    featured: false,
    tags: ['Fusion', 'Mediterranean', 'Catering'],
  },

  // Photography
  {
    name: 'Desert Dreams Photography',
    slug: 'desert-dreams-photography',
    category: 'Photo & Video',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop'],
    startingPrice: 8000,
    rating: 4.9,
    reviewsCount: 312,
    featured: true,
    tags: ['Photography', 'Cultural', 'Professional'],
  },

  // Beauty
  {
    name: 'Desert Beauty',
    slug: 'desert-beauty',
    category: 'Beauty',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1583393781828-e5c4e7b5f8c9?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1583393781828-e5c4e7b5f8c9?w=800&h=600&fit=crop'],
    startingPrice: 600,
    rating: 4.8,
    reviewsCount: 178,
    featured: false,
    tags: ['Henna', 'Makeup', 'Traditional'],
  },

  // Music
  {
    name: 'Sahara Sounds',
    slug: 'sahara-sounds',
    category: 'Music',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'],
    startingPrice: 7000,
    rating: 4.7,
    reviewsCount: 134,
    featured: false,
    tags: ['Traditional', 'Moroccan', 'Entertainment'],
  },
  {
    name: 'Atlas DJ Services',
    slug: 'atlas-dj-services',
    category: 'Music',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'],
    startingPrice: 8000,
    rating: 4.5,
    reviewsCount: 98,
    featured: false,
    tags: ['DJ', 'Modern', 'Entertainment'],
  },

  // Decor
  {
    name: 'Medina Magic Decor',
    slug: 'medina-magic-decor',
    category: 'Decor',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop'],
    startingPrice: 10000,
    rating: 4.6,
    reviewsCount: 156,
    featured: false,
    tags: ['Floral', 'Traditional', 'Decor'],
  },

  // Planning
  {
    name: 'Desert Dreams Planner',
    slug: 'desert-dreams-planner',
    category: 'Planning',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'],
    startingPrice: 20000,
    rating: 4.8,
    reviewsCount: 203,
    featured: true,
    tags: ['Full Service', 'Planning', 'Coordination'],
  },

  // Dresses
  {
    name: 'Moroccan Bridal Couture',
    slug: 'moroccan-bridal-couture',
    category: 'Dresses',
    city: 'Casablanca',
    coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop'],
    startingPrice: 5000,
    rating: 4.7,
    reviewsCount: 89,
    featured: false,
    tags: ['Traditional', 'Modern', 'Bridal'],
  },
];

export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  cover_image?: string;
  vendor_count?: number;
};

export type VendorFilters = {
  categorySlug: string;
  q?: string;
  city?: string;
  budgetMin?: number;
  budgetMax?: number;
  sort?: "relevance" | "rating" | "price_asc" | "price_desc";
  page?: number;
  pageSize?: number;
};

export type VendorResult = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  category_slug: string;
  city: string;
  city_slug: string;
  price_min?: number;
  price_max?: number;
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
  cover_image?: string;
  gallery?: string[];
  whatsapp?: string;
};

export type PaginatedResult<T> = {
  items: T[];
      pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

// Fallback category data
export const FALLBACK_CATEGORIES: Record<string, CategoryData> = {
  venues: {
    id: 'venues',
    name: 'Wedding Venues',
    slug: 'venues',
    description: 'Find the perfect venue to host your dream wedding ceremony and reception.',
    icon: '/categories/venues.png',
    cover_image: '/images/hero/hero-bg.jpg',
  },
  'photo-video': {
    id: 'photo-video',
    name: 'Photography & Videography',
    slug: 'photo-video',
    description: 'Capture your special moments with professional wedding photographers and videographers.',
    icon: '/categories/photo.png',
    cover_image: '/images/hero/hero-bg.jpg',
  },
  catering: {
    id: 'catering',
    name: 'Catering Services',
    slug: 'catering',
    description: 'Delicious food and beverage services for your wedding reception.',
    icon: '/categories/catering.png',
    cover_image: '/images/hero/hero-bg.jpg',
  },
  planning: {
    id: 'planning',
    name: 'Wedding Planning',
    slug: 'planning',
    description: 'Professional wedding planners to help coordinate your perfect day.',
    icon: '/categories/event planner.png',
    cover_image: '/images/hero/hero-bg.jpg',
  },
  beauty: {
    id: 'beauty',
    name: 'Beauty & Hair',
    slug: 'beauty',
    description: 'Makeup artists and hairstylists for your bridal beauty needs.',
    icon: '/categories/beauty.png',
    cover_image: '/images/hero/hero-bg.jpg',
  },
  decor: {
    id: 'decor',
    name: 'Decor & Styling',
    slug: 'decor',
    description: 'Floral arrangements, lighting, and decor for your wedding venue.',
    icon: '/categories/decor.png',
    cover_image: '/images/hero/hero-bg.jpg',
  },
  music: {
    id: 'music',
    name: 'Music & Entertainment',
    slug: 'music',
    description: 'DJs, live bands, and entertainment for your wedding reception.',
    icon: '/categories/music.png',
    cover_image: '/images/hero/hero-bg.jpg',
  },
  dresses: {
    id: 'dresses',
    name: 'Wedding Dresses',
    slug: 'dresses',
    description: 'Find the perfect wedding dress and bridal attire.',
    icon: '/categories/dresses.png',
    cover_image: '/images/hero/hero-bg.jpg',
  },
};

export async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  // First try database
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, image")
      .eq("slug", slug)
      .single();

    if (!error && data) {
      return {
        ...data,
        description: data.description || undefined,
        icon: data.image,
        cover_image: data.image,
      };
    }
  } catch (error) {
    // Database not available, continue to fallback
  }

  // Fallback to hardcoded data
  return FALLBACK_CATEGORIES[slug] || null;
}

export async function getVendorsByCategory(filters: {
  categorySlug: string;
  q?: string;
  city?: string;
  min?: string;
  max?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  vendors: Vendor[];
  total: number;
  currentPage: number;
  totalPages: number;
}> {
  // Use mock data for now
  let filteredVendors = MOCK_VENDORS.filter(vendor => {
    // Match category by slug - convert category name to slug for comparison
    const categorySlug = vendor.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return categorySlug === filters.categorySlug;
  });

  // Apply city filter
  if (filters.city && filters.city !== 'All Cities') {
    filteredVendors = filteredVendors.filter(vendor =>
      vendor.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  // Apply search filter
  if (filters.q) {
    filteredVendors = filteredVendors.filter(vendor =>
      vendor.name.toLowerCase().includes(filters.q!.toLowerCase()) ||
      vendor.category.toLowerCase().includes(filters.q!.toLowerCase())
    );
  }

  // Apply price filters
  if (filters.min) {
    const minPrice = parseInt(filters.min);
    filteredVendors = filteredVendors.filter(vendor =>
      vendor.startingPrice && vendor.startingPrice >= minPrice
    );
  }

  if (filters.max) {
    const maxPrice = parseInt(filters.max);
    filteredVendors = filteredVendors.filter(vendor =>
      vendor.startingPrice && vendor.startingPrice <= maxPrice
    );
  }

  // Sort vendors
  switch (filters.sort) {
    case "rating":
      filteredVendors.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "price_asc":
      filteredVendors.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
      break;
    case "price_desc":
      filteredVendors.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
      break;
    default: // "best" or "relevance"
      filteredVendors.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });
  }

  // Pagination
  const total = filteredVendors.length;
  const pageSize = filters.pageSize ?? 12;
  const page = filters.page ?? 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const paginatedVendors = filteredVendors.slice(from, to);
  const totalPages = Math.ceil(total / pageSize);

    return {
    vendors: paginatedVendors,
    total,
    currentPage: page,
    totalPages,
  };
}

export async function getAllCategories(): Promise<CategoryData[]> {
  // Return hardcoded categories for now
  return Object.values(FALLBACK_CATEGORIES);
}