import Link from 'next/link';
import type { ShellCard } from '@/components/home/DashboardShell';
import VendorBrowseCard from '@/components/home/VendorBrowseCard';

type FavoritesViewProps = {
  locale: string;
  favorites: ShellCard[];
};

function toShellVendorHref(locale: string, href: string) {
  if (!href) return `/${locale}/vendors?view=overview`;
  if (href.startsWith(`/${locale}/vendors`)) return href;

  const clean = href.split('?')[0].split('#')[0];
  const parts = clean.split('/').filter(Boolean);
  if (parts.length >= 4 && parts[0] === locale) {
    const slug = parts[parts.length - 1];
    if (slug) return `/${locale}/vendors?view=overview&vendor=${encodeURIComponent(slug)}`;
  }
  return href;
}

export default function FavoritesView({ locale, favorites }: FavoritesViewProps) {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">Favorites</h1>
          <p className="mt-2 text-lg text-[#4a5c74]">Your saved vendors in one place.</p>
        </div>
        <div className="rounded-full border border-[#d2d9e5] bg-white px-4 py-2 text-sm font-semibold text-[#33475f]">
          {favorites.length} saved
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-3xl border border-[#d7deea] bg-white p-10 text-center">
          <p className="text-xl font-bold text-[#11190C]">No favorites yet</p>
          <p className="mt-2 text-[#5f6f84]">Save vendors from listings to build your shortlist.</p>
          <Link
            href={`/${locale}/vendors?view=overview`}
            className="mt-6 inline-flex rounded-xl bg-[#11190C] px-5 py-3 text-sm font-bold text-[#D9FF0A]"
          >
            Browse Vendors
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {favorites.map((card) => (
            <VendorBrowseCard
              key={card.id}
              href={toShellVendorHref(locale, card.href)}
              title={card.title}
              location={card.location || card.subtitle || 'Morocco'}
              categoryLabel={card.categoryLabel || 'Vendor'}
              logoUrl={card.logoUrl || card.image}
              galleryImages={card.galleryImages?.length ? card.galleryImages : [card.image]}
            />
          ))}
        </div>
      )}
    </section>
  );
}
