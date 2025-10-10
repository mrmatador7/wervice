'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // if you have a classnames helper
import { vendors } from '@/lib/vendors';
import { useTranslations } from 'next-intl';

type Vendor = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  cover_url: string | null;
  min_price: number | null;
  rating: number | null;
  category: string;
};

type CategoryStripProps = {
  title: string;
  href: string;
  category: 'venues' | 'catering' | 'photo-video' | 'music' | 'dresses';
  city?: string | null;
  className?: string;
};

export default function HomeCategoryStrips(props: { city?: string | null }) {
  // If you store selected city in context/local storage, pass it down
  const city = props.city ?? null;
  const t = useTranslations('home');

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
      <div className="space-y-12">
        <CategoryStrip title={t('categoryStrips.venues')} href="/categories/venues" category="venues" city={city} />
        <CategoryStrip title={t('categoryStrips.catering')} href="/categories/catering" category="catering" city={city} />
        <CategoryStrip title={t('categoryStrips.photographers')} href="/categories/photo-video" category="photo-video" city={city} />
        <CategoryStrip title={t('categoryStrips.music')} href="/categories/music" category="music" city={city} />
        <CategoryStrip title={t('categoryStrips.dresses')} href="/categories/dresses" category="dresses" city={city} />
      </div>
    </section>
  );
}

function CategoryStrip({ title, href, category, city, className }: CategoryStripProps) {
  const [loading, setLoading] = React.useState(true);
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        // Get vendors directly from mock data instead of API call
        const data = getVendors(category, city) as Vendor[];
        if (!cancelled) setVendors(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [category, city]);

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-semibold text-[#11190C]">{title}</h3>
        <Link href={href} className="text-sm font-medium inline-flex items-center gap-1 rounded-full px-3 py-1.5 bg-[#F3F1EE] hover:bg-[#EDEBE7] transition">
          See all <span aria-hidden>→</span>
        </Link>
      </div>

      {loading ? (
        <SkeletonRow />
      ) : error ? (
        <div className="text-sm text-red-600">Couldn't load {title.toLowerCase()}.</div>
      ) : vendors.length === 0 ? (
        <div className="text-sm text-[#5B5B5B]">No {title.toLowerCase()} found{city ? ` in ${city}` : ''}.</div>
      ) : (
        <HorizontalCarousel
          items={vendors}
          renderItem={(v) => <VendorCard key={v.id} vendor={v} />}
        />
      )}
    </div>
  );
}

function getVendors(category: string, city?: string | null) {
  // Map category slugs to the enum values used in mock data
  const categoryMap: Record<string, string> = {
    'venues': 'Venues',
    'catering': 'Catering',
    'photo-video': 'Photo & Video',
    'music': 'Music',
    'dresses': 'Dresses',
    'planning': 'Planning',
    'beauty': 'Beauty',
    'decor': 'Decor'
  };

  const mappedCategory = categoryMap[category];
  if (!mappedCategory) return [];

  // Filter vendors by category and optionally by city
  let filteredVendors = vendors.filter(vendor => vendor.category === mappedCategory);

  if (city) {
    filteredVendors = filteredVendors.filter(vendor =>
      vendor.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Sort by rating (highest first) and limit results
  const sortedVendors = filteredVendors
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 12);

  // Transform to the expected API format
  return sortedVendors.map(vendor => ({
    id: vendor.slug, // Use slug as ID for now
    slug: vendor.slug,
    name: vendor.name,
    city: vendor.city,
    cover_url: vendor.coverImage,
    min_price: vendor.startingPrice,
    rating: vendor.rating,
    category: category
  }));
}

/* ---------- Generic, dependency-free carousel ---------- */

function HorizontalCarousel<T>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector('[data-card="1"]') as HTMLElement | null;
    const delta = card ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: dir === 'left' ? -delta : delta, behavior: 'smooth' });
  };

  return (
    <div className="relative px-6 sm:px-8">
      {/* Left scroll button */}
      <button
        aria-label="Scroll left"
        onClick={() => scrollBy('left')}
        className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg ring-1 ring-black/10 hover:bg-white hover:shadow-xl hover:ring-lime-200/50 transition-all duration-200 p-3 hidden sm:flex items-center justify-center group"
      >
        <svg
          className="w-5 h-5 text-slate-700 group-hover:text-lime-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        aria-roledescription="carousel"
      >
        {items.map((item, i) => (
          <div
            key={i}
            data-card="1"
            className="snap-start shrink-0 w-[280px] sm:w-[300px]"
          >
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {/* Right scroll button */}
      <button
        aria-label="Scroll right"
        onClick={() => scrollBy('right')}
        className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg ring-1 ring-black/10 hover:bg-white hover:shadow-xl hover:ring-lime-200/50 transition-all duration-200 p-3 hidden sm:flex items-center justify-center group"
      >
        <svg
          className="w-5 h-5 text-slate-700 group-hover:text-lime-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

/* ---------- Vendor card (re-uses your visual style) ---------- */

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={`/vendor/${vendor.slug}`}
      prefetch
      className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 hover:ring-black/10 hover:shadow-md transition"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={vendor.cover_url || '/images/placeholder.jpg'}
          alt={vendor.name}
          fill
          sizes="(max-width: 640px) 280px, 300px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-[#11190C] line-clamp-1">{vendor.name}</h4>
          {vendor.rating ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F1EE] px-2 py-0.5 text-xs">
              ⭐ {vendor.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
        <div className="mt-1 text-xs text-[#5B5B5B] line-clamp-1">
          {vendor.city ?? 'Morocco'}
        </div>
        {vendor.min_price ? (
          <div className="mt-1 text-xs">
            From <span className="font-medium">{formatMAD(vendor.min_price)}</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}

function SkeletonRow() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-[280px] sm:w-[300px] animate-pulse">
          <div className="h-[180px] w-full rounded-2xl bg-[#F3F1EE]" />
          <div className="mt-3 h-4 w-3/4 rounded bg-[#F3F1EE]" />
          <div className="mt-2 h-3 w-1/2 rounded bg-[#F3F1EE]" />
        </div>
      ))}
    </div>
  );
}

function formatMAD(v: number) {
  try {
    return new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(v);
  } catch {
    return `${v} MAD`;
  }
}
