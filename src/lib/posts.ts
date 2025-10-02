import { Post } from '@/models/post';

export const posts: Post[] = [
  {
    slug: 'ultimate-guide-moroccan-wedding-venues',
    title: 'The Ultimate Guide to Moroccan Wedding Venues',
    excerpt: 'From traditional riads in Marrakech to modern halls in Casablanca, discover the perfect venue for your Moroccan celebration.',
    content: `# The Ultimate Guide to Moroccan Wedding Venues

Morocco offers a stunning variety of wedding venues that blend traditional architecture with modern luxury. Whether you're dreaming of an intimate riad ceremony or a grand celebration, there's a venue for every couple.

## Traditional Riad Venues

Riads offer an intimate, authentic Moroccan experience with beautiful courtyards, intricate tilework, and traditional architecture. Perfect for couples seeking a romantic, culturally immersive celebration.

## Modern Wedding Halls

Contemporary venues in major cities like Casablanca and Rabat provide state-of-the-art facilities with Moroccan-inspired design elements.

## Garden and Outdoor Venues

For couples who love nature, Morocco's gardens and outdoor spaces offer breathtaking backdrops for unforgettable ceremonies.`,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop',
    category: 'Venues',
    tags: ['venues', 'marrakech', 'riad', 'traditional'],
    author: {
      name: 'Fatima Alaoui',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      role: 'Wedding Planner',
      location: 'Marrakech',
      bio: 'Specializing in authentic Moroccan weddings for over 10 years.',
      social: {
        instagram: '@fatima_weddings_ma'
      }
    },
    date: '2024-09-25T10:00:00Z',
    readTime: 8,
    featured: true,
    ogImage: '/images/blog/riad-wedding-venue-og.jpg',
    metaDescription: 'Discover the best Moroccan wedding venues from traditional riads to modern halls.'
  },
  {
    slug: 'authentic-moroccan-catering-guide',
    title: 'Authentic Moroccan Catering: Traditional Flavors for Modern Couples',
    excerpt: 'Learn about traditional Moroccan dishes, modern fusion options, and how to create a memorable wedding feast.',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
    category: 'Catering',
    tags: ['catering', 'food', 'traditional', 'fusion'],
    author: {
      name: 'Ahmed Bennani',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'Chef & Caterer',
      location: 'Casablanca',
      bio: 'Award-winning chef blending traditional Moroccan cuisine with contemporary techniques.',
      social: {
        instagram: '@ahmed_chef_ma'
      }
    },
    date: '2024-09-20T14:30:00Z',
    readTime: 6,
    featured: true,
    ogImage: '/images/blog/moroccan-catering-og.jpg',
    metaDescription: 'Explore authentic Moroccan wedding catering options and traditional dishes.'
  },
  {
    slug: 'wedding-photography-tips-morocco',
    title: 'Wedding Photography in Morocco: Capturing Magical Moments',
    excerpt: 'Essential tips for photographing Moroccan weddings, from golden hour shots to cultural traditions.',
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=400&fit=crop',
    category: 'Photo & Video',
    tags: ['photography', 'tips', 'golden-hour', 'cultural'],
    author: {
      name: 'Youssef Tazi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      role: 'Wedding Photographer',
      location: 'Rabat',
      bio: 'Capturing the beauty of Moroccan weddings through my lens for 8 years.',
      social: {
        instagram: '@youssef_photos_ma'
      }
    },
    date: '2024-09-15T09:15:00Z',
    readTime: 5,
    ogImage: '/images/blog/wedding-photography-og.jpg',
    metaDescription: 'Professional tips for wedding photography in Morocco.'
  },
  {
    slug: 'henna-tradition-modern-bride',
    title: 'The Henna Tradition: From Ancient Ritual to Modern Art',
    excerpt: 'Explore the beautiful tradition of henna in Moroccan weddings and how modern brides are embracing this ancient art.',
    coverImage: 'https://images.unsplash.com/photo-1583393781828-e5c4e7b5f8c9?w=800&h=400&fit=crop',
    category: 'Beauty',
    tags: ['henna', 'tradition', 'beauty', 'ceremony'],
    author: {
      name: 'Amina Khaldi',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      role: 'Henna Artist',
      location: 'Fes',
      bio: 'Master henna artist preserving traditional Moroccan patterns for contemporary brides.',
      social: {
        instagram: '@amina_henna_ma'
      }
    },
    date: '2024-09-10T16:45:00Z',
    readTime: 7,
    ogImage: '/images/blog/henna-ceremony-og.jpg',
    metaDescription: 'Discover the beauty and significance of henna in Moroccan wedding traditions.'
  },
  {
    slug: 'wedding-budget-breakdown-morocco',
    title: 'Moroccan Wedding Budget Breakdown: Plan Smart, Celebrate Big',
    excerpt: 'A comprehensive guide to wedding costs in Morocco, with tips for saving money without sacrificing tradition.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    category: 'Budget',
    tags: ['budget', 'planning', 'costs', 'saving'],
    author: {
      name: 'Karim El Fassi',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      role: 'Financial Advisor',
      location: 'Casablanca',
      bio: 'Helping couples plan financially smart weddings while honoring Moroccan traditions.',
      social: {
        twitter: '@karim_finance_ma'
      }
    },
    date: '2024-09-05T11:20:00Z',
    readTime: 6,
    ogImage: '/images/blog/wedding-budget-og.jpg',
    metaDescription: 'Complete guide to wedding costs and budgeting in Morocco.'
  },
  {
    slug: 'moroccan-wedding-decor-ideas',
    title: 'Moroccan Wedding Decor: Creating Magical Atmospheres',
    excerpt: 'From lanterns and carpets to fresh flowers, discover how to decorate your Moroccan wedding venue.',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=400&fit=crop',
    category: 'Decor',
    tags: ['decor', 'lanterns', 'flowers', 'atmosphere'],
    author: {
      name: 'Leila Mansouri',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      role: 'Event Decorator',
      location: 'Marrakech',
      bio: 'Creating stunning Moroccan-inspired wedding decor for over 12 years.',
      social: {
        instagram: '@leila_decor_ma'
      }
    },
    date: '2024-08-30T13:10:00Z',
    readTime: 5,
    ogImage: '/images/blog/wedding-decor-og.jpg',
    metaDescription: 'Beautiful Moroccan wedding decor ideas and inspiration.'
  },
  {
    slug: 'live-music-wedding-receptions',
    title: 'Live Music at Moroccan Wedding Receptions: Setting the Mood',
    excerpt: 'From traditional Andalusian music to modern DJs, find the perfect soundtrack for your celebration.',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
    category: 'Music',
    tags: ['music', 'entertainment', 'traditional', 'dj'],
    author: {
      name: 'Omar Alaoui',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      role: 'Music Producer',
      location: 'Tangier',
      bio: 'Curating memorable soundtracks for Moroccan weddings since 2015.',
      social: {
        instagram: '@omar_music_ma'
      }
    },
    date: '2024-08-25T15:30:00Z',
    readTime: 4,
    ogImage: '/images/blog/wedding-music-og.jpg',
    metaDescription: 'Guide to live music options for Moroccan wedding receptions.'
  },
  {
    slug: 'traditional-moroccan-wedding-dresses',
    title: 'Traditional Moroccan Wedding Dresses: Timeless Elegance',
    excerpt: 'Explore the beauty of caftans, takchitas, and modern takes on traditional Moroccan bridal wear.',
    coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=400&fit=crop',
    category: 'Dresses',
    tags: ['dresses', 'caftan', 'traditional', 'bridal'],
    author: {
      name: 'Nadia Berrada',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      role: 'Fashion Designer',
      location: 'Rabat',
      bio: 'Designing contemporary takes on traditional Moroccan wedding attire.',
      social: {
        instagram: '@nadia_fashion_ma'
      }
    },
    date: '2024-08-20T10:45:00Z',
    readTime: 6,
    ogImage: '/images/blog/wedding-dresses-og.jpg',
    metaDescription: 'Beautiful traditional and modern Moroccan wedding dress options.'
  },
  {
    slug: 'wedding-planning-timeline-morocco',
    title: 'Wedding Planning Timeline: 12 Months to Your Moroccan Dream Day',
    excerpt: 'A month-by-month guide to planning your perfect Moroccan wedding, from engagement to the big day.',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    category: 'Planning',
    tags: ['planning', 'timeline', 'organization', 'checklist'],
    author: {
      name: 'Sara Tazi',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      role: 'Wedding Coordinator',
      location: 'Marrakech',
      bio: 'Helping couples create stress-free Moroccan wedding experiences.',
      social: {
        instagram: '@sara_planning_ma'
      }
    },
    date: '2024-08-15T14:20:00Z',
    readTime: 8,
    ogImage: '/images/blog/wedding-timeline-og.jpg',
    metaDescription: 'Complete wedding planning timeline for Moroccan celebrations.'
  },
  {
    slug: 'wedding-cities-morocco-comparison',
    title: 'Wedding Cities in Morocco: Marrakech vs. Casablanca vs. Rabat',
    excerpt: 'Compare the top Moroccan cities for weddings: venues, vendors, costs, and unique advantages of each.',
    coverImage: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&h=400&fit=crop',
    category: 'Cities',
    tags: ['cities', 'comparison', 'marrakech', 'casablanca', 'rabat'],
    author: {
      name: 'Hassan Idrissi',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      role: 'Travel & Wedding Expert',
      location: 'Casablanca',
      bio: 'Exploring Morocco\'s wedding destinations and helping couples choose their perfect location.',
      social: {
        twitter: '@hassan_travel_ma'
      }
    },
    date: '2024-08-10T12:00:00Z',
    readTime: 7,
    ogImage: '/images/blog/cities-comparison-og.jpg',
    metaDescription: 'Compare Morocco\'s top wedding cities: Marrakech, Casablanca, and Rabat.'
  }
];

// Helper functions
export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedPosts(): Post[] {
  return posts.filter(post => post.featured).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(category: string): Post[] {
  return posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): Post[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  return posts
    .filter(post => post.slug !== currentSlug)
    .filter(post =>
      post.category === currentPost.category ||
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): Post[] {
  return posts.filter(post => post.tags.includes(tag));
}
