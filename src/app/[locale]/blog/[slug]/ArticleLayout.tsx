'use client';

import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { FiClock, FiMapPin, FiUser } from 'react-icons/fi';
import { RiCompassDiscoverLine } from 'react-icons/ri';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Article } from '@/data/articles';
import { localizeCityLabel } from '@/lib/types/vendor';

interface ArticleLayoutProps {
  article: Article;
  relatedArticles: Article[];
  latestArticles: Article[];
  popularArticles: Article[];
  articleUrl: string;
  locale: string;
}

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map((child) => extractText(child)).join('').trim();
  }
  if (React.isValidElement(children)) {
    return extractText(children.props?.children);
  }
  return '';
}

function cityFromVendorHref(href: string): string {
  const clean = href.split('?')[0];
  const parts = clean.split('/').filter(Boolean);
  if (parts.length < 4) return 'Morocco';
  const citySlug = parts[1] || '';
  return citySlug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function articleMeta(article: Article, locale: string) {
  const words = article.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 220));

  return {
    readTime,
    city: localizeCityLabel(
      article.tags?.[1]
        ? article.tags[1].charAt(0).toUpperCase() + article.tags[1].slice(1)
        : 'Morocco',
      locale
    ),
    updated: new Date(article.date).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    places: (words % 21) + 6,
    restaurants: (words % 18) + 4,
    highlights: (words % 12) + 3,
  };
}

function OverviewBlock({ article }: { article: Article }) {
  return (
    <section className="border-b border-zinc-200 pb-10">
      <h2 className="mb-4 text-4xl font-black tracking-tight text-zinc-900 md:text-5xl">Overview</h2>
      <p className="max-w-3xl text-lg leading-relaxed text-zinc-700">
        {article.excerpt || article.content.slice(0, 220)}
      </p>
    </section>
  );
}

function PlacesSummary({ article }: { article: Article }) {
  const meta = articleMeta(article, 'en');

  return (
    <section className="border-b border-zinc-200 py-10">
      <h3 className="mb-7 text-2xl font-bold text-zinc-900">Places and Experiences</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Hotels</p>
          <p className="mt-1 text-2xl font-extrabold text-zinc-900">{meta.places}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Restaurants</p>
          <p className="mt-1 text-2xl font-extrabold text-zinc-900">{meta.restaurants}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Attractions</p>
          <p className="mt-1 text-2xl font-extrabold text-zinc-900">{meta.highlights}</p>
        </div>
      </div>
    </section>
  );
}

function ArticleBody({ article }: { article: Article }) {
  return (
    <section className="py-10">
      <div className="prose prose-zinc max-w-none text-[17px] leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="mt-12 mb-4 text-4xl font-black tracking-tight text-zinc-900">{children}</h1>,
            h2: ({ children }) => <h2 className="mt-12 mb-4 text-3xl font-black tracking-tight text-zinc-900">{children}</h2>,
            h3: ({ children }) => <h3 className="mt-8 mb-4 text-2xl font-bold text-zinc-900">{children}</h3>,
            p: ({ children }) => {
              const childArray = React.Children.toArray(children);
              if (
                childArray.length === 1 &&
                React.isValidElement(childArray[0]) &&
                typeof childArray[0].props?.title === 'string' &&
                childArray[0].props.title.startsWith('card:')
              ) {
                return <div className="mb-5">{children}</div>;
              }

              return <p className="mb-5 text-zinc-700">{children}</p>;
            },
            ul: ({ children }) => <ul className="mb-6 list-disc pl-6 text-zinc-700">{children}</ul>,
            ol: ({ children }) => <ol className="mb-6 list-decimal pl-6 text-zinc-700">{children}</ol>,
            li: ({ children }) => <li className="mb-2">{children}</li>,
            a: ({ href, title, children }) => {
              const isInternal = typeof href === 'string' && href.startsWith('/');
              const cardImage = typeof title === 'string' && title.startsWith('card:')
                ? title.slice(5).trim()
                : null;

              if (isInternal && cardImage) {
                const vendorName = extractText(children) || 'Venue';
                const city = cityFromVendorHref(href);
                return (
                  <Link
                    href={href || '#'}
                    title={typeof title === 'string' ? title : undefined}
                    className="my-2 inline-block align-top no-underline"
                  >
                    <article className="group flex w-[270px] items-center gap-2.5 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#eef2f7]">
                        <Image
                          src={cardImage}
                          alt={vendorName}
                          fill
                          sizes="64px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-[13px] font-bold text-zinc-900">{vendorName}</p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-600">{city}</p>
                        <p className="mt-1 text-[11px] font-semibold text-[#1f5eff]">View venue page</p>
                      </div>
                    </article>
                  </Link>
                );
              }

              return (
                <a
                  href={href}
                  className="font-semibold text-zinc-900 underline decoration-zinc-400 underline-offset-4 hover:decoration-zinc-900"
                >
                  {children}
                </a>
              );
            },
            strong: ({ children }) => <strong className="font-bold text-zinc-900">{children}</strong>,
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>
    </section>
  );
}

function RelatedGuides({ articles, locale }: { articles: Article[]; locale: string }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12 border-t border-zinc-200 pt-10">
      <div className="mb-6 flex items-center gap-2">
        <RiCompassDiscoverLine className="h-5 w-5 text-zinc-700" />
        <h4 className="text-xl font-bold text-zinc-900">More Inspiration</h4>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {articles.map((item) => (
          <Link
            key={item.slug}
            href={`/${locale}/blog/${item.slug}`}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative h-40">
              <Image
                src={item.cover || '/images/sample/venues-1.jpg'}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <p className="mb-2 line-clamp-2 text-sm font-bold text-zinc-900">{item.title}</p>
              <p className="line-clamp-2 text-xs text-zinc-600">{item.excerpt || 'Explore this guide.'}</p>
            </div>
          </Link>
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
  locale,
}: ArticleLayoutProps) {
  const ui = {
    en: {
      guide: 'Inspiration Guide',
      minRead: 'min read',
      updated: 'Updated',
    },
    fr: {
      guide: "Guide d'inspiration",
      minRead: 'min de lecture',
      updated: 'Mis à jour',
    },
    ar: {
      guide: 'دليل الإلهام',
      minRead: 'دقيقة قراءة',
      updated: 'آخر تحديث',
    },
  }[(locale as 'en' | 'fr' | 'ar')] || {
    guide: 'Inspiration Guide',
    minRead: 'min read',
    updated: 'Updated',
  };

  const meta = articleMeta(article, locale);

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-zinc-900">
      <Header />

      <main className="pt-20 pb-16">
        <section className="mx-auto w-full max-w-[1150px] px-4 md:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[30px] border border-zinc-200 bg-black">
            <div className="relative h-[340px] md:h-[460px]">
              <Image
                src={article.cover || '/images/sample/venues-1.jpg'}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15" />

              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10">
                <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] backdrop-blur-sm">
                  {ui.guide}
                </p>
                <h1 className="max-w-4xl text-3xl font-black leading-tight md:text-6xl">{article.title}</h1>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/90">
                  <span className="inline-flex items-center gap-2">
                    <FiUser className="h-4 w-4" />
                    {article.author || 'Wervice Editorial'}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FiMapPin className="h-4 w-4" />
                    {meta.city}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FiClock className="h-4 w-4" />
                    {meta.readTime} {ui.minRead}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-0.5 text-xs backdrop-blur-sm">
                    {ui.updated} {meta.updated}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 grid w-full max-w-[1150px] grid-cols-1 gap-8 px-4 md:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
          <div>
            <OverviewBlock article={article} />
            <PlacesSummary article={article} />
            <ArticleBody article={article} />
            <RelatedGuides articles={relatedArticles} locale={locale} />
          </div>

          <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-zinc-500">Explore Next</h3>

            <div className="mb-6 space-y-3">
              {latestArticles.slice(0, 3).map((item) => (
                <Link
                  key={item.slug}
                  href={`/${locale}/blog/${item.slug}`}
                  className="block rounded-xl border border-zinc-200 px-3 py-2 transition hover:bg-zinc-50"
                >
                  <p className="line-clamp-2 text-sm font-semibold text-zinc-900">{item.title}</p>
                </Link>
              ))}
            </div>

            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Popular</h4>
            <div className="space-y-2">
              {popularArticles.slice(0, 4).map((item, index) => (
                <Link key={item.slug} href={`/${locale}/blog/${item.slug}`} className="flex items-start gap-2 rounded-lg p-1.5 hover:bg-zinc-50">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="line-clamp-2 text-xs font-medium text-zinc-700">{item.title}</span>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs text-zinc-600">Share URL</p>
              <p className="mt-1 line-clamp-2 break-all text-xs font-medium text-zinc-900">{articleUrl}</p>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
