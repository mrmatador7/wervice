// Re-export constants for better organization
export * from '@/models/types';

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
