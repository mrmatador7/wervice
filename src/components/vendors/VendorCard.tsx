'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { labelForCategory } from '@/lib/categories';
import { capitalizeCity } from '@/lib/utils';

import { Vendor } from '@/lib/types/vendor';

type VendorCardProps = {
  vendor: Vendor;
};

export default function VendorCard({ vendor }: VendorCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getImageUrl = () => {
    if (imgError) return null;
    return vendor.profile_photo_url || (vendor.gallery_urls && vendor.gallery_urls[0]) || null;
  };

  const imageUrl = getImageUrl();
  const categoryLabel = labelForCategory(vendor.category);
  const cityLabel = capitalizeCity(vendor.city);

  return (
    <article className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-all hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={vendor.business_name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,#f1f5f9,transparent),radial-gradient(circle_at_80%_0,#e2e8f0,transparent)] bg-zinc-100" />
        )}

        {/* Category Pill */}
        <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium shadow backdrop-blur-sm">
          {categoryLabel}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsBookmarked(!isBookmarked);
          }}
          className={`absolute right-2 top-2 grid h-8 w-8 place-content-center rounded-full backdrop-blur-sm transition-colors ${
            isBookmarked ? 'bg-zinc-900 text-white' : 'bg-black/60 text-white hover:bg-black/80'
          }`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="mt-3 flex flex-1 flex-col">
        {/* Title */}
        <h3 className="line-clamp-1 font-semibold text-zinc-900">
          {vendor.business_name}
        </h3>

        {/* Meta */}
        <p className="mt-1 text-sm text-zinc-500">
          {categoryLabel} • {cityLabel}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between gap-2">
          {/* Price Chip */}
          {vendor.starting_price ? (
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-[12px] font-medium text-zinc-800">
              From MAD {vendor.starting_price.toLocaleString()}
            </span>
          ) : (
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-[12px] font-medium text-zinc-500">
              Price on request
            </span>
          )}
        </div>

        {/* CTA Button */}
        <Link
          href={vendor.slug ? `/en/vendors/${vendor.slug}` : '/en/vendors'}
          className="mt-3 w-full rounded-full bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
        >
          View Vendor →
        </Link>
      </div>
    </article>
  );
}
