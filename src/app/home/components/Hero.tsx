'use client';

import Link from 'next/link';
import { HeroProps } from '@/models/types';
import { NAVBAR_CATEGORIES } from '@/lib/constants';


export default function Hero({ onViewOffers }: HeroProps) {
  return (
    <section className="bg-black text-white min-h-[500px] flex items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="moroccan-pattern w-full h-full"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-1 text-center lg:text-left">
            <h1 className="font-heading-primary text-4xl md:text-5xl lg:text-6xl leading-tight text-lime-400 mb-6">
              Best Wedding Deals on Wervice
            </h1>
            <p className="text-body-large mb-8 text-white/90 font-body-primary">
              Over 500 Moroccan vendors & packages for your authentic celebration
            </p>

            {/* Cultural Icons */}
            <div className="flex justify-center lg:justify-start space-x-6 mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-lime-400 rounded-full flex items-center justify-center text-3xl">
                🖐️
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 bg-lime-400 rounded-full flex items-center justify-center text-3xl">
                🏮
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 bg-lime-400 rounded-full flex items-center justify-center text-3xl">
                💍
              </div>
            </div>

            <button
              onClick={onViewOffers}
              className="btn-primary text-lg px-8 py-4"
            >
              View Offers
            </button>
          </div>

          {/* Right Content - Category Chips */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
              {NAVBAR_CATEGORIES.map((category) => (
                <Link
                  key={category.key}
                  href={`/categories/${category.key}`}
                  className="chip text-center"
                >
                  <div className="font-semibold">{category.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 border-4 border-lime-400/20 rounded-full hidden lg:block"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-lime-400/30 rounded-full hidden lg:block"></div>
    </section>
  );
}
