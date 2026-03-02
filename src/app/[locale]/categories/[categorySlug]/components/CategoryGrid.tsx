'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { labelForCategory } from '@/lib/categories';
import { vendorUrl } from '@/lib/vendor-url';

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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  const { locale } = useParams<{ locale: string }>();
  const [activeIndex, setActiveIndex] = useState(0);

  // Build image list from available fields
  const images: string[] = [];
  if (vendor.cover_image?.trim()) images.push(vendor.cover_image.trim());
  const gallery = (vendor as any).gallery_urls || (vendor as any).gallery_photos || [];
  if (Array.isArray(gallery)) {
    gallery.forEach((img: string) => {
      if (img?.trim() && img !== vendor.cover_image) images.push(img.trim());
    });
  }

  const total = images.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => setActiveIndex((p) => (p + 1) % total), 3000);
    return () => clearInterval(timer);
  }, [total]);

  const cityLabel = vendor.city
    ? vendor.city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : '';

  return (
    <article className="group flex flex-col rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(17,25,12,0.14)] cursor-pointer">
      {/* Image carousel */}
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-neutral-100"
        onClick={() => router.push(vendorUrl({ city: vendor.city, category: vendor.category, slug: vendor.slug }, locale || 'en'))}
      >
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
            <span className="text-5xl font-bold text-zinc-300">{vendor.name.charAt(0)}</span>
          </div>
        )}

        {/* Category pill */}
        <div className="absolute left-3 top-3 rounded-2xl bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#11190C]">
            {labelForCategory(vendor.category)}
          </span>
        </div>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="flex flex-1 flex-col px-1 pb-1 pt-5"
        onClick={() => router.push(vendorUrl({ city: vendor.city, category: vendor.category, slug: vendor.slug }, locale || 'en'))}
      >
        <h3 className="line-clamp-2 text-[22px] font-bold leading-snug text-[#11190C] sm:text-2xl">
          {vendor.name}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-[#aaa]" />
          <span className="text-sm font-medium text-[#888]">{cityLabel}</span>
        </div>
      </div>
    </article>
  );
}
