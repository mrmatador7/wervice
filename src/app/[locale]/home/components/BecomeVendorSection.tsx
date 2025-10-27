'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// Vendor benefits will be translated in the component

const decorativeIcons = [
  { src: '/categories/venues.png', x: 10, y: 15, size: 48, rotation: -3 },
  { src: '/categories/Catering.png', x: 85, y: 20, size: 52, rotation: 2 },
  { src: '/categories/music.png', x: 15, y: 60, size: 44, rotation: -4 },
  { src: '/categories/decor.png', x: 80, y: 65, size: 46, rotation: 1 },
  { src: '/categories/Dresses.png', x: 90, y: 40, size: 42, rotation: -2 },
  { src: '/categories/photo.png', x: 5, y: 80, size: 50, rotation: 3 },
  { src: '/categories/event planner.png', x: 70, y: 85, size: 48, rotation: -1 },
  { src: '/categories/beauty.png', x: 25, y: 35, size: 45, rotation: 2 }
];

export default function BecomeVendorSection() {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const t = useTranslations('home');

  const vendorBenefits = [
    {
      icon: '💰',
      alt: t('becomeVendor.benefits.flexiblePricing.title'),
      title: t('becomeVendor.benefits.flexiblePricing.title'),
      description: t('becomeVendor.benefits.flexiblePricing.description')
    },
    {
      icon: '📊',
      alt: t('becomeVendor.benefits.categoryPlans.title'),
      title: t('becomeVendor.benefits.categoryPlans.title'),
      description: t('becomeVendor.benefits.categoryPlans.description')
    },
    {
      icon: '⚡',
      alt: t('becomeVendor.benefits.quickSetup.title'),
      title: t('becomeVendor.benefits.quickSetup.title'),
      description: t('becomeVendor.benefits.quickSetup.description')
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {decorativeIcons.map((icon, index) => (
          <div
            key={index}
            className="absolute animate-float"
            style={{
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              animationDelay: `${index * 0.5}s`,
              zIndex: -1
            }}
          >
            <Image
              src={icon.src}
              alt=""
              width={icon.size}
              height={icon.size}
              className="drop-shadow-sm"
              style={{
                width: `${icon.size}px`,
                height: `${icon.size}px`,
                transform: `rotate(${icon.rotation}deg)`,
                filter: 'grayscale(20%) brightness(0.9)'
              }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-black text-[#d9ff0a] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-[#d9ff0a] rounded-full"></span>
                {t('becomeVendor.badge')}
              </div>

              <h2 className="font-inter font-bold text-4xl md:text-5xl leading-tight text-gray-900 mb-6">
                {t('becomeVendor.title')}
                <span className="text-[#d9ff0a]">{t('becomeVendor.titleHighlight')} </span>
                {t('becomeVendor.titleEnd')}
              </h2>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                {t('becomeVendor.subtitle')}
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {vendorBenefits.map((benefit, index) => (
                  <div key={index} className="text-center group">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto ring-4 ring-[#d9ff0a]/20 group-hover:ring-[#d9ff0a]/40 transition-all duration-300">
                        <span className="text-3xl" role="img" aria-label={benefit.alt}>
                          {benefit.icon}
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#d9ff0a] rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-black">{index + 1}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href={`/${currentLocale}/become-vendor`}
                  className="group inline-flex items-center justify-center px-8 py-4 bg-[#11190C] text-white font-bold rounded-2xl hover:bg-[#0a0f0a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {t('becomeVendor.cta')}
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                <Link
                  href="/vendor-login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Vendor Portal
                </Link>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Join 500+ verified vendors across 8 categories, from 150 DHS/month
              </p>
            </div>

            {/* Right Content - Enhanced Image */}
            <div className="relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#d9ff0a]/20 to-transparent rounded-3xl blur-lg"></div>
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=500&fit=crop&crop=center"
                  alt="Professional wedding vendor managing successful events"
                  className="relative rounded-3xl shadow-2xl w-full"
                />

                {/* Floating Stats Cards */}
                <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#d9ff0a] rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">150-250</div>
                      <div className="text-sm text-gray-600">DHS/month</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <span className="text-2xl text-white">🏷️</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">8</div>
                      <div className="text-sm text-gray-600">Categories</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
