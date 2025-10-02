'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import VendorCard, { VendorCardProps } from '@/components/cards/VendorCard';

type CategoryRowProps = {
  title: string;
  subtitle?: string;
  ctaHref: string;
  seeMoreHref: string;
  items: VendorCardProps[]; // must include city + rating (+ price)
};

export default function CategoryRow({
  title,
  subtitle = 'Discover top vendors across Morocco.',
  ctaHref,
  seeMoreHref,
  items,
}: CategoryRowProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    const cardWidth = 320; // Approximate VendorCard width
    carouselRef.current.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
    setTimeout(checkScrollButtons, 300);
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    const cardWidth = 320; // Approximate VendorCard width
    carouselRef.current.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
    setTimeout(checkScrollButtons, 300);
  };
  return (
    <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between gap-4 px-5 pt-5 md:px-6 md:pt-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        </div>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 rounded-full bg-[#d9ff0a] px-4 py-2 text-sm font-medium text-black hover:bg-[#c4e600] transition"
        >
          Explore the catalog <span className="translate-x-[1px]">→</span>
        </Link>
      </div>

      <div className="px-5 md:px-6 pb-6">
        {/* Carousel Track with Navigation */}
        <div className="relative mt-4">
          {/* Left Navigation Arrow */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-wervice-lime hover:bg-[#c4e600] border border-[#c4e600] rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-wervice-lime"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Navigation Arrow */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-wervice-lime hover:bg-[#c4e600] border border-[#c4e600] rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-wervice-lime"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="overflow-hidden snap-x snap-mandatory -mx-4 px-4"
            onScroll={checkScrollButtons}
          >
            <div className="flex pb-4 pr-4 space-x-4 md:space-x-6">
              {items.map((v, i) => (
                <div key={v.href ?? i} className="flex-shrink-0 w-80">
                  <VendorCard {...v} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
