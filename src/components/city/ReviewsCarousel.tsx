'use client';

import { useRef, useState } from 'react';

interface ReviewsCarouselProps {
  city: {
    name: string;
    description: string;
    image: string;
    tagline: string;
  };
}

const reviews = [
  {
    id: '1',
    quote: `"Our wedding in Marrakech was absolutely magical. The venue was stunning and our planner made everything seamless. Every detail was perfect!"`,
    rating: 5,
    reviewer: 'Sarah & Ahmed',
    location: 'Marrakech',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '2',
    quote: `"The catering was incredible - authentic Moroccan flavors with beautiful presentation. Our guests are still talking about the food!"`,
    rating: 5,
    reviewer: 'Maria & Karim',
    location: 'Casablanca',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '3',
    quote: `"The attention to detail was incredible. From the traditional henna ceremony to the modern reception, everything was flawless."`,
    rating: 5,
    reviewer: 'Lisa & Omar',
    location: 'Rabat',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '4',
    quote: `"Working with our photographer was amazing. They captured the beauty of Fes perfectly and made us feel so comfortable throughout."`,
    rating: 5,
    reviewer: 'Emma & Youssef',
    location: 'Fes',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '5',
    quote: `"The traditional music and decor made our wedding unforgettable. Everything was perfectly coordinated and culturally authentic."`,
    rating: 5,
    reviewer: 'Fatima & Hassan',
    location: 'Tangier',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsCarousel({ city }: ReviewsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    setTimeout(checkScrollButtons, 300);
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    setTimeout(checkScrollButtons, 300);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-wervice-ink mb-2">
          What couples say about {city.name}
        </h2>
        <p className="text-wervice-taupe">
          Real experiences from couples who chose {city.name} for their weddings
        </p>
      </div>

      {/* Reviews Carousel */}
      <div className="relative">
        {/* Left Navigation Arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-wervice-lime border border-wervice-sand/50 rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-wervice-lime -translate-x-1/2"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Navigation Arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-wervice-lime border border-wervice-sand/50 rounded-full p-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-wervice-lime translate-x-1/2"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="overflow-hidden snap-x snap-mandatory -mx-4 px-4"
          onScroll={checkScrollButtons}
        >
          <div className="flex gap-6 pb-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  <StarRating rating={review.rating} />
                </div>

                <blockquote className="text-gray-700 mb-4 leading-relaxed">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.reviewer}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {review.reviewer}
                    </div>
                    <div className="text-xs text-gray-500">
                      {review.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
