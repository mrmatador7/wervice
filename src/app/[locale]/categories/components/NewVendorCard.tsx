'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin } from 'react-icons/fi';
import { formatCategoryName } from '@/lib/format';

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

// Capitalize first letter of each word
const capitalizeCity = (city: string) => {
  return city
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Get category icon path
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    venues: '/categories/venues.png',
    photography: '/categories/photo.png',
    'photo-video': '/categories/photo.png',
    catering: '/categories/Catering.png',
    music: '/categories/music.png',
    'event-planner': '/categories/event-planner.png',
    planning: '/categories/event-planner.png',
    beauty: '/categories/beauty.png',
    dresses: '/categories/Dresses.png',
    decor: '/categories/decor.png',
  };
  return iconMap[category.toLowerCase()] || '/categories/venues.png';
};

export default function NewVendorCard({ vendor }: NewVendorCardProps) {
  const categoryName = formatCategoryName(vendor.category);

  return (
    <article className="group mx-auto w-full max-w-[360px] rounded-[36px] border border-[#D9DFD1] bg-white p-4 shadow-[0_8px_24px_rgba(17,25,12,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(17,25,12,0.12)]">
      <div className="relative overflow-hidden rounded-[28px] aspect-square bg-neutral-100">
        <Link href={`/vendors/${vendor.slug}`} className="block h-full">
          <img
            src={vendor.cover}
            alt={vendor.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#11190C] px-3 py-1.5 shadow-md">
          <Image
            src={getCategoryIcon(vendor.category)}
            alt={categoryName}
            width={16}
            height={16}
            className="h-4 w-4 object-contain"
          />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#D9FF0A]">
            {categoryName}
          </span>
        </div>
      </div>

      <div className="px-2 pb-2 pt-5">
        <Link href={`/vendors/${vendor.slug}`}>
          <h3 className="line-clamp-2 text-[40px] font-extrabold leading-[1.05] text-[#11190C] transition-colors hover:text-[#2A3322]">
            {vendor.name}
          </h3>
        </Link>

        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#F7F8F2] px-4 py-3">
          <div className="inline-flex min-w-0 items-center gap-2 text-neutral-700">
            <FiMapPin className="h-5 w-5 shrink-0 text-[#11190C]" />
            <span className="truncate text-lg font-semibold">
              {capitalizeCity(vendor.city)}
            </span>
          </div>
        </div>

        <Link
          href={`/vendors/${vendor.slug}`}
          className="mt-5 block w-full rounded-full bg-[#11190C] py-4 text-center text-lg font-black uppercase tracking-[0.14em] text-[#D9FF0A] transition-all hover:bg-[#2A3322]"
        >
          View Vendor
        </Link>
      </div>
    </article>
  );
}
