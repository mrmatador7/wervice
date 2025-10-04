// Wedding Categories
export type WeddingCategory =
  | 'venues'
  | 'catering'
  | 'photo-video'
  | 'planning-beauty'
  | 'decor'
  | 'music'
  | 'dresses';

// Deal/Package Types
export interface Deal {
  id: number;
  title: string;
  category: WeddingCategory;
  image: string;
  discount: string;
  rating: number;
  price: string;
  originalPrice?: string;
  description?: string;
}

// Inspiration Item Types
export type InspirationCategory = WeddingCategory | 'traditional' | 'modern' | 'luxury';

export interface InspirationItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: InspirationCategory;
  link: string;
}

// Category Configuration
export interface CategoryConfig {
  key: WeddingCategory | 'all';
  label: string;
  count?: number;
}

// Component Props Types
export interface HeaderProps {
  // Empty interface for future extensibility
  readonly _brand?: 'HeaderProps';
}

export interface HeroProps {
  onViewOffers: () => void;
}

export interface FeaturedDealsProps {
  readonly _brand?: 'FeaturedDealsProps';
}

export interface InspirationGridProps {
  readonly _brand?: 'InspirationGridProps';
}

// Timer State
export interface TimerState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Vendor Types
export type VendorCategory =
  | 'venues'
  | 'catering'
  | 'photo-video'
  | 'planning'
  | 'beauty'
  | 'decor'
  | 'music'
  | 'dresses';

export interface Vendor {
  slug: string;
  name: string;
  category: VendorCategory;
  city: string;
  address?: string;
  location?: { lat: number; lng: number };
  coverImage: string;
  gallery: string[];
  // Common
  priceRange?: { from?: number; to?: number; currency?: "MAD" };
  description?: string;
  amenities?: string[];
  services?: string[];
  phone?: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  rating?: number;
  reviewsCount?: number;
  openingHours?: string[];
  verified?: boolean;
  // Category-specific fields
  capacity?: number;                         // venues
  indoor?: boolean; outdoor?: boolean;       // venues
  pricePerPerson?: number;                   // catering
  cuisines?: string[];                       // catering
  minOrder?: number;                         // catering
  packages?: string[];                       // photo-video, planning
  hoursCoverage?: number;                    // photo-video
  rental?: boolean; sizes?: string[];        // dresses
  alterations?: boolean; fittings?: boolean; // dresses
  ensembleSize?: string; setDuration?: string; soundSystem?: boolean; // music
  deliverySetup?: boolean;                   // decor
}
