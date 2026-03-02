// Onboarding data types and enums for Wervice

export type OnboardingRole = 'bride' | 'groom' | 'planner' | 'other';

export type OnboardingCurrency = 'MAD' | 'EUR' | 'USD';

export type WeddingStyle = 'modern' | 'traditional' | 'luxury' | 'garden' | 'beach' | 'boho' | 'vintage' | 'minimalist';

export type WeddingPriority = 'venue' | 'photography' | 'decor' | 'food' | 'music' | 'beauty' | 'dress' | 'planner';

export type WeddingService = 'venues' | 'catering' | 'photography' | 'beauty' | 'decor' | 'music' | 'planner' | 'dresses';

export type WeddingDateType = 'exact' | 'monthYear' | 'notSet';

// Complete onboarding data structure
export interface OnboardingData {
  // Step 1: Welcome (no data)
  welcome?: { started: boolean };

  // Step 2: Basic Info
  basicInfo?: {
    firstName: string;
    partnerName?: string;
    role: OnboardingRole;
  };

  // Step 3: Wedding City
  city?: string;

  // Step 4: Wedding Date
  weddingDate?: string;
  weddingDateType?: WeddingDateType;

  // Step 5: Guest Count
  guestCount?: number;

  // Step 6: Budget & Currency
  currency?: OnboardingCurrency;
  budgetTotal?: number;

  // Step 7: Wedding Style & Priorities
  styles?: WeddingStyle[];
  priorities?: WeddingPriority[];

  // Step 8: Services Needed
  servicesNeeded?: WeddingService[];

  // Step 9: Suggestions (computed, not stored)
  suggestions?: any[];

  // Step 10: Summary (computed, not stored)
  summary?: any;
}

// Step definitions
export const ONBOARDING_STEPS = [
  'welcome',
  'basicInfo',
  'city',
  'weddingDate',
  'guestCount',
  'currency', // This maps to the budget/currency step
  'styles', // This maps to the style/priorities step
  'servicesNeeded', // This maps to the services step
  'suggestions',
  'summary'
] as const;

export type OnboardingStep = typeof ONBOARDING_STEPS[number];

export const STEP_LABELS: Record<OnboardingStep, string> = {
  welcome: 'Welcome',
  basicInfo: 'Basic Info',
  city: 'Wedding City',
  weddingDate: 'Wedding Date',
  guestCount: 'Guest Count',
  currency: 'Budget & Currency',
  styles: 'Style & Priorities',
  servicesNeeded: 'Services Needed',
  suggestions: 'Personalized Suggestions',
  summary: 'Summary & Finish'
};

// Cities available on Wervice (matches canonical list in lib/types/vendor)
export const MOROCCAN_CITIES = [
  { id: 'marrakech', name: 'Marrakech', description: 'The Red City - Traditional and magical', popular: true },
  { id: 'casablanca', name: 'Casablanca', description: 'Modern cosmopolitan city', popular: true },
  { id: 'fes', name: 'Fes', description: 'Ancient medina and cultural heritage', popular: true },
  { id: 'rabat', name: 'Rabat', description: 'Capital city with royal charm', popular: true },
  { id: 'tanger', name: 'Tanger', description: 'Coastal city with European influence', popular: false },
  { id: 'oujda', name: 'Oujda', description: 'Eastern gateway city', popular: false },
  { id: 'agadir', name: 'Agadir', description: 'Beach and sun destination', popular: false },
  { id: 'meknes', name: 'Meknes', description: 'Historic imperial city', popular: false },
  { id: 'tetouan', name: 'Tetouan', description: 'Mediterranean and historic medina', popular: false },
  { id: 'kenitra', name: 'Kenitra', description: 'Modern city on the Atlantic coast', popular: false },
  { id: 'el-jadida', name: 'El Jadida', description: 'Portuguese colonial architecture', popular: false },
  { id: 'safi', name: 'Safi', description: 'Coastal port and ceramics', popular: false },
  { id: 'laayoune', name: 'Laayoune', description: 'Southern Morocco', popular: false },
  { id: 'el-hoceima', name: 'El Hoceima', description: 'Mediterranean coast', popular: false },
  { id: 'beni-mellal', name: 'Beni Mellal', description: 'Atlas gateway and agriculture', popular: false },
];

// Wedding styles options
export const WEDDING_STYLES: Array<{ id: WeddingStyle; label: string; emoji: string; description: string }> = [
  { id: 'modern', label: 'Modern', emoji: '✨', description: 'Contemporary and sleek' },
  { id: 'traditional', label: 'Traditional', emoji: '🏰', description: 'Classic Moroccan elegance' },
  { id: 'luxury', label: 'Luxury', emoji: '💎', description: 'High-end and glamorous' },
  { id: 'garden', label: 'Garden', emoji: '🌸', description: 'Outdoor and natural' },
  { id: 'beach', label: 'Beach', emoji: '🏖️', description: 'Coastal and relaxed' },
  { id: 'boho', label: 'Boho Chic', emoji: '🕊️', description: 'Free-spirited and artistic' },
  { id: 'vintage', label: 'Vintage', emoji: '📻', description: 'Retro and nostalgic' },
  { id: 'minimalist', label: 'Minimalist', emoji: '⚪', description: 'Clean and simple' },
];

// Wedding priorities options
export const WEDDING_PRIORITIES: Array<{ id: WeddingPriority; label: string; emoji: string; description: string }> = [
  { id: 'venue', label: 'Venue', emoji: '🏛️', description: 'Perfect location and ambiance' },
  { id: 'photography', label: 'Photography', emoji: '📸', description: 'Capture every special moment' },
  { id: 'decor', label: 'Décor & Flowers', emoji: '🎨', description: 'Beautiful styling and flowers' },
  { id: 'food', label: 'Food & Catering', emoji: '🍽️', description: 'Delicious cuisine and service' },
  { id: 'music', label: 'Music & Entertainment', emoji: '🎵', description: 'Perfect soundtrack and fun' },
  { id: 'beauty', label: 'Beauty & Hair', emoji: '💄', description: 'Glam team for the big day' },
  { id: 'dress', label: 'Wedding Dress', emoji: '👗', description: 'Perfect attire for everyone' },
  { id: 'planner', label: 'Wedding Planner', emoji: '📋', description: 'Expert coordination' },
];

// Wedding services options
export const WEDDING_SERVICES: Array<{ id: WeddingService; label: string; icon: string; description: string; essential: boolean }> = [
  { id: 'venues', label: 'Venues', icon: '🏛️', description: 'Wedding locations and ceremony spaces', essential: true },
  { id: 'catering', label: 'Catering', icon: '🍽️', description: 'Food, beverages, and dining services', essential: true },
  { id: 'photography', label: 'Photography', icon: '📸', description: 'Capture your special moments', essential: true },
  { id: 'beauty', label: 'Beauty & Hair', icon: '💄', description: 'Makeup artists and hair stylists', essential: false },
  { id: 'decor', label: 'Décor & Flowers', icon: '🎨', description: 'Florists and wedding decorators', essential: false },
  { id: 'music', label: 'Music & Entertainment', icon: '🎵', description: 'DJ, bands, and entertainment', essential: false },
  { id: 'planner', label: 'Wedding Planner', icon: '📋', description: 'Professional coordination services', essential: false },
  { id: 'dresses', label: 'Wedding Dresses', icon: '👗', description: 'Bridal wear and accessories', essential: false },
];

// Guest count presets
export const GUEST_PRESETS = [
  { value: 50, label: 'Intimate (50)', description: 'Close friends & family' },
  { value: 100, label: 'Small (100)', description: 'Extended family & close friends' },
  { value: 150, label: 'Medium (150)', description: 'Large celebration' },
  { value: 200, label: 'Large (200)', description: 'Grand celebration' },
  { value: 300, label: 'Extra Large (300+)', description: 'Major event' },
];

// Budget ranges (in MAD)
export const BUDGET_RANGES = [
  { min: 100000, max: 250000, label: 'Budget-Friendly', description: 'Essential services, intimate celebration' },
  { min: 250000, max: 500000, label: 'Moderate', description: 'Quality vendors, comfortable celebration' },
  { min: 500000, max: 800000, label: 'Premium', description: 'High-end vendors, memorable experience' },
  { min: 800000, max: 1500000, label: 'Luxury', description: 'Top-tier everything, grand celebration' },
  { min: 1500000, max: 9999999, label: 'Ultra Luxury', description: 'No compromises, extraordinary event' },
];
