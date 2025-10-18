// Mock data for Wervice Admin Dashboard

export interface KPIStat {
  title: string;
  value: string | number;
  delta: number; // percentage change from last month
  deltaLabel: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface CategoryBooking {
  category: string;
  count: number;
  percentage: number;
}

export interface CityBooking {
  city: string;
  count: number;
}

export interface Vendor {
  id: string;
  name: string;
  city: string;
  category: string;
  status: 'Active' | 'Pending' | 'Suspended';
  bookings: number;
  revenue: number;
  rating: number;
  plan: 'style-beauty' | 'media-entertainment' | 'venue-planning';
  planPrice: number;
  profilePhotoUrl: string;
  galleryPhotoUrls: string[];
  lastPayout: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  totalBookings: number;
  lastLogin: string;
  status: 'Active' | 'Inactive';
}

export interface Booking {
  id: string;
  client: string;
  vendor: string;
  date: string;
  price: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface Payout {
  id: string;
  vendor: string;
  amount: number;
  method: string;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  activeVendors: number;
  isHidden: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  status: 'Draft' | 'Published';
  updated: string;
  author: string;
}

// KPI Statistics
export const kpiStats: KPIStat[] = [
  {
    title: 'Total Vendors',
    value: 487,
    delta: 12.5,
    deltaLabel: 'vs last month'
  },
  {
    title: 'Total Clients',
    value: '2,341',
    delta: 8.2,
    deltaLabel: 'vs last month'
  },
  {
    title: 'Total Bookings',
    value: '1,847',
    delta: 15.3,
    deltaLabel: 'vs last month'
  },
  {
    title: 'Total Revenue',
    value: 'MAD 2.4M',
    delta: 18.7,
    deltaLabel: 'vs last month'
  },
  {
    title: 'Pending Approvals',
    value: 23,
    delta: -5.2,
    deltaLabel: 'vs last month'
  },
  {
    title: 'Active Categories',
    value: 8,
    delta: 0,
    deltaLabel: 'vs last month'
  }
];

// Revenue data for charts
export const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 180000, bookings: 145 },
  { month: 'Feb', revenue: 220000, bookings: 178 },
  { month: 'Mar', revenue: 195000, bookings: 156 },
  { month: 'Apr', revenue: 280000, bookings: 234 },
  { month: 'May', revenue: 320000, bookings: 267 },
  { month: 'Jun', revenue: 290000, bookings: 245 },
  { month: 'Jul', revenue: 350000, bookings: 298 },
  { month: 'Aug', revenue: 380000, bookings: 312 },
  { month: 'Sep', revenue: 340000, bookings: 289 },
  { month: 'Oct', revenue: 410000, bookings: 345 },
  { month: 'Nov', revenue: 390000, bookings: 332 },
  { month: 'Dec', revenue: 420000, bookings: 358 }
];

// Bookings by category
export const categoryBookings: CategoryBooking[] = [
  { category: 'Venues', count: 423, percentage: 23 },
  { category: 'Catering', count: 356, percentage: 19 },
  { category: 'Photography', count: 289, percentage: 16 },
  { category: 'Planning', count: 234, percentage: 13 },
  { category: 'Beauty', count: 198, percentage: 11 },
  { category: 'Decor', count: 156, percentage: 8 },
  { category: 'Music', count: 134, percentage: 7 },
  { category: 'Dresses', count: 57, percentage: 3 }
];

// Bookings by city
export const cityBookings: CityBooking[] = [
  { city: 'Marrakech', count: 456 },
  { city: 'Casablanca', count: 389 },
  { city: 'Rabat', count: 287 },
  { city: 'Tangier', count: 198 },
  { city: 'Agadir', count: 167 },
  { city: 'Fes', count: 145 },
  { city: 'Meknes', count: 123 },
  { city: 'El Jadida', count: 82 }
];

// Vendors data
export const vendors: Vendor[] = [
  {
    id: '1',
    name: 'Palais des Congrès',
    city: 'Casablanca',
    category: 'Venues',
    status: 'Active',
    bookings: 145,
    revenue: 580000,
    rating: 4.8,
    plan: 'venue-planning',
    planPrice: 350,
    profilePhotoUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop',
    galleryPhotoUrls: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    lastPayout: '2024-01-15'
  },
  {
    id: '2',
    name: 'Dar Moha',
    city: 'Marrakech',
    category: 'Venues',
    status: 'Active',
    bookings: 132,
    revenue: 528000,
    rating: 4.9,
    plan: 'venue-planning',
    planPrice: 350,
    profilePhotoUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    galleryPhotoUrls: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    lastPayout: '2024-01-14'
  },
  {
    id: '3',
    name: 'Studio Lumière',
    city: 'Rabat',
    category: 'Photo & Video',
    status: 'Active',
    bookings: 98,
    revenue: 98000,
    rating: 4.7,
    plan: 'media-entertainment',
    planPrice: 250,
    profilePhotoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    galleryPhotoUrls: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop'
    ],
    lastPayout: '2024-01-13'
  },
  {
    id: '4',
    name: 'Chefs Marocains',
    city: 'Tangier',
    category: 'Catering',
    status: 'Active',
    bookings: 87,
    revenue: 174000,
    rating: 4.6,
    plan: 'venue-planning',
    planPrice: 350,
    profilePhotoUrl: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop',
    galleryPhotoUrls: [
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    lastPayout: '2024-01-12'
  },
  {
    id: '5',
    name: 'Wedding Dreams Co.',
    city: 'Agadir',
    category: 'Event Planner',
    status: 'Pending',
    bookings: 0,
    revenue: 0,
    rating: 0,
    plan: 'venue-planning',
    planPrice: 350,
    profilePhotoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    galleryPhotoUrls: [],
    lastPayout: '-'
  }
];

// Users data
export const users: User[] = [
  {
    id: '1',
    name: 'Fatima Alaoui',
    email: 'fatima.alaoui@email.com',
    totalBookings: 3,
    lastLogin: '2024-01-15',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Karim Bennani',
    email: 'karim.bennani@email.com',
    totalBookings: 2,
    lastLogin: '2024-01-14',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Sofia Tazi',
    email: 'sofia.tazi@email.com',
    totalBookings: 5,
    lastLogin: '2024-01-10',
    status: 'Active'
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    totalBookings: 1,
    lastLogin: '2024-01-08',
    status: 'Inactive'
  }
];

// Bookings data
export const bookings: Booking[] = [
  {
    id: 'BK-001',
    client: 'Fatima Alaoui',
    vendor: 'Dar Moha',
    date: '2024-01-20',
    price: 4000,
    status: 'Confirmed'
  },
  {
    id: 'BK-002',
    client: 'Karim Bennani',
    vendor: 'Palais des Congrès',
    date: '2024-01-18',
    price: 3200,
    status: 'Confirmed'
  },
  {
    id: 'BK-003',
    client: 'Sofia Tazi',
    vendor: 'Studio Lumière',
    date: '2024-01-22',
    price: 1500,
    status: 'Pending'
  },
  {
    id: 'BK-004',
    client: 'Ahmed Hassan',
    vendor: 'Chefs Marocains',
    date: '2024-01-25',
    price: 2800,
    status: 'Confirmed'
  }
];

// Payouts data
export const payouts: Payout[] = [
  {
    id: 'P-001',
    vendor: 'Palais des Congrès',
    amount: 87000,
    method: 'Bank Transfer',
    status: 'Completed',
    date: '2024-01-15'
  },
  {
    id: 'P-002',
    vendor: 'Dar Moha',
    amount: 79200,
    method: 'Bank Transfer',
    status: 'Completed',
    date: '2024-01-14'
  },
  {
    id: 'P-003',
    vendor: 'Studio Lumière',
    amount: 11760,
    method: 'PayPal',
    status: 'Pending',
    date: '2024-01-16'
  }
];

// Categories data
export const categories: Category[] = [
  {
    id: '1',
    name: 'Venues',
    slug: 'venues',
    icon: '/categories/venues.png',
    description: 'Wedding halls, riads, gardens and ceremony venues',
    activeVendors: 67,
    isHidden: false
  },
  {
    id: '2',
    name: 'Catering',
    slug: 'catering',
    icon: '/categories/Catering.png',
    description: 'Traditional Moroccan cuisine and catering services',
    activeVendors: 45,
    isHidden: false
  },
  {
    id: '3',
    name: 'Photo & Video',
    slug: 'photo-video',
    icon: '/categories/photo.png',
    description: 'Professional photography and videography services',
    activeVendors: 38,
    isHidden: false
  },
  {
    id: '4',
    name: 'Event Planner',
    slug: 'planning',
    icon: '/categories/event planner.png',
    description: 'Wedding planning and coordination services',
    activeVendors: 29,
    isHidden: false
  },
  {
    id: '5',
    name: 'Beauty',
    slug: 'beauty',
    icon: '/categories/beauty.png',
    description: 'Henna, hair styling and beauty services',
    activeVendors: 34,
    isHidden: false
  },
  {
    id: '6',
    name: 'Decor',
    slug: 'decor',
    icon: '/categories/decor.png',
    description: 'Floral arrangements and wedding decorations',
    activeVendors: 28,
    isHidden: false
  },
  {
    id: '7',
    name: 'Music',
    slug: 'music',
    icon: '/categories/music.png',
    description: 'Live music and entertainment services',
    activeVendors: 22,
    isHidden: false
  },
  {
    id: '8',
    name: 'Dresses',
    slug: 'dresses',
    icon: '/categories/Dresses.png',
    description: 'Wedding dresses and traditional attire',
    activeVendors: 15,
    isHidden: false
  }
];

// Blog posts data
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Traditional Moroccan Wedding Traditions',
    status: 'Published',
    updated: '2024-01-10',
    author: 'Admin'
  },
  {
    id: '2',
    title: 'Planning Your Dream Wedding in Marrakech',
    status: 'Published',
    updated: '2024-01-08',
    author: 'Admin'
  },
  {
    id: '3',
    title: 'The Best Wedding Photographers in Morocco',
    status: 'Draft',
    updated: '2024-01-12',
    author: 'Admin'
  }
];

// Top performing vendors
export const topVendors = vendors.slice(0, 5);

// Recent bookings
export const recentBookings = bookings.slice(0, 5);

// System alerts
export const systemAlerts = [
  {
    id: '1',
    type: 'warning',
    message: '5 vendor applications pending approval',
    time: '2 hours ago'
  },
  {
    id: '2',
    type: 'info',
    message: 'Server maintenance scheduled for tonight',
    time: '4 hours ago'
  },
  {
    id: '3',
    type: 'success',
    message: 'Monthly revenue target achieved',
    time: '1 day ago'
  }
];
