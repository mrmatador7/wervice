'use client';

import Link from 'next/link';
import CompactListingCard from './CompactListingCard';

type ListingItem = {
  id: string;
  name: string;
  city: string;
  category: string;
  coverImage: string;
  avatarImage?: string;
  rating?: number;
  priceFrom?: number;
  isFavorite?: boolean;
};

interface CategoryRailProps {
  title: string;
  slug: string;
  items: ListingItem[];
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export default function CategoryRail({
  title,
  slug,
  items,
  onToggleFavorite
}: CategoryRailProps) {
  // Don't render if less than 3 items
  if (items.length < 3) {
    return null;
  }

  return (
    <div className="mb-10 md:mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-inter font-bold text-xl md:text-2xl text-gray-900">
          {title}
        </h3>

        <Link
          href={`/category/${slug}`}
          className="inline-flex items-center gap-2 font-inter font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          See more
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-4 px-4">
          <div className="flex space-x-5 md:space-x-6 pb-4 pr-4">
            {items.map((item) => (
              <CompactListingCard
                key={item.id}
                {...item}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
