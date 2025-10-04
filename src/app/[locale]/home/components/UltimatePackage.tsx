'use client';

import { useTranslations } from 'next-intl';
import { PACKAGE_BUNDLES } from '@/lib/config';

export default function UltimatePackage() {
  const t = useTranslations('ultimate');
  const handleBookPackage = () => {
    alert('Ultimate Moroccan Wedding Package booked! Our team will contact you within 24 hours.');
  };


  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left - Image */}
          <div className="text-center lg:text-left rtl:lg:text-right">
            <img
              src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop&crop=center"
              alt="Moroccan Bridal Couple"
              className="rounded-lg shadow-lg w-full max-w-sm mx-auto lg:mx-0"
            />
          </div>

          {/* Center - Main Content */}
          <div className="text-center">
            <h2 className="font-cultural text-3xl md:text-4xl leading-tight text-lime-400 mb-6">
              {t('title')}
            </h2>

            {/* Package Bundles */}
            <div className="flex justify-center space-x-4 mb-6">
              {PACKAGE_BUNDLES.map((bundle, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-lime-400 text-black rounded-full flex items-center justify-center text-2xl mx-auto mb-2">
                    {bundle.icon}
                  </div>
                  <p className="font-ui-primary text-sm">{bundle.name}</p>
                </div>
              ))}
            </div>

            <p className="text-body-large text-white/90 mb-6 leading-relaxed font-body-primary">
              {t('description')}
            </p>

            <div className="mb-6">
              <span className="text-2xl font-bold text-lime-400">{t('startingFrom')} 150,000 MAD</span>
            </div>

            <button
              onClick={handleBookPackage}
              className="btn-primary font-ui-primary text-sm md:text-base uppercase tracking-wide px-8 py-4"
            >
              {t('bookNow')}
            </button>
          </div>

          {/* Right - Decorative Elements */}
          <div className="text-center lg:text-right">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center text-3xl mx-auto lg:ml-auto lg:mr-0">
                🏮
              </div>
              <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center text-2xl mx-auto lg:ml-auto lg:mr-0">
                🖐️
              </div>
              <div className="w-24 h-24 bg-lime-400/20 border-4 border-lime-400 rounded-full mx-auto lg:ml-auto lg:mr-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
