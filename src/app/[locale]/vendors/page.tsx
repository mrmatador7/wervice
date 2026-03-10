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
import VideoExperienceGrid from '@/components/home/VideoExperienceGrid';
import VendorExploreFilters from '@/components/home/VendorExploreFilters';
import {
  WERVICE_CATEGORIES,
  labelForCategory,
  normalizeCategory,
  slugToDbCategory,
} from '@/lib/categories';
import { vendorUrl } from '@/lib/vendor-url';
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

function getFileExtension(url: string): string {
  const clean = url.split('#')[0];
  const path = clean.split('?')[0];
  const parts = path.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

function isVideoFile(url: string): boolean {
  const ext = getFileExtension(url);
  return ['mp4', 'webm', 'm4v'].includes(ext);
}

function videoPriority(url: string): number {
  const lower = url.toLowerCase();
  const ext = getFileExtension(url);
  const hasVideoHint = /(vid|video|reel|clip)/.test(lower);
  const hasLogoHint = /(logo|cover|banner|profile)/.test(lower);
  if (hasVideoHint) return -2;
  if (hasLogoHint) return 8;
  if (ext === 'mp4') return 0;
  if (ext === 'webm') return 1;
  if (ext === 'm4v') return 2;
  return 10;
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
  const allowedViews = new Set(['overview', 'favorites', 'wedding-date', 'checklist', 'guest-list', 'budget-planner', 'planning-tools', 'settings', 'auth', 'inspiration', 'videos']);
  const safeView = allowedViews.has(view) ? view : 'overview';

  const cityParam = firstParam(resolvedSearchParams.city);
  const q = (firstParam(resolvedSearchParams.q) || '').trim();
  const categorySlug = normalizeCategory(firstParam(resolvedSearchParams.category) || null);
  const dbCategory = categorySlug ? slugToDbCategory(categorySlug) : null;

  const validCities = new Set(MOROCCAN_CITIES.filter((c) => c.value !== 'all').map((c) => c.value));
  const selectedCity = cityParam && validCities.has(cityParam) ? cityParam : undefined;

  const shouldLoadVendorGrid = safeView === 'overview';
  const shouldLoadVideos = safeView === 'videos';

  const { vendors, hasMore } = await fetchVendors({
    city: selectedCity,
    category: dbCategory || undefined,
    q: q || undefined,
    sort: 'newest',
    limit: shouldLoadVendorGrid ? 24 : shouldLoadVideos ? 120 : 8,
  });

  const videoVendors = vendors
    .map((vendor) => {
      const gallery = (vendor.gallery_urls || vendor.gallery_photos || []).filter(Boolean);
      const preferredVideos = ((vendor.video_urls || []).filter(Boolean)).filter((url) => isVideoFile(url));
      const fallbackVideos = preferredVideos.length > 0 ? [] : gallery.filter((url) => isVideoFile(url));
      const allVideos = [...preferredVideos, ...fallbackVideos];
      const sortedVideos = Array.from(new Set(allVideos))
        .sort((a, b) => videoPriority(a) - videoPriority(b));
      const videoUrl = sortedVideos[0];
      if (!videoUrl) return null;

      const posterUrl =
        vendor.profile_photo_url ||
        gallery.find((url) => !isVideoFile(url)) ||
        '/images/sample/venues-1.jpg';

      return {
        id: vendor.id,
        href: vendorUrl(vendor, locale),
        title: vendor.business_name,
        categorySlug: normalizeCategory(vendor.category) || 'all',
        location: localizeCityLabel(vendor.city, locale),
        cityValue: vendor.city,
        categoryLabel: labelForCategory(vendor.category, locale).toUpperCase(),
        logoUrl: vendor.profile_photo_url || posterUrl,
        posterUrl,
        videoUrl,
        videoUrls: sortedVideos,
      };
    })
    .filter(Boolean) as Array<{
    id: string;
    href: string;
    title: string;
    categorySlug: string;
    location: string;
    cityValue: string;
    categoryLabel: string;
    logoUrl: string;
    posterUrl: string;
    videoUrl: string;
    videoUrls: string[];
  }>;
  const savedCards = vendors.slice(0, 12).map((vendor) => ({
    id: vendor.id,
    title: vendor.business_name,
    subtitle: localizeCityLabel(vendor.city, locale),
    image:
      vendor.profile_photo_url ||
      vendor.gallery_urls?.[0] ||
      vendor.gallery_photos?.[0] ||
      '/images/sample/venues-1.jpg',
    href: vendorUrl(vendor, locale),
    location: localizeCityLabel(vendor.city, locale),
    categoryLabel: labelForCategory(vendor.category, locale),
    logoUrl: vendor.profile_photo_url,
    galleryImages: vendor.gallery_urls || vendor.gallery_photos || [],
  }));

  const inspirationArticles = getAll(locale).slice(0, 15);
  const activeMarketplace = safeView === 'inspiration'
    ? 'inspiration'
    : safeView === 'videos'
      ? 'videos'
      : (categorySlug === 'venues' ? 'venues' : 'all-vendors');
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
        <FavoritesView locale={locale} />
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
                        href={`/${locale}/planning-tools?chapter=${prevPlanningChapter.slug}`}
                        className="rounded-xl border border-[#d2d9e5] bg-white px-4 py-2 text-sm font-semibold text-[#33475f]"
                      >
                        {copy.planning.previous}
                      </Link>
                    )}
                    {nextPlanningChapter && (
                      <Link
                        href={`/${locale}/planning-tools?chapter=${nextPlanningChapter.slug}`}
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
                  href={`/${locale}/planning-tools?chapter=${step.chapterSlug}`}
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
                  href={`/${locale}/planning-tools?chapter=${chapter.slug}`}
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

      {safeView === 'videos' && (
        <section className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">{copy.nav.videos}</h1>
            <p className="mt-2 text-lg text-[#4a5c74]">Watch vendors that shared video highlights.</p>
          </div>
          <VendorExploreFilters
            locale={locale}
            q={q}
            selectedCity={selectedCity}
            categorySlug={categorySlug}
            allCitiesLabel={copy.vendors.allCities}
            allCategoriesLabel={copy.vendors.allCategories}
            cityItems={MOROCCAN_CITIES.filter((c) => c.value !== 'all').map((c) => ({
              value: c.value,
              label: localizeCityLabel(c.label, locale),
            }))}
            categoryItems={WERVICE_CATEGORIES.map((category) => ({
              slug: category.slug,
              label: labelForCategory(category.slug, locale),
            }))}
            basePath="videos"
            searchPlaceholder={copy.vendors.searchPlaceholder}
          />

          <div className="mt-8">
            {videoVendors.length === 0 ? (
              <div className="rounded-2xl border border-[#d7deea] bg-white p-6 text-[#5f6f84]">
                No vendor videos found yet.
              </div>
            ) : (
              <VideoExperienceGrid
                vendors={videoVendors.map((vendor) => ({
                  id: vendor.id,
                  href: vendor.href,
                  title: vendor.title,
                  categoryLabel: vendor.categoryLabel,
                  categorySlug: vendor.categorySlug,
                  location: vendor.location,
                  cityValue: vendor.cityValue,
                  logoUrl: vendor.logoUrl,
                  videoUrl: vendor.videoUrl,
                  videoUrls: vendor.videoUrls,
                  posterUrl: vendor.posterUrl,
                  galleryImages: vendors
                    .find((entry) => entry.id === vendor.id)
                    ?.gallery_urls?.slice(0, 8)
                    ?.filter((url) => !isVideoFile(url)),
                }))}
              />
            )}
          </div>
        </section>
      )}

      {safeView === 'overview' && (
      <section className="mx-auto max-w-7xl">
        <form className="mt-3 max-w-3xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a99ad]" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder={copy.vendors.searchPlaceholder}
              className="h-11 w-full rounded-xl border border-[#d7deea] bg-white pl-12 pr-4 text-base outline-none transition focus:border-[#11190C]"
            />
            {selectedCity && <input type="hidden" name="city" value={selectedCity} />}
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          </div>
        </form>

        <VendorExploreFilters
          locale={locale}
          q={q}
          selectedCity={selectedCity}
          categorySlug={categorySlug}
          allCitiesLabel={copy.vendors.allCities}
          allCategoriesLabel={copy.vendors.allCategories}
          cityItems={MOROCCAN_CITIES.filter((c) => c.value !== 'all').map((c) => ({
            value: c.value,
            label: localizeCityLabel(c.label, locale),
          }))}
          categoryItems={WERVICE_CATEGORIES.map((category) => ({
            slug: category.slug,
            label: labelForCategory(category.slug, locale),
          }))}
        />

        {vendors.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#d7deea] bg-white p-6 text-[#5f6f84]">
            {copy.vendors.noVendorsFound}
          </div>
        ) : (
          <InfiniteVendorGrid
            key={`vendors-grid:${selectedCity || 'all'}:${dbCategory || 'all'}:${q || ''}`}
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
