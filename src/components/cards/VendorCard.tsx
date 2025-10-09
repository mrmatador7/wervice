'use client';
import Image from 'next/image';
import { FiHeart } from 'react-icons/fi';
import { Vendor } from '@/models/vendor';

export type VendorCardProps = {
  name: string;
  city: string;
  coverUrl?: string;
  rating?: number;   // e.g. 4.8
  price?: string;    // e.g. '15,000 MAD'
  href?: string;
};

type VendorCardWithVendorProps = {
  vendor: Vendor;
};

type Props = VendorCardProps | VendorCardWithVendorProps;

export default function VendorCard(props: Props) {
  // Handle both prop patterns
  const isVendorProp = 'vendor' in props;

  const {
    name,
    city,
    coverUrl,
    rating,
    price,
    href = '#',
  } = isVendorProp ? {
    name: props.vendor.name,
    city: props.vendor.city,
    coverUrl: props.vendor.coverImage || undefined,
    rating: props.vendor.rating,
    price: props.vendor.startingPrice ? `${props.vendor.startingPrice.toLocaleString()} MAD` : undefined,
    href: `/vendors/${props.vendor.slug}`,
  } : props;
  return (
    <a
      href={href}
      className="group block rounded-xl overflow-hidden bg-white ring-1 ring-black/5 hover:ring-black/10 shadow-sm hover:shadow-md transition"
    >
      <div className="relative h-44 w-full">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">No image</span>
            </div>
          </div>
        )}
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
