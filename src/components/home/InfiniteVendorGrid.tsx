'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ExternalLink, Instagram, MapPin, X } from 'lucide-react';
import { labelForCategory } from '@/lib/categories';
import { vendorUrl } from '@/lib/vendor-url';
import VendorBrowseCard from '@/components/home/VendorBrowseCard';
import { getDashboardCopy, interpolateCopy } from '@/components/home/dashboard-i18n';
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWhatsappRevealed, setIsWhatsappRevealed] = useState(false);
  const [similarVendors, setSimilarVendors] = useState<VendorListItem[]>([]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('sort', 'newest');
    params.set('limit', String(pageSize));
    if (city) params.append('city', city);
    if (category) params.append('category', category);
    if (q) params.set('q', q);
    return params.toString();
  }, [city, category, q, pageSize]);

  useEffect(() => {
    const vendorSlug = searchParams.get('vendor');
    if (!vendorSlug) {
      setSelectedVendorId(null);
      return;
    }
    const found = [...vendors, ...similarVendors].find((v) => v.slug === vendorSlug);
    if (found) {
      setSelectedVendorId(found.id);
      setVendors((prev) => (prev.some((item) => item.id === found.id) ? prev : [found, ...prev]));
    }
  }, [searchParams, vendors, similarVendors]);

  const selectedVendor = useMemo(
    () => [...vendors, ...similarVendors].find((v) => v.id === selectedVendorId) || null,
    [vendors, similarVendors, selectedVendorId]
  );
  const hasRealEmail = useMemo(() => {
    const email = selectedVendor?.email?.trim().toLowerCase();
    if (!email) return false;
    return email !== 'no-email@example.com';
  }, [selectedVendor?.email]);

  const localizedOverview = useMemo(() => {
    if (!selectedVendor) return '';
    const source = (selectedVendor.profile_description || selectedVendor.description || '').trim();
    const hasArabicScript = /[\u0600-\u06FF]/.test(source);
    const looksFrench = /\b(le|la|les|des|pour|avec|mariage|prestataire|service|ville|dans)\b|[éèêàçù]/i.test(source);

    if (source) {
      if (locale === 'ar' && hasArabicScript) return source;
      if (locale === 'fr' && !hasArabicScript) return source;
      if (locale === 'en' && !hasArabicScript && !looksFrench) return source;
    }

    return interpolateCopy(copy.vendors.defaultOverviewTemplate, {
      name: selectedVendor.business_name,
      category: labelForCategory(selectedVendor.category, locale).toLowerCase(),
      city: localizeCityLabel(selectedVendor.city, locale),
    });
  }, [selectedVendor, locale, copy.vendors.defaultOverviewTemplate]);

  const selectedVendorImages = useMemo(() => {
    if (!selectedVendor) return [];
    const source = selectedVendor.gallery_urls || selectedVendor.gallery_photos || [];
    const unique = new Set<string>();
    for (const image of source) {
      if (image && image.trim()) unique.add(image);
    }
    if (unique.size === 0 && selectedVendor.profile_photo_url) {
      unique.add(selectedVendor.profile_photo_url);
    }
    return Array.from(unique);
  }, [selectedVendor]);

  const updateVendorQuery = useCallback(
    (vendorSlug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (vendorSlug) params.set('vendor', vendorSlug);
      else params.delete('vendor');
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

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

  useEffect(() => {
    setActiveImageIndex(0);
    setIsWhatsappRevealed(false);
  }, [selectedVendorId]);

  useEffect(() => {
    async function loadSimilar() {
      if (!selectedVendor) {
        setSimilarVendors([]);
        return;
      }
      try {
        const params = new URLSearchParams();
        params.set('sort', 'newest');
        params.set('limit', '12');
        params.set('city', selectedVendor.city);
        params.set('category', selectedVendor.category);
        const res = await fetch(`/api/vendors?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const fetched: VendorListItem[] = Array.isArray(data?.vendors) ? data.vendors : [];
        setSimilarVendors(fetched.filter((v) => v.id !== selectedVendor.id).slice(0, 8));
      } catch {
        setSimilarVendors([]);
      }
    }
    loadSimilar();
  }, [selectedVendor]);

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
            onCardClick={() => {
              setSelectedVendorId(vendor.id);
              updateVendorQuery(vendor.slug);
            }}
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

      {selectedVendor && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label={copy.vendors.panelCloseVendor}
            className="absolute inset-0 bg-black/20"
            onClick={() => {
              setSelectedVendorId(null);
              updateVendorQuery(null);
            }}
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-[680px] overflow-y-auto border-l border-black/10 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-4xl font-black tracking-tight text-[#11190C]">{selectedVendor.business_name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-base text-[#5f6f84]">
                  <MapPin className="h-4 w-4" />
                  {localizeCityLabel(selectedVendor.city, locale)}
                </p>
              </div>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 hover:bg-black/5"
                onClick={() => {
                  setSelectedVendorId(null);
                  updateVendorQuery(null);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="relative col-span-2 h-72 overflow-hidden rounded-2xl bg-[#eef2f7]">
                <Image
                  src={selectedVendorImages[activeImageIndex] || selectedVendor.profile_photo_url || '/images/sample/venues-1.jpg'}
                  alt={selectedVendor.business_name}
                  fill
                  sizes="420px"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {selectedVendorImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={`${selectedVendor.id}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-[84px] overflow-hidden rounded-xl bg-[#EEE9E1] text-left ${
                      activeImageIndex === idx ? 'ring-2 ring-[#D9FF0A]' : ''
                    }`}
                  >
                    <Image src={img} alt={`${selectedVendor.business_name} ${idx + 1}`} fill sizes="180px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-black/10 pt-5">
              <h4 className="text-lg font-bold text-[#11190C]">{copy.vendors.panelOverview}</h4>
              <p className="mt-2 text-sm leading-6 text-[#4d6078]">
                {localizedOverview}
              </p>
            </div>

            <div className="mt-6 grid gap-4 border-t border-black/10 pt-5 text-sm text-[#33475f] sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">{copy.vendors.panelCategory}</p>
                <p className="mt-1 font-semibold text-[#11190C]">{labelForCategory(selectedVendor.category, locale)}</p>
              </div>
              {selectedVendor.profile_starting_price && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">{copy.vendors.panelStartingPrice}</p>
                  <p className="mt-1 font-semibold text-[#11190C]">{selectedVendor.profile_starting_price}</p>
                </div>
              )}
              {hasRealEmail && selectedVendor?.email && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">{copy.vendors.panelEmail}</p>
                  <p className="mt-1 break-all font-medium">{selectedVendor.email}</p>
                </div>
              )}
              {selectedVendor.whatsapp && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">{copy.vendors.panelPhoneNumber}</p>
                  <button
                    type="button"
                    onClick={() => setIsWhatsappRevealed(true)}
                    className={`mt-1 rounded-lg border border-black/10 px-3 py-1.5 font-semibold text-[#11190C] ${
                      isWhatsappRevealed ? 'bg-[#eef8f2]' : 'bg-[#f5f7fa]'
                    }`}
                  >
                    <span className={isWhatsappRevealed ? '' : 'blur-sm select-none'}>
                      {selectedVendor.whatsapp}
                    </span>
                    {!isWhatsappRevealed && <span className="ml-2 text-xs font-medium text-[#5f6f84]">{copy.vendors.panelTapToReveal}</span>}
                  </button>
                </div>
              )}
              {selectedVendor.instagram && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">{copy.vendors.panelInstagram}</p>
                  <a
                    href={selectedVendor.instagram.startsWith('http') ? selectedVendor.instagram : `https://instagram.com/${selectedVendor.instagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[#11190C] hover:bg-[#ECE7DE]"
                    aria-label={copy.vendors.panelOpenInstagram}
                  >
                    <Instagram className="h-4.5 w-4.5" />
                  </a>
                </div>
              )}
              {selectedVendor.google_maps && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7a8ca4]">{copy.vendors.panelGoogleMaps}</p>
                  <a
                    href={selectedVendor.google_maps}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 font-medium text-[#11190C] hover:underline"
                  >
                    {copy.vendors.panelViewLocation}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            {similarVendors.length > 0 && (
              <div className="mt-6 border-t border-black/10 pt-5">
                <h4 className="text-lg font-bold text-[#11190C]">{copy.vendors.panelSimilarVendors}</h4>
                <p className="mt-1 text-sm text-[#5f6f84]">
                  {copy.vendors.panelSameCategoryCity}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {similarVendors.map((vendor) => (
                    <button
                      key={vendor.id}
                      type="button"
                      onClick={() => {
                        setVendors((prev) => (prev.some((item) => item.id === vendor.id) ? prev : [vendor, ...prev]));
                        setSelectedVendorId(vendor.id);
                        updateVendorQuery(vendor.slug);
                      }}
                      className="flex items-center gap-3 rounded-xl border border-black/10 p-2 text-left transition hover:bg-[#f6f8fb]"
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-[#eef2f7]">
                        <Image
                          src={vendor.gallery_urls?.[0] || vendor.gallery_photos?.[0] || vendor.profile_photo_url || '/images/sample/venues-1.jpg'}
                          alt={vendor.business_name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-semibold text-[#11190C]">{vendor.business_name}</p>
                        <p className="line-clamp-1 text-xs text-[#5f6f84]">{localizeCityLabel(vendor.city, locale)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
