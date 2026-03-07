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
  LogOut,
  MapPin,
  Search,
  Settings,
  Store,
  Users,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MOROCCAN_CITIES, localizeCityLabel } from '@/lib/types/vendor';
import { useUser } from '@/contexts/UserContext';
import { CHECKLIST } from '@/data/checklist';
import { getDashboardCopy } from '@/components/home/dashboard-i18n';

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
  if (!href) return `/${locale}/dashboard?view=overview`;
  if (href.startsWith(`/${locale}/dashboard`)) return href;
  if (href.startsWith(`/${locale}/vendors`)) return href.replace(`/${locale}/vendors`, `/${locale}/dashboard`);

  const clean = href.split('?')[0].split('#')[0];
  const parts = clean.split('/').filter(Boolean);

  // Old vendor URL pattern: /{locale}/{city}/{category}/{slug}
  if (parts.length >= 4 && parts[0] === locale) {
    const slug = parts[parts.length - 1];
    if (slug) {
      return `/${locale}/dashboard?view=overview&vendor=${encodeURIComponent(slug)}`;
    }
  }

  return href;
}

const dashboardNav = [
  { id: 'overview', labelKey: 'home', icon: Grid2X2, href: '' },
  { id: 'favorites', labelKey: 'favorites', icon: Heart, href: '/dashboard?view=favorites' },
  { id: 'wedding-date', labelKey: 'weddingDate', icon: Calendar, href: '/dashboard?view=wedding-date' },
  { id: 'checklist', labelKey: 'checklist', icon: CheckSquare, href: '/dashboard?view=checklist' },
  { id: 'guest-list', labelKey: 'guestList', icon: Users, href: '/dashboard?view=guest-list' },
  { id: 'budget-planner', labelKey: 'budgetPlanner', icon: CreditCard, href: '/dashboard?view=budget-planner' },
  { id: 'planning-tools', labelKey: 'planningTools', icon: BookOpen, href: '/dashboard?view=planning-tools' },
];

const marketplaceNav = [
  { id: 'all-vendors', labelKey: 'allVendors', icon: Store, href: '/dashboard?view=overview' },
  { id: 'venues', labelKey: 'venues', icon: MapPin, href: '/dashboard?view=overview&category=venues' },
  { id: 'inspiration', labelKey: 'inspiration', icon: Compass, href: '/dashboard?view=inspiration' },
];

export default function DashboardShell({ locale, children, savedCards = [], activeItem }: DashboardShellProps) {
  const copy = getDashboardCopy(locale);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, profile, signOut } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VendorSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langWrapRef = useRef<HTMLDivElement | null>(null);
  const [sidebarFavorites, setSidebarFavorites] = useState<ShellCard[]>(savedCards);
  const [checklistCompletedMap, setChecklistCompletedMap] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    if (!user?.id) {
      setSidebarFavorites([]);
      return;
    }

    const key = `wervice_favorites_${user.id}`;
    const load = () => {
      try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? (JSON.parse(raw) as ShellCard[]) : [];
        const sorted = [...parsed].sort((a, b) => {
          const aTs = Number((a as ShellCard & { savedAt?: number }).savedAt || 0);
          const bTs = Number((b as ShellCard & { savedAt?: number }).savedAt || 0);
          return bTs - aTs;
        });
        setSidebarFavorites(sorted);
      } catch {
        setSidebarFavorites([]);
      }
    };

    load();
    const onUpdate = () => load();
    window.addEventListener('wervice:favorites-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('wervice:favorites-updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setChecklistCompletedMap({});
      return;
    }

    const key = `wervice_shell_checklist_${user.id}`;
    const load = () => {
      try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
        setChecklistCompletedMap(parsed);
      } catch {
        setChecklistCompletedMap({});
      }
    };

    load();
    const onUpdate = () => load();
    window.addEventListener('wervice:checklist-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('wervice:checklist-updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, [user?.id]);

  const showSearchDropdown = useMemo(() => {
    return isSearchFocused && searchQuery.trim().length >= 3;
  }, [isSearchFocused, searchQuery]);

  const checklistCards = useMemo(() => {
    const allItems = CHECKLIST.flatMap((section) =>
      section.items.map((item) => ({
        id: item.id,
        label: item.label,
        completed: Boolean(checklistCompletedMap[item.id]),
      }))
    );
    const remaining = allItems.filter((item) => !item.completed);
    const done = allItems.filter((item) => item.completed);
    return [...remaining.slice(0, 3), ...done.slice(0, 3)].slice(0, 3);
  }, [checklistCompletedMap]);

  function openVendorFromSearch(slug: string) {
    setIsSearchFocused(false);
    router.push(`/${locale}/dashboard?view=overview&vendor=${encodeURIComponent(slug)}`);
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

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() ||
    profile?.full_name ||
    user?.email?.split('@')[0] ||
    'Guest';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'G';

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
                href={`/${locale}/dashboard?view=overview&city=${encodeURIComponent(city.value)}`}
                className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold text-[#33475f] transition hover:bg-[#F3EFE7]"
              >
                {localizeCityLabel(city.label, locale)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex w-full max-w-[760px] items-center gap-3 lg:w-auto">
            <div ref={searchWrapRef} className="relative hidden flex-1 lg:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/35" />
              <input
                className="h-14 w-full rounded-2xl border border-black/10 bg-[#EFECE7] pl-12 pr-4 text-lg outline-none transition focus:border-[#11190C]"
                placeholder={copy.topbar.searchPlaceholder}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    const q = searchQuery.trim();
                    if (!q) return;
                    setIsSearchFocused(false);
                    router.push(`/${locale}/dashboard?view=overview&q=${encodeURIComponent(q)}`);
                  }
                }}
              />

              {showSearchDropdown && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
                  {isSearching ? (
                    <p className="px-4 py-3 text-sm text-[#5f6f84]">{copy.topbar.searchingVendors}</p>
                  ) : searchResults.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-[#5f6f84]">{copy.topbar.noVendorsFound}</p>
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
                  aria-label={copy.topbar.language}
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

              {user ? (
                <div className="flex items-center gap-2.5 rounded-xl px-1 py-0.5">
                  <div className="grid h-9 w-9 place-items-center rounded-lg border border-[#cfd8e6] bg-white text-sm font-bold text-[#33475f]">
                    {initials}
                  </div>
                  <div className="min-w-[110px]">
                    <p className="text-base font-semibold leading-tight text-[#1f2d44] line-clamp-1">{displayName}</p>
                    <p className="text-xs text-[#6a7f9d]">{copy.topbar.member}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl px-1 py-0.5">
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/dashboard?view=auth&mode=signin`)}
                    className="rounded-lg bg-[#11190C] px-3 py-1.5 text-xs font-semibold text-[#D9FF0A]"
                  >
                    {copy.topbar.signIn}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  router.push(user ? `/${locale}/dashboard?view=settings` : `/${locale}/dashboard?view=auth&mode=signin`)
                }
                className="ml-1 grid h-8 w-8 place-items-center rounded-lg text-[#8fa2bf] hover:bg-white/70"
                aria-label={copy.topbar.accountSettings}
              >
                <Settings className="h-4.5 w-4.5" />
              </button>
              {user && (
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="ml-1 grid h-8 w-8 place-items-center rounded-lg text-[#8fa2bf] hover:bg-white/70"
                  aria-label={copy.topbar.disconnect}
                  title={copy.topbar.disconnect}
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
          </div>
        </header>

        <div className={`grid h-[calc(100vh-85px)] ${user ? 'xl:grid-cols-[260px_1fr_330px]' : 'xl:grid-cols-[260px_1fr]'}`}>
          <aside className="hidden overflow-y-auto border-r border-black/10 bg-[#F1EEE9] px-5 py-6 xl:block">
            <div className="mt-3 space-y-1.5">
              {dashboardNav.map((item) => {
                const Icon = item.icon;
                const active = activeItem === item.id;
                return (
                  <Link
                    key={item.labelKey}
                    href={`/${locale}${item.href}`}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xl font-semibold transition ${
                      active ? 'bg-[#D9FF0A] text-[#11190C] shadow-sm' : 'text-[#354860] hover:bg-[#E8E2D8]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {copy.nav[item.labelKey as keyof typeof copy.nav]}
                  </Link>
                );
              })}
            </div>

            <p className="mt-8 px-2 text-sm font-bold uppercase tracking-[0.16em] text-[#787664]">{copy.nav.marketplace}</p>
            <div className="mt-3 space-y-1.5">
              {marketplaceNav.map((item) => {
                const Icon = item.icon;
                const active = activeItem === item.id;
                return (
                  <Link
                    key={item.labelKey}
                    href={`/${locale}${item.href}`}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xl font-semibold transition ${
                      active ? 'bg-[#D9FF0A] text-[#11190C] shadow-sm' : 'text-[#354860] hover:bg-[#E8E2D8]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {copy.nav[item.labelKey as keyof typeof copy.nav]}
                  </Link>
                );
              })}
            </div>
          </aside>

          <main className="space-y-9 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>

          {user && (
            <aside className="hidden space-y-6 overflow-y-auto border-l border-black/10 bg-[#F7F5F2] px-4 py-6 lg:block sm:px-6">
              <section>
                <h3 className="mb-3 text-5xl font-black text-[#11190C]">{copy.rightSidebar.checklistTitle}</h3>
                <div className="space-y-3">
                  {checklistCards.map((task) => (
                    <div
                      key={task.id}
                      className={`rounded-2xl border p-4 ${task.completed ? 'border-[#D9FF0A]/40 bg-[#F7FFD9]' : 'border-black/10 bg-white'}`}
                    >
                      <p className="text-xl font-bold text-[#11190C] line-clamp-2">{task.label}</p>
                      <p className="text-sm text-[#6a7f9d]">{task.completed ? copy.rightSidebar.completed : copy.rightSidebar.pending}</p>
                    </div>
                  ))}
                  <Link
                    href={`/${locale}/dashboard?view=checklist`}
                    className="block rounded-2xl border border-black/10 bg-[#ECE7DE] p-3 text-center text-xl font-bold text-[#3E4C37]"
                  >
                    {copy.rightSidebar.viewAllTasks}
                  </Link>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-5xl font-black text-[#11190C]">{copy.rightSidebar.savedVendors}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {sidebarFavorites.slice(0, 4).map((card) => (
                    <Link key={card.id} href={toShellVendorHref(locale, card.href)} className="relative block h-32 overflow-hidden rounded-xl border border-black/10 bg-zinc-200">
                      <Image src={card.image} alt={card.title} fill sizes="160px" className="object-cover" />
                    </Link>
                  ))}
                  <Link
                    href={`/${locale}/dashboard?view=favorites`}
                    className="grid h-32 place-items-center rounded-xl border-2 border-dashed border-[#C7C1B4] bg-[#F3EEE4] text-5xl font-light text-[#787664]"
                  >
                    +
                  </Link>
                </div>
              </section>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
