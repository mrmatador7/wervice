import { SEO_ARTICLES } from './seo-blog-articles';
import { ARTICLE_TRANSLATIONS } from './article-translations';

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

function translateAuthor(author: string | undefined, locale: string) {
  const safe = author || 'Wervice Editorial';
  if (safe !== 'Wervice Editorial') return safe;
  if (locale === 'fr') return 'Éditorial Wervice';
  if (locale === 'ar') return 'فريق Wervice التحريري';
  return safe;
}

function localizeArticle(article: Article, locale: string): Article {
  const lc = (locale || 'en').toLowerCase();
  if (lc === 'en') {
    return {
      ...article,
      author: translateAuthor(article.author, lc),
      content: article.content.replace(/\/en\//g, '/en/'),
    };
  }

  const t = ARTICLE_TRANSLATIONS[article.slug]?.[lc as 'fr' | 'ar'];
  return {
    ...article,
    title: t?.title || article.title,
    excerpt: t?.excerpt || article.excerpt,
    author: translateAuthor(article.author, lc),
    content: article.content.replace(/\/en\//g, `/${lc}/`),
  };
}

export const getArticle = (slug: string, locale: string = 'en') => {
  const found = ALL_ARTICLES.find((a) => a.slug === slug) || null;
  if (!found) return null;
  return localizeArticle(found, locale);
};

export const getAll = (locale: string = 'en') => {
  // Sort by date in descending order (newest first)
  const sorted = [...ALL_ARTICLES].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    // If dates are equal, sort by title for consistency
    if (dateA === dateB) {
      return a.title.localeCompare(b.title);
    }
    return dateB - dateA;
  });
  return sorted.map((article) => localizeArticle(article, locale));
};
export const getRelated = (slug: string, locale: string = 'en') =>
  getAll(locale).filter((a) => a.slug !== slug).slice(0, 3);
export { ALL_ARTICLES };
