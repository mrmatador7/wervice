'use client';

import Link from 'next/link';
import Image from 'next/image';

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  readTime?: number;
  publishDate: string;
  category?: string;
}

// Mock blog articles data
const blogArticles: BlogArticle[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to Moroccan Wedding Traditions',
    excerpt: 'Discover the rich cultural heritage and beautiful traditions that make Moroccan weddings truly magical. From henna ceremonies to traditional music and dance.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    slug: 'moroccan-wedding-traditions-guide',
    readTime: 8,
    publishDate: '2024-01-15',
    category: 'Culture'
  },
  {
    id: '2',
    title: 'Top 10 Venues for Your Dream Wedding in Marrakech',
    excerpt: 'Explore the most breathtaking wedding venues in Marrakech, from luxurious riads to stunning gardens and palaces that will make your special day unforgettable.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    slug: 'top-venues-marrakech-wedding',
    readTime: 6,
    publishDate: '2024-01-12',
    category: 'Venues'
  },
  {
    id: '3',
    title: 'How to Choose the Perfect Wedding Photographer',
    excerpt: 'Essential tips for selecting a wedding photographer who can capture the magic of your special day. Learn what to look for in portfolios, communication style, and pricing.',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    slug: 'choosing-wedding-photographer',
    readTime: 5,
    publishDate: '2024-01-10',
    category: 'Photography'
  },
  {
    id: '4',
    title: 'Sustainable Wedding Planning: Eco-Friendly Moroccan Weddings',
    excerpt: 'Learn how to plan a beautiful wedding while being environmentally conscious. Discover local vendors committed to sustainable practices and green alternatives.',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    slug: 'sustainable-wedding-planning-morocco',
    readTime: 7,
    publishDate: '2024-01-08',
    category: 'Planning'
  }
];

export default function BlogArticles() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
        <h2 className="font-inter font-bold text-3xl md:text-4xl text-gray-900 mb-4">
          Wedding Insights & Stories
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover expert advice, beautiful stories, and practical tips for planning your perfect Moroccan wedding
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {blogArticles.map((article) => (
          <article
            key={article.id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
          >
            <Link href="/articles" className="block">
              {/* Article Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  loading="lazy"
                />
                {/* Category Badge */}
                {article.category && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
                      {article.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <time dateTime={article.publishDate}>
                    {new Date(article.publishDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                  {article.readTime && (
                    <>
                      <span>•</span>
                      <span>{article.readTime} min read</span>
                    </>
                  )}
                </div>

                <h3 className="font-inter font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {article.title}
                </h3>

                <p className="text-gray-600 text-base leading-relaxed line-clamp-3 mb-4">
                  {article.excerpt}
                </p>

                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-200">
                  Read more
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* View All Articles CTA */}
      <div className="text-center">
        <Link
          href="/articles"
          className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          View All Articles
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      </div>
    </section>
  );
}
