'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FiHeart, FiStar } from 'react-icons/fi';
import Image from 'next/image';

interface Vendor {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  city: string;
  price_min?: number;
  price_max?: number;
  rating?: number;
  review_count?: number;
  cover_image?: string;
  whatsapp?: string;
  is_featured?: boolean;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface CategoryGridProps {
  vendors: Vendor[];
  pagination: Pagination;
  categorySlug: string;
}

export default function CategoryGrid({ vendors, pagination, categorySlug }: CategoryGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', (pagination.page + 1).toString());

    const queryString = params.toString();
    const url = `/categories/${categorySlug}${queryString ? `?${queryString}` : ''}`;

    router.push(url, { scroll: false });
  };

  if (vendors.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-[#F3F1EE] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#11190C] mb-2">No vendors found</h3>
        <p className="text-neutral-600 mb-6 max-w-md mx-auto">
          We couldn't find any vendors matching your criteria. Try adjusting your filters or search terms.
        </p>
        <button
          onClick={() => router.push(`/categories/${categorySlug}`)}
          className="inline-flex items-center px-6 py-3 bg-[#D9FF0A] hover:bg-[#D9FF0A]/90 text-[#11190C] font-semibold rounded-full transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results header */}
      <div className="text-center">
        <p className="text-neutral-600">
          Showing {vendors.length} of {pagination.total.toLocaleString()} vendors
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>

      {/* Load More Button */}
      {pagination.page < pagination.totalPages && (
        <div className="text-center pt-8">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center px-8 py-4 bg-[#11190C] hover:bg-[#11190C]/90 text-white font-semibold rounded-full transition-colors"
          >
            Load More Vendors
          </button>
        </div>
      )}
    </div>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/vendors/${vendor.slug}`)}
      className="group block rounded-2xl bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md hover:ring-black/10 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {vendor.cover_image ? (
          <Image
            src={vendor.cover_image}
            alt={vendor.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {vendor.is_featured && (
            <span className="px-2 py-1 bg-[#D9FF0A] text-[#11190C] text-xs font-medium rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Heart icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement save functionality
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <FiHeart className="w-4 h-4 text-neutral-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-[#11190C] text-lg leading-tight line-clamp-2 mb-1">
            {vendor.name}
          </h3>
          <p className="text-sm text-neutral-600 line-clamp-1">
            {vendor.city} • {vendor.category}
          </p>
        </div>

        {/* Rating */}
        {vendor.rating && (
          <div className="flex items-center gap-1 mb-3">
            <FiStar className="w-4 h-4 fill-[#D9FF0A] text-[#D9FF0A]" />
            <span className="text-sm font-medium text-[#11190C]">
              {vendor.rating.toFixed(1)}
            </span>
            {vendor.review_count && (
              <span className="text-sm text-neutral-600">
                ({vendor.review_count})
              </span>
            )}
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="text-[#11190C] font-semibold">
            {vendor.price_min ? (
              <span>From {vendor.price_min.toLocaleString()} MAD</span>
            ) : (
              <span>Contact for pricing</span>
            )}
          </div>

          <button className="px-4 py-2 bg-[#11190C] hover:bg-[#11190C]/90 text-white text-sm font-medium rounded-full transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
