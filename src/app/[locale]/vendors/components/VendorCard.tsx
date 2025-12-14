import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, ChevronRight } from 'lucide-react';
import { Vendor } from '@/lib/types/vendor';
import { labelForCategory } from '@/lib/categories';

interface VendorCardProps {
  vendor: Vendor;
}

function VendorCard({ vendor }: VendorCardProps) {
  // Get all available images (gallery + profile)
  // Handle both gallery_urls and gallery_photos field names
  const allImages: string[] = [];
  const gallery = (vendor as any).gallery_urls || (vendor as any).gallery_photos || [];
  if (Array.isArray(gallery) && gallery.length > 0) {
    allImages.push(...gallery.filter((url: string) => url && url.trim()));
  }
  if (vendor.profile_photo_url && vendor.profile_photo_url.trim()) {
    allImages.push(vendor.profile_photo_url);
  }
  
  // Select a random image using vendor ID as seed for consistency
  const getFeaturedImage = () => {
    if (allImages.length === 0) return '/placeholder-vendor.jpg';
    const seed = vendor.id ? vendor.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) : 0;
    return allImages[seed % allImages.length];
  };
  
  const imageUrl = getFeaturedImage();
  const categoryLabel = labelForCategory(vendor.category);
  const cityName = vendor.city.charAt(0).toUpperCase() + vendor.city.slice(1);

  return (
    <article className="group relative rounded-2xl bg-white ring-1 ring-black/5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-[4/3]">
        <Link href={`/vendors/${vendor.slug}`}>
          <Image
            src={imageUrl}
            alt={vendor.business_name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>

        {/* Featured Badge */}
        {vendor.is_featured && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium ring-1 ring-black/5">
            Featured
          </span>
        )}

        {/* Category Icon */}
        <div className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 ring-1 ring-black/5">
          <div className="w-4 h-4 bg-gray-400 rounded" /> {/* Placeholder for category icon */}
        </div>

        {/* Image Carousel Dots (if multiple images) */}
        {vendor.gallery_urls && vendor.gallery_urls.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50" />
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
            <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50" />
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={`/vendors/${vendor.slug}`} className="block p-4 md:p-5">
        {/* Business Name */}
        <h3 className="font-semibold text-wv-text text-lg leading-tight mb-2 group-hover:text-wervice-lime transition-colors line-clamp-2">
          {vendor.business_name}
        </h3>

        {/* Meta Line */}
        <div className="flex items-center gap-2 text-sm text-wv-sub mb-3">
          <span>{categoryLabel}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{cityName}</span>
          </div>
        </div>

        {/* Description */}
        {vendor.description && (
          <p className="text-sm text-wv-sub line-clamp-2 mb-4" title={vendor.description}>
            {vendor.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-wervice-lime text-wervice-lime" />
            <span className="text-sm font-medium text-wv-text">
              {vendor.rating.toFixed(1)}
            </span>
          </div>

          {/* Price */}
          {vendor.starting_price && (
            <span className="text-sm text-wv-sub">
              From MAD {vendor.starting_price.toLocaleString()}
            </span>
          )}
        </div>
      </Link>

      {/* Hover CTA */}
      <Link
        href={`/vendors/${vendor.slug}`}
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-black/20"
      >
        <div className="bg-white rounded-full p-3 shadow-lg">
          <ChevronRight className="w-5 h-5 text-wv-text" />
        </div>
      </Link>
    </article>
  );
}

export default VendorCard;
