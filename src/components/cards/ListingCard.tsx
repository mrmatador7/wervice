'use client';

import VenueCard from './VenueCard';

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
  // Transform rating to the expected format
  const formattedRating = rating ? { score: rating, count: 0 } : undefined;

  return (
    <VenueCard
      id={id}
      name={name}
      city={city}
      priceFromMAD={priceFrom}
      rating={formattedRating}
      imageUrl={coverImage}
      isFavorited={isFavorite}
      onFavoriteToggle={onToggleFavorite}
    />
  );
}
