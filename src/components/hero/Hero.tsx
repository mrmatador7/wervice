'use client';

import * as React from 'react';
import SearchBarSimple from './SearchBarSimple';
import CategoryChips from './CategoryChips';

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left area */}
        <img
          src="/categories/venues.png"
          alt=""
          className="absolute top-20 left-8 w-12 h-12 sm:w-16 sm:h-16 opacity-25 rotate-12"
        />
        <img
          src="/categories/dresses.png"
          alt=""
          className="absolute top-32 left-20 sm:left-32 w-10 h-10 sm:w-14 sm:h-14 opacity-20 -rotate-6"
        />

        {/* Top right area */}
        <img
          src="/categories/photo.png"
          alt=""
          className="absolute top-16 right-12 sm:right-20 w-11 h-11 sm:w-15 sm:h-15 opacity-30 rotate-45"
        />
        <img
          src="/categories/catering.png"
          alt=""
          className="absolute top-40 right-8 sm:right-16 w-9 h-9 sm:w-13 sm:h-13 opacity-25 -rotate-12"
        />

        {/* Middle left */}
        <img
          src="/categories/beauty.png"
          alt=""
          className="absolute top-1/2 left-6 sm:left-12 transform -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 opacity-20 rotate-30"
        />

        {/* Middle right */}
        <img
          src="/categories/music.png"
          alt=""
          className="absolute top-1/2 right-10 sm:right-20 transform -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 opacity-30 -rotate-15"
        />

        {/* Bottom area */}
        <img
          src="/categories/decor.png"
          alt=""
          className="absolute bottom-20 left-16 sm:left-24 w-9 h-9 sm:w-13 sm:h-13 opacity-25 rotate-20"
        />
        <img
          src="/categories/event planner.png"
          alt=""
          className="absolute bottom-16 right-14 sm:right-28 w-8 h-8 sm:w-12 sm:h-12 opacity-20 -rotate-25"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl
                  pt-[calc(var(--header-h)+6px)] pb-5 px-4 sm:pt-[calc(var(--header-h)+12px)] sm:pb-8">
        {/* DEBUG: Simple visible element */}
        <div className="bg-red-500 text-white p-4 mb-4 text-center font-bold">
          HERO COMPONENT IS RENDERING - CATEGORY CHIPS SHOULD BE BELOW
        </div>

        {/* Category Chips */}
        <div className="mb-6 sm:mb-8">
          <CategoryChips />
        </div>

        <h1 className="text-3xl leading-tight sm:text-5xl sm:leading-[1.05] font-extrabold text-wervice-ink text-center">
          Plan your wedding, your way.
        </h1>
        <p className="mt-2 text-base leading-relaxed sm:text-lg text-wervice-taupe text-center max-w-2xl mx-auto">
          Compare trusted vendors, read reviews, and book fast — all in one place.
        </p>
        <div className="mt-3 sm:mt-4">
          <SearchBarSimple />
        </div>
      </div>
    </section>
  );
}
