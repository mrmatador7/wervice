'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Heart, PlayCircle, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

type VideoVendor = {
  id: string;
  href: string;
  title: string;
  categoryLabel: string;
  categorySlug: string;
  location: string;
  cityValue: string;
  logoUrl: string;
  videoUrl: string;
  videoUrls?: string[];
  posterUrl?: string;
  galleryImages?: string[];
};

type VideoExperienceGridProps = {
  vendors: VideoVendor[];
};

export default function VideoExperienceGrid({ vendors }: VideoExperienceGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const { user } = useUser();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [activeVideoFailed, setActiveVideoFailed] = useState(false);
  const [hiddenVendorIds, setHiddenVendorIds] = useState<Set<string>>(new Set());
  const visibleVendors = useMemo(
    () => vendors.filter((vendor) => !hiddenVendorIds.has(vendor.id)),
    [vendors, hiddenVendorIds]
  );

  const active = useMemo(
    () => visibleVendors.find((v) => v.id === activeId) || null,
    [activeId, visibleVendors]
  );
  const activeVideoUrls = useMemo(() => active?.videoUrls?.length ? active.videoUrls : active?.videoUrl ? [active.videoUrl] : [], [active]);
  const activeVideoUrl = activeVideoUrls[activeVideoIndex] || activeVideoUrls[0] || '';

  const moreFromVendor = useMemo(() => {
    if (!active) return [];
    return (active.galleryImages || []).slice(0, 4);
  }, [active]);

  const favoritesKey = user?.id ? `wervice_favorites_${user.id}` : '';
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!favoritesKey || typeof window === 'undefined') {
      setFavoriteIds(new Set());
      return;
    }
    try {
      const raw = localStorage.getItem(favoritesKey);
      const list = raw ? (JSON.parse(raw) as Array<{ id: string }>) : [];
      setFavoriteIds(new Set(list.map((entry) => entry.id)));
    } catch {
      setFavoriteIds(new Set());
    }
  }, [favoritesKey]);

  function toggleFavorite(vendor: VideoVendor, event?: React.MouseEvent<HTMLElement>) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!user?.id) {
      router.push(`/${locale}/auth-access?mode=signin`);
      return;
    }
    if (!favoritesKey) return;

    try {
      const raw = localStorage.getItem(favoritesKey);
      const list = raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
      const exists = list.some((entry) => entry.id === vendor.id);
      const cover = vendor.posterUrl || vendor.logoUrl || '/images/sample/venues-1.jpg';
      const nextList = exists
        ? list.filter((entry) => entry.id !== vendor.id)
        : [
            ...list,
            {
              id: vendor.id,
              title: vendor.title,
              image: cover,
              href: vendor.href,
              location: vendor.location,
              categoryLabel: vendor.categoryLabel,
              logoUrl: vendor.logoUrl,
              galleryImages: vendor.galleryImages || [],
              savedAt: Date.now(),
            },
          ];
      localStorage.setItem(favoritesKey, JSON.stringify(nextList));
      setFavoriteIds(new Set(nextList.map((entry) => String(entry.id))));
      window.dispatchEvent(new CustomEvent('wervice:favorites-updated'));
    } catch {
      // no-op
    }
  }

  const similar = useMemo(() => {
    if (!active) return [];
    const sameCityAndCategory = visibleVendors.filter(
      (v) =>
        v.id !== active.id &&
        v.cityValue === active.cityValue &&
        v.categorySlug === active.categorySlug
    );
    if (sameCityAndCategory.length > 0) return sameCityAndCategory.slice(0, 3);
    const sameCategory = visibleVendors.filter(
      (v) => v.id !== active.id && v.categorySlug === active.categorySlug
    );
    if (sameCategory.length > 0) return sameCategory.slice(0, 3);
    return visibleVendors.filter((v) => v.id !== active.id).slice(0, 3);
  }, [active, visibleVendors]);

  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);

  useEffect(() => {
    setActiveVideoIndex(0);
    setActiveVideoFailed(false);
  }, [activeId]);

  function tryNextVideo() {
    if (!activeVideoUrls.length) return;
    setActiveVideoIndex((prev) => (prev + 1 < activeVideoUrls.length ? prev + 1 : prev));
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleVendors.map((vendor) => (
          <div
            key={vendor.id}
            role="button"
            tabIndex={0}
            onClick={() => setActiveId(vendor.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setActiveId(vendor.id);
              }
            }}
            className="group relative block aspect-[4/5] cursor-pointer overflow-hidden rounded-[22px] border border-[#dbe3ef] bg-black text-left transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9FF0A]"
          >
            <video
              src={vendor.videoUrl}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              onError={() => {
                setHiddenVendorIds((prev) => {
                  const next = new Set(prev);
                  next.add(vendor.id);
                  return next;
                });
              }}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/72" />

            <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/35 px-2.5 py-1 text-[0.78rem] font-bold tracking-[0.08em] text-white/95">
                <PlayCircle className="h-3.5 w-3.5" />
                <span>{vendor.categoryLabel}</span>
              </div>
              <button
                type="button"
                aria-label="Save vendor"
                onClick={(event) => toggleFavorite(vendor, event)}
                className={`grid h-9 w-9 place-items-center rounded-full border bg-black/35 text-white ${
                  favoriteIds.has(vendor.id) ? 'border-[#D9FF0A] text-[#D9FF0A]' : 'border-white/30'
                }`}
              >
                <Heart className={`h-4.5 w-4.5 ${favoriteIds.has(vendor.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 font-[var(--font-inter)]">
              <h3 className="line-clamp-2 text-[1.08rem] font-bold leading-[1.12] tracking-[-0.01em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                {vendor.title}
              </h3>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="relative h-6 w-6 overflow-hidden rounded-full border border-white/40 bg-white/90">
                  <Image src={vendor.logoUrl} alt={`${vendor.title} logo`} fill sizes="24px" className="object-cover" />
                </div>
                <p className="line-clamp-1 text-[0.94rem] font-semibold text-white/95">{vendor.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[100] bg-[#11190C]/76 backdrop-blur-sm">
          <div className="flex h-full w-full">
            <section className="relative flex flex-1 items-center justify-center p-6">
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="absolute left-6 top-6 rounded-full border border-white/25 bg-[#11190C]/50 px-4 py-2 text-sm font-semibold text-white"
              >
                Back to Gallery
              </button>

              <div className="relative h-[84vh] w-full max-w-[560px] overflow-hidden rounded-[24px] border border-white/15 bg-black">
                {activeVideoFailed || !activeVideoUrl ? (
                  <div className="relative h-full w-full bg-black">
                    <Image
                      src={active.posterUrl || active.logoUrl}
                      alt={active.title}
                      fill
                      sizes="560px"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 px-4 py-3 text-sm text-white/90">
                      Video unavailable for this vendor right now.
                    </div>
                  </div>
                ) : (
                  <video
                    key={`${active.id}-${activeVideoIndex}`}
                    src={activeVideoUrl}
                    poster={active.posterUrl}
                    controls
                    muted
                    autoPlay
                    playsInline
                    preload="auto"
                    onError={() => {
                      if (activeVideoIndex + 1 < activeVideoUrls.length) {
                        tryNextVideo();
                        return;
                      }
                      setActiveVideoFailed(true);
                    }}
                    onLoadedMetadata={(event) => {
                      const element = event.currentTarget;
                      if (!Number.isFinite(element.duration) || element.duration <= 0.2) {
                        if (activeVideoIndex + 1 < activeVideoUrls.length) {
                          tryNextVideo();
                          return;
                        }
                        setActiveVideoFailed(true);
                        return;
                      }
                      element.play().catch(() => {});
                    }}
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                  <h2 className="text-2xl font-bold text-white">{active.title}</h2>
                  <p className="mt-1 text-base text-white/85">{active.location}</p>
                </div>
              </div>

              <div className="ml-4 hidden flex-col gap-4 md:flex">
                <button
                  type="button"
                  onClick={() => toggleFavorite(active)}
                  className={`grid h-14 w-14 place-items-center rounded-full border text-white ${
                    favoriteIds.has(active.id)
                      ? 'border-[#D9FF0A] bg-[#11190C] text-[#D9FF0A]'
                      : 'border-white/20 bg-white/10'
                  }`}
                  aria-label="Save vendor"
                >
                  <Heart className={`h-6 w-6 ${favoriteIds.has(active.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </section>

            <aside className="relative hidden w-[390px] border-l border-[#d8dee8] bg-[#f6f7f9] p-6 text-[#11190C] lg:block">
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="absolute right-5 top-5 text-[#6f7f95] hover:text-[#11190C]"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>

              <div>
                <h3 className="text-4xl font-black tracking-tight text-[#11190C]">{active.title}</h3>
                <p className="mt-1 text-sm text-[#5f6f84]">{active.categoryLabel} • {active.location}</p>
              </div>

              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-xl font-bold">More from {active.title.split(' ')[0]}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {moreFromVendor.map((image, idx) => (
                    <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#dbe3ef] bg-white">
                      <Image src={image} alt={`${active.title} media ${idx + 1}`} fill sizes="160px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <h4 className="mb-3 text-xl font-bold">Similar Inspiration</h4>
                <div className="space-y-3">
                  {similar.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      className="flex w-full items-center gap-3 rounded-xl border border-[#dbe3ef] bg-white p-2.5 text-left"
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-[#eef2f7]">
                        <Image src={item.logoUrl} alt={item.title} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-base font-semibold text-[#11190C]">{item.title}</p>
                        <p className="line-clamp-1 text-sm text-[#5f6f84]">{item.categoryLabel} • {item.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={active.href}
                className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#11190C] text-base font-bold text-[#D9FF0A] hover:bg-[#0a1008]"
              >
                Book {active.title}
              </a>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
