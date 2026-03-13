'use client';

import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Calendar, ChevronLeft, ChevronRight, Clock3, MapPin, User, X } from 'lucide-react';
import type { Article } from '@/data/articles';
import { getDashboardCopy } from '@/components/home/dashboard-i18n';
import { localizeCityLabel } from '@/lib/types/vendor';
import { labelForCategory } from '@/lib/categories';

type InspirationArticleGridProps = {
  locale: string;
  articles: Article[];
};

function articleCity(article: Article, locale: string) {
  const city = article.tags?.[1];
  if (!city) return 'Morocco';
  const normalized = city.charAt(0).toUpperCase() + city.slice(1);
  return localizeCityLabel(normalized, locale);
}

function articleCategory(article: Article, locale: string) {
  const tag = article.tags?.[0] || 'guide';
  const normalized = tag.toLowerCase();
  if (normalized === 'guide') {
    if (locale === 'fr') return 'Guide';
    if (locale === 'ar') return 'دليل';
    return 'Guide';
  }
  return labelForCategory(normalized, locale);
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

function extractVendorCardImages(markdown: string): string[] {
  const matches = Array.from(markdown.matchAll(/"card:([^"]+)"/g)).map((match) => match[1]?.trim());
  const unique: string[] = [];
  for (const image of matches) {
    if (!image) continue;
    if (!unique.includes(image)) unique.push(image);
  }
  return unique;
}

export default function InspirationArticleGrid({ locale, articles }: InspirationArticleGridProps) {
  const copy = getDashboardCopy(locale);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const selectedArticle = useMemo(
    () => (selectedSlug ? articles.find((article) => article.slug === selectedSlug) || null : null),
    [articles, selectedSlug]
  );

  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    return articles.filter((article) => article.slug !== selectedArticle.slug).slice(0, 8);
  }, [articles, selectedArticle]);

  const selectedGalleryImages = useMemo(() => {
    if (!selectedArticle) return [];

    const fromContent = extractVendorCardImages(selectedArticle.content);
    const merged = fromContent.length > 0
      ? fromContent
      : [selectedArticle.cover || '/images/sample/venues-1.jpg'];
    const unique: string[] = [];
    for (const image of merged) {
      if (!unique.includes(image)) unique.push(image);
    }
    return unique;
  }, [selectedArticle]);

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

  useEffect(() => {
    setSelectedGalleryIndex(0);
    setIsLightboxOpen(false);
  }, [selectedArticle?.slug]);

  return (
    <>
      <section className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">{copy.inspiration.title}</h1>
        <p className="mt-3 text-lg text-[#4a5c74]">{copy.inspiration.subtitle}</p>

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
                  {articleCategory(article, locale)}
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
            aria-label={copy.inspiration.closeArticlePanel}
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
                  {articleCity(selectedArticle, locale)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSlug(null);
                  updateArticleQuery(null);
                }}
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 hover:bg-black/5"
                aria-label={copy.inspiration.closeArticlePanel}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="relative h-[320px] overflow-hidden rounded-2xl bg-[#eef2f7] sm:h-[420px]"
                aria-label="Open image"
              >
                <Image
                  src={selectedGalleryImages[selectedGalleryIndex] || selectedArticle.cover || '/images/sample/venues-1.jpg'}
                  alt={selectedArticle.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 680px"
                  className="object-cover"
                />
                <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2 py-1 text-xs font-semibold text-white">
                  {selectedGalleryIndex + 1} / {selectedGalleryImages.length}
                </div>
              </button>

              <div className="grid grid-cols-4 gap-2 sm:h-[420px] sm:grid-cols-1 sm:grid-rows-4 sm:gap-3">
                {selectedGalleryImages.slice(0, 4).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => {
                      setSelectedGalleryIndex(index);
                      setIsLightboxOpen(true);
                    }}
                    className={`relative h-20 overflow-hidden rounded-xl bg-[#EEE9E1] text-left sm:h-auto ${
                      selectedGalleryIndex === index ? 'ring-2 ring-[#D9FF0A]' : 'ring-1 ring-black/5'
                    }`}
                    aria-label={`Gallery image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${selectedArticle.title} gallery image ${index + 1}`}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {isLightboxOpen && selectedGalleryImages.length > 0 && (
              <div className="fixed inset-0 z-[70]">
                <button
                  type="button"
                  className="absolute inset-0 bg-black/80"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Close image viewer"
                />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedGalleryIndex((current) =>
                        current === 0 ? selectedGalleryImages.length - 1 : current - 1
                      )
                    }
                    className="mr-3 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/40 bg-black/40 text-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="relative h-[72vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-black">
                    <Image
                      src={selectedGalleryImages[selectedGalleryIndex]}
                      alt={`${selectedArticle.title} full image`}
                      fill
                      sizes="1200px"
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedGalleryIndex((current) =>
                        current === selectedGalleryImages.length - 1 ? 0 : current + 1
                      )
                    }
                    className="ml-3 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/40 bg-black/40 text-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(false)}
                    className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-black/40 text-white"
                    aria-label="Close image viewer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-5 border-t border-black/10 pt-5">
              <h4 className="text-lg font-bold text-[#11190C]">{copy.inspiration.overview}</h4>
              <p className="mt-2 text-sm leading-6 text-[#4d6078]">{articleSummary(selectedArticle)}</p>
            </div>

            <div className="mt-6 border-t border-black/10 pt-5">
              <h4 className="text-lg font-bold text-[#11190C]">{copy.inspiration.article}</h4>
              <div className="prose prose-sm mt-3 max-w-none text-[#33475f]">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="mt-7 mb-3 text-2xl font-black text-[#11190C]">{children}</h1>,
                    h2: ({ children }) => <h2 className="mt-6 mb-3 text-xl font-black text-[#11190C]">{children}</h2>,
                    h3: ({ children }) => <h3 className="mt-5 mb-2 text-lg font-bold text-[#11190C]">{children}</h3>,
                    p: ({ children }) => {
                      const childArray = React.Children.toArray(children);
                      if (
                        childArray.length === 1 &&
                        React.isValidElement(childArray[0]) &&
                        typeof childArray[0].props?.title === 'string' &&
                        childArray[0].props.title.startsWith('card:')
                      ) {
                        return <div className="mb-4">{children}</div>;
                      }

                      return <p className="mb-3 leading-6 text-[#3f5671]">{children}</p>;
                    },
                    ul: ({ children }) => <ul className="mb-3 list-disc pl-5">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-3 list-decimal pl-5">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-[#11190C]">{children}</strong>,
                    a: ({ href, title, children }) => {
                      const isInternal = typeof href === 'string' && href.startsWith('/');
                      const cardImage = typeof title === 'string' && title.startsWith('card:')
                        ? title.slice(5).trim()
                        : null;

                      if (isInternal && cardImage) {
                        const vendorName = extractText(children) || 'Venue';
                        const city = cityFromVendorHref(href);

                        return (
                          <Link href={href} className="my-2 inline-block align-top no-underline">
                            <article className="group flex w-[270px] items-center gap-2.5 rounded-xl border border-[#d7deea] bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
                                <p className="line-clamp-1 text-[13px] font-bold text-[#11190C]">{vendorName}</p>
                                <p className="mt-0.5 line-clamp-1 text-[11px] text-[#6B7280]">{city}</p>
                                <p className="mt-1 text-[11px] font-semibold text-[#1f5eff]">View venue page</p>
                              </div>
                            </article>
                          </Link>
                        );
                      }

                      return (
                        <a href={href} className="font-semibold text-[#11190C] underline underline-offset-2">
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {cleanMarkdown(selectedArticle.content)}
                </ReactMarkdown>
              </div>
            </div>

            <div className="mt-6 grid gap-4 border-t border-black/10 pt-5 text-sm text-[#33475f] sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">{copy.inspiration.category}</p>
                <p className="mt-1 font-semibold text-[#11190C]">{articleCategory(selectedArticle, locale)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">{copy.inspiration.readTime}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[#11190C]">
                  <Clock3 className="h-4 w-4" />
                  {articleReadTime(selectedArticle)} {copy.inspiration.min}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">{copy.inspiration.author}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[#11190C]">
                  <User className="h-4 w-4" />
                  {selectedArticle.author || copy.inspiration.defaultAuthor}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">{copy.inspiration.published}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-[#11190C]">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedArticle.date).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {relatedArticles.length > 0 && (
              <div className="mt-6 border-t border-black/10 pt-5">
                <h4 className="text-lg font-bold text-[#11190C]">{copy.inspiration.similarGuides}</h4>
                <p className="mt-1 text-sm text-[#5f6f84]">{copy.inspiration.recommendedInspiration}</p>
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
                        <p className="text-sm text-[#5f6f84]">{articleCity(article, locale)}</p>
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
                {copy.inspiration.openFullArticle}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
