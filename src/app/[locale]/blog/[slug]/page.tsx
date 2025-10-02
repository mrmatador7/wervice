import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { FiClock, FiShare2, FiInstagram, FiFacebook, FiTwitter, FiArrowLeft } from 'react-icons/fi';
import { getPostBySlug, getRelatedPosts } from '@/lib/posts';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface BlogArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function ArticleContent({ content }: { content: string }) {
  // Simple markdown-like content renderer
  // In a real app, you'd use a proper MDX renderer
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <div className="prose prose-lg max-w-none">
      {paragraphs.map((paragraph, index) => {
        if (paragraph.startsWith('# ')) {
          return (
            <h1 key={index} className="text-3xl md:text-4xl font-bold text-slate-900 mt-8 mb-4 first:mt-0">
              {paragraph.replace('# ', '')}
            </h1>
          );
        } else if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl md:text-3xl font-bold text-slate-900 mt-6 mb-3">
              {paragraph.replace('## ', '')}
            </h2>
          );
        } else if (paragraph.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl md:text-2xl font-semibold text-slate-900 mt-5 mb-2">
              {paragraph.replace('### ', '')}
            </h3>
          );
        } else {
          return (
            <p key={index} className="text-slate-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          );
        }
      })}
    </div>
  );
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://wervice.com/blog/${slug}`;
  const text = `Check out this article: ${title}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600 mr-2">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-slate-600 hover:text-[#D7FF1F] transition-colors"
      >
        <FiTwitter className="w-4 h-4" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-slate-600 hover:text-[#D7FF1F] transition-colors"
      >
        <FiFacebook className="w-4 h-4" />
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-slate-600 hover:text-[#D7FF1F] transition-colors"
      >
        <span className="text-xs font-bold">📱</span>
      </a>
    </div>
  );
}

function AuthorBlock({ author }: { author: any }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 mt-12">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={author.avatar}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{author.name}</h3>
              {author.role && (
                <p className="text-slate-600 mb-2">{author.role}</p>
              )}
              {author.bio && (
                <p className="text-slate-700 leading-relaxed">{author.bio}</p>
              )}
            </div>

            <div className="flex gap-3">
              {author.social?.instagram && (
                <a
                  href={`https://instagram.com/${author.social.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-600 hover:text-[#D7FF1F] transition-colors"
                >
                  <FiInstagram className="w-5 h-5" />
                </a>
              )}
              {author.social?.facebook && (
                <a
                  href={author.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-600 hover:text-[#D7FF1F] transition-colors"
                >
                  <FiFacebook className="w-5 h-5" />
                </a>
              )}
              {author.social?.twitter && (
                <a
                  href={`https://twitter.com/${author.social.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-600 hover:text-[#D7FF1F] transition-colors"
                >
                  <FiTwitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RelatedPosts({ posts }: { posts: any[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <article className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <div className="relative h-44 md:h-48 w-full overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-4 md:p-5">
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-[#D7FF1F] transition-colors text-base md:text-lg">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    <span>{post.readTime} min read</span>
                  </div>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Wervice',
    };
  }

  return {
    title: `${post.title} | Wervice Blog`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      images: post.ogImage ? [{ url: post.ogImage, alt: post.title }] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-16">
        {/* Back Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[#D7FF1F] text-slate-900 text-sm font-medium rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>

              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </header>

          {/* Hero Image */}
          <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {post.content && <ArticleContent content={post.content} />}
          </div>

          {/* Author Block */}
          <AuthorBlock author={post.author} />

          {/* Related Posts */}
          <RelatedPosts posts={relatedPosts} />
        </article>
      </main>

      <Footer />
    </div>
  );
}
