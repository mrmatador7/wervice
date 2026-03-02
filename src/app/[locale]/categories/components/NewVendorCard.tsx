'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiMapPin } from 'react-icons/fi';
import { formatCategoryName } from '@/lib/format';
import { vendorUrl } from '@/lib/vendor-url';

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
}

const capitalizeCity = (city: string) =>
  city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

export default function NewVendorCard({ vendor }: NewVendorCardProps) {
  const { locale } = useParams<{ locale: string }>();
  const href = vendorUrl({ city: vendor.city, category: vendor.category, slug: vendor.slug }, locale || 'en');
  const [activeIndex, setActiveIndex] = useState(0);

  const images: string[] = [];
  if (vendor.cover?.trim()) images.push(vendor.cover.trim());
  if (Array.isArray(vendor.images)) {
    vendor.images.forEach((img) => {
      if (img?.trim() && img !== vendor.cover) images.push(img.trim());
    });
  }
  const total = images.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => setActiveIndex((p) => (p + 1) % total), 3000);
    return () => clearInterval(timer);
  }, [total]);

  const categoryName = formatCategoryName(vendor.category);

  return (
    <Link href={href} className="group block w-full">
      <article className="bg-white rounded-[20px] border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          {total > 0 ? (
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ width: `${total * 100}%`, transform: `translateX(-${(activeIndex * 100) / total}%)` }}
            >
              {images.map((src, i) => (
                <div key={i} className="relative h-full flex-shrink-0" style={{ width: `${100 / total}%` }}>
                  <Image
                    src={src}
                    alt={`${vendor.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-100">
              <span className="text-5xl font-bold text-neutral-300">{vendor.name.charAt(0)}</span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute left-3 top-3">
            <span className="inline-block rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#11190C] shadow-sm backdrop-blur-sm">
              {categoryName}
            </span>
          </div>

          {/* Dot indicators */}
          {total > 1 && (
            <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setActiveIndex(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-4 py-4">
          <h3 className="text-[19px] font-bold leading-snug text-[#11190C] line-clamp-1 group-hover:text-[#333] transition-colors">
            {vendor.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5">
            <FiMapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
            <span className="text-sm text-neutral-500">{capitalizeCity(vendor.city)}</span>
          </div>
        </div>

      </article>
    </Link>
  );
}
