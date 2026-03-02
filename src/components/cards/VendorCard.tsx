'use client';
import VenueCard from './VenueCard';
import { Vendor } from '@/models/vendor';
import { vendorUrl } from '@/lib/vendor-url';

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
    href: vendorUrl({ city: props.vendor.city, category: props.vendor.category, slug: props.vendor.slug }, 'en'),
  } : props;

  // Extract price number from string like "15,000 MAD"
  const priceFromMAD = price ? parseInt(price.replace(/[^\d]/g, '')) : undefined;

  // Transform rating to the expected format
  const formattedRating = rating ? { score: rating, count: 0 } : undefined;

  return (
    <VenueCard
      id={href.split('/').pop() || name}
      name={name}
      city={city}
      priceFromMAD={priceFromMAD}
      rating={formattedRating}
      imageUrl={coverUrl || ''}
    />
  );
}
