/**
 * CategorySeoBlocks — Server Component (RSC)
 *
 * Renders SEO content sections below vendor listings:
 *   1. #about   — Category intro text (300-500 words)
 *   2. #cities  — "Find by City" crawlable link grid
 *   3. #faq     — FAQ accordion + matching JSON-LD FAQPage schema
 *   4. #related — "Complete Your Wedding Planning" related category links
 *
 * This component is intentionally a Server Component so all HTML is present
 * in the initial server response and indexable by crawlers.
 */

import Link from 'next/link';
import { getCategorySeoContent } from '@/lib/seo/category-seo-content';
import { WERVICE_CATEGORIES } from '@/lib/categories';
import { cityToSlug } from '@/lib/vendor-url';
import { capitalizeCity } from '@/lib/utils';

// Top Moroccan cities shown in the "Find by City" grid
const CITIES = [
  'Marrakech', 'Casablanca', 'Rabat', 'Fes', 'Tanger',
  'Agadir', 'Meknes', 'Oujda', 'Tetouan', 'Kenitra',
  'El Jadida', 'Safi',
];

interface CategorySeoBlocksProps {
  categorySlug: string;
  /** Raw city value from URL search params (e.g. "Marrakech") */
  city?: string | null;
  locale?: string;
}

export default function CategorySeoBlocks({
  categorySlug,
  city,
  locale = 'en',
}: CategorySeoBlocksProps) {
  const seo = getCategorySeoContent(categorySlug);
  const cat = WERVICE_CATEGORIES.find((c) => c.slug === categorySlug);
  const categoryLabel = cat?.label ?? categorySlug;

  // Resolved city name — either the filter selection or "Morocco"
  const locationLabel = city && city !== 'all' ? capitalizeCity(city) : 'Morocco';
  const citySlugForLinks = city && city !== 'all' ? cityToSlug(city) : null;

  // JSON-LD FAQPage schema — must match visible FAQ answers exactly
  const faqSchema =
    seo.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: seo.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  // Related category entries
  const relatedCats = seo.relatedCategories
    .map((slug) => WERVICE_CATEGORIES.find((c) => c.slug === slug))
    .filter(Boolean) as typeof WERVICE_CATEGORIES[number][];

  if (!seo.intro && seo.faqs.length === 0 && relatedCats.length === 0) return null;

  return (
    <>
      {/* JSON-LD FAQ schema — injected in-place (Next.js hoists to <head> via RSC) */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-16">

        {/* ── 1. SEO Intro ── */}
        {seo.intro && (
          <section id="about" aria-label="Category SEO intro">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              {categoryLabel} in {locationLabel}
            </h2>
            <div className="prose prose-neutral max-w-none text-gray-600 leading-relaxed">
              {seo.intro.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4 text-sm sm:text-base">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* ── 2. Find by City ── */}
        <section id="cities" aria-label={`Find ${categoryLabel} by city`}>
          <h3 className="text-xl font-bold text-gray-900 mb-5">
            Find {categoryLabel} by City
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CITIES.map((cityName) => {
              const isActive = city && city !== 'all' && capitalizeCity(city) === cityName;
              const href = isActive
                ? `/${locale}/categories/${categorySlug}`
                : `/${locale}/categories/${categorySlug}?city=${encodeURIComponent(cityName)}`;
              return (
                <Link
                  key={cityName}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all group border ${
                    isActive
                      ? 'bg-[#D9FF0A] border-[#D9FF0A] text-[#11190C]'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-[#D9FF0A] hover:bg-[#f9ffe0] hover:text-gray-900'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-[#11190C]' : 'bg-gray-300 group-hover:bg-[#99cc00]'} transition-colors`} />
                  {categoryLabel} in {cityName}
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── 3. FAQ ── */}
        {seo.faqs.length > 0 && (
          <section id="faq" aria-label="Frequently asked questions">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
              {seo.faqs.map((faq, i) => (
                <details key={i} className="group bg-white">
                  <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 group-open:bg-[#D9FF0A] flex items-center justify-center transition-colors">
                      <svg
                        className="w-3.5 h-3.5 text-gray-600 group-open:rotate-45 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-1">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── 4. Related Categories ── */}
        {relatedCats.length > 0 && (
          <section id="related" aria-label="Complete your wedding planning">
            <h3 className="text-xl font-bold text-gray-900 mb-5">
              Complete Your Wedding Planning
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedCats.map((relCat) => {
                const href = citySlugForLinks
                  ? `/${locale}/categories/${relCat.slug}?city=${encodeURIComponent(city!)}`
                  : `/${locale}/categories/${relCat.slug}`;
                return (
                  <Link
                    key={relCat.slug}
                    href={href}
                    className="flex items-center gap-3 px-5 py-4 bg-white border border-gray-200 rounded-2xl hover:border-[#D9FF0A] hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl select-none" aria-hidden>
                      {CATEGORY_EMOJI[relCat.slug] ?? '✨'}
                    </span>
                    <span className="font-semibold text-gray-800 text-sm group-hover:text-gray-900 transition-colors">
                      {relCat.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 5. Join CTA ── */}
        <section id="join" className="bg-[#11190C] rounded-3xl p-8 sm:p-10 text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#D9FF0A] mb-3">
            Are you a {categoryLabel} vendor?
          </p>
          <h3 className="text-2xl font-bold text-white mb-3">
            List Your Business on Wervice
          </h3>
          <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
            Join hundreds of verified wedding professionals. Get discovered by couples planning their wedding in Morocco.
          </p>
          <Link
            href={`/${locale}/become-vendor`}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#D9FF0A] hover:bg-[#c8f000] text-[#11190C] font-bold rounded-full text-sm transition-colors"
          >
            Get Listed Free →
          </Link>
        </section>

      </div>
    </>
  );
}

const CATEGORY_EMOJI: Record<string, string> = {
  florist: '🌸',
  dresses: '👗',
  venues: '🏛️',
  beauty: '💄',
  'photo-film': '📸',
  caterer: '🍽️',
  decor: '✨',
  negafa: '👑',
  artist: '🎵',
  'event-planner': '📋',
  cakes: '🎂',
};
