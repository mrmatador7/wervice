'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/contexts/LocaleContext';

export default function FeaturedSection() {
  const { locale } = useLocale();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 - More reasons to choose Wervice */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                More reasons to choose Wervice
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Verified Vendors */}
              <Link
                href={`/${locale}/about`}
                className="group block bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 h-full flex flex-col justify-between min-h-[180px]">
                  <div className="flex items-center justify-center mb-4">
                    <Image
                      src="/categories/venues.png"
                      alt="Verified Vendors"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Vendors</h3>
                    <p className="text-sm text-gray-700">All our vendors are reviewed and verified for reliability.</p>
                  </div>
                </div>
              </Link>

              {/* Pay Later Option */}
              <Link
                href={`/${locale}/how-it-works`}
                className="group block bg-gradient-to-br from-[#FFF9C4] to-[#FFF59D] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 h-full flex flex-col justify-between min-h-[180px]">
                  <div className="flex items-center justify-center mb-4">
                    <Image
                      src="/categories/beauty.png"
                      alt="Pay Later"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pay Later Option</h3>
                    <p className="text-sm text-gray-700">Book your dream venue now and pay on confirmation.</p>
                  </div>
                </div>
              </Link>

              {/* Wedding Packages */}
              <Link
                href={`/${locale}/categories/venues`}
                className="group block bg-gradient-to-br from-[#E1BEE7] to-[#CE93D8] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 h-full flex flex-col justify-between min-h-[180px]">
                  <div className="flex items-center justify-center mb-4">
                    <Image
                      src="/categories/decor.png"
                      alt="Wedding Packages"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Wedding Packages</h3>
                    <p className="text-sm text-gray-700">Choose complete bundles — Venue, Decor, Catering in one click.</p>
                  </div>
                </div>
              </Link>

              {/* Real Reviews */}
              <Link
                href={`/${locale}/vendors`}
                className="group block bg-gradient-to-br from-[#FFE0B2] to-[#FFCC80] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 h-full flex flex-col justify-between min-h-[180px]">
                  <div className="flex items-center justify-center mb-4">
                    <Image
                      src="/categories/music.png"
                      alt="Real Reviews"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Real Reviews</h3>
                    <p className="text-sm text-gray-700">What couples say about their experience on Wervice.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Column 2 - Featured Collections */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#D9FF0A] to-[#C5E808] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Collections
                </h2>
                <Link
                  href={`/${locale}/vendors`}
                  className="text-sm font-semibold text-gray-900 hover:underline"
                >
                  VIEW ALL
                </Link>
              </div>
              <p className="text-sm text-gray-800">
                Discover curated wedding themes & top picks of the week
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* Garden Venues */}
                <div className="bg-white rounded-xl p-4 hover:shadow-lg transition-all">
                  <span className="inline-block px-3 py-1 bg-[#D9FF0A] rounded-full text-xs font-bold text-gray-900 mb-3">
                    Garden Venues
                  </span>
                  <Link href={`/${locale}/categories/venues`} className="block">
                    <div className="aspect-square bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-lg mb-3 flex items-center justify-center">
                      <Image
                        src="/categories/venues.png"
                        alt="Garden Venues"
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                      Elegant outdoor spaces for romantic ceremonies
                    </h3>
                  </Link>
                </div>

                {/* Top Photographers */}
                <div className="bg-white rounded-xl p-4 hover:shadow-lg transition-all">
                  <span className="inline-block px-3 py-1 bg-[#D9FF0A] rounded-full text-xs font-bold text-gray-900 mb-3">
                    Top Photographers
                  </span>
                  <Link href={`/${locale}/categories/photography`} className="block">
                    <div className="aspect-square bg-gradient-to-br from-[#FDE9EB] to-[#F8BBD0] rounded-lg mb-3 flex items-center justify-center">
                      <Image
                        src="/categories/photo.png"
                        alt="Top Photographers"
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                      Capture your day with the best creatives
                    </h3>
                  </Link>
                </div>

                {/* New in Marrakech */}
                <div className="bg-white rounded-xl p-4 hover:shadow-lg transition-all">
                  <span className="inline-block px-3 py-1 bg-[#D9FF0A] rounded-full text-xs font-bold text-gray-900 mb-3">
                    New in Marrakech
                  </span>
                  <Link href={`/${locale}/categories/venues?city=Marrakech`} className="block">
                    <div className="aspect-square bg-gradient-to-br from-[#F3E8FF] to-[#E1BEE7] rounded-lg mb-3 flex items-center justify-center">
                      <Image
                        src="/categories/Event Planner.png"
                        alt="New in Marrakech"
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                      Recently added venues and planners
                    </h3>
                  </Link>
                </div>

                {/* All-in-One Packages */}
                <div className="bg-white rounded-xl p-4 hover:shadow-lg transition-all">
                  <span className="inline-block px-3 py-1 bg-[#D9FF0A] rounded-full text-xs font-bold text-gray-900 mb-3">
                    Complete Packages
                  </span>
                  <Link href={`/${locale}/categories/planning`} className="block">
                    <div className="aspect-square bg-gradient-to-br from-[#FFF4E6] to-[#FFE0B2] rounded-lg mb-3 flex items-center justify-center">
                      <Image
                        src="/categories/Catering.png"
                        alt="All-in-One Packages"
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                      Simplify planning with complete bundles
                    </h3>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 - Inspiration & Planning */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Inspiration & Planning
              </h2>
            </div>

            <div className="space-y-4">
              {/* Find Your Perfect Venue Style */}
              <Link
                href={`/${locale}/guides/venue-styles`}
                className="group block bg-gradient-to-br from-[#FFF4E6] to-[#FFE0B2] rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6 min-h-[200px] flex flex-col justify-between">
                  <div className="flex items-center justify-center mb-4">
                    <Image
                      src="/images/wervice/peace-of-mind.jpg"
                      alt="Venue Guide"
                      width={120}
                      height={120}
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Find Your Perfect Venue Style
                    </h3>
                    <p className="text-sm text-gray-700">
                      Ballroom, garden, or rooftop? Learn how to choose.
                    </p>
                  </div>
                </div>
              </Link>

              {/* 2025 Wedding Trends */}
              <Link
                href={`/${locale}/blog/wedding-trends-2025`}
                className="group block bg-gradient-to-br from-[#E1BEE7] to-[#CE93D8] rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6 min-h-[200px] flex flex-col justify-between">
                  <div className="flex items-center justify-center mb-4">
                    <Image
                      src="/categories/Dresses.png"
                      alt="Wedding Trends"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      2025 Wedding Trends
                    </h3>
                    <p className="text-sm text-gray-700">
                      Discover what's shaping Moroccan weddings this year.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Weekly Spotlight Vendor */}
              <Link
                href={`/${locale}/vendors`}
                className="group block bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6 min-h-[200px] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-[#D9FF0A] rounded-full text-xs font-bold text-gray-900">
                      This Week
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Weekly Spotlight Vendor
                    </h3>
                    <p className="text-sm text-gray-700">
                      This week's top-rated wedding planner in Casablanca.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

