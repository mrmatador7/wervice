'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Heart, MapPin } from 'lucide-react';
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
}: VendorBrowseCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const { user } = useUser();
  const images = useMemo(() => {
    const unique = new Set<string>();
    for (const image of galleryImages) {
      if (!image || !image.trim()) continue;
      if (logoUrl && image === logoUrl) continue;
      unique.add(image);
    }
    return Array.from(unique);
  }, [galleryImages, logoUrl]);

  const [imageIndex, setImageIndex] = useState(0);
  const displayImages = images.length > 0 ? images : ['/images/sample/venues-1.jpg'];
  const currentImage = displayImages[imageIndex] || '/images/sample/venues-1.jpg';
  const safeLogo = logoUrl || displayImages[0] || '/images/sample/venues-1.jpg';
  const localizedLocation = localizeCityLabel(location, locale);
  const favoritesKey = user?.id ? `wervice_favorites_${user.id}` : '';

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

  function toggleFavorite(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!user?.id) {
      const localeMatch = href.match(/^\/(en|fr|ar)(\/|$)/);
      const locale = localeMatch?.[1] || 'en';
      router.push(`/${locale}/dashboard?view=auth&mode=signin`);
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
        if (!onCardClick) return;
        event.preventDefault();
        onCardClick();
      }}
      className="group min-w-0 rounded-[22px] bg-transparent transition hover:-translate-y-0.5"
    >
      <div className="relative h-56 overflow-hidden rounded-[22px]">
        <Image
          src={currentImage}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 25vw"
          className="object-cover"
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
            <Image src={safeLogo} alt={`${title} logo`} fill sizes="24px" className="object-cover" />
          </div>
          <h3 className="line-clamp-1 text-[1.12rem] font-semibold leading-[1.2] tracking-[-0.01em] text-[#1f2937]">{title}</h3>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[0.95rem] font-medium text-[#6b7280]">
          <MapPin className="h-4 w-4 text-[#8b95a7]" />
          <span className="line-clamp-1">{localizedLocation}</span>
        </div>
      </div>
    </Link>
  );
}
