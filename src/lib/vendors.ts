import { Vendor, VendorCategory, VendorCity, VendorFilters, VendorSortOption } from '@/models/vendor';

export type { Vendor, VendorFilters, VendorCity, VendorCategory };

export const VENDOR_CATEGORIES: VendorCategory[] = [
  'Venues', 'Catering', 'Photo & Video', 'Planning', 'Beauty', 'Decor', 'Music', 'Dresses'
];

export const VENDOR_CITIES: VendorCity[] = [
  'Casablanca', 'Marrakech', 'Rabat', 'Tangier', 'Agadir', 'Fes', 'Meknes', 'El Jadida', 'Kenitra'
];

export const SORT_OPTIONS: VendorSortOption[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Rating' },
  { value: 'price-low', label: 'Price (Low to High)' },
  { value: 'price-high', label: 'Price (High to Low)' },
  { value: 'newest', label: 'Newest' }
];

export const vendors: Vendor[] = [
  // Marrakech Venues
  {
    slug: 'riad-dar-moha',
    name: 'Riad Dar Moha',
    category: 'Venues',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop'
    ],
    startingPrice: 25000,
    rating: 4.8,
    reviewsCount: 127,
    whatsapp: '212661234567',
    featured: true,
    tags: ['Traditional', 'Popular', 'WhatsApp'],
    description: 'Stunning traditional riad in the heart of Marrakech with authentic Moroccan architecture.'
  },
  {
    slug: 'nomad-marrakech',
    name: 'Nomad Marrakech',
    category: 'Venues',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
    startingPrice: 35000,
    rating: 4.6,
    reviewsCount: 89,
    whatsapp: '212662345678',
    tags: ['Modern', 'Rooftop', 'New'],
    description: 'Contemporary venue with panoramic views of the Medina.'
  },

  // Casablanca Catering
  {
    slug: 'authentic-moroccan-kitchen',
    name: 'Authentic Moroccan Kitchen',
    category: 'Catering',
    city: 'Casablanca',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    startingPrice: 150,
    rating: 4.9,
    reviewsCount: 203,
    whatsapp: '212663456789',
    featured: true,
    tags: ['Traditional', 'Popular', 'WhatsApp'],
    description: 'Award-winning traditional Moroccan cuisine with modern presentation.'
  },
  {
    slug: 'fusion-feast',
    name: 'Fusion Feast',
    category: 'Catering',
    city: 'Casablanca',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    startingPrice: 200,
    rating: 4.7,
    reviewsCount: 156,
    whatsapp: '212664567890',
    tags: ['Fusion', 'Modern', 'WhatsApp'],
    description: 'Creative fusion of Moroccan and international cuisines.'
  },

  // Rabat Photo & Video
  {
    slug: 'medina-memories',
    name: 'Medina Memories',
    category: 'Photo & Video',
    city: 'Rabat',
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop',
    startingPrice: 8000,
    rating: 4.8,
    reviewsCount: 94,
    whatsapp: '212665678901',
    tags: ['Photo', 'Video', 'WhatsApp'],
    description: 'Capturing authentic Moroccan wedding moments with artistic flair.'
  },
  {
    slug: 'royal-portraits',
    name: 'Royal Portraits',
    category: 'Photo & Video',
    city: 'Rabat',
    coverImage: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop',
    startingPrice: 12000,
    rating: 4.5,
    reviewsCount: 67,
    whatsapp: '212666789012',
    tags: ['Photo', 'Traditional', 'WhatsApp'],
    description: 'Specializing in traditional Moroccan wedding photography.'
  },

  // Tangier Planning
  {
    slug: 'mediterranean-matrimony',
    name: 'Mediterranean Matrimony',
    category: 'Planning',
    city: 'Tangier',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    startingPrice: 15000,
    rating: 4.9,
    reviewsCount: 178,
    whatsapp: '212667890123',
    featured: true,
    tags: ['Planning', 'Full Service', 'WhatsApp'],
    description: 'Comprehensive wedding planning with a Mediterranean touch.'
  },

  // Agadir Beauty
  {
    slug: 'henna-heaven',
    name: 'Henna Heaven',
    category: 'Beauty',
    city: 'Agadir',
    coverImage: 'https://images.unsplash.com/photo-1583393781828-e5c4e7b5f8c9?w=800&h=600&fit=crop',
    startingPrice: 500,
    rating: 4.7,
    reviewsCount: 134,
    whatsapp: '212668901234',
    tags: ['Henna', 'Beauty', 'WhatsApp'],
    description: 'Traditional Moroccan henna artistry for your special day.'
  },

  // Fes Decor
  {
    slug: 'medina-magic-decor',
    name: 'Medina Magic Decor',
    category: 'Decor',
    city: 'Fes',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    startingPrice: 8000,
    rating: 4.6,
    reviewsCount: 89,
    whatsapp: '212669012345',
    tags: ['Decor', 'Traditional', 'WhatsApp'],
    description: 'Authentic Moroccan decor and styling for unforgettable weddings.'
  },

  // Meknes Music
  {
    slug: 'sahara-sounds',
    name: 'Sahara Sounds',
    category: 'Music',
    city: 'Meknes',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    startingPrice: 6000,
    rating: 4.8,
    reviewsCount: 112,
    whatsapp: '212670123456',
    tags: ['Music', 'Traditional', 'WhatsApp'],
    description: 'Traditional Moroccan music and entertainment for your celebration.'
  },

  // El Jadida Dresses
  {
    slug: 'coastal-couture',
    name: 'Coastal Couture',
    category: 'Dresses',
    city: 'El Jadida',
    coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop',
    startingPrice: 3000,
    rating: 4.7,
    reviewsCount: 98,
    whatsapp: '212671234567',
    tags: ['Dresses', 'Modern', 'WhatsApp'],
    description: 'Contemporary wedding dresses with Moroccan influences.'
  },

  // Additional vendors for variety
  {
    slug: 'kasbah-wedding-hall',
    name: 'Kasbah Wedding Hall',
    category: 'Venues',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
    startingPrice: 18000,
    rating: 4.4,
    reviewsCount: 76,
    whatsapp: '212672345678',
    tags: ['Hall', 'Modern', 'WhatsApp']
  },
  {
    slug: 'ocean-view-catering',
    name: 'Ocean View Catering',
    category: 'Catering',
    city: 'Agadir',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    startingPrice: 180,
    rating: 4.5,
    reviewsCount: 87,
    whatsapp: '212673456789',
    tags: ['Seafood', 'Modern', 'WhatsApp']
  },
  {
    slug: 'imperial-photography',
    name: 'Imperial Photography',
    category: 'Photo & Video',
    city: 'Fes',
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop',
    startingPrice: 10000,
    rating: 4.6,
    reviewsCount: 145,
    whatsapp: '212674567890',
    tags: ['Photo', 'Video', 'Imperial']
  },
  {
    slug: 'desert-dreams-planner',
    name: 'Desert Dreams Planner',
    category: 'Planning',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    startingPrice: 20000,
    rating: 4.8,
    reviewsCount: 203,
    whatsapp: '212675678901',
    featured: true,
    tags: ['Planning', 'Luxury', 'WhatsApp']
  },
  {
    slug: 'moroccan-makeup-artist',
    name: 'Moroccan Makeup Artist',
    category: 'Beauty',
    city: 'Casablanca',
    coverImage: 'https://images.unsplash.com/photo-1583393781828-e5c4e7b5f8c9?w=800&h=600&fit=crop',
    startingPrice: 800,
    rating: 4.7,
    reviewsCount: 167,
    whatsapp: '212676789012',
    tags: ['Makeup', 'Hair', 'WhatsApp']
  },
  {
    slug: 'palace-decor',
    name: 'Palace Decor',
    category: 'Decor',
    city: 'Rabat',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    startingPrice: 12000,
    rating: 4.9,
    reviewsCount: 134,
    whatsapp: '212677890123',
    tags: ['Luxury', 'Decor', 'WhatsApp']
  },
  {
    slug: 'atlas-dj-services',
    name: 'Atlas DJ Services',
    category: 'Music',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    startingPrice: 8000,
    rating: 4.5,
    reviewsCount: 98,
    whatsapp: '212678901234',
    tags: ['DJ', 'Modern', 'WhatsApp']
  },
  {
    slug: 'traditional-kaftans',
    name: 'Traditional Kaftans',
    category: 'Dresses',
    city: 'Fes',
    coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop',
    startingPrice: 2000,
    rating: 4.6,
    reviewsCount: 112,
    whatsapp: '212679012345',
    tags: ['Traditional', 'Kaftan', 'WhatsApp']
  },
  {
    slug: 'souk-venue',
    name: 'Souk Venue',
    category: 'Venues',
    city: 'Fes',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    startingPrice: 15000,
    rating: 4.3,
    reviewsCount: 67,
    whatsapp: '212680123456',
    tags: ['Traditional', 'Souk', 'WhatsApp']
  },
  {
    slug: 'medina-catering',
    name: 'Medina Catering',
    category: 'Catering',
    city: 'Fes',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    startingPrice: 120,
    rating: 4.4,
    reviewsCount: 89,
    whatsapp: '212681234567',
    tags: ['Traditional', 'Local', 'WhatsApp']
  },
  {
    slug: 'coastal-cameraman',
    name: 'Coastal Cameraman',
    category: 'Photo & Video',
    city: 'Agadir',
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop',
    startingPrice: 9000,
    rating: 4.7,
    reviewsCount: 123,
    whatsapp: '212682345678',
    tags: ['Photo', 'Beach', 'WhatsApp']
  },
  {
    slug: 'wedding-whisperer',
    name: 'Wedding Whisperer',
    category: 'Planning',
    city: 'Casablanca',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    startingPrice: 18000,
    rating: 4.9,
    reviewsCount: 245,
    whatsapp: '212683456789',
    featured: true,
    tags: ['Planning', 'Luxury', 'WhatsApp']
  },
  {
    slug: 'desert-beauty',
    name: 'Desert Beauty',
    category: 'Beauty',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1583393781828-e5c4e7b5f8c9?w=800&h=600&fit=crop',
    startingPrice: 600,
    rating: 4.8,
    reviewsCount: 178,
    whatsapp: '212684567890',
    tags: ['Beauty', 'Natural', 'WhatsApp']
  },
  {
    slug: 'medina-magic-decor-marrakech',
    name: 'Medina Magic Decor',
    category: 'Decor',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    startingPrice: 10000,
    rating: 4.6,
    reviewsCount: 156,
    whatsapp: '212685678901',
    tags: ['Decor', 'Traditional', 'WhatsApp']
  },
  {
    slug: 'sahara-sounds-marrakech',
    name: 'Sahara Sounds',
    category: 'Music',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    startingPrice: 7000,
    rating: 4.7,
    reviewsCount: 134,
    whatsapp: '212686789012',
    tags: ['Music', 'Traditional', 'WhatsApp']
  },
  {
    slug: 'modern-bride-dresses',
    name: 'Modern Bride Dresses',
    category: 'Dresses',
    city: 'Rabat',
    coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop',
    startingPrice: 4000,
    rating: 4.5,
    reviewsCount: 89,
    whatsapp: '212687890123',
    tags: ['Modern', 'Bridal', 'WhatsApp']
  },
  {
    slug: 'tangier-terrace-venue',
    name: 'Tangier Terrace Venue',
    category: 'Venues',
    city: 'Tangier',
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
    startingPrice: 22000,
    rating: 4.6,
    reviewsCount: 98,
    whatsapp: '212688901234',
    tags: ['Terrace', 'Ocean View', 'WhatsApp']
  },
  {
    slug: 'mediterranean-feast',
    name: 'Mediterranean Feast',
    category: 'Catering',
    city: 'Tangier',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    startingPrice: 160,
    rating: 4.6,
    reviewsCount: 112,
    whatsapp: '212689012345',
    tags: ['Mediterranean', 'Fresh', 'WhatsApp']
  },
  {
    slug: 'meknes-memories-photography',
    name: 'Meknes Memories Photography',
    category: 'Photo & Video',
    city: 'Meknes',
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop',
    startingPrice: 8500,
    rating: 4.4,
    reviewsCount: 76,
    whatsapp: '212690123456',
    tags: ['Photo', 'Memories', 'WhatsApp']
  },
  {
    slug: 'el-jadida-event-planner',
    name: 'El Jadida Event Planner',
    category: 'Planning',
    city: 'El Jadida',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    startingPrice: 12000,
    rating: 4.5,
    reviewsCount: 87,
    whatsapp: '212691234567',
    tags: ['Planning', 'Coastal', 'WhatsApp']
  },
  {
    slug: 'kenitra-kouture',
    name: 'Kenitra Kouture',
    category: 'Beauty',
    city: 'Kenitra',
    coverImage: 'https://images.unsplash.com/photo-1583393781828-e5c4e7b5f8c9?w=800&h=600&fit=crop',
    startingPrice: 550,
    rating: 4.3,
    reviewsCount: 65,
    whatsapp: '212692345678',
    tags: ['Beauty', 'Local', 'WhatsApp']
  }
];

// Helper functions
export function getAllVendors(): Vendor[] {
  return vendors;
}

export function getVendorBySlug(slug: string): Vendor | undefined {
  return vendors.find(vendor => vendor.slug === slug);
}

export function getFeaturedVendors(): Vendor[] {
  return vendors.filter(vendor => vendor.featured);
}

export function getVendorsByCategory(category: VendorCategory): Vendor[] {
  return vendors.filter(vendor => vendor.category === category);
}

export function getVendorsByCity(city: VendorCity): Vendor[] {
  return vendors.filter(vendor => vendor.city === city);
}

export function filterVendors(vendors: Vendor[], filters: VendorFilters): Vendor[] {
  return vendors.filter(vendor => {
    // Search query
    if (filters.q) {
      const query = filters.q.toLowerCase();
      const matchesSearch =
        vendor.name.toLowerCase().includes(query) ||
        vendor.category.toLowerCase().includes(query) ||
        vendor.city.toLowerCase().includes(query) ||
        vendor.description?.toLowerCase().includes(query) ||
        vendor.tags?.some(tag => tag.toLowerCase().includes(query));

      if (!matchesSearch) return false;
    }

    // City filter
    if (filters.city && vendor.city.toLowerCase() !== filters.city.toLowerCase()) return false;

    // Category filter
    if (filters.category && vendor.category.toLowerCase() !== filters.category.toLowerCase()) return false;

    // Price range filter
    if (filters.minPrice && (!vendor.startingPrice || vendor.startingPrice < filters.minPrice)) return false;
    if (filters.maxPrice && (!vendor.startingPrice || vendor.startingPrice > filters.maxPrice)) return false;

    return true;
  });
}

export function sortVendors(vendors: Vendor[], sortBy: VendorFilters['sort'] = 'recommended'): Vendor[] {
  const sorted = [...vendors];

  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'price-low':
      return sorted.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
    case 'price-high':
      return sorted.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
    case 'newest':
      // For now, sort by rating as a proxy for "newest"
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'recommended':
    default:
      // Featured first, then by rating
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });
  }
}

export function paginateVendors(vendors: Vendor[], page: number = 1, perPage: number = 24): {
  vendors: Vendor[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
} {
  const totalCount = vendors.length;
  const totalPages = Math.ceil(totalCount / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    vendors: vendors.slice(startIndex, endIndex),
    totalPages,
    currentPage,
    totalCount
  };
}
