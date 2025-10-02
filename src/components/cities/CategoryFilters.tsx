'use client';

import { useState } from 'react';

const categories = [
  {
    id: 'venues',
    name: 'Venues',
    icon: '/categories/venues.png',
  },
  {
    id: 'catering',
    name: 'Catering',
    icon: '/categories/Catering.png',
  },
  {
    id: 'dresses',
    name: 'Dresses',
    icon: '/categories/Dresses.png',
  },
  {
    id: 'photo-video',
    name: 'Photo & Video',
    icon: '/categories/photo.png',
  },
  {
    id: 'planning',
    name: 'Planning',
    icon: '/categories/event planner.png',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: '/categories/beauty.png',
  },
  {
    id: 'decor',
    name: 'Decor',
    icon: '/categories/decor.png',
  },
  {
    id: 'music',
    name: 'Music',
    icon: '/categories/music.png',
  },
];

export default function CategoryFilters() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-wervice-ink">
          Browse by Category
        </h2>
        <button
          onClick={() => setActiveCategory('all')}
          className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${
            activeCategory === 'all'
              ? 'bg-[#D9FF0A] text-black'
              : 'text-wervice-taupe hover:text-wervice-ink'
          }`}
        >
          Show All
        </button>
      </div>

      {/* Scrollable Category Pills */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              activeCategory === category.id
                ? 'bg-[#D9FF0A] border-[#D9FF0A] text-black shadow-sm'
                : 'bg-white border-wervice-sand/50 text-wervice-ink hover:border-wervice-sand hover:shadow-sm'
            }`}
          >
            <img
              src={category.icon}
              alt=""
              className="w-4 h-4 flex-shrink-0"
            />
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
