'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
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
import { useRouter, useSearchParams } from 'next/navigation';

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
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  const Icon = icon;
  return (
    <div className="mb-3 flex items-center justify-between gap-2.5 sm:mb-4">
      <h2 className="type-title-medium-2 sm:type-headline-small flex items-center gap-2 tracking-tight text-[#11190C]">
        <Icon className="h-5 w-5 text-[#11190C] sm:h-6 sm:w-6" />
        {title}
      </h2>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="type-label-medium leading-none text-[#11190C] sm:text-sm">
          {actionLabel}
        </Link>
      ) : null}
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
      className="group relative block shrink-0"
    >
      <div className="flex h-[86px] w-[82px] flex-col items-center justify-center rounded-2xl border border-[#d7deea] bg-white sm:hidden">
        <div className="mb-1.5 grid h-8 w-8 place-items-center rounded-xl bg-[#eef3f9] text-[#33475f]">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <p className="type-label-small line-clamp-2 px-1 text-center text-[#33475f]">
          {card.title}
        </p>
      </div>

      <div className="relative hidden h-44 w-[260px] overflow-hidden rounded-3xl ring-1 ring-black/10 sm:block">
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
          <p className="text-[1.9rem] font-extrabold leading-none sm:text-3xl">{card.title}</p>
        </div>
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
      className="group block shrink-0 rounded-3xl font-[var(--font-inter)]"
    >
      <div className="type-label-medium inline-flex h-10 items-center gap-1.5 rounded-full border border-[#d7deea] bg-white px-3 text-[#33475f] sm:hidden">
        <MapPin className="h-3.5 w-3.5 text-[#7f8fa6]" />
        <span className="line-clamp-1">{title}</span>
      </div>

      <div className="hidden w-[260px] sm:block">
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
          <h4 className="type-title-medium line-clamp-1 tracking-[-0.01em] text-[#1f2937]">{title}</h4>
          <p className="type-body-small mt-1 text-[#6b7280]">{vendors}</p>
        </div>
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
  const searchParams = useSearchParams();
  const categoriesRowRef = useRef<HTMLDivElement | null>(null);
  const citiesRowRef = useRef<HTMLDivElement | null>(null);
  const recommendedSentinelRef = useRef<HTMLDivElement | null>(null);
  const [gpsCity, setGpsCity] = useState<string | null>(null);
  const [savedCity, setSavedCity] = useState<string | null>(null);
  const [visibleRecommendedCount, setVisibleRecommendedCount] = useState(6);
  const [isNavigating, setIsNavigating] = useState(false);
  const [mobileCategoryFilter, setMobileCategoryFilter] = useState<'all' | string>('all');

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
    venues: '/images/categories/venues.jpg',
    dresses: '/images/categories/dresses.jpg',
    beauty: '/images/categories/beauty.jpg',
    'photo-film': '/images/categories/photo-film.jpg',
    caterer: '/images/categories/caterer.jpg',
    decor: '/images/categories/decor.jpg',
    artist: '/images/categories/artist.jpg',
    'event-planner': '/images/categories/event-planner.jpg',
    florist: '/images/categories/florist.jpg',
    negafa: '/images/categories/negafa.jpg',
    cakes: '/images/categories/cakes.jpg',
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
    agadir: '/cities/Agadir.jpg',
    meknes: '/cities/meknes.jpg',
    tetouan: '/cities/Tetouan.jpg',
    kenitra: '/cities/Kenitra.webp',
    'el-jadida': '/cities/El Jadida.jpg',
    safi: '/cities/Safi.jpg',
    oujda: '/cities/Oujda.jpg',
    laayoune: '/cities/Laayoune.jpg',
    'el-hoceima': '/cities/El Hoceima.jpg',
    'beni-mellal': '/cities/Beni Mellal.jpg',
  };

  const cityCards = MOROCCAN_CITIES
    .filter((city) => city.value !== 'all')
    .map((city, idx) => {
      const slug = cityToSlug(city.value);
      return {
        title: localizeCityLabel(city.label, locale),
        image: cityImageBySlug[slug] || '/images/sample/venues-1.jpg',
        vendors: `${Math.max(25, 140 - idx * 6)}+ Vendors`,
        href: `/${locale}/${slug}`,
      };
    });

  const savedCards: ShellCard[] = forYouCards;

  const cityKey = (value: string | null | undefined) =>
    (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  const knownCityValues = useMemo(
    () => MOROCCAN_CITIES.filter((city) => city.value !== 'all').map((city) => city.value),
    []
  );
  const selectedCityFromQuery = useMemo(() => {
    const cityQuery = (searchParams.get('city') || '').trim().toLowerCase();
    if (!cityQuery) return null;
    const match = knownCityValues.find((city) => {
      const value = city.toLowerCase();
      return value === cityQuery || cityToSlug(city) === cityQuery;
    });
    return match || null;
  }, [knownCityValues, searchParams]);
  const selectedSavedCity = useMemo(() => {
    if (!savedCity) return null;
    const normalized = savedCity.trim().toLowerCase();
    const match = knownCityValues.find((city) => city.toLowerCase() === normalized || cityToSlug(city) === normalized);
    return match || null;
  }, [knownCityValues, savedCity]);
  const selectedCity = useMemo(() => {
    if (selectedCityFromQuery) return selectedCityFromQuery;
    if (selectedSavedCity) return selectedSavedCity;
    if (!gpsCity) return null;
    const normalizedGps = cityKey(gpsCity);
    if (!normalizedGps) return null;

    const directKnown = knownCityValues.find((city) => {
      const normalizedKnown = cityKey(city);
      return (
        normalizedGps === normalizedKnown ||
        normalizedGps.includes(normalizedKnown) ||
        normalizedKnown.includes(normalizedGps)
      );
    });
    if (directKnown) return directKnown;

    const vendorMatched = recommendedVendors.find((vendor) => {
      const tokens = vendor.city.split(/[\/,]/).map((token) => cityKey(token));
      return tokens.some(
        (token) =>
          token === normalizedGps ||
          token.includes(normalizedGps) ||
          normalizedGps.includes(token)
      );
    });
    return vendorMatched ? vendorMatched.city.split(/[\/,]/)[0].trim().toLowerCase() : null;
  }, [gpsCity, knownCityValues, recommendedVendors, selectedCityFromQuery, selectedSavedCity]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem('wervice_selected_city');
    if (!raw) return;
    setSavedCity(raw);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cityToPersist = selectedCityFromQuery || selectedCity || 'Marrakech';
    window.localStorage.setItem('wervice_selected_city', cityToPersist);
    setSavedCity(cityToPersist);
  }, [selectedCity, selectedCityFromQuery]);

  const effectiveCity = selectedCity || 'Marrakech';
  const recommendedForCity = useMemo(() => {
    const normalized = cityKey(effectiveCity);
    const inCity = recommendedVendors.filter((vendor) =>
      vendor.city
        .split(/[\/,]/)
        .map((token) => cityKey(token))
        .some((token) => token === normalized)
    );
    return (inCity.length > 0 ? inCity : recommendedVendors).slice(0, 16);
  }, [effectiveCity, recommendedVendors]);
  const recommendedFiltered = useMemo(() => {
    if (mobileCategoryFilter === 'all') return recommendedForCity;
    return recommendedForCity.filter((vendor) => vendor.category === mobileCategoryFilter);
  }, [mobileCategoryFilter, recommendedForCity]);

  useEffect(() => {
    setVisibleRecommendedCount(6);
  }, [selectedCity, mobileCategoryFilter]);

  useEffect(() => {
    const node = recommendedSentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisibleRecommendedCount((prev) => {
          if (prev >= recommendedFiltered.length) return prev;
          return Math.min(16, prev + 6, recommendedFiltered.length);
        });
      },
      { rootMargin: '260px 0px', threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [recommendedFiltered.length]);

  const visibleRecommended = recommendedFiltered.slice(0, visibleRecommendedCount);

  return (
    <DashboardShell locale={locale} savedCards={savedCards}>
      <div
        className={`transition-opacity duration-300 ${isNavigating ? 'opacity-70' : 'opacity-100'} xl:[zoom:0.75]`}
      >
        <section className="overflow-hidden">
          <div className="mx-auto max-w-4xl px-6 py-10 text-center sm:px-10 sm:py-14">
            <h1 className="text-3xl font-black leading-[0.95] text-[#11190C] sm:text-6xl">
              Plan your Moroccan{' '}
              <span className="inline-block rounded-xl bg-[#11190C] px-3 py-1 text-[#D9FF0A] shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:rounded-2xl sm:px-4 sm:py-1.5">
                wedding
              </span>
              , your way.
            </h1>
            <p className="mt-4 text-[0.92rem] leading-snug text-[#4a5c74] sm:mt-5 sm:text-2xl">
              Find the best venues, planners, and standout vendors across Morocco to make your day unforgettable.
            </p>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-none border-0 bg-transparent p-4 shadow-none sm:rounded-[28px] sm:border sm:border-[#dbe2ec] sm:bg-white/70 sm:p-6 sm:shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <CarouselHeader
              icon={Grid3X3}
              title="Explore Categories"
              actionLabel="View All"
              actionHref={`/${locale}/vendors`}
            />
            <div
              ref={categoriesRowRef}
              className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

          <section className="rounded-none border-0 bg-transparent p-4 shadow-none sm:rounded-[28px] sm:border sm:border-[#dbe2ec] sm:bg-white/70 sm:p-6 sm:shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <CarouselHeader
              icon={MapPin}
              title="Popular Cities"
              actionLabel="View All"
              actionHref={`/${locale}/vendors`}
            />
            <div
              ref={citiesRowRef}
              className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

          <section className="rounded-none border-0 bg-transparent p-4 shadow-none sm:rounded-[28px] sm:border sm:border-[#dbe2ec] sm:bg-white/70 sm:p-6 sm:shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-[#11190C] sm:text-[1.9rem]">
              Recommended for you in {localizeCityLabel(effectiveCity, locale)}
            </h2>
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setMobileCategoryFilter('all')}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  mobileCategoryFilter === 'all'
                    ? 'border-[#11190C] bg-[#11190C] text-[#D9FF0A]'
                    : 'border-[#d7deea] bg-white text-[#4c5e78]'
                }`}
              >
                {locale === 'fr' ? 'Tout' : locale === 'ar' ? 'الكل' : 'All'}
              </button>
              {WERVICE_CATEGORIES.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setMobileCategoryFilter(category.slug)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    mobileCategoryFilter === category.slug
                      ? 'border-[#11190C] bg-[#11190C] text-[#D9FF0A]'
                      : 'border-[#d7deea] bg-white text-[#4c5e78]'
                  }`}
                >
                  {labelForCategory(category.slug, locale)}
                </button>
              ))}
            </div>
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
                  mobileVariant="list"
                />
              ))}
            </div>
            {recommendedFiltered.length === 0 && (
              <div className="mt-4 rounded-2xl border border-[#d7deea] bg-white p-5 text-sm text-[#5f6f84]">
                No recommended vendors found in this city yet.
              </div>
            )}
            {recommendedFiltered.length > visibleRecommended.length && (
              <div ref={recommendedSentinelRef} className="h-8" />
            )}
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
