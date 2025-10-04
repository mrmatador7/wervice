import { Vendor } from './types';

// Mock vendor data
export const mockVendors: Vendor[] = [
  {
    slug: 'palais-des-congres',
    name: 'Palais des Congrès',
    category: 'venues',
    city: 'Casablanca',
    address: 'Rue de la Paix, Casablanca 20000, Morocco',
    location: { lat: 33.5731, lng: -7.5898 },
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?q=80&w=800&auto=format&fit=crop',
    ],
    priceRange: { from: 15000, to: 30000, currency: 'MAD' },
    description: `Palais des Congrès is Casablanca's premier luxury wedding venue, offering breathtaking architecture and world-class service. This iconic venue features stunning ballrooms, elegant gardens, and panoramic views of the Atlantic Ocean.

With over 20 years of experience hosting unforgettable celebrations, Palais des Congrès combines traditional Moroccan elegance with modern luxury. Our expert team ensures every detail is perfect for your special day.

The venue offers flexible spaces from intimate gatherings of 50 to grand celebrations of 800 guests. Each space can be customized with our extensive decor and floral services.`,
    amenities: [
      'Parking for 200+ vehicles',
      'Outdoor terrace with ocean views',
      'State-of-the-art sound system',
      'Catering kitchen facilities',
      'Bridal suite with dressing room',
      'Air conditioning throughout',
      'Security and valet services',
      'Accessible entrance and facilities'
    ],
    services: [
      'Full event planning and coordination',
      'Catering partnerships available',
      'Photography and videography on-site',
      'Floral and decor services',
      'Transportation and logistics',
      'Technical support (lighting, AV)',
      'Guest accommodation assistance'
    ],
    phone: '+212 522 123 456',
    email: 'events@palaiscongres.ma',
    website: 'https://palaiscongres.ma',
    whatsapp: '212522123456',
    rating: 4.8,
    reviewsCount: 127,
    openingHours: ['9:00 AM - 11:00 PM'],
    capacity: 800,
    indoor: true,
    outdoor: true,
    verified: true
  },
  {
    slug: 'dar-moha',
    name: 'Dar Moha',
    category: 'venues',
    city: 'Marrakech',
    address: 'Rue Dar Moha, Gueliz District, Marrakech 40000, Morocco',
    location: { lat: 31.6295, lng: -7.9811 },
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop',
    ],
    priceRange: { from: 25000, to: 50000, currency: 'MAD' },
    description: `Dar Moha is a stunning traditional Moroccan riad transformed into Marrakech's most romantic wedding venue. Nestled in the heart of the Gueliz district, this intimate venue combines authentic Moroccan architecture with contemporary luxury.

Originally a 19th-century palace, Dar Moha features intricate zellige tilework, carved cedar ceilings, and lush courtyard gardens. The venue offers an authentic Moroccan wedding experience with modern amenities and exceptional service.

Perfect for intimate weddings of 20-120 guests, Dar Moha provides a magical setting for both traditional Moroccan ceremonies and contemporary celebrations.`,
    amenities: [
      'Traditional Moroccan architecture',
      'Central courtyard garden',
      'Indoor and outdoor ceremony spaces',
      'Private bridal suite',
      'On-site catering facilities',
      'Traditional Moroccan decor included',
      'Intimate and romantic atmosphere',
      'Professional photography locations'
    ],
    services: [
      'Traditional Moroccan wedding packages',
      'Henna ceremony coordination',
      'Cultural ceremony guidance',
      'Photography and videography',
      'Floral arrangements with local blooms',
      'Traditional music and entertainment',
      'Guest transportation from airport',
      'Post-wedding brunch included'
    ],
    phone: '+212 524 123 789',
    email: 'weddings@darmoha.ma',
    website: 'https://darmoha.ma',
    whatsapp: '212524123789',
    rating: 4.9,
    reviewsCount: 89,
    openingHours: ['8:00 AM - 12:00 AM'],
    capacity: 120,
    indoor: true,
    outdoor: true,
    verified: true
  },
  {
    slug: 'authentic-moroccan-kitchen',
    name: 'Authentic Moroccan Kitchen',
    category: 'catering',
    city: 'Casablanca',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'
    ],
    pricePerPerson: 150,
    cuisines: ['Traditional Moroccan', 'Tagine', 'Couscous'],
    minOrder: 25,
    rating: 4.9,
    reviewsCount: 203,
    whatsapp: '212661234567',
    verified: true
  },
  {
    slug: 'fusion-feast',
    name: 'Fusion Feast',
    category: 'catering',
    city: 'Casablanca',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'
    ],
    pricePerPerson: 200,
    cuisines: ['Moroccan Fusion', 'Mediterranean', 'International'],
    minOrder: 30,
    rating: 4.7,
    reviewsCount: 156,
    whatsapp: '212662345678',
    verified: true
  },
  {
    slug: 'ocean-view-catering',
    name: 'Ocean View Catering',
    category: 'catering',
    city: 'Agadir',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'
    ],
    pricePerPerson: 180,
    cuisines: ['Seafood', 'Moroccan Seafood', 'Mediterranean'],
    minOrder: 20,
    rating: 4.5,
    reviewsCount: 87,
    whatsapp: '212663456789',
    verified: true
  },
  {
    slug: 'golden-moments',
    name: 'Golden Moments',
    category: 'photo-video',
    city: 'Casablanca',
    address: 'Boulevard Mohammed V, Casablanca 20000, Morocco',
    location: { lat: 33.5731, lng: -7.5898 },
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554048612-b6a482dbe4c8?q=80&w=800&auto=format&fit=crop',
    ],
    priceRange: { from: 3000, to: 8000, currency: 'MAD' },
    description: `Golden Moments is Casablanca's premier wedding photography and videography studio, specializing in capturing the magic and emotion of Moroccan weddings. With over 15 years of experience, we blend artistic vision with technical excellence to create timeless memories.

Our team of professional photographers and videographers are experts in Moroccan wedding traditions, from intimate henna ceremonies to grand palace receptions. We understand the cultural significance of each moment and ensure every photograph tells your unique love story.

We offer comprehensive packages that include engagement sessions, wedding day coverage, and post-wedding albums with both traditional and contemporary styling.`,
    amenities: [
      'Professional photography equipment',
      '4K videography capabilities',
      'Drone photography available',
      'Multiple camera angles',
      'Professional lighting setup',
      'Backup equipment on-site',
      'Emergency photography coverage',
      'Online gallery with 24-hour delivery'
    ],
    services: [
      'Full wedding day coverage',
      'Engagement and pre-wedding shoots',
      'Traditional ceremony documentation',
      'Reception and party photography',
      'Photo editing and retouching',
      'Custom wedding albums',
      'Digital galleries and USB drives',
      'Second photographer option'
    ],
    phone: '+212 522 987 654',
    email: 'hello@goldenmoments.ma',
    website: 'https://goldenmoments.ma',
    whatsapp: '212522987654',
    rating: 4.9,
    reviewsCount: 156,
    openingHours: ['9:00 AM - 6:00 PM'],
    packages: ['Basic', 'Premium', 'Deluxe'],
    hoursCoverage: 8,
    verified: true
  },
  {
    slug: 'studio-lumiere',
    name: 'Studio Lumière',
    category: 'photo-video',
    city: 'Rabat',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop'
    ],
    packages: ['Portrait', 'Event', 'Wedding'],
    hoursCoverage: 6,
    priceRange: { from: 3500, currency: 'MAD' },
    rating: 4.7,
    reviewsCount: 94,
    whatsapp: '212665678901',
    verified: true
  },
  {
    slug: 'desert-lens',
    name: 'Desert Lens',
    category: 'photo-video',
    city: 'Marrakech',
    coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'
    ],
    packages: ['Desert', 'Traditional', 'Modern'],
    hoursCoverage: 10,
    priceRange: { from: 3800, currency: 'MAD' },
    rating: 4.7,
    reviewsCount: 112,
    whatsapp: '212666789012',
    verified: true
  },
  {
    slug: 'wedding-whisperer',
    name: 'Wedding Whisperer',
    category: 'planning',
    city: 'Casablanca',
    address: 'Avenue Hassan II, Casablanca 20000, Morocco',
    location: { lat: 33.5731, lng: -7.5898 },
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    ],
    priceRange: { from: 15000, to: 30000, currency: 'MAD' },
    description: `Wedding Whisperer is Casablanca's premier wedding planning and coordination service, specializing in creating unforgettable Moroccan wedding experiences. With over 10 years of experience, we transform your vision into reality with meticulous attention to detail and authentic cultural elements.

Our comprehensive planning services include everything from intimate ceremonies to grand celebrations. We work closely with Morocco's finest vendors to ensure every aspect of your special day is perfect, from traditional henna ceremonies to elaborate banquet receptions.

Whether you dream of a traditional Moroccan wedding or a contemporary celebration, Wedding Whisperer brings expertise, creativity, and passion to make your day truly magical.`,
    amenities: [
      '10+ years experience',
      'Personalized consultation',
      'Vendor network',
      'Budget tracking',
      'Cultural expertise'
    ],
    services: [
      'Full wedding planning',
      'Vendor sourcing',
      'Budget planning',
      'Ceremony design',
      'Moroccan wedding expertise'
    ],
    phone: '+212 522 456 789',
    email: 'hello@weddingwhisperer.ma',
    website: 'https://weddingwhisperer.ma',
    whatsapp: '212683456789',
    rating: 4.9,
    reviewsCount: 245,
    openingHours: ['9:00 AM - 8:00 PM'],
    capacity: 500,
    indoor: true,
    outdoor: true,
    verified: true
  }
];

// Utility functions
export function getVendorBySlug(slug: string): Vendor | undefined {
  return mockVendors.find(vendor => vendor.slug === slug);
}

export function getSimilarVendors(vendor: Vendor, limit: number = 6): Vendor[] {
  return mockVendors
    .filter(v => v.slug !== vendor.slug && v.category === vendor.category && v.city === vendor.city)
    .slice(0, limit);
}

export function getAllVendors(): Vendor[] {
  return mockVendors;
}
