import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getArticle, getRelated, getAll } from '@/data/articles';
import ArticleLayout from './ArticleLayout';
import { absoluteUrl } from '@/lib/absolute-url';

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Wervice',
    };
  }

  return {
    title: `${article.title} | Wervice Blog`,
    description: article.excerpt || article.content.substring(0, 160),
    keywords: article.tags?.join(', ') || 'Moroccan weddings, wedding planning',
    authors: [{ name: article.author || 'Wervice Team' }],
    openGraph: {
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
      images: article.cover ? [{ url: article.cover, alt: article.title }] : [],
      type: 'article',
      publishedTime: article.date,
      authors: [article.author || 'Wervice Team'],
      tags: article.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
      images: article.cover ? [article.cover] : [],
    },
    alternates: {
      canonical: `/blog/${article.slug}`,
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
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  // Get related articles for the bottom section
  const relatedArticles = getRelated(slug);

  // Get latest and popular articles for the sidebar
  const allArticles = getAll();
  const latestArticles = allArticles.slice(0, 3);
  // Sort by date for popular articles since views property doesn't exist
  const popularArticles = allArticles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Construct the full article URL for social sharing
  const articleUrl = `${absoluteUrl()}${locale}/blog/${slug}`;

  return (
    <ArticleLayout
      article={article}
      relatedArticles={relatedArticles}
      latestArticles={latestArticles}
      popularArticles={popularArticles}
      articleUrl={articleUrl}
    />
  );
}
