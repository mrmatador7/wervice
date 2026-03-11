'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiChevronRight, FiMapPin, FiInstagram, FiShare2, FiChevronLeft } from 'react-icons/fi';
import { BsPlayCircle } from 'react-icons/bs';
import type { SimilarVendor } from '@/lib/db/vendors';
import { useUser } from '@/contexts/UserContext';
import SimilarVendors from './SimilarVendors';

interface VendorDetailPageProps {
  name: string;
  city: string;
  category: string;
  categoryLabel: string;
  description: string | null;
  priceFrom: number;
  phone: string;
  instagram?: string | null;
  googleMaps?: string | null;
  logoUrl?: string | null;
  images: string[];
  videoUrl?: string;
  videoUrls?: string[] | null;
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

function normalizeWhatsappNumber(rawPhone: string | null | undefined): string | null {
  if (!rawPhone) return null;

  // Pick the first phone-like segment when multiple numbers are present.
  const firstCandidate = rawPhone.match(/\+?\d[\d\s()./-]{6,}\d/)?.[0] || rawPhone;
  let normalized = firstCandidate.trim();

  if (normalized.startsWith('+')) normalized = normalized.slice(1);
  normalized = normalized.replace(/[^\d]/g, '');
  if (!normalized) return null;

  // Convert leading international prefix.
  if (normalized.startsWith('00')) normalized = normalized.slice(2);

  // Morocco normalization:
  // 06XXXXXXXX or 07XXXXXXXX -> 2126XXXXXXXX / 2127XXXXXXXX
  // 6XXXXXXXX or 7XXXXXXXX (missing leading 0) -> 2126XXXXXXXX / 2127XXXXXXXX
  if (normalized.startsWith('212')) return normalized;
  if (normalized.length === 10 && normalized.startsWith('0')) return `212${normalized.slice(1)}`;
  if (normalized.length === 9 && /^[67]/.test(normalized)) return `212${normalized}`;

  return normalized;
}

export default function VendorDetailPage({
  name,
  city,
  category,
  categoryLabel,
  description,
  priceFrom,
  phone,
  instagram,
  googleMaps,
  logoUrl,
  images,
  videoUrl,
  videoUrls,
  locale = 'en',
  similarVendors = [],
}: VendorDetailPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalError, setVideoModalError] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendMessageStatus, setSendMessageStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const previewRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const { user, profile } = useUser();

  const copyPhone = () => {
    if (!phone) return;
    navigator.clipboard.writeText(phone).then(() => {
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 2000);
    });
  };

  const videoCandidates = Array.from(
    new Set([...(videoUrls || []), ...(videoUrl ? [videoUrl] : [])].filter(Boolean))
  );
  const currentVideoUrl = videoCandidates[videoIndex] || videoCandidates[0];
  const visibleVideoCandidates = videoCandidates.slice(0, 2);
  const allMedia = [...images];
  if (currentVideoUrl) allMedia.push(currentVideoUrl);
  const embeddableVideoUrl = getEmbeddableVideoUrl(currentVideoUrl);

  const playPreview = (index: number) => {
    const videoEl = previewRefs.current[index];
    if (!videoEl) return;
    if (!videoEl.muted) videoEl.muted = true;
    if (videoEl.volume !== 0) videoEl.volume = 0;
    videoEl.currentTime = 0;
    void videoEl.play().catch(() => {});
  };

  const stopPreview = (index: number) => {
    const videoEl = previewRefs.current[index];
    if (!videoEl) return;
    videoEl.pause();
    videoEl.currentTime = 0;
  };

  const openVideoModal = (index: number) => {
    setVideoIndex(index);
    setVideoModalError(false);
    setVideoModalOpen(true);
  };

  const enforceMutedPlayback = (element: HTMLVideoElement) => {
    if (!element.muted) element.muted = true;
    if (element.volume !== 0) element.volume = 0;
  };

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
  const publicSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wervice.com').replace(/\/+$/, '');
  const vendorPageUrl = `${publicSiteUrl}${pathname || ''}`;
  const whatsappNumber = normalizeWhatsappNumber(phone);
  const whatsappMessageByLocale = {
    en: `Hi, I found your profile here: ${vendorPageUrl} while searching for ${categoryLabel} vendors in ${city}, and I'm interested in your services.`,
    fr: `Bonjour, j'ai trouvé votre profil ici : ${vendorPageUrl} en recherchant des prestataires ${categoryLabel} à ${city}, et je suis intéressé(e) par vos services.`,
    ar: `مرحبا، لقد وجدت ملفكم هنا: ${vendorPageUrl} أثناء البحث عن مزودي ${categoryLabel} في ${city}، وأنا مهتم بخدماتكم.`,
  } as const;
  const whatsappMessage =
    whatsappMessageByLocale[(locale as keyof typeof whatsappMessageByLocale) || 'en'] ||
    whatsappMessageByLocale.en;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

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
      primaryContact: 'Primary Contact',
      clickToReveal: 'Click to reveal',
      sendWhatsappMessage: 'Send WhatsApp Message',
      sendVendorMessage: 'Send Message',
      yourName: 'Your name',
      yourPhone: 'Your phone number',
      yourMessage: 'Your message',
      messagePlaceholder: 'Hi, I am interested in your services for my wedding.',
      messageSent: 'Your message was sent successfully.',
      messageFailed: 'Failed to send your message. Please try again.',
      sending: 'Sending...',
      follow: 'Follow',
      contactForInfo: 'Contact for info',
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
      primaryContact: 'Contact principal',
      clickToReveal: 'Cliquez pour afficher',
      sendWhatsappMessage: 'Envoyer un message WhatsApp',
      sendVendorMessage: 'Envoyer un message',
      yourName: 'Votre nom',
      yourPhone: 'Votre numéro de téléphone',
      yourMessage: 'Votre message',
      messagePlaceholder: "Bonjour, je suis intéressé(e) par vos services pour mon mariage.",
      messageSent: 'Votre message a été envoyé avec succès.',
      messageFailed: "Échec de l'envoi du message. Veuillez réessayer.",
      sending: 'Envoi...',
      follow: 'Suivre',
      contactForInfo: 'Contactez pour plus d’infos',
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
      primaryContact: 'جهة الاتصال الرئيسية',
      clickToReveal: 'اضغط لإظهار الرقم',
      sendWhatsappMessage: 'إرسال رسالة واتساب',
      sendVendorMessage: 'إرسال رسالة',
      yourName: 'اسمك',
      yourPhone: 'رقم هاتفك',
      yourMessage: 'رسالتك',
      messagePlaceholder: 'مرحبًا، أنا مهتم/ة بخدماتكم لحفل زفافي.',
      messageSent: 'تم إرسال رسالتك بنجاح.',
      messageFailed: 'فشل إرسال الرسالة. حاول/ي مرة أخرى.',
      sending: 'جارٍ الإرسال...',
      follow: 'متابعة',
      contactForInfo: 'تواصل لمعرفة التفاصيل',
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

  useEffect(() => {
    const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim();
    const fallbackName = user?.email ? user.email.split('@')[0] : '';
    const nextName = fullName || fallbackName;
    if (nextName) setSenderName(nextName);
    if (profile?.phone) setSenderPhone(String(profile.phone));
  }, [profile?.first_name, profile?.last_name, profile?.phone, user?.email]);

  const sendVendorMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSendMessageStatus(null);

    const nameValue = senderName.trim();
    const phoneValue = senderPhone.trim();
    const messageValue = senderMessage.trim();
    if (!nameValue || !phoneValue || !messageValue) return;

    setSendingMessage(true);
    try {
      const response = await fetch('/api/vendor-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorName: name,
          vendorCategory: categoryLabel,
          vendorCity: city,
          vendorUrl: vendorPageUrl,
          locale,
          senderName: nameValue,
          senderPhone: phoneValue,
          senderAccountEmail: user?.email || profile?.email || '',
          message: messageValue,
        }),
      });

      if (!response.ok) {
        throw new Error('send_failed');
      }

      setSendMessageStatus({ type: 'success', text: c.messageSent });
      setSenderMessage('');
    } catch {
      setSendMessageStatus({ type: 'error', text: c.messageFailed });
    } finally {
      setSendingMessage(false);
    }
  };

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

            {/* Video */}
            {currentVideoUrl && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-gray-900">{c.video}</h2>
                  {visibleVideoCandidates.length > 0 && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {visibleVideoCandidates.length} / {visibleVideoCandidates.length}
                    </span>
                  )}
                </div>
                <div className="mt-1 overflow-x-auto pb-1">
                  <div className="flex min-w-max gap-4">
                    {visibleVideoCandidates.map((url, idx) => (
                      <button
                        key={`${url}-${idx}`}
                        type="button"
                        onClick={() => openVideoModal(idx)}
                        onMouseEnter={() => playPreview(idx)}
                        onMouseLeave={() => stopPreview(idx)}
                        className={`group relative h-52 w-32 overflow-hidden rounded-3xl border transition-all md:h-64 md:w-40 ${
                          idx === videoIndex
                            ? 'border-gray-900 shadow-lg ring-2 ring-gray-900/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title={`Video ${idx + 1}`}
                      >
                        {isDirectVideoFile(url) ? (
                          <video
                            src={url}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onLoadedMetadata={(event) => enforceMutedPlayback(event.currentTarget)}
                            onPlay={(event) => enforceMutedPlayback(event.currentTarget)}
                            onVolumeChange={(event) => enforceMutedPlayback(event.currentTarget)}
                            ref={(el) => {
                              previewRefs.current[idx] = el;
                            }}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-400" />
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                          <BsPlayCircle className="h-5 w-5" />
                          <span className="text-xs font-semibold">Video {idx + 1}</span>
                        </div>
                      </button>
                    ))}
                  </div>
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
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#11190C]/50 mb-1">{c.primaryContact}</p>
              {phone ? (
                <>
                  {phoneRevealed ? (
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
                      <span className="block mt-1 text-xs font-normal text-[#11190C]/70">{c.clickToReveal}</span>
                    </button>
                  )}

                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#11190C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1008]"
                    >
                      {c.sendWhatsappMessage}
                    </a>
                  )}
                </>
              ) : (
                <p className="text-xl font-bold text-[#11190C] mt-1">{c.contactForInfo}</p>
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
                  <span className="ml-auto text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap">{c.follow} →</span>
                </a>
              </div>
            )}

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h4 className="mb-3 text-base font-bold text-[#11190C]">{c.sendVendorMessage}</h4>
              <form onSubmit={sendVendorMessage} className="space-y-2.5">
                <input
                  type="text"
                  value={senderName}
                  onChange={(event) => setSenderName(event.target.value)}
                  placeholder={c.yourName}
                  required
                  readOnly={Boolean(user)}
                  className="w-full rounded-xl border border-[#d8dee8] bg-white px-3 py-2.5 text-sm text-[#11190C] focus:outline-none focus:ring-2 focus:ring-[#D9FF0A]"
                />
                <input
                  type="tel"
                  value={senderPhone}
                  onChange={(event) => setSenderPhone(event.target.value)}
                  placeholder={c.yourPhone}
                  required
                  className="w-full rounded-xl border border-[#d8dee8] bg-white px-3 py-2.5 text-sm text-[#11190C] focus:outline-none focus:ring-2 focus:ring-[#D9FF0A]"
                />
                <textarea
                  value={senderMessage}
                  onChange={(event) => setSenderMessage(event.target.value)}
                  placeholder={c.messagePlaceholder}
                  required
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#d8dee8] bg-white px-3 py-2.5 text-sm text-[#11190C] focus:outline-none focus:ring-2 focus:ring-[#D9FF0A]"
                />
                <button
                  type="submit"
                  disabled={sendingMessage}
                  className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#11190C] px-4 text-sm font-semibold text-white hover:bg-[#0a1008] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sendingMessage ? c.sending : c.sendVendorMessage}
                </button>
              </form>
              {sendMessageStatus && (
                <p
                  className={`mt-2 text-xs font-semibold ${
                    sendMessageStatus.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {sendMessageStatus.text}
                </p>
              )}
            </div>

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
      {videoModalOpen && currentVideoUrl && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-6 backdrop-blur-md"
          onClick={() => setVideoModalOpen(false)}
        >
          <button
            type="button"
            onClick={() => setVideoModalOpen(false)}
            className="absolute right-6 top-6 z-20 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative w-full max-w-[min(92vw,420px)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[9/16] max-h-[86vh] w-full overflow-hidden rounded-[26px] bg-black shadow-2xl">
              {isDirectVideoFile(currentVideoUrl) ? (
                <video
                  key={`modal-${currentVideoUrl}`}
                  src={currentVideoUrl}
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  playsInline
                  muted
                  onLoadedMetadata={(event) => enforceMutedPlayback(event.currentTarget)}
                  onPlay={(event) => enforceMutedPlayback(event.currentTarget)}
                  onVolumeChange={(event) => enforceMutedPlayback(event.currentTarget)}
                  onError={() => setVideoModalError(true)}
                />
              ) : embeddableVideoUrl ? (
                <iframe
                  src={embeddableVideoUrl.includes('?') ? `${embeddableVideoUrl}&autoplay=1&mute=1&muted=1` : `${embeddableVideoUrl}?autoplay=1&mute=1&muted=1`}
                  className="h-full w-full object-cover"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm text-white/80">
                  This video link can&apos;t be embedded.
                </div>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 text-white">
                <p className="text-3xl font-semibold leading-tight">{name}</p>
                <p className="mt-1 text-sm text-white/85">{city}</p>
              </div>
            </div>

            {videoModalError && (
              <div className="mt-3 rounded-lg border border-red-300/30 bg-red-900/30 px-4 py-3 text-sm text-red-200">
                Failed to play video in popup.
              </div>
            )}
          </div>
        </div>
      )}

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
            {allMedia[lightboxIndex] === currentVideoUrl ? (
              <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden">
                {isDirectVideoFile(currentVideoUrl) ? (
                  <video
                    src={currentVideoUrl}
                    controls
                    controlsList="nodownload noplaybackrate noremoteplayback"
                    disablePictureInPicture
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={(event) => enforceMutedPlayback(event.currentTarget)}
                    onPlay={(event) => enforceMutedPlayback(event.currentTarget)}
                    onVolumeChange={(event) => enforceMutedPlayback(event.currentTarget)}
                    onContextMenu={(event) => event.preventDefault()}
                    className="w-full h-full wervice-video-controls"
                  />
                ) : embeddableVideoUrl ? (
                  <iframe
                    src={embeddableVideoUrl.includes('?') ? `${embeddableVideoUrl}&autoplay=1&mute=1&muted=1` : `${embeddableVideoUrl}?autoplay=1&mute=1&muted=1`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-900 text-white px-6 text-center">
                    <p className="text-sm text-white/80">This video link can&apos;t be embedded.</p>
                    <a
                      href={currentVideoUrl}
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
                {item === currentVideoUrl ? (
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
