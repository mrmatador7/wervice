'use client';

import VenueCard from './VenueCard';

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
  avatarImage,
  rating,
  priceFrom,
  isFavorite = false,
  onToggleFavorite
}: CompactListingCardProps) {
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
