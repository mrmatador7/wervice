'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

const floatingIcons = [
  { src: '/categories/venues.png', x: 10, y: 15, size: 48, rotation: -3, delay: 0 },
  { src: '/categories/Catering.png', x: 85, y: 20, size: 52, rotation: 2, delay: 1 },
  { src: '/categories/music.png', x: 15, y: 60, size: 44, rotation: -4, delay: 2 },
  { src: '/categories/photo.png', x: 80, y: 65, size: 50, rotation: 5, delay: 0.5 },
  { src: '/categories/Dresses.png', x: 45, y: 80, size: 46, rotation: -2, delay: 1.5 },
  { src: '/categories/beauty.png', x: 70, y: 40, size: 42, rotation: 3, delay: 2.5 },
];

export default function VendorHero() {
  const t = useTranslations('vendor');

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[38vh] md:min-h-[44vh] lg:min-h-[48vh] bg-gradient-to-br from-[#D7FF1F]/10 via-white to-[#D7FF1F]/5 overflow-hidden pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-14">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {floatingIcons.map((icon, index) => (
          <div
            key={index}
            className="absolute animate-float opacity-10 md:opacity-15"
            style={{
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              animationDelay: `${icon.delay}s`,
            }}
          >
            <img
              src={icon.src}
              alt=""
              className="w-8 md:w-10 h-8 md:h-10 object-contain"
              style={{
                transform: `rotate(${icon.rotation}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h1 className="font-decorative text-[clamp(28px,5vw,44px)] text-gray-900 mb-3 md:mb-4 leading-tight">
            Become a Wervice Vendor
          </h1>

          {/* Subtitle */}
          <p className="text-[clamp(14px,2.2vw,18px)] text-gray-600 mb-6 md:mb-8 max-w-[58ch] mx-auto leading-relaxed">
            Join Morocco&apos;s premier wedding marketplace and connect with couples planning their big day.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-6 md:mb-8">
            <button
              onClick={scrollToPricing}
              className="btn-primary font-ui-primary text-lg px-8 py-4 uppercase tracking-wide"
            >
              Start Subscription
            </button>

            <Link
              href="/vendor-login"
              className="btn-secondary font-ui-primary text-lg px-8 py-4 uppercase tracking-wide"
            >
              Vendor Login
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
