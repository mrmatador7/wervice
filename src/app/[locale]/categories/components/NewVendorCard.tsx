'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  const categoryIcon = getCategoryIcon(vendor.category);
  const categoryName = formatCategoryName(vendor.category);

  return (
    <article className="group bg-white rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full max-w-[420px]">
      {/* Image Container - 16:9 aspect ratio for wider look */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Link href={`/vendors/${vendor.slug}`} className="block h-full">
          <img
            src={vendor.cover}
            alt={vendor.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Category Icon - Top Left */}
          <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center p-2">
            <Image
              src={categoryIcon}
              alt={categoryName}
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>

          {/* City - Top Right */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <span className="text-xs font-semibold text-neutral-700">
              {capitalizeCity(vendor.city)}
            </span>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Vendor Name */}
        <Link href={`/vendors/${vendor.slug}`}>
          <h3 className="text-2xl font-bold text-[#11190C] mb-1 hover:text-[#D9FF0A] transition-colors line-clamp-1 tracking-tight">
            {vendor.name}
          </h3>
        </Link>

        {/* Category */}
        <p className="text-sm text-neutral-500 mb-6 font-medium">
          {categoryName}
        </p>

        {/* CTA Button */}
        <Link
          href={`/vendors/${vendor.slug}`}
          className="block w-full py-4 bg-[#11190C] text-white rounded-full text-base font-semibold hover:bg-[#2A2F25] transition-all text-center shadow-sm hover:shadow-md"
        >
          Get in Touch
        </Link>
      </div>
    </article>
  );
}

