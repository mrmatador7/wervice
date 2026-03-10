import { NextRequest, NextResponse } from 'next/server';
import { ARTICLES, type Article } from '@/data/articles';
import { SEO_ARTICLES } from '@/data/seo-blog-articles';
import {
  getAdminBlogArticles,
  getBlogSeoSettings,
  saveAdminBlogArticles,
} from '@/lib/blog-admin-store';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseTags(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input
      .map((tag) => String(tag || '').trim().toLowerCase())
      .filter(Boolean);
  }

  if (typeof input === 'string') {
    return input
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  return [];
}

export async function GET() {
  try {
    const [customArticles, seo] = await Promise.all([
      getAdminBlogArticles(),
      getBlogSeoSettings(),
    ]);

    const customSlugs = new Set(customArticles.map((article) => article.slug));
    const posts = [...ARTICLES, ...SEO_ARTICLES, ...customArticles]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((article) => ({
        ...article,
        status: article.status || 'Published',
        source: customSlugs.has(article.slug) ? 'admin' : 'website',
      }));

    return NextResponse.json({
      success: true,
      posts,
      seo,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch blog data',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const title = String(body.title || '').trim();
    const slugInput = String(body.slug || '').trim();
    const excerpt = String(body.excerpt || '').trim();
    const cover = String(body.cover || '').trim();
    const author = String(body.author || 'Wervice Editorial').trim();
    const content = String(body.content || '').trim();
    const status: Article['status'] = body.status === 'Draft' ? 'Draft' : 'Published';
    const dateInput = String(body.date || '').trim();
    const tags = parseTags(body.tags);

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title and content are required',
        },
        { status: 400 }
      );
    }

    const slug = slugify(slugInput || title);
    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid slug',
        },
        { status: 400 }
      );
    }

    const articleDate = dateInput ? new Date(dateInput).toISOString() : new Date().toISOString();
    const customArticles = await getAdminBlogArticles();
    const existingPosts = [...ARTICLES, ...SEO_ARTICLES, ...customArticles];

    if (existingPosts.some((article) => article.slug === slug)) {
      return NextResponse.json(
        {
          success: false,
          message: 'A post with this slug already exists',
        },
        { status: 409 }
      );
    }

    const nextArticles: Article[] = [
      {
        slug,
        title,
        excerpt: excerpt || content.slice(0, 170),
        cover: cover || '/images/sample/venues-1.jpg',
        author,
        date: articleDate,
        status,
        tags,
        content,
      },
      ...customArticles,
    ];

    await saveAdminBlogArticles(nextArticles);

    return NextResponse.json({
      success: true,
      post: nextArticles[0],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create post',
      },
      { status: 500 }
    );
  }
}
