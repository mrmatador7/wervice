'use client';

import ListingCard from './ListingCard';

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

interface ListingsRailProps {
  title?: string;
  items: ListingItem[];
  variant?: "carousel" | "grid";
  className?: string;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export default function ListingsRail({
  title = "Discover Listings",
  items,
  variant = "carousel",
  className = "",
  onToggleFavorite
}: ListingsRailProps) {
  if (variant === "grid") {
    return (
      <section className={`px-4 md:px-6 lg:px-8 py-8 ${className}`}>
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-8">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Explore amazing wedding vendors and services
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ListingCard
                key={item.id}
                {...item}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Carousel Layout (default)
  return (
    <section className={`px-4 md:px-6 lg:px-8 py-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Explore amazing wedding vendors and services
          </p>
        </div>

        {/* Carousel Track */}
        <div className="relative">
          <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-4 px-4">
            <div className="flex space-x-5 md:space-x-6 pb-4 pr-4">
              {items.map((item) => (
                <ListingCard
                  key={item.id}
                  {...item}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
