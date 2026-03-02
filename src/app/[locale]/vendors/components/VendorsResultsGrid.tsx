'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiMessageCircle, FiHeart } from 'react-icons/fi';
import { Vendor } from '@/lib/types/vendor';
import { labelForCategory } from '@/lib/categories';
import { vendorUrl } from '@/lib/vendor-url';

interface VendorsResultsGridProps {
  vendors: Vendor[];
  isLoading?: boolean;
  onClearFilters?: () => void;
}

// Individual Vendor Card Component (adapted from existing vendor card)
function VendorCard({ vendor }: { vendor: Vendor }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  const whatsappUrl = vendor.phone ? `https://wa.me/${vendor.phone}` : null;

  return (
    <div className="bg-white rounded-2xl border border-[#CAC4B7] shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      {/* Image */}
      <div className="relative h-[200px] md:h-[210px] lg:h-[220px] overflow-hidden">
        {(() => {
          // Get all available images (gallery + profile)
          // Handle both gallery_urls and gallery_photos field names
          const allImages: string[] = [];
          const gallery = (vendor as any).gallery_urls || (vendor as any).gallery_photos || [];
          if (Array.isArray(gallery) && gallery.length > 0) {
            allImages.push(...gallery.filter((url: string) => url && url.trim()));
          }
          if (vendor.profile_photo_url && vendor.profile_photo_url.trim() !== '') {
            allImages.push(vendor.profile_photo_url);
          }
          
          // Select a random image using vendor ID as seed for consistency
          const featuredImage = allImages.length > 0 
            ? (() => {
                const seed = vendor.id ? vendor.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) : 0;
                return allImages[seed % allImages.length];
              })()
            : null;
          
          return featuredImage ? (
            <Image
              src={featuredImage}
              alt={vendor.business_name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-sm">No image</div>
            </div>
          );
        })()}

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 rounded-full">
            {labelForCategory(vendor.category)}
          </span>
        </div>

        {/* Bookmark button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsBookmarked(!isBookmarked);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          aria-label={isBookmarked ? "Remove from favorites" : "Add to favorites"}
        >
          <FiHeart
            className={`w-4 h-4 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
          />
        </button>

        {/* Featured/New badges */}
        {vendor.is_featured && (
          <div className="absolute top-3 right-14">
            <span className="inline-flex items-center px-2 py-1 bg-[#D9FF0A] text-xs font-medium text-[#11190C] rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <Link href={vendorUrl(vendor, currentLocale)}>
              <h3 className="font-semibold text-[#11190C] text-lg mb-1 hover:text-[#D9FF0A] transition-colors truncate">
                {vendor.business_name}
              </h3>
            </Link>
            <p className="text-[#787664] text-sm">{vendor.city}</p>
          </div>
        </div>

        {/* Rating */}
        {vendor.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 fill-[#D9FF0A] text-[#D9FF0A]" />
              <span className="font-medium text-[#11190C]">{vendor.rating}</span>
            </div>
            {/* TODO: Add reviews count */}
          </div>
        )}

        {/* Price range */}
        {vendor.starting_price && (
          <div className="text-[#11190C] font-medium mb-3">
            From MAD {vendor.starting_price.toLocaleString()}
          </div>
        )}

        {/* Description */}
        {vendor.description && (
          <p className="text-[#787664] text-sm line-clamp-2 mb-3">
            {vendor.description}
          </p>
        )}

        {whatsappUrl && (
          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#CAC4B7] hover:border-[#787664] text-[#787664] hover:text-[#11190C] font-medium rounded-xl transition-colors text-sm"
              aria-label={`Contact ${vendor.business_name} on WhatsApp`}
            >
              <FiMessageCircle className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-[#F3F1EE] rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-[#787664]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-[#11190C] mb-2">
        No vendors found
      </h3>
      <p className="text-[#787664] mb-6 max-w-md mx-auto">
        We couldn&apos;t find any vendors matching your criteria. Try adjusting your filters or search terms.
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D9FF0A] hover:bg-[#D9FF0A]/90 text-[#11190C] font-semibold rounded-xl transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default function VendorsResultsGrid({ vendors, isLoading, onClearFilters }: VendorsResultsGridProps) {
  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="animate-pulse bg-[#F3F1EE] h-8 w-64 mx-auto rounded-lg mb-2"></div>
            <div className="animate-pulse bg-[#F3F1EE] h-4 w-96 mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#F3F1EE] rounded-2xl h-64 mb-4"></div>
                <div className="space-y-2 px-1">
                  <div className="bg-[#F3F1EE] h-6 w-3/4 rounded"></div>
                  <div className="bg-[#F3F1EE] h-4 w-1/2 rounded"></div>
                  <div className="bg-[#F3F1EE] h-4 w-2/3 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#11190C] mb-2">
              {vendors.length > 0 ? `${vendors.length} Vendor${vendors.length === 1 ? '' : 's'} Found` : 'Search Results'}
            </h2>
            <p className="text-[#787664]">
              {vendors.length > 0
                ? 'Browse through our curated selection of wedding professionals'
                : 'Adjust your search criteria to find more results'
              }
            </p>
          </div>
        </div>

        {vendors.length === 0 ? (
          <EmptyState onClearFilters={onClearFilters} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.slug} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
