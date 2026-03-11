'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart, MapPin } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { localizeCityLabel } from '@/lib/types/vendor';

interface VendorBrowseCardProps {
  vendorId?: string;
  href: string;
  title: string;
  location: string;
  categoryLabel: string;
  logoUrl?: string | null;
  galleryImages: string[];
  onCardClick?: () => void;
  mobileVariant?: 'list' | 'card';
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm|avi|m4v)(\?|$)/i.test(url);
}

export default function VendorBrowseCard({
  vendorId,
  href,
  title,
  location,
  categoryLabel,
  logoUrl,
  galleryImages,
  onCardClick,
  mobileVariant = 'card',
}: VendorBrowseCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const { user } = useUser();
  const images = useMemo(() => {
    const unique = new Set<string>();
    for (const image of galleryImages) {
      if (!image || !image.trim()) continue;
      if (isVideoUrl(image)) continue;
      if (logoUrl && image === logoUrl) continue;
      unique.add(image);
    }
    return Array.from(unique);
  }, [galleryImages, logoUrl]);

  const [imageIndex, setImageIndex] = useState(0);
  const [coverSrc, setCoverSrc] = useState<string>('/images/sample/venues-1.jpg');
  const [logoSrc, setLogoSrc] = useState<string>('/images/sample/venues-1.jpg');
  const touchStartXRef = useRef<number | null>(null);
  const didSwipeRef = useRef(false);
  const displayImages = images.length > 0 ? images : ['/images/sample/venues-1.jpg'];
  const currentImage = displayImages[imageIndex] || '/images/sample/venues-1.jpg';
  const safeLogo = (logoUrl && !isVideoUrl(logoUrl)) ? logoUrl : (displayImages[0] || '/images/sample/venues-1.jpg');
  const localizedLocation = localizeCityLabel(location, locale);
  const favoritesKey = user?.id ? `wervice_favorites_${user.id}` : '';

  useEffect(() => {
    setCoverSrc(currentImage);
  }, [currentImage]);

  useEffect(() => {
    setLogoSrc(safeLogo);
  }, [safeLogo]);

  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    if (!user?.id || !vendorId || typeof window === 'undefined') return false;
    try {
      const raw = localStorage.getItem(`wervice_favorites_${user.id}`);
      const list = raw ? (JSON.parse(raw) as Array<{ id: string }>) : [];
      return list.some((item) => item.id === vendorId);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!user?.id || !vendorId || typeof window === 'undefined') {
      setIsFavorite(false);
      return;
    }
    try {
      const raw = localStorage.getItem(`wervice_favorites_${user.id}`);
      const list = raw ? (JSON.parse(raw) as Array<{ id: string }>) : [];
      setIsFavorite(list.some((item) => item.id === vendorId));
    } catch {
      setIsFavorite(false);
    }
  }, [user?.id, vendorId]);

  function showNextImage(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setImageIndex((prev) => (prev + 1) % displayImages.length);
  }

  function showPrevImage() {
    setImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }

  function showPrevImageFromButton(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    showPrevImage();
  }

  function toggleFavorite(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!user?.id) {
      const localeMatch = href.match(/^\/(en|fr|ar)(\/|$)/);
      const locale = localeMatch?.[1] || 'en';
      router.push(`/${locale}/auth-access?mode=signin`);
      return;
    }

    if (!vendorId || !favoritesKey) return;

    try {
      const raw = localStorage.getItem(favoritesKey);
      const list = raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
      const exists = list.some((item) => item.id === vendorId);
      let nextList: Array<Record<string, unknown>> = [];

      if (exists) {
        nextList = list.filter((item) => item.id !== vendorId);
        setIsFavorite(false);
      } else {
        nextList = [
          ...list,
          {
            id: vendorId,
            title,
            image: currentImage,
            href,
            location: localizedLocation,
            categoryLabel,
            logoUrl: safeLogo,
            galleryImages: displayImages,
            savedAt: Date.now(),
          },
        ];
        setIsFavorite(true);
      }

      localStorage.setItem(favoritesKey, JSON.stringify(nextList));
      window.dispatchEvent(new CustomEvent('wervice:favorites-updated'));
    } catch {
      // no-op
    }
  }

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (didSwipeRef.current) {
          event.preventDefault();
          didSwipeRef.current = false;
          return;
        }
        if (!onCardClick) return;
        event.preventDefault();
        onCardClick();
      }}
      className="group min-w-0 rounded-[22px] bg-transparent"
    >
      {/* Mobile: list card item (homepage only) */}
      <div className={`rounded-3xl border border-[#d8dee8] bg-white p-3.5 shadow-sm sm:hidden ${mobileVariant === 'list' ? 'block' : 'hidden'}`}>
        <div className="flex items-start gap-3">
          <div className="relative h-[98px] w-[98px] shrink-0 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverSrc}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => setCoverSrc('/images/sample/venues-1.jpg')}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-[1.35rem] font-semibold leading-tight tracking-[-0.01em] text-[#1f2937]">{title}</h3>
            <p className="mt-0.5 line-clamp-1 text-[0.95rem] italic text-[#818b9b]">{categoryLabel}</p>
            <p className="mt-2 text-[0.92rem] font-medium text-[#8b95a7]">City</p>
            <div className="mt-0.5 flex items-center gap-1.5 text-[1.03rem] font-bold text-[#2d3f56]">
              <MapPin className="h-4 w-4 text-[#8b95a7]" />
              <span className="line-clamp-1">{localizedLocation}</span>
            </div>
          </div>

          <div className="ml-auto flex shrink-0 flex-col items-center gap-2">
            <button
              type="button"
              aria-label="Save vendor"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                isFavorite ? 'bg-[#11190C] text-[#D9FF0A]' : 'bg-[#f5f7fb] text-[#11190C]'
              }`}
              onClick={toggleFavorite}
            >
              <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            {displayImages.length > 1 && (
              <button
                type="button"
                aria-label="Next image"
                onClick={showNextImage}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f7fb] text-[#11190C]"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card view (default on mobile for non-home pages + tablet/desktop everywhere) */}
      <div className={`transition sm:hover:-translate-y-0.5 ${mobileVariant === 'list' ? 'hidden sm:block' : 'block'}`}>
        <div
          className="relative aspect-square overflow-hidden rounded-[22px] sm:h-56 sm:aspect-auto"
          onTouchStart={(event) => {
            touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const startX = touchStartXRef.current;
            const endX = event.changedTouches[0]?.clientX ?? null;
            touchStartXRef.current = null;
            if (startX === null || endX === null || displayImages.length < 2) return;

            const delta = endX - startX;
            if (Math.abs(delta) < 35) return;
            didSwipeRef.current = true;
            if (delta < 0) {
              setImageIndex((prev) => (prev + 1) % displayImages.length);
            } else {
              showPrevImage();
            }
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverSrc}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setCoverSrc('/images/sample/venues-1.jpg')}
          />

          <button
            type="button"
            aria-label="Save vendor"
            className={`absolute right-2.5 top-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${
              isFavorite ? 'bg-[#11190C] text-[#D9FF0A]' : 'bg-[#F3EFE7] text-[#11190C]'
            }`}
            onClick={toggleFavorite}
          >
            <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {displayImages.length > 1 && (
            <button
              type="button"
              aria-label="Previous image"
              onClick={showPrevImageFromButton}
              className="absolute left-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white sm:hidden"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {displayImages.length > 1 && (
            <button
              type="button"
              aria-label="Next image"
              onClick={showNextImage}
              className="absolute right-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white sm:hidden"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {displayImages.length > 1 && (
            <button
              type="button"
              aria-label="Previous image"
              onClick={showPrevImageFromButton}
              className="absolute left-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {displayImages.length > 1 && (
            <button
              type="button"
              aria-label="Next image"
              onClick={showNextImage}
              className="absolute right-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          <div className="absolute left-2.5 bottom-2.5 rounded-full bg-[#11190C] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#D9FF0A]">
            {categoryLabel}
          </div>
        </div>

        <div className="p-3 font-[var(--font-inter)]">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 overflow-hidden rounded-full border border-black/10 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt={`${title} logo`}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={() => setLogoSrc('/images/sample/venues-1.jpg')}
              />
            </div>
            <h3 className="line-clamp-1 text-[1.12rem] font-semibold leading-[1.2] tracking-[-0.01em] text-[#1f2937]">{title}</h3>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[0.95rem] font-medium text-[#6b7280]">
            <MapPin className="h-4 w-4 text-[#8b95a7]" />
            <span className="line-clamp-1">{localizedLocation}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
