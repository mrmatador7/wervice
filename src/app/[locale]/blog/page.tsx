'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { FiClock, FiUser, FiHeart, FiShare2, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { getAllPosts, getFeaturedPosts, getAllTags, getPostsByTag } from '@/lib/posts';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const POSTS_PER_PAGE = 6;
const TRENDING_TOPICS = [
  'Venues', 'Catering', 'Photo & Video', 'Planning', 'Beauty', 'Decor', 'Music', 'Dresses', 'Cities', 'Budget', 'Tips'
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function ArticleCard({ post, isLarge = false }: { post: any; isLarge?: boolean }) {
  const sizeClasses = isLarge
    ? 'md:col-span-2 md:row-span-2'
    : 'col-span-1';

  const imageHeight = isLarge ? 'h-64 md:h-80' : 'h-44 md:h-48';

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${sizeClasses}`}>
        <div className={`relative ${imageHeight} w-full overflow-hidden`}>
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
          <h3 className={`font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-[#D7FF1F] transition-colors ${isLarge ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}>
            {post.title}
          </h3>

          <p className="text-sm text-slate-600 mb-3 line-clamp-2 md:line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FiUser className="w-3 h-3" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}

function Sidebar() {
  const featuredPosts = getFeaturedPosts().slice(0, 2);
  const popularTags = getAllTags().slice(0, 8);

  return (
    <aside className="space-y-6">
      {/* Author Card */}
      <div className="bg-white rounded-2xl border p-5 sticky top-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D7FF1F] rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">W</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Wervice Team</h3>
          <p className="text-sm text-slate-600 mb-4">Your guide to Moroccan weddings</p>

          <div className="flex justify-center gap-3">
            <a href="#" className="p-2 text-slate-600 hover:text-[#D7FF1F] transition-colors">
              <FiInstagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 text-slate-600 hover:text-[#D7FF1F] transition-colors">
              <FiFacebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 text-slate-600 hover:text-[#D7FF1F] transition-colors">
              <FiTwitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Featured Posts</h3>
        <div className="space-y-4">
          {featuredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-900 line-clamp-2 group-hover:text-[#D7FF1F] transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(post.date)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-sm text-slate-700 rounded-full transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const allPosts = getAllPosts();
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return allPosts;
    return getPostsByTag(selectedTag);
  }, [selectedTag, allPosts]);

  const featuredPosts = getFeaturedPosts();
  const regularPosts = filteredPosts.filter(post => !post.featured);

  // Pagination
  const totalPages = Math.ceil(regularPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = regularPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Wervice Stories & Guides
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Trends, tips and inspiration for Moroccan weddings.
              </p>
            </div>

            {/* Trending Topics */}
            <div className="mt-8 md:mt-12">
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === null
                      ? 'bg-[#D7FF1F] text-slate-900 ring-2 ring-[#D7FF1F]'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All Posts
                </button>
                {TRENDING_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTag(topic)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedTag === topic
                        ? 'bg-[#D7FF1F] text-slate-900 ring-2 ring-[#D7FF1F]'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Featured Posts Row */}
                {currentPage === 1 && !selectedTag && featuredPosts.length >= 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {featuredPosts.slice(0, 2).map((post) => (
                      <ArticleCard key={post.slug} post={post} isLarge />
                    ))}
                  </div>
                )}

                {/* Regular Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {paginatedPosts.map((post) => (
                    <ArticleCard key={post.slug} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-[#D7FF1F] text-slate-900'
                            : 'border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Sidebar />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
