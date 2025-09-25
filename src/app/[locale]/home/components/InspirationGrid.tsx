'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { InspirationGridProps } from '@/models/types';
import { INSPIRATION_ITEMS, FILTER_CATEGORIES } from '@/lib/constants';


export default function InspirationGrid({}: InspirationGridProps) {
  const t = useTranslations('inspiration');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredInspirations = INSPIRATION_ITEMS.filter(item => {
    // Style-based filtering (traditional, modern, luxury)
    let matchesFilter = true;
    if (activeFilter === 'traditional') {
      matchesFilter = ['venues', 'music', 'decor'].includes(item.category);
    } else if (activeFilter === 'modern') {
      matchesFilter = ['photo-video', 'planning-beauty'].includes(item.category);
    } else if (activeFilter === 'luxury') {
      matchesFilter = ['dresses', 'venues'].includes(item.category);
    }

    return matchesFilter;
  });

  const handleViewDetails = (title: string) => {
    alert(`Viewing details for: ${title}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading-primary text-3xl md:text-4xl text-black mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            {t('subtitle')}
          </p>

          {/* Filter Dots */}
          <div className="flex justify-center space-x-4 mb-8">
            {FILTER_CATEGORIES.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeFilter === filter.key ? 'bg-lime-400' : 'bg-gray-300'
                }`}
                title={filter.label}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredInspirations.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(item.title)}
            >
              <div
                className="w-full h-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="p-4">
                <h3 className="font-semibold text-black mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <a
                  href={item.link}
                  className="text-lime-400 hover:text-black transition-colors text-sm font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('viewDetails')}
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredInspirations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{t('noInspirations')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
