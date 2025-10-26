'use client';

import Link from 'next/link';
import { FiHeart, FiMapPin, FiStar } from 'react-icons/fi';
import { formatPrice } from '@/lib/format';
import { convert } from '@/lib/currency';
import { CurrencyCode } from '@/lib/types/vendor';

interface Vendor {
  id: string;
  name: string;
  city: string;
  category: string;
  cover: string;
  images?: string[];
  rating: number;
  reviews: number;
  tags: string[];
  priceFromMAD?: number;
  isFeatured?: boolean;
  slug: string;
}

interface NewVendorCardProps {
  vendor: Vendor;
  currency?: CurrencyCode;
}

// Capitalize first letter of each word
const capitalizeCity = (city: string) => {
  return city
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function NewVendorCard({ vendor, currency = 'MAD' }: NewVendorCardProps) {
  const convertedPrice = vendor.priceFromMAD ? convert(vendor.priceFromMAD, currency) : undefined;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-[#D9FF0A] hover:shadow-2xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-neutral-100">
        <Link href={`/vendors/${vendor.slug}`}>
          <img
            src={vendor.cover}
            alt={vendor.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        {/* Featured Badge */}
        {vendor.isFeatured && (
          <div className="absolute top-3 left-3 bg-[#D9FF0A] text-[#11190C] px-3 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}

        {/* Category Badge - Top Right */}
        {vendor.tags.length > 0 && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
            <span className="text-xs font-medium text-neutral-700">
              {vendor.tags[0]}
            </span>
          </div>
        )}

        {/* Save Heart - Moved to bottom right */}
        <button
          aria-label={`Save ${vendor.name}`}
          className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-[#D9FF0A] flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
        >
          <FiHeart className="h-4 w-4 text-neutral-700" />
        </button>

        {/* Rating Badge */}
        {vendor.rating > 0 && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
            <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-neutral-900">{vendor.rating.toFixed(1)}</span>
            <span className="text-xs text-neutral-500">({vendor.reviews})</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Vendor Name */}
        <Link href={`/vendors/${vendor.slug}`}>
          <h3 className="text-lg font-bold text-[#11190C] mb-2 hover:text-[#D9FF0A] transition-colors line-clamp-2 group-hover:text-[#D9FF0A]">
            {vendor.name}
          </h3>
        </Link>

        {/* Location */}
        {vendor.city && (
          <div className="flex items-center gap-1.5 text-sm text-neutral-600 mb-3">
            <FiMapPin className="h-4 w-4" />
            <span>{capitalizeCity(vendor.city)}</span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div>
            {convertedPrice ? (
              <>
                <div className="text-xs text-neutral-500 mb-1">Starting from</div>
                <div className="text-xl font-bold text-[#11190C]">
                  {formatPrice(convertedPrice, currency)}
                </div>
              </>
            ) : (
              <div className="text-sm text-neutral-500">Price on request</div>
            )}
          </div>
          
          <Link
            href={`/vendors/${vendor.slug}`}
            className="px-5 py-2.5 bg-[#11190C] text-white rounded-full text-sm font-semibold hover:bg-[#D9FF0A] hover:text-[#11190C] transition-all"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

