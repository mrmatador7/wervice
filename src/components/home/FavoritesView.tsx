'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { ShellCard } from '@/components/home/DashboardShell';
import VendorBrowseCard from '@/components/home/VendorBrowseCard';
import { useUser } from '@/contexts/UserContext';
import { getDashboardCopy } from '@/components/home/dashboard-i18n';

type FavoritesViewProps = {
  locale: string;
};

function toShellVendorHref(locale: string, href: string) {
  if (!href) return `/${locale}/vendors`;
  if (href.startsWith(`/${locale}/vendors?`)) {
    try {
      const url = new URL(href, 'https://wervice.local');
      const slug = url.searchParams.get('vendor');
      if (slug) return `/${locale}/vendors/${encodeURIComponent(slug)}`;
    } catch {
      // ignore and use existing href below
    }
    return href;
  }

  const clean = href.split('?')[0].split('#')[0];
  const parts = clean.split('/').filter(Boolean);
  if (parts.length >= 4 && parts[0] === locale) {
    const slug = parts[parts.length - 1];
    if (slug) return `/${locale}/vendors/${encodeURIComponent(slug)}`;
  }
  return href;
}

export default function FavoritesView({ locale }: FavoritesViewProps) {
  const copy = getDashboardCopy(locale);
  const { user } = useUser();
  const [liveFavorites, setLiveFavorites] = useState<ShellCard[]>([]);

  useEffect(() => {
    if (!user?.id) {
      setLiveFavorites([]);
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
        setLiveFavorites(sorted);
      } catch {
        setLiveFavorites([]);
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

  const cards = useMemo(() => {
    if (!user?.id) return [];
    return liveFavorites;
  }, [user?.id, liveFavorites]);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">{copy.favorites.title}</h1>
          <p className="mt-2 text-lg text-[#4a5c74]">{copy.favorites.subtitle}</p>
        </div>
        <div className="rounded-full border border-[#d2d9e5] bg-white px-4 py-2 text-sm font-semibold text-[#33475f]">
          {cards.length} {copy.favorites.saved}
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-3xl border border-[#d7deea] bg-white p-10 text-center">
          <p className="text-xl font-bold text-[#11190C]">{copy.favorites.emptyTitle}</p>
          <p className="mt-2 text-[#5f6f84]">{copy.favorites.emptySubtitle}</p>
          <Link
            href={`/${locale}/vendors`}
            className="mt-6 inline-flex rounded-xl bg-[#11190C] px-5 py-3 text-sm font-bold text-[#D9FF0A]"
          >
            {copy.favorites.browseVendors}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <VendorBrowseCard
              key={card.id}
              vendorId={card.id}
              href={toShellVendorHref(locale, card.href)}
              title={card.title}
              location={card.location || card.subtitle || copy.favorites.defaultLocation}
              categoryLabel={card.categoryLabel || copy.favorites.defaultCategory}
              logoUrl={card.logoUrl || card.image}
              galleryImages={card.galleryImages?.length ? card.galleryImages : [card.image]}
            />
          ))}
        </div>
      )}
    </section>
  );
}
