'use client';

/**
 * VendorCardShowcase - Modern product card similar to Apple/Nike UI
 *
 * Visual Reference: Modern e-commerce product card with clean hierarchy and premium feel
 *
 * OVERALL CARD LAYOUT:
 * - Rounded rectangle (large radius ~20-24px) with white background and soft drop shadow
 * - Fixed width around 360px (desktop), full width on mobile
 * - Vertical layout: image section on top, content section below
 * - Generous padding (16-20px inside) with clean typography and perfect alignment
 *
 * TOP IMAGE SECTION:
 * - Image has rounded top corners matching the card radius
 * - Two badges positioned inside the image:
 *   - Top-left: small pill-shaped label (e.g., "Featured" or "Best Seller")
 *   - Top-right: circular badge containing category icon (40px diameter, white background)
 * - Bottom center: small carousel dots indicating multiple photos available
 * - Fixed height: 260px on small screens, 280px on medium+ screens
 *
 * BOTTOM CONTENT SECTION:
 * - Title: bold, large text (like "Nike NK Court Vision") using Poppins font
 * - Subtitle: smaller gray text line below title (like "Own the Court")
 * - Description: one short sentence in lighter gray (2 lines max with line-clamp)
 * - Bottom row with horizontal spacing:
 *   - Left: rounded rating chip (star icon + numeric value, replaces price)
 *   - Right: space for potential CTA (currently empty as per Wervice UX)
 *
 * STYLING & SPACING:
 * - Shadow: soft drop shadow using venue-card tokens for premium feel
 * - Colors: Wervice palette (light neutral backgrounds, black text, lime accent for focus)
 * - Spacing: 8px rhythm throughout, no overlaps or clipped elements
 * - Responsive: scales perfectly from 320px to 4K viewports
 *
 * INTERACTION & ACCESSIBILITY:
 * - Entire card is clickable and links to vendor detail page
 * - Built-in image carousel with touch/swipe on mobile
 * - Keyboard navigation for carousel (left/right arrows)
 * - Proper ARIA labels and focus management
 * - Skeleton loading state for smooth UX
 *
 * USAGE:
 * ```tsx
 * import VendorCardShowcase from '@/components/cards/VendorCardShowcase';
 * import IconForCategory from '@/components/icons/IconForCategory';
 *
 * const cardProps = {
 *   id: "vendor-1",
 *   name: "Beautiful Venue",
 *   href: "/en/vendors/beautiful-venue",
 *   city: "Marrakech",
 *   subtitle: "Wedding Venues",
 *   blurb: "Stunning garden venue perfect for weddings",
 *   images: [{ src: "/venue-image.jpg", alt: "Beautiful Venue" }],
 *   categoryIcon: <IconForCategory category="venues" size={16} />,
 *   badge: "Featured",
 *   rating: 4.8
 * };
 *
 * <VendorCardShowcase {...cardProps} />
 * ```
 */

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { ReactNode } from 'react';

export type VendorCardShowcaseProps = {
  id: string;
  name: string;                       // vendor name
  href: string;                       // vendor detail link
  city?: string;
  subtitle?: string;                  // e.g., category or short line used under title
  blurb?: string;                     // short description line
  images: { src: string; alt?: string }[]; // at least 1 image
  categoryIcon: ReactNode;            // icon element rendered in the top-right badge
  badge?: string;                     // optional e.g. "Featured"
  rating?: number;                    // 0..5
  className?: string;                 // optional override wrapper
};

export default function VendorCardShowcase({
  id,
  name,
  href,
  city,
  subtitle,
  blurb,
  images,
  categoryIcon,
  badge,
  rating,
  className = "",
}: VendorCardShowcaseProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Handle touch/swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Handle keyboard navigation for carousel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
      e.preventDefault();
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (e.key === 'ArrowRight' && currentImageIndex < images.length - 1) {
      e.preventDefault();
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const currentImage = images[currentImageIndex] || images[0];

  return (
    <Link
      href={href}
      className={`group block w-full max-w-[360px] ${className}`}
      aria-label={`${name}${city ? ` in ${city}` : ''}`}
    >
      {/* OVERALL CARD CONTAINER - Rounded rectangle with soft drop shadow */}
      <article className="bg-white rounded-venue-card shadow-venue-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-venue-card-hover focus:outline-none focus:ring-2 focus:ring-wv-lime focus:ring-offset-2">
        {/* TOP IMAGE SECTION - Image with rounded top corners, fixed height, badges inside */}
        <div
          className="relative h-[260px] md:h-[280px] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="img"
          aria-label={`Image carousel for ${name}`}
        >
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Images */}
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-300 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt || `${name} - Image ${index + 1}`}
                fill
                className="object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                onLoad={index === 0 ? handleImageLoad : undefined}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              />
            </div>
          ))}

          {/* Top-left Badge - Small pill-shaped label (e.g., "Featured" or "Best Seller") */}
          {badge && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-neutral-100 text-gray-700 shadow-sm">
                {badge}
              </span>
            </div>
          )}

          {/* Top-right Category Icon Badge - Circular badge containing category icon */}
          <div className="absolute top-3 right-3 grid place-items-center size-10 rounded-full bg-white/90 backdrop-blur shadow-sm ring-1 ring-black/5">
            {categoryIcon}
          </div>

          {/* Bottom Center Dots - Small carousel dots indicating multiple photos */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  aria-label={`Go to image ${index + 1} of ${images.length}`}
                  className={`size-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-gray-800' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM CONTENT SECTION - Title, subtitle, description, and rating */}
        <div className="p-4 space-y-3">
          {/* Title and Subtitle - Bold large title with smaller gray subtitle below */}
          <div className="space-y-1">
            <h3 className="font-poppins font-semibold text-[20px] leading-[28px] text-[#1E1E1E] line-clamp-2">
              {name}
            </h3>
            {(subtitle || city) && (
              <p className="text-[15px] text-[#6B7280] line-clamp-1">
                {subtitle || city}
              </p>
            )}
          </div>

          {/* Description - One short sentence in lighter gray (2 lines max) */}
          {blurb && (
            <p className="text-[14px] text-[#6B7280] leading-[20px] line-clamp-2">
              {blurb}
            </p>
          )}

          {/* Bottom Row - Rating chip on left, space for CTA on right */}
          {rating && rating > 0 && (
            <div className="flex justify-between items-center">
              {/* Left: Rating Chip - Rounded chip showing star icon + numeric value */}
              <div className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 bg-neutral-100 text-sm font-medium text-[#1E1E1E]">
                <Star className="size-4 fill-star-gold text-star-gold" />
                <span>{rating.toFixed(1)}</span>
              </div>

              {/* Right: Space for potential CTA button (currently empty per Wervice UX) */}
              <div className="w-0"></div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
