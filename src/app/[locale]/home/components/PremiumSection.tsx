'use client';

import { useTranslations } from 'next-intl';
import { PREMIUM_BENEFITS } from '@/lib/config';

export default function PremiumSection() {
  const t = useTranslations('premium');
  const handleSubscribe = () => {
    alert('Premium subscription activated! Enjoy exclusive Moroccan wedding planning tools.');
  };


  return (
    <section className="py-16 bg-[#F7F8FB] moroccan-pattern">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left rtl:lg:text-right">
            <div className="text-6xl mb-6">⭐</div>
            <h2 className="font-decorative text-3xl md:text-4xl leading-tight text-black mb-6">
              {t('title')}
            </h2>
            <p className="text-body-large text-gray-700 mb-8 leading-relaxed font-body-primary">
              {t('description')}
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {PREMIUM_BENEFITS.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-ui-secondary text-black mb-2">{benefit.title}</h3>
                  <p className="font-body-secondary text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubscribe}
              className="btn-primary font-ui-primary text-sm md:text-base uppercase tracking-wide px-8 py-4"
            >
              {t('subscribe')}
            </button>
          </div>

          {/* Right Content - Image */}
          <div className="text-center lg:text-right">
            <img
              src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&h=400&fit=crop&crop=center"
              alt="Moroccan Wedding Celebration"
              className="rounded-lg shadow-lg w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
