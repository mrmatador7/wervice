'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { FiClock, FiCalendar, FiUser, FiTag, FiMail } from 'react-icons/fi';
import { RiTwitterXFill, RiFacebookCircleFill, RiLinkedinFill, RiWhatsappFill } from 'react-icons/ri';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Article } from '@/data/articles';

interface ArticleLayoutProps {
  article: Article;
  relatedArticles: Article[];
  latestArticles: Article[];
  popularArticles: Article[];
  articleUrl: string;
}

// Social Share Component
function SocialShare({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const shareButtons = [
    {
      href: shareLinks.twitter,
      icon: RiTwitterXFill,
      label: 'Share on X',
      ariaLabel: 'Share on X',
    },
    {
      href: shareLinks.facebook,
      icon: RiFacebookCircleFill,
      label: 'Share on Facebook',
      ariaLabel: 'Share on Facebook',
    },
    {
      href: shareLinks.linkedin,
      icon: RiLinkedinFill,
      label: 'Share on LinkedIn',
      ariaLabel: 'Share on LinkedIn',
    },
    {
      href: shareLinks.whatsapp,
      icon: RiWhatsappFill,
      label: 'Share on WhatsApp',
      ariaLabel: 'Share on WhatsApp',
    },
  ];

  return (
    <>
      {/* Desktop: Fixed left sidebar */}
      <div className="fixed left-10 top-1/2 -translate-y-1/2 z-40 hidden lg:flex animate-[fadeInUp_0.4s_ease-out]">
        <div className="bg-white/80 backdrop-blur-md border border-neutral-100 rounded-2xl p-3 flex flex-col items-center gap-3 shadow-lg">
          <p className="text-[12px] text-neutral-500 font-medium mb-2">Share</p>
          <div className="flex flex-col gap-3">
            {shareButtons.map((button) => (
              <a
                key={button.label}
                href={button.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center rounded-full text-[#0F0F0F] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-neutral-100 transition-all duration-200 hover:bg-[#D9FF3F] hover:text-black hover:scale-110 hover:shadow-[0_4px_20px_rgba(217,255,63,0.3)]"
                aria-label={button.ariaLabel}
              >
                <button.icon className="w-4 h-4" />
                {/* Tooltip */}
                <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {button.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Horizontal bar at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden animate-[fadeInUp_0.4s_ease-out]">
        <div className="bg-white/90 backdrop-blur-md border border-neutral-100 rounded-2xl px-4 py-3 flex items-center gap-4 shadow-lg">
          <p className="text-[12px] text-neutral-500 font-medium mr-2">Share</p>
          <div className="flex gap-3">
            {shareButtons.map((button) => (
              <a
                key={button.label}
                href={button.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center rounded-full text-[#0F0F0F] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-neutral-100 transition-all duration-200 hover:bg-[#D9FF3F] hover:text-black hover:scale-110 hover:shadow-[0_4px_20px_rgba(217,255,63,0.3)]"
                aria-label={button.ariaLabel}
              >
                <button.icon className="w-4 h-4" />
                {/* Tooltip */}
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {button.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Article Content Component
function ArticleContent({ article }: { article: Article }) {

  const readingTime = Math.ceil(article.content.split(' ').length / 200); // Rough estimate

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      {/* Article Header */}
      <header className="mb-12">
        {/* Category Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 text-xs font-medium bg-[#D7FF1F] text-slate-900 rounded-full"
              >
                <FiTag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold text-neutral-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-neutral-600 text-sm mb-8">
          <div className="flex items-center gap-2">
            <FiUser className="w-4 h-4" />
            <span>{article.author || 'Wervice Team'}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="w-4 h-4" />
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="w-4 h-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {article.cover && (
        <div className="mb-12">
          <div className="relative w-full h-[420px] rounded-2xl shadow-md overflow-hidden">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg prose-neutral leading-relaxed text-neutral-800 max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-bold text-neutral-900 mt-12 mb-6">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-3">{children}</h3>,
            p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="mb-4 ml-6 list-disc">{children}</ul>,
            ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[#D7FF1F] pl-4 italic text-neutral-700 my-6">
                {children}
              </blockquote>
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}

// Sidebar Component
function Sidebar({ latestArticles, popularArticles }: {
  latestArticles: Article[];
  popularArticles: Article[];
}) {
  return (
    <aside className="hidden lg:block w-[300px] pl-10 space-y-8">
      {/* Latest Articles */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Latest Articles</h3>
        <div className="space-y-4">
          {latestArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block"
            >
              <div className="flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={article.cover || '/images/sample/venues-1.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-neutral-900 line-clamp-2 group-hover:text-[#D7FF1F] transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    {new Date(article.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Reads */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Popular Reads</h3>
        <div className="space-y-3">
          {popularArticles.map((article, index) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex items-center gap-3"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-[#D7FF1F] rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-neutral-900 line-clamp-2 group-hover:text-[#D7FF1F] transition-colors">
                  {article.title}
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  {article.slug.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 900 + 100} views
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Subscribe Card */}
      <div className="bg-gradient-to-br from-[#D7FF1F]/10 to-[#D7FF1F]/5 rounded-2xl border border-[#D7FF1F]/20 p-6">
        <div className="text-center">
          <FiMail className="w-8 h-8 text-[#D7FF1F] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Get Weekly Tips
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            Subscribe for expert Moroccan wedding advice
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent"
            />
            <button className="w-full px-4 py-2 bg-[#D7FF1F] text-slate-900 font-semibold rounded-lg hover:bg-[#D7FF1F]/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Related Articles Component
function RelatedArticles({ articles }: { articles: Article[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
          More Articles You Might Like
        </h2>
        <p className="text-neutral-600">
          Discover more insights about planning your perfect Moroccan wedding
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2"
          >
            <Link href={`/blog/${article.slug}`} className="block">
              {/* Article Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.cover || '/images/sample/venues-1.jpg'}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Article Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-900 mb-3 line-clamp-2 group-hover:text-[#D7FF1F] transition-colors">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="text-neutral-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    <span className="font-medium">{article.author || 'Wervice Team'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    <span>{Math.ceil((article.content?.split(' ').length || 0) / 200)} min</span>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ArticleLayout({
  article,
  relatedArticles,
  latestArticles,
  popularArticles,
  articleUrl,
}: ArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Social Share - Fixed Position */}
            <SocialShare
              url={articleUrl}
              title={article.title}
            />

            {/* Article Content */}
            <div className="flex-1">
              <ArticleContent article={article} />
            </div>

            {/* Sidebar */}
            <Sidebar latestArticles={latestArticles} popularArticles={popularArticles} />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-200 my-16"></div>

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />
      </main>

      <Footer />
    </div>
  );
}
