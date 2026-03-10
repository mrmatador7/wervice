import { SEO_ARTICLES } from './seo-blog-articles';
import { ARTICLE_TRANSLATIONS } from './article-translations';
import ADMIN_BLOG_ARTICLES from './admin-blog-articles.json';

export type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string;
  author?: string;
  date: string;         // ISO
  status?: 'Draft' | 'Published';
  tags?: string[];
  content: string;      // markdown for now
};

export const ARTICLES: Article[] = [];

const ADMIN_ARTICLES: Article[] = Array.isArray(ADMIN_BLOG_ARTICLES)
  ? (ADMIN_BLOG_ARTICLES as Article[])
  : [];

const ALL_ARTICLES: Article[] = [...ARTICLES, ...SEO_ARTICLES, ...ADMIN_ARTICLES].reduce<Article[]>(
  (acc, article) => {
    if (!article?.slug) return acc;
    if (acc.some((existing) => existing.slug === article.slug)) return acc;
    acc.push(article);
    return acc;
  },
  []
);

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
  const found = ALL_ARTICLES.find((a) => a.slug === slug && (a.status || 'Published') === 'Published') || null;
  if (!found) return null;
  return localizeArticle(found, locale);
};

export const getAll = (locale: string = 'en') => {
  const published = ALL_ARTICLES.filter((article) => (article.status || 'Published') === 'Published');
  // Sort by date in descending order (newest first)
  const sorted = [...published].sort((a, b) => {
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

export const getAllAdmin = (locale: string = 'en') => {
  const sorted = [...ALL_ARTICLES].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
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
