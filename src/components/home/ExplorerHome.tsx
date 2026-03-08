'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Camera,
  Grid3X3,
  MapPin,
  Music2,
  Paintbrush2,
  Shirt,
  Sparkles,
  Ticket,
  UtensilsCrossed,
  WandSparkles,
} from 'lucide-react';
import { WERVICE_CATEGORIES, labelForCategory } from '@/lib/categories';
import { MOROCCAN_CITIES, localizeCityLabel } from '@/lib/types/vendor';
import { cityToSlug } from '@/lib/vendor-url';
import DashboardShell, { type ShellCard } from '@/components/home/DashboardShell';
import VendorBrowseCard from '@/components/home/VendorBrowseCard';
import { useRouter } from 'next/navigation';

type HomeCard = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

interface ExplorerHomeProps {
  locale: string;
  forYouCards: HomeCard[];
  recommendedVendors: Array<{
    id: string;
    title: string;
    city: string;
    category: string;
    logoUrl?: string | null;
    galleryImages: string[];
    href: string;
  }>;
}

function CarouselHeader({
  icon,
  title,
  actionLabel,
  actionHref,
  onPrev,
  onNext,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  actionLabel?: string;
  actionHref?: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  const Icon = icon;
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-3 text-4xl font-black tracking-tight text-[#11190C]">
        <Icon className="h-9 w-9 text-[#11190C]" />
        {title}
      </h2>
      <div className="flex items-center gap-2">
        {actionLabel && actionHref && (
          <Link href={actionHref} className="mr-2 text-2xl font-bold text-[#11190C]">
            {actionLabel}
          </Link>
        )}
        <button
          type="button"
          onClick={onPrev}
          className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-[#F3EFE7] text-[#33475f] hover:bg-[#E8E2D8]"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-[#F3EFE7] text-[#33475f] hover:bg-[#E8E2D8]"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

const iconByCategorySlug = {
  venues: Building2,
  dresses: Shirt,
  beauty: Sparkles,
  'photo-film': Camera,
  caterer: UtensilsCrossed,
  decor: Paintbrush2,
  artist: Music2,
  'event-planner': WandSparkles,
  florist: Ticket,
  negafa: Shirt,
  cakes: Sparkles,
} as const;

function SmallCategoryCard({
  card,
  Icon,
  onNavigate,
}: {
  card: HomeCard;
  Icon: React.ComponentType<{ className?: string }>;
  onNavigate: (href: string) => void;
}) {
  return (
    <Link
      href={card.href}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(card.href);
      }}
      className="group relative block h-44 w-[260px] shrink-0 overflow-hidden rounded-3xl ring-1 ring-black/10"
    >
      <Image
        src={card.image}
        alt={card.title}
        fill
        sizes="(max-width: 1024px) 100vw, 25vw"
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172fcc] via-[#0f172f66] to-[#0f172f22]" />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-white">
        <Icon className="mb-1.5 h-7 w-7" />
        <p className="text-3xl font-extrabold leading-none">{card.title}</p>
      </div>
    </Link>
  );
}

function CityCard({
  title,
  image,
  vendors,
  href,
  onNavigate,
}: {
  title: string;
  image: string;
  vendors: string;
  href: string;
  onNavigate: (href: string) => void;
}) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(href);
      }}
      className="group block w-[260px] shrink-0 rounded-3xl font-[var(--font-inter)]"
    >
      <div className="relative h-44 overflow-hidden rounded-3xl bg-zinc-200 shadow-sm ring-1 ring-black/10">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-2 pb-1 pt-4 text-center">
        <h4 className="line-clamp-1 text-[1.08rem] font-semibold leading-[1.2] tracking-[-0.01em] text-[#1f2937]">{title}</h4>
        <p className="mt-1 text-[0.95rem] font-medium text-[#6b7280]">{vendors}</p>
      </div>
    </Link>
  );
}

export default function ExplorerHome({
  locale,
  forYouCards,
  recommendedVendors,
}: ExplorerHomeProps) {
  const router = useRouter();
  const categoriesRowRef = useRef<HTMLDivElement | null>(null);
  const citiesRowRef = useRef<HTMLDivElement | null>(null);
  const recommendedSentinelRef = useRef<HTMLDivElement | null>(null);
  const [gpsCity, setGpsCity] = useState<string | null>(null);
  const [visibleRecommendedCount, setVisibleRecommendedCount] = useState(6);
  const [isNavigating, setIsNavigating] = useState(false);

  function smoothNavigate(href: string) {
    setIsNavigating(true);
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as Document & { startViewTransition?: (cb: () => void) => void }).startViewTransition?.(() => {
        router.push(href);
      });
      return;
    }
    router.push(href);
  }

  function scrollRow(ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') {
    const node = ref.current;
    if (!node) return;
    const amount = 320;
    node.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
            { cache: 'no-store' }
          );
          if (!res.ok) return;
          const data = await res.json();
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.state ||
            null;
          if (city) setGpsCity(String(city));
        } catch {
          // Ignore geolocation reverse-lookup failure and keep fallback city.
        }
      },
      () => {
        // Permission denied or unavailable.
      },
      { timeout: 7000, maximumAge: 1000 * 60 * 10 }
    );
  }, []);

  const categoryImageBySlug: Record<string, string> = {
    venues: '/categories/venues.png',
    dresses: '/categories/Dresses.png',
    beauty: '/categories/beauty.png',
    'photo-film': '/categories/photo.png',
    caterer: '/categories/Catering.png',
    decor: '/categories/decor.png',
    artist: '/categories/music.png',
    'event-planner': '/categories/event-planner.png',
    florist: '/categories/decor.png',
    negafa: '/categories/beauty.png',
    cakes: '/categories/Catering.png',
  };

  const categoryCards = WERVICE_CATEGORIES.map((category) => ({
    id: `cat-${category.slug}`,
    slug: category.slug,
    title: labelForCategory(category.slug, locale),
    subtitle: '',
    image: categoryImageBySlug[category.slug] || '/categories/venues.png',
    href: `/${locale}/categories/${category.slug}`,
  }));

  const cityImageBySlug: Record<string, string> = {
    marrakech: '/cities/Marrakech.jpg',
    casablanca: '/cities/Casablanca.jpg',
    fes: '/cities/Fez.jpg',
    rabat: '/cities/Rabat.jpg',
    tanger: '/cities/tanger.jpg',
    agadir: '/cities/tanger.jpg',
    meknes: '/cities/meknes.jpg',
    tetouan: '/cities/tanger.jpg',
    kenitra: '/cities/Kenitra.webp',
    'el-jadida': '/cities/El Jadida.jpg',
    safi: '/cities/El Jadida.jpg',
    oujda: '/cities/Casablanca.jpg',
    laayoune: '/cities/tanger.jpg',
    'el-hoceima': '/cities/tanger.jpg',
    'beni-mellal': '/cities/Casablanca.jpg',
    chefchaouen: '/cities/tanger.jpg',
  };

  const cityCards = MOROCCAN_CITIES
    .filter((city) => city.value !== 'all')
    .map((city, idx) => {
      const slug = cityToSlug(city.value);
      return {
        title: localizeCityLabel(city.label, locale),
        image: cityImageBySlug[slug] || '/cities/Casablanca.jpg',
        vendors: `${Math.max(25, 140 - idx * 6)}+ Vendors`,
        href: `/${locale}/${slug}`,
      };
    });

  const savedCards: ShellCard[] = forYouCards;

  const cityKey = (value: string | null | undefined) => (value || '').toLowerCase().trim();
  const fallbackCity = recommendedVendors[0]?.city || 'Morocco';
  const selectedCity = useMemo(() => {
    if (!gpsCity) return fallbackCity;
    const normalized = cityKey(gpsCity);
    const hasCity = recommendedVendors.some((vendor) => cityKey(vendor.city) === normalized);
    return hasCity ? gpsCity : fallbackCity;
  }, [gpsCity, recommendedVendors, fallbackCity]);

  const recommendedForCity = useMemo(() => {
    const normalized = cityKey(selectedCity);
    return recommendedVendors.filter((vendor) => cityKey(vendor.city) === normalized).slice(0, 16);
  }, [recommendedVendors, selectedCity]);

  useEffect(() => {
    setVisibleRecommendedCount(6);
  }, [selectedCity]);

  useEffect(() => {
    const node = recommendedSentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisibleRecommendedCount((prev) => {
          if (prev >= recommendedForCity.length) return prev;
          return Math.min(16, prev + 6, recommendedForCity.length);
        });
      },
      { rootMargin: '260px 0px', threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [recommendedForCity.length]);

  const visibleRecommended = recommendedForCity.slice(0, visibleRecommendedCount);

  return (
    <DashboardShell locale={locale} savedCards={savedCards}>
      <div className={`transition-opacity duration-300 ${isNavigating ? 'opacity-70' : 'opacity-100'}`}>
      <section className="overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 py-10 text-center sm:px-10 sm:py-14">
          <h1 className="text-4xl font-black leading-[0.95] text-[#11190C] sm:text-6xl">
            Plan your Moroccan{' '}
            <span className="inline-block rounded-2xl bg-[#11190C] px-4 py-1.5 text-[#D9FF0A] shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
              wedding
            </span>
            , your way.
          </h1>
          <p className="mt-5 text-xl text-[#4a5c74] sm:text-2xl">
            Find the best venues, planners, and standout vendors across Morocco to make your day unforgettable.
          </p>
        </div>
      </section>

      <section>
        <CarouselHeader
          icon={Grid3X3}
          title="Explore Categories"
          actionLabel="View All"
          actionHref={`/${locale}/vendors`}
          onPrev={() => scrollRow(categoriesRowRef, 'left')}
          onNext={() => scrollRow(categoriesRowRef, 'right')}
        />
        <div
          ref={categoriesRowRef}
          className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categoryCards.map((card) => (
            <SmallCategoryCard
              key={card.id}
              card={card}
              Icon={iconByCategorySlug[card.slug as keyof typeof iconByCategorySlug] || Sparkles}
              onNavigate={smoothNavigate}
            />
          ))}
        </div>
      </section>

      <section>
        <CarouselHeader
          icon={MapPin}
          title="Popular Cities"
          onPrev={() => scrollRow(citiesRowRef, 'left')}
          onNext={() => scrollRow(citiesRowRef, 'right')}
        />
        <div
          ref={citiesRowRef}
          className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cityCards.map((city) => (
            <CityCard
              key={city.href}
              title={city.title}
              image={city.image}
              vendors={city.vendors}
              href={city.href}
              onNavigate={smoothNavigate}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-4xl font-black tracking-tight text-[#11190C]">
          Recommended for you in {localizeCityLabel(selectedCity, locale)}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {visibleRecommended.map((vendor) => (
            <VendorBrowseCard
              key={vendor.id}
              vendorId={vendor.id}
              href={vendor.href}
              title={vendor.title}
              location={vendor.city}
              categoryLabel={labelForCategory(vendor.category, locale)}
              logoUrl={vendor.logoUrl}
              galleryImages={vendor.galleryImages}
            />
          ))}
        </div>
        {recommendedForCity.length === 0 && (
          <div className="mt-4 rounded-2xl border border-[#d7deea] bg-white p-5 text-sm text-[#5f6f84]">
            No recommended vendors found in this city yet.
          </div>
        )}
        {recommendedForCity.length > visibleRecommended.length && (
          <div ref={recommendedSentinelRef} className="h-8" />
        )}
      </section>
      </div>
    </DashboardShell>
  );
}
