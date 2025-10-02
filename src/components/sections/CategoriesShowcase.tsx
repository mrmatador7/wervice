'use client';

import Link from 'next/link';
import { useRef } from 'react';
import Image from 'next/image';

export type CategoryItem = {
  id: string;
  name: string;
  subtitle: string;
  cover: string;
  href: string;
};

type Props = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  seeMoreHref: string;
  items: CategoryItem[];
  railCardWidth?: number;
  railCardHeight?: number;
};

export default function CategoriesShowcase({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  seeMoreHref,
  items,
  railCardWidth = 280,
  railCardHeight = 360,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 'prev' | 'next') => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector<HTMLElement>('[data-card]');
    const gap = 16; // 1rem gap
    const delta = (card?.offsetWidth || railCardWidth) + gap;
    trackRef.current.scrollBy({
      left: dir === 'next' ? delta * 2 : -delta * 2,
      behavior: 'smooth',
    });
  };

  const renderCard = (item: CategoryItem) => (
    <Link
      key={item.id}
      href={item.href}
      className="group relative flex-shrink-0 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/20 active:opacity-92 overflow-hidden snap-start rounded-2xl bg-white"
      style={{
        width: railCardWidth,
        height: railCardHeight,
      }}
      aria-label={`View ${item.name} - ${item.subtitle}`}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-t-2xl" style={{ height: '70%' }}>
        <Image
          src={item.cover}
          alt={`${item.name} cover`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={`${railCardWidth}px`}
          loading="lazy"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col justify-center" style={{ height: '30%' }}>
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-1">
          {item.subtitle}
        </p>
      </div>
    </Link>
  );

  return (
    <div className="relative rounded-2xl bg-white shadow-sm ring-1 ring-black/5 px-4 py-6 md:px-6 lg:px-8">
      {/* Header row */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h3>
        <Link
          href={seeMoreHref}
          className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
        >
          See more →
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left rail */}
        <div className="col-span-12 lg:col-span-4 relative">
          <p className="text-neutral-600 mb-4">{subtitle}</p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-4 py-2 font-medium text-black hover:bg-lime-400 transition"
          >
            {ctaLabel}
            <span className="inline-block translate-x-[1px]">→</span>
          </Link>
        </div>

        {/* Right track */}
        <div className="col-span-12 lg:col-span-8 relative">
          {/* arrows */}
          <button
            aria-label="Previous"
            onClick={() => scrollByCards('prev')}
            className="absolute left-[-14px] top-1/2 z-10 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 hover:bg-white/90"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={() => scrollByCards('next')}
            className="absolute right-[-14px] top-1/2 z-10 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 hover:bg-white/90"
          >
            ›
          </button>

          <div
            ref={trackRef}
            className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
            style={{ paddingBottom: 2 }} // avoids clipping shadows
          >
            {items.map((item) => (
              <div
                key={item.id}
                data-card
                className="snap-start shrink-0"
                style={{ width: railCardWidth }}
              >
                {renderCard(item)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
