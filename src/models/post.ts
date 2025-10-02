export type PostCategory =
  | 'Venues'
  | 'Catering'
  | 'Photo & Video'
  | 'Planning'
  | 'Beauty'
  | 'Decor'
  | 'Music'
  | 'Dresses'
  | 'Cities'
  | 'Tips'
  | 'Budget';

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content?: string; // MDX when used
  coverImage: string;
  category: PostCategory;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role?: string;
    location?: string;
    bio?: string;
    social?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  date: string; // ISO
  readTime: number; // minutes
  featured?: boolean;
  ogImage?: string;
  metaDescription?: string;
};
