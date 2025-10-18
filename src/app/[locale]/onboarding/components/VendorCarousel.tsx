'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  image: string;
  category: string;
}

interface VendorCarouselProps {
  vendors: Vendor[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
  }).format(price);
};

export function VendorCarousel({ vendors }: VendorCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show 3 vendors on desktop, 1 on mobile
  const itemsPerView = typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1;
  const maxIndex = Math.max(0, vendors.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="flex-shrink-0 w-full md:w-1/3"
            >
              <VendorCard vendor={vendor} />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {vendors.length > itemsPerView && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm border border-wv-gray3 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors z-10"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm border border-wv-gray3 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors z-10"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {vendors.length > itemsPerView && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-wervice-lime' : 'bg-wv-gray3'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <motion.div
      className="bg-white border border-wv-gray3 rounded-xl overflow-hidden shadow-card hover:shadow-cardHover transition-shadow"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-wv-gray2 relative overflow-hidden">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-wervice-ink">
          {vendor.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-semibold text-wervice-ink line-clamp-2">
            {vendor.name}
          </h4>
          <div className="flex items-center gap-1 text-sm text-wervice-taupe mt-1">
            <MapPin className="w-4 h-4" />
            {vendor.location}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-wervice-ink">
              {vendor.rating}
            </span>
          </div>
          <span className="text-sm text-wervice-taupe">
            ({vendor.reviewCount} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-wervice-ink">
            {formatPrice(vendor.price)}
          </div>
          <button className="inline-flex items-center gap-2 bg-wervice-lime text-wervice-ink font-semibold px-4 py-2 rounded-lg hover:bg-wv-limeDark transition-colors text-sm">
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
