'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { labelForCategory } from '@/lib/categories';
import { capitalizeCity } from '@/lib/utils';
import { vendorUrl } from '@/lib/vendor-url';

import { Vendor } from '@/lib/types/vendor';

type VendorCardProps = {
  vendor: Vendor;
};

export default function VendorCard({ vendor }: VendorCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Build image list from gallery + profile photo
  const images: string[] = [];
  const gallery = (vendor as any).gallery_urls || (vendor as any).gallery_photos || [];
  if (Array.isArray(gallery) && gallery.length > 0) {
    images.push(...gallery.filter((url: string) => url && url.trim()));
  }
  if (vendor.profile_photo_url?.trim()) {
    images.push(vendor.profile_photo_url.trim());
  }

  const hasImages = images.length > 0;
  const total = images.length;

  // Auto-advance every 3 seconds when there are multiple images
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(timer);
  }, [total]);

  const categoryLabel = labelForCategory(vendor.category);
  const cityLabel = capitalizeCity(vendor.city);
  const vendorHref = vendor.slug ? vendorUrl(vendor, 'en') : '/en/vendors';

  return (
    <article className="group mx-auto flex w-full max-w-[480px] flex-col rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(17,25,12,0.14)]">
      {/* Image carousel */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-neutral-100">
        <Link href={vendorHref} className="block h-full">
          {hasImages ? (
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ width: `${total * 100}%`, transform: `translateX(-${(activeIndex * 100) / total}%)` }}
            >
              {images.map((src, i) => (
                <div key={i} className="relative h-full flex-shrink-0" style={{ width: `${100 / total}%` }}>
                  <Image
                    src={src}
                    alt={`${vendor.business_name} ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
              <span className="text-5xl font-bold text-zinc-300">
                {vendor.business_name.charAt(0)}
              </span>
            </div>
          )}
        </Link>

        {/* Category pill */}
        <div className="absolute left-3 top-3 rounded-2xl bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#11190C]">
            {categoryLabel}
          </span>
        </div>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setActiveIndex(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
        <Link href={vendorHref}>
          <h3 className="line-clamp-2 text-[22px] font-bold leading-snug text-[#11190C] sm:text-2xl">
            {vendor.business_name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-[#aaa]" />
          <span className="text-sm font-medium text-[#888]">{cityLabel}</span>
        </div>
      </div>
    </article>
  );
}
