'use client';

import { useTranslations } from 'next-intl';
import { FeaturedDealsProps } from '@/models/types';
import { FEATURED_DEALS } from '@/lib/config';
import { generateStars, useCountdown } from '@/lib';


export default function FeaturedDeals({}: FeaturedDealsProps) {
  const t = useTranslations('featuredDeals');
  const timeLeft = useCountdown({ days: 2, hours: 14, minutes: 32, seconds: 45 });

  // Show all deals on homepage
  const filteredDeals = FEATURED_DEALS;


  const handleAddToRegistry = (dealTitle: string) => {
    alert(`${dealTitle} added to your wedding registry!`);
  };

  return (
    <section className="py-16 bg-gray-50 moroccan-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading-secondary text-3xl md:text-4xl leading-tight text-black mb-4">
            {t('title')}
          </h2>
          <p className="text-body-large text-gray-600 font-body-primary">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="deal-card">
              <div className="relative">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-lime-400 text-black px-2 py-1 rounded-lg font-bold text-sm">
                  {deal.discount}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-heading-secondary text-lg md:text-xl leading-snug text-black mb-2 line-clamp-2">
                  {deal.title}
                </h3>

                <div className="flex items-center mb-3">
                  <span className="text-lime-400 mr-2 font-cultural">{generateStars(deal.rating)}</span>
                  <span className="text-gray-600 font-body-secondary text-sm">({deal.rating})</span>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-bold text-black">{deal.price}</span>
                  {deal.originalPrice && (
                    <span className="text-gray-500 line-through ml-2">{deal.originalPrice}</span>
                  )}
                </div>

                <div className="font-ui-secondary text-sm text-gray-600 mb-4">
                  <span className="font-semibold">{t('endsIn')}</span> {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                </div>

                <button
                  onClick={() => handleAddToRegistry(deal.title)}
                  className="btn-primary w-full font-ui-primary text-sm md:text-base uppercase tracking-wide"
                >
                  {t('addToRegistry')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{t('noDeals')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
