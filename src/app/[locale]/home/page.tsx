import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck2, Heart, MapPin, Search, Sparkles, Users } from 'lucide-react';
import { labelForCategory } from '@/lib/categories';
import { fetchVendors } from '@/lib/supabase/vendors';
import { localizeCityLabel } from '@/lib/types/vendor';
import { vendorUrl } from '@/lib/vendor-url';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { vendors } = await fetchVendors({ limit: 12, sort: 'newest' });

  const featured = (vendors || []).slice(0, 6).map((vendor) => ({
    id: vendor.id,
    name: vendor.business_name,
    city: localizeCityLabel(vendor.city, locale),
    category: labelForCategory(vendor.category, locale),
    href: vendorUrl(vendor, locale),
    image:
      vendor.profile_photo_url ||
      vendor.gallery_urls?.[0] ||
      vendor.gallery_photos?.[0] ||
      '/images/sample/venues-1.jpg',
  }));

  return (
    <main className="min-h-screen bg-[#f7f4fb] text-[#11190C]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.95),rgba(255,255,255,0)_42%),radial-gradient(circle_at_75%_20%,rgba(244,215,255,0.45),rgba(244,215,255,0)_40%),radial-gradient(circle_at_30%_75%,rgba(226,213,255,0.35),rgba(226,213,255,0)_45%)]" />

      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
          <Link href={`/${locale}`}>
            <Image src="/wervice-logo-black.png" alt="Wervice" width={150} height={40} className="h-8 w-auto" />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href={`/${locale}/vendors`} className="text-sm font-medium text-[#6b7280] hover:text-[#11190C]">Account</Link>
            <Link href={`/${locale}/home`} className="text-sm font-semibold text-[#11190C]">Home</Link>
          </nav>
          <Link href={`/${locale}/vendors`} className="inline-flex items-center gap-2 rounded-full border border-[#d6d9e2] bg-white px-3 py-1.5 text-sm font-semibold">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#d9ff0a] text-[11px] font-bold text-[#11190C]">W</span>
            Wervice
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-14 pt-4 text-center sm:px-6">
        <p className="text-base font-bold text-[#dd4fd6]">Wervice Home</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">Plan your wedding in one place</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#5e6472]">
          Discover vendors, build your checklist, save favorites, and organize your wedding journey faster.
        </p>

        <div className="mx-auto mt-8 flex w-fit items-center gap-1 rounded-full border border-[#e8e2f0] bg-white p-1 shadow-sm">
          <span className="rounded-full px-5 py-2 text-lg font-medium text-[#4b5563]">Vendors</span>
          <span className="rounded-full bg-[#11190C] px-5 py-2 text-lg font-semibold text-white">Checklist</span>
          <span className="rounded-full bg-[#f7cdf2] px-3 py-1 text-sm font-semibold text-[#4f2f4f]">All in one dashboard</span>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <article className="rounded-[28px] border border-[#e2dfea] bg-white/80 p-4 shadow-[0_10px_30px_rgba(17,25,12,0.05)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e4e6ef] bg-white px-3 py-1 text-sm font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-[#a3aab8]" />
              Core Tools
            </div>
            <div className="mt-4 rounded-3xl border border-[#e3e6f1] bg-white p-6">
              <h2 className="text-3xl font-black">Organize it all</h2>
              <p className="mt-2 text-lg text-[#6b7280]">Everything you need to keep planning on track</p>
              <div className="mt-6 space-y-3 text-lg text-[#444b59]">
                {[
                  'Track tasks with wedding checklist',
                  'Save and compare favorite vendors',
                  'Manage guest list and budget',
                  'Switch between cities and categories',
                  'Keep all planning in one flow',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0d6ee] text-[#7a4a78]">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-[#e4d3ea] bg-[linear-gradient(145deg,#efdaf8,#e6e8ff)] p-4 shadow-[0_14px_36px_rgba(129,99,255,0.18)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e4e6ef] bg-white px-3 py-1 text-sm font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-[#c38bce]" />
              Quick Start
            </div>
            <div className="mt-4 rounded-3xl border border-[#dccfed] bg-white p-6">
              <h2 className="text-3xl font-black">Start in seconds</h2>
              <p className="mt-2 text-lg text-[#6b7280]">Pick a path and continue inside your dashboard</p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link href={`/${locale}/vendors`} className="rounded-2xl border border-[#e0e4ef] bg-[#f9fbff] p-4">
                  <Search className="h-5 w-5" />
                  <p className="mt-2 text-base font-bold">Browse Vendors</p>
                </Link>
                <Link href={`/${locale}/wedding-checklist`} className="rounded-2xl border border-[#e0e4ef] bg-[#f9fbff] p-4">
                  <CalendarCheck2 className="h-5 w-5" />
                  <p className="mt-2 text-base font-bold">Open Checklist</p>
                </Link>
                <Link href={`/${locale}/favorites`} className="rounded-2xl border border-[#e0e4ef] bg-[#f9fbff] p-4">
                  <Heart className="h-5 w-5" />
                  <p className="mt-2 text-base font-bold">View Favorites</p>
                </Link>
                <Link href={`/${locale}/guest-list`} className="rounded-2xl border border-[#e0e4ef] bg-[#f9fbff] p-4">
                  <Users className="h-5 w-5" />
                  <p className="mt-2 text-base font-bold">Guest List</p>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-10 w-full max-w-5xl px-4 pb-16 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight">Featured vendors</h2>
          <Link href={`/${locale}/vendors`} className="text-sm font-bold text-[#33475f] hover:text-[#11190C]">View all</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((vendor) => (
            <Link key={vendor.id} href={vendor.href} className="group overflow-hidden rounded-[24px] border border-[#dbe3ef] bg-white">
              <div className="relative h-48 overflow-hidden bg-[#edf1f6]">
                <Image src={vendor.image} alt={vendor.name} fill sizes="(max-width: 1280px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute left-3 top-3 rounded-full bg-[#11190C] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#D9FF0A]">
                  {vendor.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 text-2xl font-black tracking-tight">{vendor.name}</h3>
                <p className="mt-1 inline-flex items-center gap-1 text-base font-semibold text-[#5f6f84]">
                  <MapPin className="h-4 w-4" />
                  {vendor.city}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
