'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

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

interface CompactListingCardProps extends ListingItem {
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export default function CompactListingCard({
  id,
  name,
  city,
  category,
  coverImage,
  rating,
  priceFrom,
  isFavorite = false,
  onToggleFavorite
}: CompactListingCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    onToggleFavorite?.(id, newFavoriteState);
  };

  return (
    <Link
      href={`/vendor/${id}`}
      className="group relative flex-shrink-0 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/20 active:opacity-92 overflow-hidden snap-start rounded-2xl bg-white"
      style={{
        width: 'clamp(220px, 24vw, 260px)',
      }}
      aria-label={`Open ${name} in ${city} – ${category}`}
    >
      {/* Image Section - Fixed height */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <Image
          src={coverImage}
          alt={`${name} cover photo`}
          width={300}
          height={210}
          className="w-full h-[180px] md:h-[200px] lg:h-[210px] object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 220px, (max-width: 768px) 240px, 260px"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
        >
          <svg
            className={`w-4 h-4 ${favorite ? 'text-red-500 fill-current' : 'text-white'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-2 line-clamp-2">
          {name}
        </h3>

        {/* Meta Row */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{city}</span>

          {/* Rating or Price */}
          <div className="flex items-center gap-1">
            {rating && (
              <>
                <span className="text-yellow-500">⭐</span>
                <span className="text-gray-700 font-medium">{rating}</span>
              </>
            )}
            {priceFrom && (
              <span className="text-gray-700 font-medium">
                {priceFrom.toLocaleString()} MAD
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
