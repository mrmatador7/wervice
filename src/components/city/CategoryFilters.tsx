'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock analytics - replace with your actual analytics implementation
const analytics = {
  track: (event: string, data: any) => {
    console.log('Analytics:', event, data);
    // In real app: analytics.track(event, data);
  }
};

const categories = [
  {
    id: 'venues',
    name: 'Venues',
    icon: '/categories/venues.png',
    slug: 'venues',
  },
  {
    id: 'catering',
    name: 'Catering',
    icon: '/categories/Catering.png',
    slug: 'catering',
  },
  {
    id: 'dresses',
    name: 'Dresses',
    icon: '/categories/Dresses.png',
    slug: 'dresses',
  },
  {
    id: 'photo-video',
    name: 'Photo & Video',
    icon: '/categories/photo.png',
    slug: 'photo-video',
  },
  {
    id: 'planning',
    name: 'Planning',
    icon: '/categories/event planner.png',
    slug: 'planning',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: '/categories/beauty.png',
    slug: 'beauty',
  },
  {
    id: 'decor',
    name: 'Decor',
    icon: '/categories/decor.png',
    slug: 'decor',
  },
  {
    id: 'music',
    name: 'Music',
    icon: '/categories/music.png',
    slug: 'music',
  },
];

interface CategoryFiltersProps {
  cityName: string;
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilters({ cityName, onCategoryChange }: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Sync with URL on mount and URL changes
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    setActiveCategory(category);
  }, [searchParams]);

  const handleCategoryClick = (categorySlug: string) => {
    const newCategory = categorySlug === 'all' ? 'all' : categorySlug;

    // Update local state
    setActiveCategory(newCategory);

    // Update URL with shallow routing
    const newSearchParams = new URLSearchParams(searchParams);
    if (newCategory === 'all') {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', newCategory);
    }

    const newUrl = newSearchParams.toString()
      ? `?${newSearchParams.toString()}`
      : window.location.pathname;

    router.push(newUrl, { scroll: false });

    // Notify parent component
    onCategoryChange?.(newCategory);

    // Track analytics
    analytics.track('category_selected', {
      city: cityName,
      category: newCategory,
      source: 'chips'
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-wervice-ink">
          Browse by Category
        </h2>
        <button
          onClick={() => handleCategoryClick('all')}
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
            onClick={() => handleCategoryClick(category.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              activeCategory === category.slug
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
