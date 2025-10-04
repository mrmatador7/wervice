'use client';

import { useTranslations } from 'next-intl';

const categories = [
  {
    name: 'Venues',
    icon: '/categories/venues.png',
    description: 'Wedding halls, riads, gardens'
  },
  {
    name: 'Catering',
    icon: '/categories/Catering.png',
    description: 'Traditional Moroccan cuisine'
  },
  {
    name: 'Photo & Video',
    icon: '/categories/photo.png',
    description: 'Photography and videography'
  },
  {
    name: 'Planning & Beauty',
    icon: '/categories/beauty.png',
    description: 'Wedding planning and henna'
  },
  {
    name: 'Decor',
    icon: '/categories/decor.png',
    description: 'Floral arrangements and styling'
  },
  {
    name: 'Music',
    icon: '/categories/music.png',
    description: 'Live music and entertainment'
  },
  {
    name: 'Dresses',
    icon: '/categories/Dresses.png',
    description: 'Wedding dresses and attire'
  },
  {
    name: 'Event Planner',
    icon: '/categories/event planner.png',
    description: 'Full wedding coordination'
  }
];

export default function VendorCategories() {
  const t = useTranslations('vendor');

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="font-decorative text-3xl md:text-4xl text-gray-900 mb-4">
              Join Any Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whatever your wedding specialty, there&apos;s a place for you on Wervice
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group bg-gray-50 hover:bg-white rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-white rounded-full p-3 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <h3 className="font-ui-secondary text-lg text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
