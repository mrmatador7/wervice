export type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string;
  author?: string;
  date: string;         // ISO
  tags?: string[];
  content: string;      // markdown for now
};

export const ARTICLES: Article[] = [
  // Migrated from existing blog posts
  {
    slug: 'ultimate-guide-moroccan-wedding-venues',
    title: 'The Ultimate Guide to Moroccan Wedding Venues',
    excerpt: 'From traditional riads in Marrakech to modern halls in Casablanca, discover the perfect venue for your Moroccan celebration.',
    cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop',
    author: 'Fatima Alaoui',
    date: '2024-09-25T10:00:00Z',
    tags: ['venues', 'marrakech', 'riad', 'traditional'],
    content: `# The Ultimate Guide to Moroccan Wedding Venues

Morocco offers a stunning variety of wedding venues that blend traditional architecture with modern luxury. Whether you're dreaming of an intimate riad ceremony or a grand celebration, there's a venue for every couple.

## Traditional Riad Venues

Riads offer an intimate, authentic Moroccan experience with beautiful courtyards, intricate tilework, and traditional architecture. Perfect for couples seeking a romantic, culturally immersive celebration.

## Modern Wedding Halls

Contemporary venues in major cities like Casablanca and Rabat provide state-of-the-art facilities with Moroccan-inspired design elements.

## Garden and Outdoor Venues

For couples who love nature, Morocco's gardens and outdoor spaces offer breathtaking backdrops for unforgettable ceremonies.`
  },
  {
    slug: 'authentic-moroccan-catering-guide',
    title: 'Authentic Moroccan Catering: Traditional Flavors for Modern Couples',
    excerpt: 'Learn about traditional Moroccan dishes, modern fusion options, and how to create a memorable wedding feast.',
    cover: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
    author: 'Ahmed Bennani',
    date: '2024-09-20T10:00:00Z',
    tags: ['catering', 'food', 'traditional', 'fusion'],
    content: `# Authentic Moroccan Catering: Traditional Flavors for Modern Couples

Discover the rich culinary traditions of Morocco and how to incorporate them into your modern wedding celebration.

## Traditional Moroccan Dishes

Moroccan cuisine is renowned for its bold flavors and communal dining experience. Traditional dishes include tagine, couscous, and pastilla.

## Modern Fusion Options

Many caterers now offer fusion menus that blend Moroccan flavors with international cuisine, catering to diverse palates.

## Dietary Considerations

From halal options to vegetarian alternatives, modern Moroccan catering can accommodate various dietary needs.`
  },
  {
    slug: 'photography-videography-moroccan-weddings',
    title: 'Photography & Videography for Moroccan Weddings',
    excerpt: 'Capture the magic of your Moroccan wedding with expert photographers and videographers.',
    cover: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop',
    author: 'Sara Tazi',
    date: '2024-09-15T10:00:00Z',
    tags: ['photography', 'videography', 'documentation'],
    content: `# Photography & Videography for Moroccan Weddings

Preserve the memories of your special day with professional photography and videography services tailored to Moroccan weddings.

## Cultural Documentation

Understanding and capturing Moroccan wedding traditions, from henna ceremonies to traditional dances.

## Modern Techniques

Combining contemporary photography styles with the unique beauty of Moroccan settings and customs.

## Package Options

From full-day coverage to highlight reels, find the perfect documentation package for your celebration.`
  },
  {
    slug: 'wedding-planning-morocco',
    title: 'Wedding Planning in Morocco: A Complete Guide',
    excerpt: 'Everything you need to know about planning your dream wedding in Morocco.',
    cover: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=400&fit=crop',
    author: 'Wervice Editorial',
    date: '2024-09-10T10:00:00Z',
    tags: ['planning', 'guide', 'morocco'],
    content: `# Wedding Planning in Morocco: A Complete Guide

Planning a wedding in Morocco combines the romance of a destination wedding with rich cultural traditions. Here's everything you need to know.

## Choosing Your Date

Morocco's climate varies by region and season. Spring and fall offer ideal weather for outdoor ceremonies.

## Legal Requirements

Understanding marriage requirements in Morocco for international couples, including documentation and ceremonies.

## Vendor Coordination

Working with local vendors who understand both Moroccan traditions and international expectations.

## Cultural Considerations

Respecting local customs while creating a celebration that reflects your unique love story.`
  },
  {
    slug: 'moroccan-henna-traditions',
    title: 'Moroccan Henna Traditions and Modern Interpretations',
    excerpt: 'Explore the beautiful tradition of henna in Moroccan weddings and contemporary adaptations.',
    cover: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800&h=400&fit=crop',
    author: 'Nadia El Mansouri',
    date: '2024-09-05T10:00:00Z',
    tags: ['henna', 'tradition', 'beauty', 'culture'],
    content: `# Moroccan Henna Traditions and Modern Interpretations

Henna holds a special place in Moroccan wedding traditions, symbolizing joy, celebration, and the beginning of married life.

## Traditional Henna Ceremony

The henna night is a festive pre-wedding celebration where family and friends gather for music, dancing, and intricate henna designs.

## Modern Adaptations

Contemporary couples are finding creative ways to incorporate henna into their weddings, from minimalist designs to full traditional ceremonies.

## Choosing Your Henna Artist

Finding skilled henna artists who understand both traditional patterns and modern styles.

## Symbolism and Meaning

The deeper significance of henna in Moroccan culture and its role in wedding celebrations.`
  }
];

export const getArticle = (slug: string) => ARTICLES.find(a => a.slug === slug) || null;
export const getAll = () => [...ARTICLES].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
export const getRelated = (slug: string) => getAll().filter(a => a.slug !== slug).slice(0, 3);

