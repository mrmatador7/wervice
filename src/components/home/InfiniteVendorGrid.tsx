'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { labelForCategory } from '@/lib/categories';
import { vendorUrl } from '@/lib/vendor-url';
import VendorBrowseCard from '@/components/home/VendorBrowseCard';
import { getDashboardCopy } from '@/components/home/dashboard-i18n';
import { localizeCityLabel } from '@/lib/types/vendor';

type VendorListItem = {
  id: string;
  slug: string;
  business_name: string;
  category: string;
  city: string;
  profile_photo_url: string | null;
  gallery_photos: string[] | null;
  gallery_urls?: string[] | null;
  description?: string | null;
  profile_description?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  instagram?: string | null;
  google_maps?: string | null;
  profile_starting_price?: string | null;
  service_area?: string[] | null;
  languages_spoken?: string[] | null;
};

interface InfiniteVendorGridProps {
  locale: string;
  initialVendors: VendorListItem[];
  initialHasMore: boolean;
  city?: string;
  category?: string;
  q?: string;
  pageSize?: number;
  gridClassName?: string;
  showStatusText?: boolean;
}

export default function InfiniteVendorGrid({
  locale,
  initialVendors,
  initialHasMore,
  city,
  category,
  q,
  pageSize = 24,
  gridClassName,
  showStatusText = true,
}: InfiniteVendorGridProps) {
  const copy = getDashboardCopy(locale);
  const [vendors, setVendors] = useState<VendorListItem[]>(initialVendors);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(initialVendors.length);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('sort', 'newest');
    params.set('limit', String(pageSize));
    if (city) params.append('city', city);
    if (category) params.append('category', category);
    if (q) params.set('q', q);
    return params.toString();
  }, [city, category, q, pageSize]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(`/api/vendors?${queryString}&offset=${offset}`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const next: VendorListItem[] = Array.isArray(data?.vendors) ? data.vendors : [];
      setVendors((prev) => {
        const seen = new Set(prev.map((v) => v.id));
        const merged = [...prev];
        for (const item of next) {
          if (!seen.has(item.id)) merged.push(item);
        }
        return merged;
      });
      setOffset((prev) => prev + next.length);
      setHasMore(Boolean(data?.hasMore) && next.length > 0);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, queryString, offset]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { root: null, rootMargin: '320px 0px', threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className={`${gridClassName || 'mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} animate-fade-in`}>
        {vendors.map((vendor) => (
          <VendorBrowseCard
            key={vendor.id}
            vendorId={vendor.id}
            href={vendorUrl(vendor, locale)}
            title={vendor.business_name}
            location={localizeCityLabel(vendor.city, locale)}
            categoryLabel={labelForCategory(vendor.category, locale)}
            logoUrl={vendor.profile_photo_url}
            galleryImages={vendor.gallery_urls || vendor.gallery_photos || []}
          />
        ))}
      </div>

      <div ref={sentinelRef} className="h-8" />
      {showStatusText && isLoadingMore && (
        <p className="pb-8 pt-2 text-center text-sm text-[#5f6f84]">{copy.vendors.loadingMore}</p>
      )}
      {showStatusText && !hasMore && vendors.length > 0 && (
        <p className="pb-8 pt-2 text-center text-sm text-[#5f6f84]">{copy.vendors.reachedEnd}</p>
      )}
    </>
  );
}
