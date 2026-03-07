'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FiMapPin } from 'react-icons/fi';
import { formatCategoryName } from '@/lib/format';
import { vendorUrl } from '@/lib/vendor-url';

/** Vendor shape from /api/vendors (vendor_leads + media) */
export interface AIVendorCardVendor {
  id: string;
  business_name: string;
  slug: string;
  city: string;
  category: string;
  profile_photo_url?: string | null;
  gallery_photos?: string[] | null;
  gallery_urls?: string[] | null;
  starting_price?: number | null;
}

interface VendorCardProps {
  vendor: AIVendorCardVendor;
}

const capitalizeCity = (city: string) =>
  city.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

export default function VendorCard({ vendor }: VendorCardProps) {
  const params = useParams<{ locale?: string }>();
  const locale = (params?.locale as string) || 'en';
  const href = vendorUrl({ city: vendor.city, category: vendor.category, slug: vendor.slug }, locale);

  const images: string[] = [];
  if (vendor.profile_photo_url?.trim()) images.push(vendor.profile_photo_url.trim());
  const gallery = vendor.gallery_photos ?? vendor.gallery_urls ?? [];
  gallery.forEach((img) => {
    if (img?.trim() && img !== vendor.profile_photo_url) images.push(img.trim());
  });
  const cover = images[0] || '';

  const categoryName = formatCategoryName(vendor.category);

  return (
    <Link href={href} className="group block w-full">
      <article className="bg-white rounded-[20px] border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          {cover ? (
            <Image
              src={cover}
              alt={vendor.business_name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 280px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-100">
              <span className="text-4xl font-bold text-neutral-300">
                {vendor.business_name.charAt(0)}
              </span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute left-3 top-3">
            <span className="inline-block rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#11190C] shadow-sm backdrop-blur-sm">
              {categoryName}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-4">
          <h3 className="text-[17px] font-bold leading-snug text-[#11190C] line-clamp-1 group-hover:text-[#333] transition-colors">
            {vendor.business_name}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5">
            <FiMapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
            <span className="text-sm text-neutral-500">{capitalizeCity(vendor.city)}</span>
          </div>
          {vendor.starting_price != null && vendor.starting_price > 0 && (
            <p className="mt-1.5 text-sm font-semibold text-[#11190C]">
              From {vendor.starting_price.toLocaleString()} MAD
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
