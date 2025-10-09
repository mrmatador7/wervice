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
    <section className="relative min-h-[35vh] md:min-h-[40vh] lg:min-h-[45vh] bg-gradient-to-br from-[#D7FF1F]/10 via-white to-[#D7FF1F]/5 overflow-hidden pt-6 pb-6 md:pt-8 md:pb-8 flex flex-col items-center justify-center">
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
      <div className="max-w-3xl w-full px-4 flex flex-col items-center justify-center text-center gap-3">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
          Pricing Plans for Vendors
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-neutral-600">
          Choose your category plan and save up to 20% on long-term subscriptions. Every long-term plan includes a free social boost on Instagram & TikTok!
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={scrollToPricing}
            className="w-full sm:w-auto bg-[#D7FF1F] text-black px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold hover:bg-[#c4e600] transition-colors"
          >
            Start Subscription
          </button>

          <Link
            href="/vendor-login"
            className="w-full sm:w-auto border-2 border-neutral-300 text-neutral-700 px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold hover:bg-neutral-50 transition-colors"
          >
            Vendor Login
          </Link>
        </div>
      </div>

    </section>
  );
}
