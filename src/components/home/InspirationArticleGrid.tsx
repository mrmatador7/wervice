'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock3, MapPin, User, X } from 'lucide-react';
import type { Article } from '@/data/articles';

type InspirationArticleGridProps = {
  locale: string;
  articles: Article[];
};

function articleCity(article: Article) {
  const city = article.tags?.[1];
  if (!city) return 'Morocco';
  return city.charAt(0).toUpperCase() + city.slice(1);
}

function articleCategory(article: Article) {
  const tag = article.tags?.[0] || 'guide';
  return tag.replace(/-/g, ' ');
}

function articleReadTime(article: Article) {
  return Math.max(1, Math.ceil(article.content.split(/\s+/).length / 220));
}

function articleSummary(article: Article) {
  if (article.excerpt?.trim()) return article.excerpt.trim();
  const raw = article.content
    .replace(/^#+\s.*$/gm, '')
    .replace(/\[[^\]]+\]\([^\)]+\)/g, '')
    .replace(/[\*_`>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return raw.slice(0, 220) + (raw.length > 220 ? '...' : '');
}

function cleanMarkdown(markdown: string) {
  return markdown
    .replace(/^#\s.*$/m, '')
    .trim();
}

export default function InspirationArticleGrid({ locale, articles }: InspirationArticleGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedArticle = useMemo(
    () => (selectedSlug ? articles.find((article) => article.slug === selectedSlug) || null : null),
    [articles, selectedSlug]
  );

  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    return articles.filter((article) => article.slug !== selectedArticle.slug).slice(0, 8);
  }, [articles, selectedArticle]);

  const updateArticleQuery = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) params.set('article', slug);
      else params.delete('article');
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const articleSlug = searchParams.get('article');
    if (!articleSlug) {
      setSelectedSlug(null);
      return;
    }
    const exists = articles.some((article) => article.slug === articleSlug);
    setSelectedSlug(exists ? articleSlug : null);
  }, [searchParams, articles]);

  return (
    <>
      <section className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">Inspiration</h1>
        <p className="mt-3 text-lg text-[#4a5c74]">Explore guides and real wedding ideas.</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {articles.map((article) => (
            <button
              key={article.slug}
              type="button"
              onClick={() => {
                setSelectedSlug(article.slug);
                updateArticleQuery(article.slug);
              }}
              className="group overflow-hidden rounded-2xl border border-[#d7deea] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={article.cover || '/images/sample/venues-1.jpg'}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <p className="mb-1 inline-flex rounded-full bg-[#11190C] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#D9FF0A]">
                  {articleCategory(article)}
                </p>
                <h3 className="line-clamp-2 text-xl font-bold leading-tight text-[#11190C]">{article.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-[#52657f]">{articleSummary(article)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedArticle && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/20"
            aria-label="Close article panel"
            onClick={() => {
              setSelectedSlug(null);
              updateArticleQuery(null);
            }}
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-[680px] overflow-y-auto border-l border-black/10 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-4xl font-black tracking-tight text-[#11190C]">{selectedArticle.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-base text-[#5f6f84]">
                  <MapPin className="h-4 w-4" />
                  {articleCity(selectedArticle)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSlug(null);
                  updateArticleQuery(null);
                }}
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 hover:bg-black/5"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="relative col-span-2 h-72 overflow-hidden rounded-2xl bg-[#eef2f7]">
                <Image
                  src={selectedArticle.cover || '/images/sample/venues-1.jpg'}
                  alt={selectedArticle.title}
                  fill
                  sizes="420px"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {relatedArticles.slice(0, 4).map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => {
                      setSelectedSlug(item.slug);
                      updateArticleQuery(item.slug);
                    }}
                    className={`relative h-[84px] overflow-hidden rounded-xl bg-[#EEE9E1] text-left ${
                      item.slug === selectedArticle.slug ? 'ring-2 ring-[#D9FF0A]' : ''
                    }`}
                  >
                    <Image
                      src={item.cover || '/images/sample/venues-1.jpg'}
                      alt={item.title}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-black/10 pt-5">
              <h4 className="text-lg font-bold text-[#11190C]">Overview</h4>
              <p className="mt-2 text-sm leading-6 text-[#4d6078]">{articleSummary(selectedArticle)}</p>
            </div>

            <div className="mt-6 border-t border-black/10 pt-5">
              <h4 className="text-lg font-bold text-[#11190C]">Article</h4>
              <div className="prose prose-sm mt-3 max-w-none text-[#33475f]">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="mt-7 mb-3 text-2xl font-black text-[#11190C]">{children}</h1>,
                    h2: ({ children }) => <h2 className="mt-6 mb-3 text-xl font-black text-[#11190C]">{children}</h2>,
                    h3: ({ children }) => <h3 className="mt-5 mb-2 text-lg font-bold text-[#11190C]">{children}</h3>,
                    p: ({ children }) => <p className="mb-3 leading-6 text-[#3f5671]">{children}</p>,
                    ul: ({ children }) => <ul className="mb-3 list-disc pl-5">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-3 list-decimal pl-5">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-[#11190C]">{children}</strong>,
                    a: ({ href, children }) => (
                      <a href={href} className="font-semibold text-[#11190C] underline underline-offset-2">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {cleanMarkdown(selectedArticle.content)}
                </ReactMarkdown>
              </div>
            </div>

            <div className="mt-6 grid gap-4 border-t border-black/10 pt-5 text-sm text-[#33475f] sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">Category</p>
                <p className="mt-1 font-semibold text-[#11190C]">{articleCategory(selectedArticle)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">Read Time</p>
                <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[#11190C]">
                  <Clock3 className="h-4 w-4" />
                  {articleReadTime(selectedArticle)} min
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">Author</p>
                <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[#11190C]">
                  <User className="h-4 w-4" />
                  {selectedArticle.author || 'Wervice Editorial'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">Published</p>
                <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[#11190C]">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedArticle.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {relatedArticles.length > 0 && (
              <div className="mt-6 border-t border-black/10 pt-5">
                <h4 className="text-lg font-bold text-[#11190C]">Similar Guides</h4>
                <p className="mt-1 text-sm text-[#5f6f84]">Recommended inspiration</p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {relatedArticles.map((article) => (
                    <button
                      key={article.slug}
                      type="button"
                      onClick={() => {
                        setSelectedSlug(article.slug);
                        updateArticleQuery(article.slug);
                      }}
                      className="flex items-center gap-3 rounded-xl border border-black/10 p-2 text-left hover:bg-[#F5F7FA]"
                    >
                      <div className="relative h-12 w-14 overflow-hidden rounded-lg bg-[#EEE9E1]">
                        <Image src={article.cover || '/images/sample/venues-1.jpg'} alt={article.title} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-base font-bold text-[#11190C]">{article.title}</p>
                        <p className="text-sm text-[#5f6f84]">{articleCity(article)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 border-t border-black/10 pt-5">
              <Link
                href={`/${locale}/blog/${selectedArticle.slug}`}
                className="inline-flex rounded-xl bg-[#11190C] px-4 py-2.5 text-sm font-bold text-[#D9FF0A]"
              >
                Open Full Article
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
