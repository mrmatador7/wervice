'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiChevronRight, FiMapPin, FiInstagram, FiShare2, FiChevronLeft } from 'react-icons/fi';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import type { SimilarVendor } from '@/lib/db/vendors';
import SimilarVendors from './SimilarVendors';

interface VendorDetailPageProps {
  name: string;
  city: string;
  category: string;
  categoryLabel: string;
  description: string | null;
  priceFrom: number;
  phone: string;
  whatsapp: string;
  instagram?: string | null;
  googleMaps?: string | null;
  logoUrl?: string | null;
  images: string[];
  videoUrl?: string;
  locale?: string;
  similarVendors?: SimilarVendor[];
}

function parseInstagramHandle(ig: string | null | undefined): { handle: string; url: string } | null {
  if (!ig) return null;
  const match = ig.match(/instagram\.com\/([^/?#\s]+)/i);
  if (match) {
    const handle = match[1].replace(/\/$/, '');
    return { handle: '@' + handle, url: ig.startsWith('http') ? ig : `https://instagram.com/${handle}` };
  }
  if (ig.startsWith('@') || (!ig.includes('/') && !ig.includes('.'))) {
    const handle = ig.replace(/^@/, '');
    return { handle: '@' + handle, url: `https://instagram.com/${handle}` };
  }
  return null;
}

function isDirectVideoFile(url: string | undefined): boolean {
  if (!url) return false;
  return /\.(mp4|mov|webm|avi|m4v)(\?|$)/i.test(url);
}

function getEmbeddableVideoUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (parsed.pathname.startsWith('/shorts/')) {
        const shortsId = parsed.pathname.split('/')[2];
        if (shortsId) return `https://www.youtube.com/embed/${shortsId}`;
      }
    }

    if (host === 'youtu.be') {
      const id = parsed.pathname.replace(/^\/+/, '').split('/')[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    if (host === 'vimeo.com') {
      const id = parsed.pathname.replace(/^\/+/, '').split('/')[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    if (host === 'player.vimeo.com') return url;
    if (host === 'youtube-nocookie.com' || host === 'youtube.com' && parsed.pathname.includes('/embed/')) return url;
    return null;
  } catch {
    return null;
  }
}

export default function VendorDetailPage({
  name,
  city,
  category,
  categoryLabel,
  description,
  priceFrom,
  phone,
  whatsapp,
  instagram,
  googleMaps,
  logoUrl,
  images,
  videoUrl,
  locale = 'en',
  similarVendors = [],
}: VendorDetailPageProps) {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);

  const copyPhone = () => {
    if (!phone) return;
    navigator.clipboard.writeText(phone).then(() => {
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 2000);
    });
  };

  const allMedia = [...images];
  if (videoUrl) allMedia.push(videoUrl);
  const embeddableVideoUrl = getEmbeddableVideoUrl(videoUrl);

  const mainImage = allMedia[0] || null;
  const gridImages = allMedia.slice(1, 5);

  const igInfo = parseInstagramHandle(instagram);

  const openLightbox = (i: number) => { setLightboxIndex(i); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const nextImg = () => setLightboxIndex((p) => (p + 1) % allMedia.length);
  const prevImg = () => setLightboxIndex((p) => (p - 1 + allMedia.length) % allMedia.length);

  const mapsHref = googleMaps
    ? (googleMaps.startsWith('http') ? googleMaps : `https://www.google.com/maps/search/${encodeURIComponent(googleMaps + ', ' + city + ', Morocco')}`)
    : `https://www.google.com/maps/search/${encodeURIComponent(name + ', ' + city + ', Morocco')}`;

  const contentCopy = {
    en: {
      home: 'Home',
      vendors: 'Vendors',
      vendorPortfolio: 'Vendor Portfolio',
      viewAllPhotos: 'View all {count} photos',
      share: 'Share',
      aboutVendor: 'About the Vendor',
      video: 'Video',
      clickToPlay: 'Click to play',
      back: 'Back',
      location: 'Location',
      getDirections: 'Get Directions',
      fallbackOverview: `${name} is one of the featured ${categoryLabel.toLowerCase()} vendors in ${city}.`,
    },
    fr: {
      home: 'Accueil',
      vendors: 'Prestataires',
      vendorPortfolio: 'Portfolio prestataire',
      viewAllPhotos: 'Voir les {count} photos',
      share: 'Partager',
      aboutVendor: 'À propos du prestataire',
      video: 'Vidéo',
      clickToPlay: 'Cliquer pour lire',
      back: 'Retour',
      location: 'Localisation',
      getDirections: 'Obtenir l’itinéraire',
      fallbackOverview: `${name} fait partie des prestataires ${categoryLabel.toLowerCase()} recommandés à ${city}.`,
    },
    ar: {
      home: 'الرئيسية',
      vendors: 'المزوّدون',
      vendorPortfolio: 'معرض المزوّد',
      viewAllPhotos: 'عرض كل الصور ({count})',
      share: 'مشاركة',
      aboutVendor: 'نبذة عن المزوّد',
      video: 'فيديو',
      clickToPlay: 'انقر للتشغيل',
      back: 'رجوع',
      location: 'الموقع',
      getDirections: 'الحصول على الاتجاهات',
      fallbackOverview: `${name} من مزوّدي ${categoryLabel.toLowerCase()} المميزين في ${city}.`,
    },
  } as const;

  const c = contentCopy[(locale as keyof typeof contentCopy) || 'en'] || contentCopy.en;
  const rawDescription = (description || '').trim();
  const hasArabicScript = /[\u0600-\u06FF]/.test(rawDescription);
  const looksFrench = /\b(le|la|les|des|pour|avec|mariage|prestataire|service|ville|dans)\b|[éèêàçù]/i.test(rawDescription);
  const safeDescription =
    rawDescription && (
      (locale === 'en' && !hasArabicScript && !looksFrench) ||
      (locale === 'fr' && !hasArabicScript) ||
      (locale === 'ar' && hasArabicScript)
    )
      ? rawDescription
      : c.fallbackOverview;

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(`/${locale}/vendors`);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentPath = `${window.location.pathname}${window.location.search}`;
    const prevPath = window.sessionStorage.getItem('wervice_prev_path');
    setShowBackButton(Boolean(prevPath && prevPath !== currentPath));
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-8">
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            className="mb-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <FiChevronLeft className="h-4 w-4" />
            {c.back}
          </button>
        )}

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link href={`/${locale}`} className="hover:text-gray-700">{c.home}</Link>
          <FiChevronRight className="w-3 h-3" />
          <Link href={`/${locale}/vendors`} className="hover:text-gray-700">{c.vendors}</Link>
          <FiChevronRight className="w-3 h-3" />
          <Link href={`/${locale}/categories/${category}`} className="hover:text-gray-700">{categoryLabel}</Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-gray-600 font-medium truncate max-w-[180px]">{name}</span>
        </div>

        {/* ── Gallery ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">{c.vendorPortfolio}</span>
            {allMedia.length > 1 && (
              <button
                onClick={() => openLightbox(0)}
                className="text-sm font-semibold text-gray-800 hover:text-gray-600 flex items-center gap-1 transition-colors"
              >
                {c.viewAllPhotos.replace('{count}', String(allMedia.length))} →
              </button>
            )}
          </div>

          {/* Grid: 1 large + up to 4 small */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[460px] rounded-2xl overflow-hidden">
            {/* Large image (col-span-2, row-span-2) */}
            <button
              onClick={() => openLightbox(0)}
              className="col-span-2 row-span-2 relative w-full h-full group focus:outline-none"
            >
              {mainImage ? (
                <Image src={mainImage} alt={name} fill sizes="50vw" className="object-cover group-hover:brightness-95 transition-all" priority />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">{name.charAt(0)}</span>
                </div>
              )}
            </button>

            {/* 4 smaller cells */}
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => openLightbox(i + 1)}
                className="relative w-full h-full group focus:outline-none"
              >
                {gridImages[i] ? (
                  <Image
                    src={gridImages[i]}
                    alt={`${name} ${i + 2}`}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:brightness-95 transition-all"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                )}
                {/* "Show more" overlay on last cell if more images */}
                {i === 3 && allMedia.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">+{allMedia.length - 5}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Vendor Name Bar ── */}
        <div className="bg-white rounded-2xl mt-4 px-6 py-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-900 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 relative">
              {logoUrl ? (
                <Image src={logoUrl} alt={name} fill className="object-cover" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{name}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <FiMapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {categoryLabel} · {city}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { if (navigator.share) navigator.share({ title: name, url: window.location.href }); }}
              className="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              title={c.share}
            >
              <FiShare2 className="w-4.5 h-4.5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* ── Main 2-column layout ── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* LEFT */}
          <div className="space-y-6">

            {/* About — hidden when no description */}
            {safeDescription && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{c.aboutVendor}</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">{safeDescription}</p>
              </div>
            )}

            {/* Video — hidden when no videoUrl, paused until clicked */}
            {videoUrl && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{c.video}</h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-black relative">
                  {videoPlaying && !videoError ? (
                    isDirectVideoFile(videoUrl) ? (
                      <video
                        src={videoUrl}
                        className="w-full h-full"
                        controls
                        autoPlay
                        playsInline
                        onError={() => setVideoError(true)}
                      />
                    ) : embeddableVideoUrl ? (
                      <iframe
                        src={embeddableVideoUrl.includes('?') ? `${embeddableVideoUrl}&autoplay=1` : `${embeddableVideoUrl}?autoplay=1`}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-900 text-white px-6 text-center">
                        <p className="text-sm text-white/80">This video link can&apos;t be embedded.</p>
                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-lg bg-white text-gray-900 px-3 py-2 text-sm font-semibold"
                        >
                          Open video source
                        </a>
                      </div>
                    )
                  ) : (
                    <button
                      onClick={() => {
                        setVideoError(false);
                        setVideoPlaying(true);
                      }}
                      className="w-full h-full flex flex-col items-center justify-center gap-4 group bg-gray-900 hover:bg-gray-800 transition-colors"
                    >
                      <BsFillPlayCircleFill className="w-20 h-20 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
                      <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">{c.clickToPlay}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{c.location}</h2>
              <p className="text-gray-600 flex items-center gap-2 text-sm">
                <FiMapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {googleMaps && !googleMaps.startsWith('http') ? googleMaps : `${city}, Morocco`}
              </p>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {c.getDirections}
              </a>
            </div>

          </div>

          {/* RIGHT sidebar */}
          <div className="space-y-4">

            {/* Primary Contact — lime green card, number blurred until click */}
            <div className="bg-[#D9FF0A] rounded-2xl p-6">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#11190C]/50 mb-1">Primary Contact</p>
              {phone ? (
                phoneRevealed ? (
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <a href={`tel:${phone}`} className="text-2xl font-bold text-[#11190C] hover:underline leading-tight break-all">
                      {phone}
                    </a>
                    <button
                      type="button"
                      onClick={copyPhone}
                      title="Copy number"
                      className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#11190C]/10 hover:bg-[#11190C]/20 flex items-center justify-center transition-colors"
                    >
                      {phoneCopied ? (
                        <svg className="w-4 h-4 text-[#11190C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#11190C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPhoneRevealed(true)}
                    className="text-2xl font-bold text-[#11190C] block leading-tight text-left w-full cursor-pointer mt-1"
                  >
                    <span className="select-none blur-md pointer-events-none" aria-hidden>{phone}</span>
                    <span className="block mt-1 text-xs font-normal text-[#11190C]/70">Click to reveal</span>
                  </button>
                )
              ) : (
                <p className="text-xl font-bold text-[#11190C] mt-1">Contact for info</p>
              )}
            </div>

            {/* Instagram */}
            {igInfo && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <a
                  href={igInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                    <FiInstagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Instagram</p>
                    <p className="text-sm font-semibold text-gray-900">{igInfo.handle}</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap">Follow →</span>
                </a>
              </div>
            )}

            {/* Price (if available) */}
            {priceFrom > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D9FF0A]">
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-1">Starting From</p>
                <p className="text-2xl font-bold text-gray-900">{priceFrom.toLocaleString()} <span className="text-base font-medium text-gray-500">MAD</span></p>
              </div>
            )}

          </div>
        </div>

        {/* ── Similar Listings ── */}
        {similarVendors.length > 0 && (
          <div className="mt-10 mb-12">
            <SimilarVendors items={similarVendors} locale={locale} />
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/96 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
            {lightboxIndex + 1} / {allMedia.length}
          </div>

          {allMedia.length > 1 && (
            <>
              <button onClick={prevImg} className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextImg} className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <FiChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative w-full h-full flex items-center justify-center p-16">
            {allMedia[lightboxIndex] === videoUrl ? (
              <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden">
                {isDirectVideoFile(videoUrl) ? (
                  <video
                    src={videoUrl}
                    className="w-full h-full"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : embeddableVideoUrl ? (
                  <iframe src={embeddableVideoUrl} className="w-full h-full" allowFullScreen allow="autoplay" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-900 text-white px-6 text-center">
                    <p className="text-sm text-white/80">This video link can&apos;t be embedded.</p>
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-lg bg-white text-gray-900 px-3 py-2 text-sm font-semibold"
                    >
                      Open video source
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={allMedia[lightboxIndex]}
                  alt={`${name} - ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-xl px-4 justify-center">
            {allMedia.map((item, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  i === lightboxIndex ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'
                }`}
              >
                {item === videoUrl ? (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                ) : (
                  <Image src={item} alt="" fill className="object-cover" />
                )}
              </button>
            ))}
          </div>

          <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}</style>
        </div>
      )}
    </div>
  );
}
