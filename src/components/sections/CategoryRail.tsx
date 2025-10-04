'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

export type RailItem = {
  id: string;
  href: string;
  coverUrl: string;
  name: string;
  city?: string;
  rating?: number;
  price?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  ctaHref: string;
  seeMoreHref: string;
  items: RailItem[];
  renderCard: (item: RailItem) => React.ReactNode;
  className?: string;
  step?: number; // cards per click
};

export default function CategoryRail({
  title,
  subtitle,
  ctaHref,
  seeMoreHref,
  items,
  renderCard,
  className,
  step = 1,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [cardW, setCardW] = useState(0);
  const [gap, setGap] = useState(16);
  const count = items.length;

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const c = t.querySelector<HTMLDivElement>('[data-card]');
    if (c) {
      setCardW(c.getBoundingClientRect().width);
      const s = window.getComputedStyle(t);
      const g = parseInt(s.columnGap || s.gap || '16', 10);
      setGap(isNaN(g) ? 16 : g);
    }
  }, [items]);

  const maxIndex = useMemo(() => Math.max(0, count - 1), [count]);

  const scrollToIndex = useCallback(
    (next: number) => {
      const t = trackRef.current;
      if (!t || !cardW) return;
      const i = Math.max(0, Math.min(next, maxIndex));
      setIndex(i);
      t.scrollTo({ left: i * (cardW + gap), behavior: 'smooth' });
    },
    [cardW, gap, maxIndex]
  );

  const prev = () => scrollToIndex(index - step);
  const next = () => scrollToIndex(index + step);

  useEffect(() => {
    const t = trackRef.current;
    if (!t || !cardW) return;
    const onScroll = () => {
      const i = Math.round(t.scrollLeft / (cardW + gap));
      if (i !== index) setIndex(i);
    };
    t.addEventListener('scroll', onScroll, { passive: true });
    return () => t.removeEventListener('scroll', onScroll);
  }, [index, cardW, gap]);

  const canPrev = index > 0;
  const canNext = index < maxIndex;
  const showArrows = count > 3;

  return (
    <div className={clsx('rounded-xl ring-1 ring-black/5 bg-white p-4 md:p-5', className)}>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
          </div>

          <a href={seeMoreHref} className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            See more →
          </a>
        </div>

        <div className="mt-3">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-4 py-2 font-medium text-black hover:bg-lime-400 transition"
          >
            Explore the catalog <span className="translate-x-[1px]">→</span>
          </a>
        </div>
      </div>

      {/* Rail */}
      <div className="relative">
        {showArrows && (
          <button
            onClick={prev}
            disabled={!canPrev}
            aria-label="Previous"
            className={clsx(
              'absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-md',
              canPrev ? 'bg-white hover:bg-slate-50' : 'bg-white/60 text-slate-400 cursor-not-allowed'
            )}
          >
            ‹
          </button>
        )}

        <div
          ref={trackRef}
          className={clsx(
            'flex gap-4 overflow-x-auto no-scrollbar pb-1',
            'snap-x snap-mandatory'
          )}
        >
          {items.map((it) => (
            <div
              key={it.id}
              data-card
              className="snap-start shrink-0 w-[280px] md:w-[320px] lg:w-[360px] h-[220px] md:h-[240px] rounded-xl overflow-hidden ring-1 ring-black/5 bg-white shadow-card"
            >
              {renderCard(it)}
            </div>
          ))}
        </div>

        {showArrows && (
          <button
            onClick={next}
            disabled={!canNext}
            aria-label="Next"
            className={clsx(
              'absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-md',
              canNext ? 'bg-white hover:bg-slate-50' : 'bg-white/60 text-slate-400 cursor-not-allowed'
            )}
          >
            ›
          </button>
        )}
      </div>

      <div className="mt-6 md:hidden">
        <a href={seeMoreHref} className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
          See more →
        </a>
      </div>
    </div>
  );
}