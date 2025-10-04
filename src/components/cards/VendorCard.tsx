'use client';
import Image from 'next/image';
import { FiHeart } from 'react-icons/fi';

export type VendorCardProps = {
  name: string;
  city: string;
  coverUrl: string;
  rating?: number;   // e.g. 4.8
  price?: string;    // e.g. '15,000 MAD'
  href?: string;
};

export default function VendorCard({
  name,
  city,
  coverUrl,
  rating,
  price,
  href = '#',
}: VendorCardProps) {
  return (
    <a
      href={href}
      className="group block rounded-xl overflow-hidden bg-white ring-1 ring-black/5 hover:ring-black/10 shadow-sm hover:shadow-md transition"
    >
      <div className="relative h-44 w-full">
        <Image
          src={coverUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute right-2 top-2 rounded-full bg-black/45 p-1.5 backdrop-blur-sm text-white">
          <FiHeart size={14} />
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="font-medium text-gray-900 leading-tight line-clamp-1">
          {name}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <span className="truncate">{city}</span>
          {typeof rating === 'number' && (
            <>
              <span aria-hidden>•</span>
              <span className="inline-flex items-center gap-1">
                <span role="img" aria-label="rating">⭐</span>
                {rating.toFixed(1)}
              </span>
            </>
          )}
          {price && (
            <>
              <span aria-hidden>•</span>
              <span>{price}</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}
