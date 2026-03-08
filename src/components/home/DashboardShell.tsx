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
import { cityToSlug } from '@/lib/vendor-url';
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

  if (href.startsWith(`/${locale}/dashboard?`)) {
    try {
      const url = new URL(href, 'https://wervice.local');
      const slug = url.searchParams.get('vendor');
      if (slug) return `/${locale}/vendors/${encodeURIComponent(slug)}`;
    } catch {
      // ignore and keep fallback behavior
    }
    return href;
  }

  const clean = href.split('?')[0].split('#')[0];
  const parts = clean.split('/').filter(Boolean);

  // Old vendor URL pattern: /{locale}/{city}/{category}/{slug}
  if (parts.length >= 4 && parts[0] === locale) {
    return href;
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
  const [isRouteSwitching, setIsRouteSwitching] = useState(false);

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
    setIsRouteSwitching(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const previousCurrent = window.sessionStorage.getItem('wervice_current_path');
    if (previousCurrent && previousCurrent !== current) {
      window.sessionStorage.setItem('wervice_prev_path', previousCurrent);
    }
    window.sessionStorage.setItem('wervice_current_path', current);
  }, [pathname, searchParams]);

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
    const onUpdate = () => {
      window.setTimeout(load, 0);
    };
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
    const onUpdate = () => {
      window.setTimeout(load, 0);
    };
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

  const checklistStats = useMemo(() => {
    const validIds = new Set(CHECKLIST.flatMap((section) => section.items.map((item) => item.id)));
    const total = validIds.size;
    const done = Object.entries(checklistCompletedMap).filter(([id, isDone]) => isDone && validIds.has(id)).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [checklistCompletedMap]);

  const weddingDateDisplay = useMemo(() => {
    const raw = profile?.wedding_date;
    if (!raw) return null;
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return null;
    const localeTag = locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(localeTag, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [profile?.wedding_date, locale]);

  const checklistTasksDoneLabel = useMemo(() => {
    return copy.rightSidebar.tasksDone
      .replace('{done}', String(checklistStats.done))
      .replace('{total}', String(checklistStats.total));
  }, [copy.rightSidebar.tasksDone, checklistStats.done, checklistStats.total]);

  function openVendorFromSearch(vendor: VendorSearchItem) {
    setIsSearchFocused(false);
    const href = `/${locale}/${cityToSlug(vendor.city)}/${vendor.category}/${vendor.slug}`;
    router.push(href);
  }

  function navigateSmooth(href: string) {
    setIsRouteSwitching(true);
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as Document & { startViewTransition?: (cb: () => void) => void }).startViewTransition?.(() => {
        router.push(href);
      });
      return;
    }
    router.push(href);
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
    <div className="h-screen w-full overflow-hidden bg-[#eceff3] font-[var(--font-inter)]">
      <div className="h-full w-full overflow-hidden border border-[#d8dce3] bg-[#f6f7f9]">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-[#dde2ea] bg-[#f8f9fb]/95 px-4 py-3 backdrop-blur sm:px-6">
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

          <nav className="ml-2 hidden flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex xl:flex-wrap xl:overflow-visible xl:whitespace-normal">
            {MOROCCAN_CITIES.filter((city) => city.value !== 'all').map((city) => (
              <Link
                key={city.value}
                href={`/${locale}/dashboard?view=overview&city=${encodeURIComponent(city.value)}`}
                onClick={(event) => {
                  event.preventDefault();
                  navigateSmooth(`/${locale}/dashboard?view=overview&city=${encodeURIComponent(city.value)}`);
                }}
                className="rounded-full border border-[#d7dde7] bg-white px-3 py-1.5 text-sm font-medium text-[#4d5f78] transition hover:bg-[#f1f4f9]"
              >
                {localizeCityLabel(city.label, locale)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex w-full max-w-[760px] items-center gap-3 lg:w-auto">
            <div ref={searchWrapRef} className="relative hidden flex-1 lg:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b95a7]" />
              <input
                className="h-12 w-full rounded-xl border border-[#d8dee8] bg-white pl-12 pr-4 text-base text-[#2c3850] outline-none transition placeholder:text-[#98a3b6] focus:border-[#96aac9]"
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
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-[#d8dee8] bg-white shadow-xl">
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
                            onClick={() => openVendorFromSearch(vendor)}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#f2f5fa]"
                          >
                            <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[#d8dee8] bg-[#edf1f6]">
                              <Image src={cover} alt={vendor.business_name} fill sizes="40px" className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="line-clamp-1 text-sm font-bold text-[#11190C]">{vendor.business_name}</p>
                              <p className="line-clamp-1 text-xs text-[#5f6f84]">{localizeCityLabel(vendor.city, locale)}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button type="button" className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[#d8dee8] bg-white text-[#4d5f78] hover:bg-[#f1f4f9] sm:inline-flex">
              <Heart className="h-5 w-5" />
            </button>

            <div className="hidden items-center rounded-2xl border border-[#d7dde8] bg-[#edf2f8] px-2 py-1.5 sm:flex">
              <div ref={langWrapRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangOpen((prev) => !prev)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[#475a76] hover:bg-white/60"
                  aria-haspopup="menu"
                  aria-expanded={isLangOpen}
                  aria-label={copy.topbar.language}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-base font-semibold">{locale.toUpperCase()}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {isLangOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-24 overflow-hidden rounded-xl border border-[#d8dee8] bg-white p-1 text-[#475a76] shadow-xl">
                    {(['en', 'fr', 'ar'] as const).map((lng) => (
                      <button
                        key={lng}
                        type="button"
                        onClick={() => switchLocale(lng)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold uppercase tracking-wide hover:bg-[#f1f4f9]"
                      >
                        {locale === lng ? <span className="text-xs">✓</span> : <span className="w-3" />}
                        <span>{lng}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mx-2 h-8 w-px bg-[#d2d9e6]" />

              {user ? (
                <div className="flex items-center gap-2.5 rounded-xl px-1 py-0.5">
                  <div className="grid h-9 w-9 place-items-center rounded-lg border border-[#d2d9e6] bg-white text-sm font-semibold text-[#4d5f78]">
                    {initials}
                  </div>
                  <div className="min-w-[110px]">
                    <p className="text-base font-semibold leading-tight text-[#1f2d44] line-clamp-1">{displayName}</p>
                    <p className="text-xs text-[#7a89a0]">{copy.topbar.member}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl px-1 py-0.5">
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/dashboard?view=auth&mode=signin`)}
                    className="rounded-lg bg-[#111827] px-3 py-1.5 text-xs font-semibold text-white"
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
                className="ml-1 grid h-8 w-8 place-items-center rounded-lg text-[#8093af] hover:bg-white/70"
                aria-label={copy.topbar.accountSettings}
              >
                <Settings className="h-4.5 w-4.5" />
              </button>
              {user && (
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="ml-1 grid h-8 w-8 place-items-center rounded-lg text-[#8093af] hover:bg-white/70"
                  aria-label={copy.topbar.disconnect}
                  title={copy.topbar.disconnect}
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
          </div>
        </header>

        <div className={`grid h-[calc(100vh-85px)] transition-opacity duration-300 ${isRouteSwitching ? 'opacity-70' : 'opacity-100'} ${user ? 'xl:grid-cols-[290px_1fr_330px]' : 'xl:grid-cols-[290px_1fr]'}`}>
          <aside className="hidden overflow-y-auto border-r border-[#dde2ea] bg-[#f3f5f8] px-5 py-6 xl:block">
            <div className="space-y-1">
              {dashboardNav.map((item) => {
                const Icon = item.icon;
                const active = activeItem === item.id;
                return (
                  <Link
                    key={item.labelKey}
                    href={`/${locale}${item.href}`}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-[17px] font-medium transition ${
                      active
                        ? 'border border-[#d9dee7] bg-white text-[#2e3b52] shadow-[0_2px_8px_rgba(15,23,42,0.08)]'
                        : 'border border-transparent text-[#6f7888] hover:bg-white/70'
                    }`}
                  >
                    <Icon className="h-5 w-5 stroke-[1.9]" />
                    {copy.nav[item.labelKey as keyof typeof copy.nav]}
                  </Link>
                );
              })}
            </div>

            <p className="mt-6 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9aa3b3]">{copy.nav.marketplace}</p>
            <div className="mt-2 space-y-1">
              {marketplaceNav.map((item) => {
                const Icon = item.icon;
                const active = activeItem === item.id;
                return (
                  <Link
                    key={item.labelKey}
                    href={`/${locale}${item.href}`}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-[17px] font-medium transition ${
                      active
                        ? 'border border-[#d9dee7] bg-white text-[#2e3b52] shadow-[0_2px_8px_rgba(15,23,42,0.08)]'
                        : 'border border-transparent text-[#6f7888] hover:bg-white/70'
                    }`}
                  >
                    <Icon className="h-5 w-5 stroke-[1.9]" />
                    {copy.nav[item.labelKey as keyof typeof copy.nav]}
                  </Link>
                );
              })}
            </div>
          </aside>

          <main className="space-y-9 overflow-y-auto bg-[#f7f8fa] px-4 py-6 sm:px-6 lg:px-8">{children}</main>

          {user && (
            <aside className="hidden space-y-4 overflow-y-auto border-l border-[#dde2ea] bg-[#f3f5f8] px-4 py-6 lg:block sm:px-5">
              <section className="grid grid-cols-1 gap-3">
                <div className="rounded-2xl border border-[#dde2ea] bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[#1f2937]">{copy.rightSidebar.weddingDateTitle}</h3>
                    <Calendar className="h-4 w-4 text-[#8a96ab]" />
                  </div>
                  <p className="text-lg font-semibold text-[#243244]">{weddingDateDisplay || copy.rightSidebar.noWeddingDate}</p>
                  <Link
                    href={`/${locale}/dashboard?view=wedding-date`}
                    className="mt-2 inline-flex text-xs font-semibold text-[#5a6f90] hover:text-[#2f4668]"
                  >
                    {copy.rightSidebar.openWeddingDate}
                  </Link>
                </div>

                <div className="rounded-2xl border border-[#dde2ea] bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[#1f2937]">{copy.rightSidebar.planningProgressTitle}</h3>
                    <span className="text-sm font-semibold text-[#3a4f70]">{checklistStats.percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5ebf3]">
                    <div className="h-full rounded-full bg-[#8fb6ff]" style={{ width: `${checklistStats.percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs font-medium text-[#8a96ab]">{checklistTasksDoneLabel}</p>
                </div>
              </section>

              <section className="rounded-2xl border border-[#dde2ea] bg-white p-4">
                <h3 className="mb-3 text-2xl font-semibold tracking-[-0.01em] text-[#1f2937]">{copy.rightSidebar.checklistTitle}</h3>
                <div className="space-y-2.5">
                  {checklistCards.map((task) => (
                    <div
                      key={task.id}
                      className={`rounded-xl border p-3 ${task.completed ? 'border-[#cfe7d6] bg-[#f2fcf5]' : 'border-[#e2e7ef] bg-[#fbfcfe]'}`}
                    >
                      <p className="line-clamp-2 text-[15px] font-semibold leading-[1.28] text-[#243244]">{task.label}</p>
                      <p className="mt-1 text-xs font-medium text-[#8a96ab]">{task.completed ? copy.rightSidebar.completed : copy.rightSidebar.pending}</p>
                    </div>
                  ))}
                  <Link
                    href={`/${locale}/dashboard?view=checklist`}
                    className="block rounded-xl border border-[#dde2ea] bg-[#edf2f8] p-2.5 text-center text-sm font-semibold text-[#3f4f67]"
                  >
                    {copy.rightSidebar.viewAllTasks}
                  </Link>
                </div>
              </section>

              <section className="rounded-2xl border border-[#dde2ea] bg-white p-4">
                <h3 className="mb-3 text-2xl font-semibold tracking-[-0.01em] text-[#1f2937]">{copy.rightSidebar.savedVendors}</h3>
                <div className="space-y-3">
                  {sidebarFavorites.slice(0, 3).map((card) => (
                    <Link
                      key={card.id}
                      href={toShellVendorHref(locale, card.href)}
                      className="block overflow-hidden rounded-2xl border border-[#e2e7ef] bg-[#f9fbfe] p-2.5 transition hover:border-[#cfd8e5] hover:bg-white"
                    >
                      <div className="relative h-36 overflow-hidden rounded-xl bg-zinc-200">
                        <Image src={card.image} alt={card.title} fill sizes="280px" className="object-cover" />
                      </div>
                      <p className="mt-2.5 line-clamp-2 text-[15px] font-semibold leading-[1.25] text-[#1f2937]">{card.title}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="rounded-full border border-[#d8dfea] bg-white px-2 py-0.5 text-[11px] font-medium text-[#6f7f96]">
                          {card.categoryLabel || 'Vendor'}
                        </span>
                        <span className="inline-flex min-w-0 items-center gap-1 text-[11px] font-medium text-[#8a96ab]">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{card.location || 'Morocco'}</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/${locale}/dashboard?view=favorites`}
                    className="grid h-14 place-items-center rounded-xl border-2 border-dashed border-[#cfd6e1] bg-[#f4f7fc] text-3xl font-light text-[#7f8da3]"
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
