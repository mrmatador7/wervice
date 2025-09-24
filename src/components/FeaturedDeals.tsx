'use client';

import { FeaturedDealsProps } from '@/types';
import { FEATURED_DEALS } from '@/data/deals';
import { generateStars } from '@/utils';
import { useCountdown } from '@/hooks/useCountdown';


export default function FeaturedDeals({}: FeaturedDealsProps) {
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
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-4">
            Featured Moroccan Weddings
          </h2>
          <p className="text-gray-600 text-lg">
            Discover exclusive deals on traditional celebrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="deal-card">
              <div className="relative">
                <div
                  className="w-full h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${deal.image})` }}
                />
                <div className="absolute top-3 right-3 bg-lime-400 text-black px-2 py-1 rounded-lg font-bold text-sm">
                  {deal.discount}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
                  {deal.title}
                </h3>

                <div className="flex items-center mb-3">
                  <span className="text-lime-400 mr-2">{generateStars(deal.rating)}</span>
                  <span className="text-gray-600 text-sm">({deal.rating})</span>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-bold text-black">{deal.price}</span>
                  {deal.originalPrice && (
                    <span className="text-gray-500 line-through ml-2">{deal.originalPrice}</span>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Ends in:</span> {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                </div>

                <button
                  onClick={() => handleAddToRegistry(deal.title)}
                  className="btn-primary w-full"
                >
                  Add to Registry
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No deals found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
