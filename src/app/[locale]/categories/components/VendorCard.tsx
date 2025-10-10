import Link from 'next/link';
import { FiStar, FiHeart } from 'react-icons/fi';
import { formatPrice, formatRating } from '@/lib/format';
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

interface VendorCardProps {
  vendor: Vendor;
  currency?: CurrencyCode;
}

export default function VendorCard({ vendor, currency = 'MAD' }: VendorCardProps) {
  const convertedPrice = vendor.priceFromMAD ? convert(vendor.priceFromMAD, currency) : undefined;

  return (
    <article className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-200 will-change-transform">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-xl aspect-[4/3]">
        <Link href={`/vendors/${vendor.slug}`}>
          <img
            src={vendor.cover}
            alt={vendor.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Featured Badge */}
        {vendor.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-wv-lime px-3 py-1 text-xs font-medium text-wv-black shadow">
            Featured
          </span>
        )}

        {/* Save Heart */}
        <button
          aria-label={`Save ${vendor.name}`}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:scale-105 transition-all"
        >
          <FiHeart className="h-5 w-5 text-neutral-700" />
        </button>

        {/* Multiple Images Indicator */}
        {!!vendor.images?.length && vendor.images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2 py-1 text-xs text-neutral-700 shadow">
            +{vendor.images.length - 1}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <Link href={`/vendors/${vendor.slug}`}>
            <h3 className="text-base font-medium text-wv-black line-clamp-2 hover:text-wv-lime transition-colors">
              {vendor.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-sm text-neutral-700 flex-shrink-0">
            <FiStar className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="font-medium">{formatRating(vendor.rating)}</span>
            <span className="text-neutral-400">({vendor.reviews})</span>
          </div>
        </div>

        {/* Location & Category */}
        <p className="text-sm text-neutral-600 line-clamp-1 mb-3">
          {vendor.city} • {vendor.category}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {vendor.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-wv-gray1 text-neutral-700 text-xs px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-700">
            {convertedPrice ? (
              <>
                From <span className="font-medium text-wv-black">{formatPrice(convertedPrice, currency)}</span>
              </>
            ) : (
              <span className="text-neutral-500">Price on request</span>
            )}
          </div>

          <Link
            href={`/vendors/${vendor.slug}`}
            className="inline-flex h-9 items-center rounded-full bg-wv-lime px-4 text-sm font-medium text-wv-black shadow-sm hover:shadow-md transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
