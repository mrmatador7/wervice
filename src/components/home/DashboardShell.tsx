'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckSquare,
  ChevronDown,
  Compass,
  CreditCard,
  Globe,
  Grid2X2,
  Heart,
  MapPin,
  Search,
  Settings,
  Store,
  Users,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';

export type ShellCard = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  location?: string;
  categoryLabel?: string;
  logoUrl?: string | null;
  galleryImages?: string[];
};

interface DashboardShellProps {
  locale: string;
  children: ReactNode;
  savedCards?: ShellCard[];
  activeItem?: string;
}

type VendorSearchItem = {
  id: string;
  slug: string;
  business_name: string;
  city: string;
  category: string;
  profile_photo_url?: string | null;
  gallery_urls?: string[] | null;
  gallery_photos?: string[] | null;
};

function toShellVendorHref(locale: string, href: string) {
  if (!href) return `/${locale}/vendors?view=overview`;
  if (href.startsWith(`/${locale}/vendors`)) return href;

  const clean = href.split('?')[0].split('#')[0];
  const parts = clean.split('/').filter(Boolean);

  // Old vendor URL pattern: /{locale}/{city}/{category}/{slug}
  if (parts.length >= 4 && parts[0] === locale) {
    const slug = parts[parts.length - 1];
    if (slug) {
      return `/${locale}/vendors?view=overview&vendor=${encodeURIComponent(slug)}`;
    }
  }

  return href;
}

const dashboardNav = [
  { id: 'overview', label: 'Home', icon: Grid2X2, href: '' },
  { id: 'favorites', label: 'Favorites', icon: Heart, href: '/vendors?view=favorites' },
  { id: 'wedding-date', label: 'Wedding Date', icon: Calendar, href: '/vendors?view=wedding-date' },
  { id: 'checklist', label: 'Wedding Checklist', icon: CheckSquare, href: '/vendors?view=checklist' },
  { id: 'guest-list', label: 'Guest List', icon: Users, href: '/vendors?view=guest-list' },
  { id: 'budget-planner', label: 'Budget Planner', icon: CreditCard, href: '/vendors?view=budget-planner' },
  { id: 'planning-tools', label: 'Planning Tools', icon: BookOpen, href: '/vendors?view=planning-tools' },
];

const marketplaceNav = [
  { id: 'all-vendors', label: 'All Vendors', icon: Store, href: '/vendors?view=overview' },
  { id: 'venues', label: 'Venues', icon: MapPin, href: '/vendors?view=overview&category=venues' },
  { id: 'inspiration', label: 'Inspiration', icon: Compass, href: '/vendors?view=inspiration' },
];

export default function DashboardShell({ locale, children, savedCards = [], activeItem }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VendorSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!searchWrapRef.current) return;
      if (!searchWrapRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (langWrapRef.current && !langWrapRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const handle = setTimeout(async () => {
      setIsSearching(true);
      try {
        const params = new URLSearchParams();
        params.set('q', query);
        params.set('sort', 'newest');
        params.set('limit', '12');
        const response = await fetch(`/api/vendors?${params.toString()}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json();
        const vendors: VendorSearchItem[] = Array.isArray(data?.vendors) ? data.vendors : [];
        const normalized = query.toLowerCase();

        // Prioritize exact prefix matches (e.g. "Neg..." -> "Negafa ...")
        const sorted = [...vendors].sort((a, b) => {
          const aName = a.business_name.toLowerCase();
          const bName = b.business_name.toLowerCase();
          const aStarts = aName.startsWith(normalized) ? 0 : 1;
          const bStarts = bName.startsWith(normalized) ? 0 : 1;
          if (aStarts !== bStarts) return aStarts - bStarts;
          return aName.localeCompare(bName);
        });

        setSearchResults(sorted.slice(0, 6));
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [searchQuery]);

  const showSearchDropdown = useMemo(() => {
    return isSearchFocused && searchQuery.trim().length >= 3;
  }, [isSearchFocused, searchQuery]);

  function openVendorFromSearch(slug: string) {
    setIsSearchFocused(false);
    router.push(`/${locale}/vendors?view=overview&vendor=${encodeURIComponent(slug)}`);
  }

  function switchLocale(nextLocale: string) {
    if (!nextLocale || nextLocale === locale) return;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) segments[0] = nextLocale;
    const nextPath = `/${segments.join('/')}`;
    const qs = searchParams.toString();
    setIsLangOpen(false);
    router.push(`${nextPath}${qs ? `?${qs}` : ''}`);
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#F3F1EE]">
      <div className="h-full w-full overflow-hidden border border-black/10 bg-[#F7F5F2] shadow-[0_15px_45px_rgba(17,25,12,0.1)]">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-black/10 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <Image
              src="/wervice-logo-black.png"
              alt="Wervice"
              width={210}
              height={64}
              priority
              className="h-12 w-auto"
            />
          </Link>

          <nav className="ml-4 hidden flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex xl:flex-wrap xl:overflow-visible xl:whitespace-normal">
            {MOROCCAN_CITIES.filter((city) => city.value !== 'all').map((city) => (
              <Link
                key={city.value}
                href={`/${locale}/vendors?view=overview&city=${encodeURIComponent(city.value)}`}
                className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold text-[#33475f] transition hover:bg-[#F3EFE7]"
              >
                {city.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex w-full max-w-[760px] items-center gap-3 lg:w-auto">
            <div ref={searchWrapRef} className="relative hidden flex-1 lg:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/35" />
              <input
                className="h-14 w-full rounded-2xl border border-black/10 bg-[#EFECE7] pl-12 pr-4 text-lg outline-none transition focus:border-[#11190C]"
                placeholder="Search for vendors or locations..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    const q = searchQuery.trim();
                    if (!q) return;
                    setIsSearchFocused(false);
                    router.push(`/${locale}/vendors?view=overview&q=${encodeURIComponent(q)}`);
                  }
                }}
              />

              {showSearchDropdown && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
                  {isSearching ? (
                    <p className="px-4 py-3 text-sm text-[#5f6f84]">Searching vendors...</p>
                  ) : searchResults.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-[#5f6f84]">No vendors found.</p>
                  ) : (
                    <div className="max-h-96 overflow-y-auto py-1">
                      {searchResults.map((vendor) => {
                        const cover =
                          vendor.profile_photo_url ||
                          vendor.gallery_urls?.[0] ||
                          vendor.gallery_photos?.[0] ||
                          '/images/sample/venues-1.jpg';
                        return (
                          <button
                            key={vendor.id}
                            type="button"
                            onClick={() => openVendorFromSearch(vendor.slug)}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#F3EFE7]"
                          >
                            <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-black/10 bg-[#EEE9E1]">
                              <Image src={cover} alt={vendor.business_name} fill sizes="40px" className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="line-clamp-1 text-sm font-bold text-[#11190C]">{vendor.business_name}</p>
                              <p className="line-clamp-1 text-xs text-[#5f6f84]">{vendor.city}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button type="button" className="hidden h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-[#11190C] hover:bg-[#F3EFE7] sm:inline-flex">
              <Heart className="h-5 w-5" />
            </button>

            <div className="hidden items-center rounded-2xl border border-[#d3dae5] bg-[#e9edf3] px-2 py-1.5 sm:flex">
              <div ref={langWrapRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangOpen((prev) => !prev)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[#33475f] hover:bg-white/50"
                  aria-haspopup="menu"
                  aria-expanded={isLangOpen}
                  aria-label="Language"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-base font-semibold">{locale.toUpperCase()}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {isLangOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-24 overflow-hidden rounded-xl border border-[#d2d9e5] bg-white p-1 text-[#33475f] shadow-xl">
                    {(['en', 'fr', 'ar'] as const).map((lng) => (
                      <button
                        key={lng}
                        type="button"
                        onClick={() => switchLocale(lng)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold uppercase tracking-wide hover:bg-[#F3EFE7]"
                      >
                        {locale === lng ? <span className="text-xs">✓</span> : <span className="w-3" />}
                        <span>{lng}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mx-2 h-8 w-px bg-[#ccd4e1]" />

              <div className="flex items-center gap-2.5 rounded-xl px-1 py-0.5">
                <div className="grid h-9 w-9 place-items-center rounded-lg border border-[#cfd8e6] bg-white text-sm font-bold text-[#33475f]">
                  LB
                </div>
                <div className="min-w-[110px]">
                  <p className="text-base font-semibold leading-tight text-[#1f2d44]">Lina B.</p>
                  <p className="text-xs text-[#6a7f9d]">Member</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push(`/${locale}/vendors?view=settings`)}
                className="ml-1 grid h-8 w-8 place-items-center rounded-lg text-[#8fa2bf] hover:bg-white/70"
                aria-label="Account settings"
              >
                <Settings className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </header>

        <div className="grid h-[calc(100vh-85px)] xl:grid-cols-[260px_1fr_330px]">
          <aside className="hidden overflow-y-auto border-r border-black/10 bg-[#F1EEE9] px-5 py-6 xl:block">
            <div className="mt-3 space-y-1.5">
              {dashboardNav.map((item) => {
                const Icon = item.icon;
                const active = activeItem === item.id;
                return (
                  <Link
                    key={item.label}
                    href={`/${locale}${item.href}`}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xl font-semibold transition ${
                      active ? 'bg-[#D9FF0A] text-[#11190C] shadow-sm' : 'text-[#354860] hover:bg-[#E8E2D8]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <p className="mt-8 px-2 text-sm font-bold uppercase tracking-[0.16em] text-[#787664]">Marketplace</p>
            <div className="mt-3 space-y-1.5">
              {marketplaceNav.map((item) => {
                const Icon = item.icon;
                const active = activeItem === item.id;
                return (
                  <Link
                    key={item.label}
                    href={`/${locale}${item.href}`}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xl font-semibold transition ${
                      active ? 'bg-[#D9FF0A] text-[#11190C] shadow-sm' : 'text-[#354860] hover:bg-[#E8E2D8]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </aside>

          <main className="space-y-9 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>

          <aside className="hidden space-y-6 overflow-y-auto border-l border-black/10 bg-[#F7F5F2] px-4 py-6 lg:block sm:px-6">
            <section>
              <h3 className="mb-3 text-5xl font-black text-[#11190C]">Wedding Checklist</h3>
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#D9FF0A]/40 bg-[#F7FFD9] p-4">
                  <p className="text-2xl font-bold text-[#11190C]">Book Venue</p>
                  <p className="text-base text-[#6a7f9d]">Completed 2 weeks ago</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-2xl font-bold text-[#11190C]">Find a Negafa</p>
                  <p className="text-base text-[#6a7f9d]">Suggested for this month</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-2xl font-bold text-[#11190C]">Choose Catering</p>
                  <p className="text-base text-[#6a7f9d]">Due in 15 days</p>
                </div>
                <Link
                  href={`/${locale}/checklist`}
                  className="block rounded-2xl border border-black/10 bg-[#ECE7DE] p-3 text-center text-xl font-bold text-[#3E4C37]"
                >
                  View All Tasks
                </Link>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-5xl font-black text-[#11190C]">Saved Vendors</h3>
              <div className="grid grid-cols-2 gap-3">
                {savedCards.slice(0, 4).map((card) => (
                  <Link key={card.id} href={toShellVendorHref(locale, card.href)} className="relative block h-32 overflow-hidden rounded-xl border border-black/10 bg-zinc-200">
                    <Image src={card.image} alt={card.title} fill sizes="160px" className="object-cover" />
                  </Link>
                ))}
                <button
                  type="button"
                  className="grid h-32 place-items-center rounded-xl border-2 border-dashed border-[#C7C1B4] bg-[#F3EEE4] text-5xl font-light text-[#787664]"
                >
                  +
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
