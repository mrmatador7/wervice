import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { Search } from 'lucide-react';
import DashboardShell from '@/components/home/DashboardShell';
import InfiniteVendorGrid from '@/components/home/InfiniteVendorGrid';
import InspirationArticleGrid from '@/components/home/InspirationArticleGrid';
import AccountToolViews from '@/components/home/AccountToolViews';
import FavoritesView from '@/components/home/FavoritesView';
import WeddingChecklistView from '@/components/home/WeddingChecklistView';
import AccountSettingsView from '@/components/home/AccountSettingsView';
import AuthAccessView from '@/components/home/AuthAccessView';
import {
  WERVICE_CATEGORIES,
  labelForCategory,
  normalizeCategory,
  slugToDbCategory,
} from '@/lib/categories';
import { fetchVendors } from '@/lib/supabase/vendors';
import { MOROCCAN_CITIES, localizeCityLabel } from '@/lib/types/vendor';
import { getAll } from '@/data/articles';
import { getAllChapters, getTimelineSteps } from '@/data/planningChapters';
import { getDashboardCopy, interpolateCopy } from '@/components/home/dashboard-i18n';
import { localeAlternates, toAbsoluteUrl } from '@/lib/seo/site-url';

interface VendorsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function generateMetadata({ params }: VendorsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = getDashboardCopy(locale);
  return {
    title: `${copy.vendors.title} | Wervice`,
    description: copy.vendors.subtitle,
    alternates: {
      canonical: toAbsoluteUrl(`/${locale}/vendors`),
      languages: localeAlternates('/vendors'),
    },
  };
}

export default async function VendorsPage({ params, searchParams }: VendorsPageProps) {
  const { locale } = await params;
  const copy = getDashboardCopy(locale);
  const resolvedSearchParams = await searchParams;
  const view = firstParam(resolvedSearchParams.view) || 'overview';
  const chapterParam = firstParam(resolvedSearchParams.chapter);
  const allowedViews = new Set(['overview', 'favorites', 'wedding-date', 'checklist', 'guest-list', 'budget-planner', 'planning-tools', 'settings', 'auth', 'inspiration']);
  const safeView = allowedViews.has(view) ? view : 'overview';

  const cityParam = firstParam(resolvedSearchParams.city);
  const q = (firstParam(resolvedSearchParams.q) || '').trim();
  const categorySlug = normalizeCategory(firstParam(resolvedSearchParams.category) || null);
  const dbCategory = categorySlug ? slugToDbCategory(categorySlug) : null;

  const validCities = new Set(MOROCCAN_CITIES.filter((c) => c.value !== 'all').map((c) => c.value));
  const selectedCity = cityParam && validCities.has(cityParam) ? cityParam : undefined;

  const shouldLoadVendorGrid = safeView === 'overview';

  const { vendors, hasMore } = await fetchVendors({
    city: selectedCity,
    category: dbCategory || undefined,
    q: q || undefined,
    sort: 'newest',
    limit: shouldLoadVendorGrid ? 24 : 8,
  });

  const savedCards = vendors.slice(0, 12).map((vendor) => ({
    id: vendor.id,
    title: vendor.business_name,
    subtitle: localizeCityLabel(vendor.city, locale),
    image:
      vendor.profile_photo_url ||
      vendor.gallery_urls?.[0] ||
      vendor.gallery_photos?.[0] ||
      '/images/sample/venues-1.jpg',
    href: `/${locale}/dashboard?view=overview&vendor=${encodeURIComponent(vendor.slug)}`,
    location: localizeCityLabel(vendor.city, locale),
    categoryLabel: labelForCategory(vendor.category, locale),
    logoUrl: vendor.profile_photo_url,
    galleryImages: vendor.gallery_urls || vendor.gallery_photos || [],
  }));

  const inspirationArticles = getAll(locale).slice(0, 15);
  const activeMarketplace = safeView === 'inspiration' ? 'inspiration' : (categorySlug === 'venues' ? 'venues' : 'all-vendors');
  const activeItem = ['overview', 'favorites', 'wedding-date', 'checklist', 'guest-list', 'budget-planner', 'planning-tools'].includes(safeView)
    ? safeView
    : activeMarketplace;
  const planningChapters = getAllChapters();
  const planningSteps = getTimelineSteps();
  const selectedPlanningChapter = chapterParam
    ? planningChapters.find((chapter) => chapter.slug === chapterParam) || null
    : null;
  const selectedPlanningStep = selectedPlanningChapter
    ? planningSteps.find((step) => step.chapterSlug === selectedPlanningChapter.slug) || null
    : null;
  const selectedPlanningIndex = selectedPlanningChapter
    ? planningChapters.findIndex((chapter) => chapter.slug === selectedPlanningChapter.slug)
    : -1;
  const prevPlanningChapter =
    selectedPlanningIndex > 0 ? planningChapters[selectedPlanningIndex - 1] : null;
  const nextPlanningChapter =
    selectedPlanningIndex >= 0 && selectedPlanningIndex < planningChapters.length - 1
      ? planningChapters[selectedPlanningIndex + 1]
      : null;

  return (
    <DashboardShell locale={locale} savedCards={savedCards} activeItem={activeItem}>
      {safeView === 'favorites' && (
        <FavoritesView locale={locale} favorites={savedCards} />
      )}

      {safeView === 'checklist' && (
        <WeddingChecklistView locale={locale} />
      )}

      {(safeView === 'wedding-date' || safeView === 'guest-list' || safeView === 'budget-planner') && (
        <AccountToolViews locale={locale} view={safeView} />
      )}

      {safeView === 'settings' && (
        <AccountSettingsView locale={locale} />
      )}

      {safeView === 'auth' && (
        <AuthAccessView locale={locale} />
      )}

      {safeView === 'planning-tools' && (
        <section className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">{copy.planning.title}</h1>
          <p className="mt-3 text-lg text-[#4a5c74]">{copy.planning.subtitle}</p>

          {selectedPlanningChapter && (
            <div className="mt-8 rounded-3xl border border-[#d7deea] bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
                <div className="relative h-64 overflow-hidden rounded-2xl bg-[#eef2f7]">
                  <Image
                    src={selectedPlanningChapter.coverImage}
                    alt={selectedPlanningChapter.title}
                    fill
                    sizes="380px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="inline-flex rounded-full bg-[#11190C] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#D9FF0A]">
                    {interpolateCopy(copy.planning.chapterOf, { current: selectedPlanningChapter.order, total: planningChapters.length })}
                  </p>
                  <h2 className="mt-3 text-4xl font-black leading-tight text-[#11190C]">{selectedPlanningChapter.title}</h2>
                  <p className="mt-2 text-lg text-[#4a5c74]">{selectedPlanningChapter.excerpt}</p>
                  <p className="mt-2 text-sm font-semibold text-[#6f7f95]">{interpolateCopy(copy.planning.minRead, { count: selectedPlanningChapter.readTime })}</p>

                  {selectedPlanningStep?.tasks?.length ? (
                    <div className="mt-5 rounded-2xl border border-[#d7deea] bg-[#F8FAFC] p-4">
                      <h3 className="text-lg font-bold text-[#11190C]">{copy.planning.doThisNow}</h3>
                      <ul className="mt-3 space-y-2">
                        {selectedPlanningStep.tasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[#3f5671]">
                            <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#D9FF0A]" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-3">
                    {prevPlanningChapter && (
                      <Link
                        href={`/${locale}/dashboard?view=planning-tools&chapter=${prevPlanningChapter.slug}`}
                        className="rounded-xl border border-[#d2d9e5] bg-white px-4 py-2 text-sm font-semibold text-[#33475f]"
                      >
                        {copy.planning.previous}
                      </Link>
                    )}
                    {nextPlanningChapter && (
                      <Link
                        href={`/${locale}/dashboard?view=planning-tools&chapter=${nextPlanningChapter.slug}`}
                        className="rounded-xl bg-[#11190C] px-4 py-2 text-sm font-semibold text-[#D9FF0A]"
                      >
                        {copy.planning.next}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-3xl border border-[#d7deea] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#11190C]">{copy.planning.timeline}</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {planningSteps.slice(0, 12).map((step) => (
                <Link
                  key={step.chapterSlug}
                  href={`/${locale}/dashboard?view=planning-tools&chapter=${step.chapterSlug}`}
                  className="rounded-2xl border border-[#d7deea] bg-[#F8FAFC] p-4 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <div className="text-2xl">{step.icon}</div>
                  <p className="mt-2 text-sm font-semibold text-[#6f7f95]">{step.months === 0 ? copy.planning.final : interpolateCopy(copy.planning.months, { count: step.months })}</p>
                  <p className="mt-1 text-lg font-bold text-[#11190C]">{step.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-[#5f6f84]">{step.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-[#d7deea] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#11190C]">{copy.planning.guideChapters}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {planningChapters.map((chapter) => (
                <Link
                  key={chapter.slug}
                  href={`/${locale}/dashboard?view=planning-tools&chapter=${chapter.slug}`}
                  className="rounded-2xl border border-[#d7deea] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-[#6f7f95]">{interpolateCopy(copy.planning.minRead, { count: chapter.readTime })}</p>
                  <p className="mt-1 text-lg font-bold text-[#11190C]">{chapter.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-[#5f6f84]">{chapter.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {safeView === 'inspiration' && (
        <InspirationArticleGrid locale={locale} articles={inspirationArticles} />
      )}

      {safeView === 'overview' && (
      <section className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">{copy.vendors.title}</h1>
        <p className="mt-3 text-lg text-[#4a5c74]">{copy.vendors.subtitle}</p>

        <form className="mt-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a99ad]" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder={copy.vendors.searchPlaceholder}
              className="h-14 w-full rounded-2xl border border-[#d7deea] bg-white pl-12 pr-4 text-base outline-none transition focus:border-[#11190C]"
            />
            {selectedCity && <input type="hidden" name="city" value={selectedCity} />}
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          </div>
        </form>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link
            href={`/${locale}/vendors${q ? `?q=${encodeURIComponent(q)}` : ''}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !selectedCity ? 'bg-[#11190C] text-[#D9FF0A]' : 'border border-[#d2d9e5] bg-white text-[#33475f] hover:bg-[#eef2f8]'
            }`}
          >
            {copy.vendors.allCities}
          </Link>
          {MOROCCAN_CITIES.filter((c) => c.value !== 'all').map((city) => {
            const isActive = selectedCity === city.value;
            return (
              <Link
                key={city.value}
                href={`/${locale}/vendors?city=${encodeURIComponent(city.value)}${categorySlug ? `&category=${categorySlug}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-[#11190C] text-[#D9FF0A]' : 'border border-[#d2d9e5] bg-white text-[#33475f] hover:bg-[#eef2f8]'
                }`}
              >
                {localizeCityLabel(city.label, locale)}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link
            href={`/${locale}/vendors${selectedCity ? `?city=${encodeURIComponent(selectedCity)}` : ''}${q ? `${selectedCity ? '&' : '?'}q=${encodeURIComponent(q)}` : ''}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !categorySlug ? 'bg-[#11190C] text-[#D9FF0A]' : 'border border-[#d2d9e5] bg-white text-[#33475f] hover:bg-[#eef2f8]'
            }`}
          >
            {copy.vendors.allCategories}
          </Link>
          {WERVICE_CATEGORIES.map((category) => {
            const isActive = categorySlug === category.slug;
            return (
              <Link
                key={category.slug}
                href={`/${locale}/vendors?category=${category.slug}${selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-[#11190C] text-[#D9FF0A]' : 'border border-[#d2d9e5] bg-white text-[#33475f] hover:bg-[#eef2f8]'
                }`}
              >
                {labelForCategory(category.slug, locale)}
              </Link>
            );
          })}
        </div>

        {vendors.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#d7deea] bg-white p-6 text-[#5f6f84]">
            {copy.vendors.noVendorsFound}
          </div>
        ) : (
          <InfiniteVendorGrid
            locale={locale}
            initialVendors={vendors}
            initialHasMore={hasMore}
            city={selectedCity}
            category={dbCategory || undefined}
            q={q || undefined}
          />
        )}
      </section>
      )}
    </DashboardShell>
  );
}
