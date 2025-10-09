import Image from 'next/image';
import Link from 'next/link';
import { FiStar } from 'react-icons/fi';
import { SaveHeart } from './SaveHeart';
import { formatCurrency } from '@/lib/currency';

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  city: string;
  primaryCategory: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  shortFeatures?: string[];
}

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const imageUrl = vendor.images?.[0] || '/img/placeholder.webp';

  return (
    <article className="group rounded-2xl bg-white ring-1 ring-black/5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-[4/3]">
        <Link href={`/vendors/${vendor.slug}`}>
          <Image
            src={imageUrl}
            alt={vendor.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>

        {/* Featured Badge */}
        {vendor.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium ring-1 ring-black/5">
            Featured
          </span>
        )}

        {/* Save Heart */}
        <SaveHeart vendorId={vendor.id} className="absolute right-3 top-3" />
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Name and Location */}
        <div className="mb-3">
          <Link href={`/vendors/${vendor.slug}`}>
            <h3 className="font-semibold text-[#11190C] text-lg leading-tight line-clamp-2 hover:text-[#D9FF0A] transition-colors">
              {vendor.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-neutral-600 truncate">
            {vendor.city} • {vendor.primaryCategory}
          </p>
        </div>

        {/* Rating */}
        {vendor.rating && vendor.reviewCount && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 fill-[#D9FF0A] text-[#D9FF0A]" />
              <span className="text-sm font-medium text-[#11190C]">
                {vendor.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-neutral-500">
              ({vendor.reviewCount})
            </span>
          </div>
        )}

        {/* Features */}
        {vendor.shortFeatures && vendor.shortFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {vendor.shortFeatures.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-[#E9E6E2] bg-white px-2 py-0.5 text-[11px] text-neutral-700"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-700">
            <span>From </span>
            <strong className="text-[#11190C]">
              {vendor.minPrice
                ? formatCurrency(vendor.minPrice, 'MAD', { showSymbol: true })
                : 'Contact for pricing'
              }
            </strong>
          </div>

          <Link
            href={`/vendors/${vendor.slug}`}
            className="inline-flex h-9 items-center rounded-full bg-[#11190C] px-4 text-sm text-white hover:bg-black transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
