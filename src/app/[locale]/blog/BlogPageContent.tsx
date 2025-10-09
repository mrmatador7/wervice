'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FiArrowRight, FiCalendar, FiUser, FiTag, FiClock, FiSearch, FiFacebook, FiTwitter, FiMessageCircle } from 'react-icons/fi';
import { getAll, Article } from '@/data/articles';

function BlogPageContent() {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleArticles, setVisibleArticles] = useState(6);

  // Extract locale from pathname (e.g., /en/blog -> en)
  const locale = pathname.split('/')[1] || 'en';

  // Get articles data with locale-aware URLs
  const allBlogPosts = useMemo(() => {
    return getAll().map((article: Article) => ({
      id: article.slug,
      title: article.title,
      excerpt: article.excerpt || article.content.substring(0, 160) + '...',
      content: article.content,
      author: article.author || 'Wervice Team',
      date: article.date,
      category: (article.tags && article.tags[0]) || 'General',
      readTime: Math.ceil(article.content.split(' ').length / 200),
      href: `/${locale}/blog/${article.slug}`,
      image: article.cover || '/images/sample/venues-1.jpg',
      featured: false,
      views: article.slug.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 900 + 100, // Deterministic view count based on slug
      tags: article.tags || []
    }));
  }, [locale]);

  const categories = ['All', 'Venues', 'Photography', 'Culture', 'Planning', 'Dresses', 'Catering', 'Music'];

  const categoryColors: { [key: string]: string } = {
    Venues: 'bg-blue-100 text-blue-800',
    Photography: 'bg-purple-100 text-purple-800',
    Culture: 'bg-orange-100 text-orange-800',
    Planning: 'bg-green-100 text-green-800',
    Dresses: 'bg-pink-100 text-pink-800',
    Catering: 'bg-red-100 text-red-800',
    Music: 'bg-indigo-100 text-indigo-800'
  };

  // Filter and search logic
  const filteredPosts = useMemo(() => {
    return allBlogPosts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, allBlogPosts]);

  const featuredPost = filteredPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);
  const displayedPosts = regularPosts.slice(0, visibleArticles);
  const popularPosts = [...allBlogPosts].sort((a, b) => b.views - a.views).slice(0, 5);
  const latestPosts = [...allBlogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  const loadMore = () => {
    setVisibleArticles(prev => prev + 6);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Header />

      <main className="pt-16">
        {/* Category Filters */}
        <section className="py-6 border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-[#D7FF1F] text-slate-900 shadow-md ring-2 ring-[#D7FF1F]/50'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">

              {/* Featured Article */}
              {featuredPost && (
                <section className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-80 md:h-96">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-2 bg-[#D7FF1F] text-slate-900 text-sm font-semibold rounded-full shadow-lg">
                          ⭐ Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${categoryColors[featuredPost.category] || 'bg-gray-100 text-gray-800'}`}>
                          {featuredPost.category}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <FiUser className="w-4 h-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4" />
                          <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          <span>{featuredPost.readTime} min read</span>
                        </div>
                      </div>
                      <Link
                        href={featuredPost.href}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
                      >
                        Read More
                        <FiArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </section>
              )}

              {/* Newsletter Subscription */}
              <section className="bg-gradient-to-r from-[#D7FF1F]/10 to-blue-50/50 rounded-2xl p-8 md:p-12 border border-[#D7FF1F]/20">
                <div className="text-center max-w-2xl mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    Get Weekly Moroccan Wedding Tips
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Subscribe to our newsletter and receive expert advice, cultural insights, and exclusive planning tips straight to your inbox.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent"
                    />
                    <button className="px-6 py-3 bg-[#D7FF1F] text-slate-900 font-semibold rounded-full hover:bg-[#D7FF1F]/90 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </section>

              {/* Article Cards Grid */}
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {displayedPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2"
                    >
                      <Link href={post.href} className="block">
                        {/* Featured Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-lg ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}>
                              {post.category}
                            </span>
                          </div>
                          {/* Social Share Icons on Hover */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex gap-2">
                              <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                                <FiFacebook className="w-4 h-4 text-blue-600" />
                              </button>
                              <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                                <FiTwitter className="w-4 h-4 text-blue-400" />
                              </button>
                              <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                                <FiMessageCircle className="w-4 h-4 text-green-600" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2 group-hover:text-[#D7FF1F] transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-slate-600 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between text-sm text-slate-500">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <FiUser className="w-4 h-4" />
                                <span className="font-medium">{post.author}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FiCalendar className="w-4 h-4" />
                                <span>{new Date(post.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiClock className="w-4 h-4" />
                              <span>{post.readTime} min</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>

                {/* Load More Button */}
                {displayedPosts.length < regularPosts.length && (
                  <div className="text-center pt-8">
                    <button
                      onClick={loadMore}
                      className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Load More Articles
                    </button>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Search */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-32">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search wedding tips..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Latest Articles */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Latest Articles</h3>
                <div className="space-y-4">
                  {latestPosts.map((post) => (
                    <Link key={post.id} href={post.href} className="group block">
                      <div className="flex gap-3">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-900 line-clamp-2 group-hover:text-[#D7FF1F] transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(post.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular Reads */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Popular Reads</h3>
                <div className="space-y-3">
                  {popularPosts.map((post, index) => (
                    <Link key={post.id} href={post.href} className="group flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#D7FF1F] rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 line-clamp-2 group-hover:text-[#D7FF1F] transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {post.views} views
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(1).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 text-xs rounded-full transition-all ${
                        selectedCategory === category
                          ? `${categoryColors[category]} ring-2 ring-offset-2 ring-slate-300`
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <div className="pb-16"></div>

      <Footer />
    </div>
  );
}

export default BlogPageContent;
