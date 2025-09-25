// Re-export constants for better organization
export * from '@/models/types';

// Inspiration Items
export const INSPIRATION_ITEMS = [
  {
    id: 1,
    title: 'Traditional Moroccan Riad',
    description: 'Elegant courtyard venue perfect for intimate ceremonies',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&crop=center',
    category: 'venues',
    link: '#venues'
  },
  {
    id: 2,
    title: 'Henna Night Celebration',
    description: 'Beautiful traditional henna ceremony with family and friends',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&crop=center',
    category: 'planning-beauty',
    link: '#planning-beauty'
  },
  {
    id: 3,
    title: 'Luxury Wedding Photography',
    description: 'Capture every moment of your special day',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop&crop=center',
    category: 'photo-video',
    link: '#photo-video'
  },
  {
    id: 4,
    title: 'Traditional Moroccan Catering',
    description: 'Authentic flavors for your wedding feast',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&crop=center',
    category: 'catering',
    link: '#catering'
  },
  {
    id: 5,
    title: 'Moroccan Wedding Decor',
    description: 'Elegant decor with traditional Moroccan touches',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop&crop=center',
    category: 'decor',
    link: '#decor'
  },
  {
    id: 6,
    title: 'Live Wedding Music',
    description: 'Traditional Moroccan music and entertainment',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center',
    category: 'music',
    link: '#music'
  }
];

// Filter Categories
export const FILTER_CATEGORIES = [
  { key: 'all', label: 'All Categories' },
  { key: 'venues', label: 'Venues' },
  { key: 'catering', label: 'Catering' },
  { key: 'photo-video', label: 'Photo & Video' },
  { key: 'planning-beauty', label: 'Planning & Beauty' },
  { key: 'decor', label: 'Decor' },
  { key: 'music', label: 'Music' },
  { key: 'dresses', label: 'Dresses' }
];

// Navbar Categories
export const NAVBAR_CATEGORIES = [
  { key: 'venues', label: 'Venues' },
  { key: 'dresses', label: 'Dresses' },
  { key: 'planning-beauty', label: 'Henna' },
  { key: 'catering', label: 'Catering' },
  { key: 'decor', label: 'Decor' },
  { key: 'music', label: 'Music' },
  { key: 'photo-video', label: 'Photo/Video' }
];

// Featured Deals
export const FEATURED_DEALS = [
  {
    id: 1,
    title: 'Traditional Riad Wedding Venue',
    category: 'venues' as const,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&crop=center',
    discount: '25% OFF',
    rating: 4.8,
    price: '45,000',
    originalPrice: '60,000',
    description: 'Beautiful traditional Moroccan riad in the heart of Marrakech'
  },
  {
    id: 2,
    title: 'Authentic Moroccan Catering',
    category: 'catering' as const,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&crop=center',
    discount: '20% OFF',
    rating: 4.9,
    price: '2,500',
    originalPrice: '3,125',
    description: 'Traditional Moroccan cuisine with modern presentation'
  },
  {
    id: 3,
    title: 'Professional Wedding Photography',
    category: 'photo-video' as const,
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop&crop=center',
    discount: '30% OFF',
    rating: 4.7,
    price: '15,000',
    originalPrice: '21,429',
    description: 'Capture your special moments with experienced photographers'
  },
  {
    id: 4,
    title: 'Henna Ceremony Package',
    category: 'planning-beauty' as const,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&crop=center',
    discount: '15% OFF',
    rating: 4.6,
    price: '3,500',
    originalPrice: '4,118',
    description: 'Traditional henna ceremony with skilled artists'
  }
];

// Package Bundles
export const PACKAGE_BUNDLES = [
  {
    name: 'Essential',
    icon: '💎',
    price: '25,000 MAD',
    originalPrice: '35,000 MAD',
    discount: 'Save 10,000 MAD',
    features: [
      'Venue selection assistance',
      'Basic catering coordination',
      'Photography package',
      'Wedding planning timeline'
    ]
  },
  {
    name: 'Premium',
    icon: '👑',
    price: '45,000 MAD',
    originalPrice: '65,000 MAD',
    discount: 'Save 20,000 MAD',
    features: [
      'All Essential features',
      'Henna ceremony planning',
      'Decor and styling',
      'VIP vendor priority',
      '24/7 planning support'
    ]
  },
  {
    name: 'Luxury',
    icon: '🏰',
    price: '75,000 MAD',
    originalPrice: '110,000 MAD',
    discount: 'Save 35,000 MAD',
    features: [
      'All Premium features',
      'Amaria procession',
      'Live music and entertainment',
      'Luxury transportation',
      'Personal wedding coordinator',
      'Post-wedding photo editing'
    ]
  }
];

// Premium Benefits
export const PREMIUM_BENEFITS = [
  {
    icon: '🎯',
    title: 'Exclusive Discounts',
    description: 'Up to 30% off on premium vendors'
  },
  {
    icon: '📅',
    title: 'Planning Timeline',
    description: 'Custom wedding planning schedule'
  },
  {
    icon: '💎',
    title: 'VIP Support',
    description: 'Priority customer support'
  }
];

// Footer Links
export const FOOTER_LINKS = [
  { name: 'About Us', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
  { name: 'Privacy Policy', href: '#privacy' },
  { name: 'Terms of Service', href: '#terms' }
];

// Current Year
export const CURRENT_YEAR = new Date().getFullYear();

// Configuration constants
export const CONFIG = {
  ITEMS_PER_PAGE: 12,
  SEARCH_DEBOUNCE_MS: 300,
  TIMER_UPDATE_INTERVAL: 1000,
  MAX_SEARCH_RESULTS: 50,
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  DEALS: '/api/deals',
  INSPIRATIONS: '/api/inspirations',
  CATEGORIES: '/api/categories',
  SEARCH: '/api/search',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'wervice_search_history',
  WISHLIST: 'wervice_wishlist',
  CART: 'wervice_cart',
  USER_PREFERENCES: 'wervice_user_preferences',
} as const;

// Theme Configuration
export const THEME = {
  COLORS: {
    PRIMARY: '#d9ff0a',
    SECONDARY: '#000000',
    WHITE: '#ffffff',
    GRAY: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    }
  },
  FONTS: {
    PRIMARY: 'Amiri, serif',
    SECONDARY: 'Open Sans, sans-serif',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  }
} as const;
