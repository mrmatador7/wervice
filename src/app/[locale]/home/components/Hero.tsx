'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { HeroProps } from '@/models/types';
import { NAVBAR_CATEGORIES } from '@/lib/constants';


export default function Hero({ onViewOffers }: HeroProps) {
  const t = useTranslations('hero');

  return (
    <section className="bg-black text-white min-h-screen flex items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="moroccan-pattern w-full h-full"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left rtl:lg:text-right">
            <h1 className="font-heading-primary text-4xl md:text-6xl lg:text-7xl leading-tight text-lime-400 mb-6">
              {t('title')}
            </h1>
            <p className="font-body-primary text-xl md:text-2xl mb-8 text-white/90 max-w-2xl">
              {t('subtitle')}
            </p>

            {/* Wedding Service Images */}
            <div className="flex justify-center lg:justify-start rtl:lg:justify-start space-x-8 mb-12">
              <div className="group">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-lime-400 rounded-2xl overflow-hidden mb-3 transition-transform group-hover:scale-110">
                  <img
                    src="https://picsum.photos/seed/wedding-dj/112/112"
                    alt="Professional wedding DJ and sound system"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-ui-secondary text-sm text-white/70">{t('services.dj')}</span>
              </div>
              <div className="group">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-lime-400 rounded-2xl overflow-hidden mb-3 transition-transform group-hover:scale-110">
                  <img
                    src="https://picsum.photos/seed/wedding-photography/112/112"
                    alt="Wedding photography and videography"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-ui-secondary text-sm text-white/70">{t('services.photography')}</span>
              </div>
              <div className="group">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-lime-400 rounded-2xl overflow-hidden mb-3 transition-transform group-hover:scale-110">
                  <img
                    src="https://picsum.photos/seed/wedding-catering/112/112"
                    alt="Wedding catering and food services"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-ui-secondary text-sm text-white/70">{t('services.catering')}</span>
              </div>
            </div>

            <button
              onClick={onViewOffers}
              className="btn-primary text-xl px-12 py-5 font-ui-primary hover:scale-105 transition-transform"
            >
              {t('cta')}
            </button>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="relative">
            {/* Main Wedding Illustration */}
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-lime-400/20 to-lime-400/5 rounded-3xl overflow-hidden border border-lime-400/30">
                <img
                  src="https://picsum.photos/seed/wedding-services/600/384"
                  alt="Complete wedding services and vendor showcase"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-ui-primary text-lime-400 text-xl font-semibold">Your Perfect Day Begins Here</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-lime-400 rounded-full overflow-hidden animate-pulse">
                <img
                  src="https://picsum.photos/seed/wedding-music/80/80"
                  alt="Wedding DJ and music services"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-lime-400/30">
                <img
                  src="https://picsum.photos/seed/wedding-camera/64/64"
                  alt="Wedding photography equipment"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="absolute top-1/2 -right-12 w-12 h-12 bg-lime-400/30 rounded-full overflow-hidden animate-bounce">
                <img
                  src="https://picsum.photos/seed/wedding-flowers/48/48"
                  alt="Wedding flowers and decorations"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Additional Stats/Features */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="font-heading-primary text-3xl text-lime-400 mb-2">500+</div>
                <div className="font-ui-secondary text-sm text-white/70">{t('stats.vendors')}</div>
              </div>
              <div className="text-center">
                <div className="font-heading-primary text-3xl text-lime-400 mb-2">100%</div>
                <div className="font-ui-secondary text-sm text-white/70">{t('stats.authentic')}</div>
              </div>
              <div className="text-center">
                <div className="font-heading-primary text-3xl text-lime-400 mb-2">24/7</div>
                <div className="font-ui-secondary text-sm text-white/70">{t('stats.support')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-20 right-20 w-40 h-40 border-4 border-lime-400/10 rounded-full hidden lg:block"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 border-2 border-lime-400/20 rounded-full hidden lg:block"></div>
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-lime-400 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-lime-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
    </section>
  );
}
