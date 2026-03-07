'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  FiClock,
  FiHeart,
  FiMapPin,
  FiPlusCircle,
  FiSearch,
  FiUser,
} from 'react-icons/fi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Article, getAll } from '@/data/articles';

function titleToMeta(title: string) {
  const words = title.split(' ').length;
  const places = (words % 28) + 8;
  const points = (words % 12) + 4;
  return { places, points };
}

function categoryLabel(tags?: string[]) {
  if (!tags || tags.length === 0) return 'Guide';
  const first = tags[0].replace(/-/g, ' ');
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function toCardModel(article: Article, locale: string) {
  const readingTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 220));
  const meta = titleToMeta(article.title);

  return {
    slug: article.slug,
    href: `/${locale}/blog/${article.slug}`,
    title: article.title,
    excerpt: article.excerpt || article.content.slice(0, 150),
    image: article.cover || '/images/sample/venues-1.jpg',
    author: article.author || 'Wervice Editorial',
    date: article.date,
    city: article.tags?.[1] || 'Morocco',
    category: categoryLabel(article.tags),
    readingTime,
    places: meta.places,
    points: meta.points,
  };
}

export default function BlogPageContent() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [query, setQuery] = useState('');

  const cards = useMemo(() => {
    return getAll().map((article) => toCardModel(article, locale));
  }, [locale]);

  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;

    return cards.filter((card) => {
      return (
        card.title.toLowerCase().includes(q) ||
        card.excerpt.toLowerCase().includes(q) ||
        card.city.toLowerCase().includes(q) ||
        card.author.toLowerCase().includes(q) ||
        card.category.toLowerCase().includes(q)
      );
    });
  }, [cards, query]);

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-zinc-900">
      <Header />

      <main className="pt-24 pb-16">
        <section className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">Travel style guides</p>
              <h1 className="text-4xl font-black tracking-tight text-zinc-900 md:text-5xl">Inspiration</h1>
            </div>
            <div className="hidden rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-500 md:block">
              {filteredCards.length} guides
            </div>
          </div>

          <div className="mb-10 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
            <label className="relative block">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for location, category, or author"
                className="w-full rounded-xl border-0 bg-zinc-100 py-3 pl-11 pr-4 text-sm text-zinc-800 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
            </label>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900">Featured guides</h2>
            <p className="text-sm text-zinc-500">Curated for planners and couples</p>
          </div>

          {filteredCards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-600">
              No guides found for this search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
              {filteredCards.map((card) => (
                <article
                  key={card.slug}
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={card.href} className="block">
                    <div className="relative h-60 overflow-hidden">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                      <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-zinc-800">
                        {card.places} places
                      </div>

                      <div className="absolute right-3 top-3 flex items-center gap-2 text-white">
                        <span className="rounded-full bg-black/35 p-1.5 backdrop-blur-sm">
                          <FiHeart className="h-4 w-4" />
                        </span>
                        <span className="rounded-full bg-black/35 p-1.5 backdrop-blur-sm">
                          <FiPlusCircle className="h-4 w-4" />
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="mb-2 line-clamp-2 text-[15px] font-bold leading-tight text-zinc-900 group-hover:text-zinc-700">
                        {card.title}
                      </h3>

                      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1">
                          <FiMapPin className="h-3.5 w-3.5" />
                          {card.city}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiClock className="h-3.5 w-3.5" />
                          {card.readingTime} min
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                        <span className="inline-flex items-center gap-1 text-zinc-600">
                          <FiUser className="h-3.5 w-3.5" />
                          {card.author}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2 py-1 font-medium text-zinc-700">
                          {card.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
