'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';

const categories = [
  {
    value: 'venues',
    label: 'Venues',
    iconSrc: '/categories/venues.png'
  },
  {
    value: 'dresses',
    label: 'Dresses',
    iconSrc: '/categories/dresses.png'
  },
  {
    value: 'catering',
    label: 'Catering',
    iconSrc: '/categories/catering.png'
  },
  {
    value: 'photo-video',
    label: 'Photo & Video',
    iconSrc: '/categories/photo.png'
  },
  {
    value: 'planning',
    label: 'Planning',
    iconSrc: '/categories/event planner.png'
  },
  {
    value: 'beauty',
    label: 'Beauty',
    iconSrc: '/categories/beauty.png'
  },
  {
    value: 'decor',
    label: 'Decor',
    iconSrc: '/categories/decor.png'
  },
  {
    value: 'music',
    label: 'Music',
    iconSrc: '/categories/music.png'
  }
];

interface VendorsCategoryChipsProps {
  activeCategory?: string;
  onCategoryChange?: (category: string | null) => void;
}

export default function VendorsCategoryChips({ activeCategory, onCategoryChange }: VendorsCategoryChipsProps) {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const handleCategoryClick = (categoryValue: string | null) => {
    if (onCategoryChange) {
      onCategoryChange(categoryValue);
      return;
    }

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());

    if (categoryValue) {
      params.set('category', categoryValue);
    } else {
      params.delete('category');
    }

    // Remove page param when changing filters
    params.delete('page');

    const queryString = params.toString();
    const url = `/${locale}/vendors${queryString ? `?${queryString}` : ''}`;

    router.push(url);
  };

  const handleShowAll = () => {
    handleCategoryClick(null);
  };

  return (
    <section className="py-8 bg-white border-b border-[#CAC4B7]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-[#11190C] mb-2">
              Browse by Category
            </h2>
            <p className="text-[#787664] text-sm">
              Find the perfect vendor for your wedding needs
            </p>
          </div>

          {/* Show All Button */}
          <button
            onClick={handleShowAll}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
              !activeCategory
                ? 'bg-[#D9FF0A] border-[#D9FF0A] text-[#11190C] font-medium shadow-sm'
                : 'border-[#CAC4B7] text-[#787664] hover:border-[#787664] hover:bg-[#F3F1EE]'
            }`}
          >
            <FiX className="w-4 h-4" />
            <span>Show All</span>
          </button>
        </div>

        {/* Category Chips */}
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category.value;
            return (
              <button
                key={category.value}
                onClick={() => handleCategoryClick(category.value)}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-[#D9FF0A] focus:ring-offset-2 ${
                  isActive
                    ? 'bg-[#D9FF0A] border-[#D9FF0A] text-[#11190C] font-medium shadow-sm scale-105'
                    : 'border-[#CAC4B7] text-[#787664] hover:border-[#787664] hover:bg-[#F3F1EE] hover:scale-102'
                }`}
              >
                <Image
                  src={category.iconSrc}
                  alt=""
                  width={20}
                  height={20}
                  className={`shrink-0 ${isActive ? 'opacity-100' : 'opacity-70'}`}
                />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
