import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import { getArticle, getRelated, getAll } from '@/data/articles';
import ArticleLayout from './ArticleLayout';
import { absoluteUrl } from '@/lib/absolute-url';
import { toAbsoluteUrl } from '@/lib/seo/site-url';

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const seoCopy = {
    en: {
      notFound: 'Article Not Found | Wervice',
      blogSuffix: 'Wervice Blog',
      fallbackKeywords: 'Moroccan weddings, wedding planning',
      fallbackAuthor: 'Wervice Team',
    },
    fr: {
      notFound: 'Article Introuvable | Wervice',
      blogSuffix: 'Blog Wervice',
      fallbackKeywords: 'mariage marocain, organisation mariage',
      fallbackAuthor: 'Equipe Wervice',
    },
    ar: {
      notFound: 'المقال غير موجود | Wervice',
      blogSuffix: 'مدونة Wervice',
      fallbackKeywords: 'زفاف مغربي، تخطيط الزفاف',
      fallbackAuthor: 'فريق Wervice',
    },
  } as const;
  const current = seoCopy[locale as keyof typeof seoCopy] || seoCopy.en;
  const legacySlugRedirects: Record<string, string> = {
    'photography-videography-moroccan-weddings': 'best-wedding-photographers-marrakech-2026',
    'wedding-trends-2025': 'best-wedding-photographers-marrakech-2026',
  };
  const redirectedSlug = legacySlugRedirects[slug] || slug;
  const article = getArticle(redirectedSlug, locale);

  if (!article) {
    return {
      title: current.notFound,
    };
  }

  return {
    title: `${article.title} | ${current.blogSuffix}`,
    description: article.excerpt || article.content.substring(0, 160),
    keywords: article.tags?.join(', ') || current.fallbackKeywords,
    authors: [{ name: article.author || current.fallbackAuthor }],
    openGraph: {
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
      images: article.cover ? [{ url: article.cover, alt: article.title }] : [],
      type: 'article',
      publishedTime: article.date,
      authors: [article.author || current.fallbackAuthor],
      tags: article.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
      images: article.cover ? [article.cover] : [],
    },
    alternates: {
      canonical: toAbsoluteUrl(`/${locale}/blog/${article.slug}`),
      languages: {
        en: toAbsoluteUrl(`/en/blog/${article.slug}`),
        fr: toAbsoluteUrl(`/fr/blog/${article.slug}`),
        ar: toAbsoluteUrl(`/ar/blog/${article.slug}`),
        'x-default': toAbsoluteUrl(`/en/blog/${article.slug}`),
      },
    },
  };
}

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = getAll();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

interface ArticlePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const legacySlugRedirects: Record<string, string> = {
    'photography-videography-moroccan-weddings': 'best-wedding-photographers-marrakech-2026',
    'wedding-trends-2025': 'best-wedding-photographers-marrakech-2026',
  };
  const redirectedSlug = legacySlugRedirects[slug];
  if (redirectedSlug) {
    permanentRedirect(`/${locale}/blog/${redirectedSlug}`);
  }
  const article = getArticle(slug, locale);

  if (!article) {
    notFound();
  }

  // Get related articles for the bottom section
  const relatedArticles = getRelated(slug, locale);

  // Get latest and popular articles for the sidebar
  const allArticles = getAll(locale);
  const latestArticles = allArticles.slice(0, 3);
  // Sort by date for popular articles since views property doesn't exist
  const popularArticles = allArticles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Construct the full article URL for social sharing
  const articleUrl = absoluteUrl(`/${locale}/blog/${slug}`);

  return (
    <ArticleLayout
      article={article}
      relatedArticles={relatedArticles}
      latestArticles={latestArticles}
      popularArticles={popularArticles}
      articleUrl={articleUrl}
      locale={locale}
    />
  );
}
