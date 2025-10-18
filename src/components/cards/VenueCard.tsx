'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MapPin, Star } from 'lucide-react';

export type VenueCardProps = {
  id: string;
  name: string;        // Title
  city: string;
  priceFromMAD?: number;
  rating?: { score: number; count: number };
  imageUrl: string;
  maxGuests?: number;  // optional metadata row
  styles?: string[];   // e.g., ["Garden","Luxury"]
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string, next: boolean) => void;
};

export default function VenueCard({
  id,
  name,
  city,
  priceFromMAD,
  rating,
  imageUrl,
  maxGuests,
  styles,
  isFavorited = false,
  onFavoriteToggle,
}: VenueCardProps) {
  const [favorite, setFavorite] = useState(isFavorited);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    onFavoriteToggle?.(id, newFavoriteState);
  };

  return (
    <article className="group relative bg-white rounded-venue-card shadow-venue-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-venue-card-hover">
      <div className="relative">
        {/* Image */}
        <div className="relative w-full aspect-[16/10] md:aspect-[16/10] sm:aspect-[4/3] aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${name} venue`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Price Badge - Top Left */}
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold bg-price-warm text-[#1E1E1E] shadow-sm">
              {priceFromMAD ? `From MAD ${priceFromMAD.toLocaleString()}` : 'Price on request'}
            </span>
          </div>

          {/* Favorite Button - Top Right */}
          <button
            onClick={handleFavoriteClick}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={favorite}
            className="absolute right-3 top-3 grid place-items-center size-9 rounded-full bg-white/90 backdrop-blur shadow-sm ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-wv-lime transition-colors hover:bg-white"
          >
            <Heart
              className={`size-4 transition-colors ${
                favorite ? 'fill-[#1E1E1E] text-[#1E1E1E]' : 'text-[#9CA3AF] fill-none'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 space-y-2">
        {/* Title and Rating Row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[20px] leading-[28px] font-semibold text-[#1E1E1E] truncate flex-1 font-poppins">
            {name}
          </h3>
          {rating && (
            <div className="shrink-0 flex items-center gap-1 text-[14px] text-[#1E1E1E]">
              <Star className="size-4 fill-star-gold text-star-gold" />
              <span className="font-medium">{rating.score.toFixed(1)}</span>
              <span className="text-[#6B7280]">({rating.count})</span>
            </div>
          )}
        </div>

        {/* City Row */}
        <div className="flex items-center gap-2 text-[15px] text-[#6B7280]">
          <MapPin className="size-4 opacity-80" />
          <span className="truncate">{city}</span>
        </div>

        {/* Optional Meta Row */}
        {(maxGuests || styles?.length) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {maxGuests && (
              <span className="inline-flex items-center rounded-[12px] px-3 py-1 bg-neutral-100 text-[13px] text-[#6B7280]">
                👰 {maxGuests} Guests
              </span>
            )}
            {styles?.slice(0, 2).map((style) => (
              <span
                key={style}
                className="inline-flex items-center rounded-[12px] px-3 py-1 bg-neutral-100 text-[13px] text-[#6B7280]"
              >
                {style}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
