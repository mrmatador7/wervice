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
  categoryImage?: string;
  rating?: number;
  priceFrom?: number;
  isFavorite?: boolean;
};

interface ListingCardProps extends ListingItem {
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export default function ListingCard({
  id,
  name,
  city,
  category,
  coverImage,
  categoryImage,
  rating,
  priceFrom,
  isFavorite = false,
  onToggleFavorite
}: ListingCardProps) {
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
      className="group relative flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/20 active:opacity-92 overflow-hidden snap-start"
      style={{
        width: 'clamp(220px, 26vw, 320px)',
        height: 'clamp(340px, 40vw, 460px)',
        borderRadius: '26px'
      }}
      aria-label={`Open listing: ${name}, ${category}, ${city}`}
    >
      {/* Background Image with Color Wash */}
      <Image
        src={coverImage}
        alt={`${name} cover photo`}
        fill
        className="object-cover object-center group-hover:scale-103 transition-transform duration-300"
        sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, 320px"
        loading="lazy"
        style={{ borderRadius: '26px' }}
      />

      {/* Color Wash Overlay */}
      <div
        className="absolute inset-0 group-hover:opacity-90 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
        }}
      ></div>

      {/* City Chip - Top Left */}
      <div className="absolute top-4 left-4">
        <div className="bg-black/35 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 flex items-center gap-1.5">
          <svg className="w-3 h-3 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-white/90 text-xs font-medium">{city}</span>
        </div>
      </div>

      {/* Favorite Button - Top Right */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 w-9 h-9 bg-black/35 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-black/45 transition-colors duration-200"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={favorite}
      >
        <svg
          className={`w-4 h-4 ${favorite ? 'text-red-400 fill-current' : 'text-white'}`}
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

      {/* Optional Rating/Price Chips - Bottom Left */}
      {(rating || priceFrom) && (
        <div className="absolute bottom-20 left-4 flex gap-2">
          {rating && (
            <div className="bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white/90 flex items-center gap-1">
              <span>⭐</span>
              <span>{rating}</span>
            </div>
          )}
          {priceFrom && (
            <div className="bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white/90">
              from {priceFrom.toLocaleString()} MAD
            </div>
          )}
        </div>
      )}

      {/* Glass Pill - Bottom */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/35 backdrop-blur-lg border border-white/22 rounded-2xl px-4 py-2.5 flex items-center gap-3">
          {/* Category Avatar */}
          <div className="flex-shrink-0">
            {categoryImage ? (
              <Image
                src={categoryImage}
                alt={category}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {category.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Name and Category */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base leading-tight truncate mb-1">
              {name}
            </h3>
            <p className="text-white/80 text-xs">
              {category}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
