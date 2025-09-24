import { CategoryConfig, WeddingCategory } from '@/types';

// Wedding Categories
export const WEDDING_CATEGORIES: CategoryConfig[] = [
  { key: 'venues', label: 'Venues' },
  { key: 'catering', label: 'Catering' },
  { key: 'photo-video', label: 'Photo & Video' },
  { key: 'planning-beauty', label: 'Planning Beauty' },
  { key: 'decor', label: 'Decor' },
  { key: 'music', label: 'Music' },
  { key: 'dresses', label: 'Dresses' },
];

// Category Labels Map
export const CATEGORY_LABELS: Record<WeddingCategory, string> = {
  venues: 'Venues',
  catering: 'Catering',
  'photo-video': 'Photo & Video',
  'planning-beauty': 'Planning Beauty',
  decor: 'Decor',
  music: 'Music',
  dresses: 'Dresses'
};

// Navbar Categories (all 7 categories shown)
export const NAVBAR_CATEGORIES = [
  { key: 'venues', label: 'Venues' },
  { key: 'catering', label: 'Catering' },
  { key: 'photo-video', label: 'Photo & Video' },
  { key: 'planning-beauty', label: 'Planning Beauty' },
  { key: 'decor', label: 'Decor' },
  { key: 'music', label: 'Music' },
  { key: 'dresses', label: 'Dresses' },
];

// Filter Categories for Inspiration Grid
export const FILTER_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'traditional', label: 'Traditional' },
  { key: 'modern', label: 'Modern' },
  { key: 'luxury', label: 'Luxury' }
];

// App Metadata
export const APP_METADATA = {
  title: 'Wervice - Moroccan Wedding Planning',
  description: 'Authentic Moroccan weddings made easy with categories like Venues, Dresses, and Decor. Plan your perfect celebration with traditional henna, kaftans, and Amaria processions.',
  keywords: 'Moroccan weddings, henna ceremonies, kaftans, Amaria processions, Riad venues, traditional catering, wedding planning Morocco',
};

// Premium Benefits
export const PREMIUM_BENEFITS = [
  {
    icon: '📅',
    title: 'Priority Bookings',
    description: 'Skip the waitlist for top venues and vendors'
  },
  {
    icon: '👗',
    title: 'Custom Consults',
    description: 'Personal styling sessions for dresses and decor'
  },
  {
    icon: '🛁',
    title: 'Hammam Access',
    description: 'Exclusive partnerships with luxury spas'
  }
];

// Ultimate Package Bundles
export const PACKAGE_BUNDLES = [
  { name: 'Venues + Decor', icon: '🏰' },
  { name: 'Catering + Music', icon: '🎵' },
  { name: 'Dresses + Photo & Video', icon: '📸' }
];

// Social Media Links
export const SOCIAL_LINKS = [
  { platform: 'Facebook', icon: '📘', url: '#' },
  { platform: 'Instagram', icon: '📷', url: '#' },
  { platform: 'Twitter', icon: '🐦', url: '#' },
  { platform: 'LinkedIn', icon: '💼', url: '#' },
];

// Footer Links
export const FOOTER_LINKS = [
  { label: 'Privacy', url: '#' },
  { label: 'Terms', url: '#' },
  { label: 'Contact', url: '#' },
];

// Current Year
export const CURRENT_YEAR = new Date().getFullYear();
