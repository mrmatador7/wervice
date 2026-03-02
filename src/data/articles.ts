import { SEO_ARTICLES } from './seo-blog-articles';

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

export const ARTICLES: Article[] = [];

const ALL_ARTICLES: Article[] = [...ARTICLES, ...SEO_ARTICLES];

export const getArticle = (slug: string) => ALL_ARTICLES.find(a => a.slug === slug) || null;
export const getAll = () => {
  // Sort by date in descending order (newest first)
  return [...ALL_ARTICLES].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    // If dates are equal, sort by title for consistency
    if (dateA === dateB) {
      return a.title.localeCompare(b.title);
    }
    return dateB - dateA;
  });
};
export const getRelated = (slug: string) => getAll().filter(a => a.slug !== slug).slice(0, 3);
export { ALL_ARTICLES };

