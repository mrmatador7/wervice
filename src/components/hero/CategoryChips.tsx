'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';

const categories = [
  {
    value: 'venues',
    label: 'Venues',
    iconSrc: '/categories/venues.png'
  },
  {
    value: 'dresses',
    label: 'Dresses',
    iconSrc: '/categories/Dresses.png'
  },
  {
    value: 'catering',
    label: 'Catering',
    iconSrc: '/categories/Catering.png'
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

export default function CategoryChips() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');


  const handleCategoryClick = (categorySlug: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (activeCategory === categorySlug) {
      // If clicking the same category, clear it
      newSearchParams.delete('category');
    } else {
      // Set new category and clear city/subcategory/page (chips navigate to general search)
      newSearchParams.set('category', categorySlug);
      newSearchParams.delete('city');
      newSearchParams.delete('subcategory');
      newSearchParams.delete('page');
    }

    // Navigate with shallow routing
    const newUrl = newSearchParams.toString()
      ? `?${newSearchParams.toString()}`
      : window.location.pathname;

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
        {categories.map((category) => {
          const isActive = activeCategory === category.value;

          return (
            <button
              key={category.value}
              onClick={() => handleCategoryClick(category.value)}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#D9FF0A] text-[#11190C] font-semibold'
                  : 'bg-white border border-black/10 text-[#11190C] hover:bg-[#F3F1EE]'
              }`}
            >
              <Image
                src={category.iconSrc}
                alt=""
                width={16}
                height={16}
                className="shrink-0"
              />
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
