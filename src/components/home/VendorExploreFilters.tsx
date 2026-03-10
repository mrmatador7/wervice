'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

type Item = {
  value: string;
  label: string;
};

type CategoryItem = {
  slug: string;
  label: string;
};

type VendorExploreFiltersProps = {
  locale: string;
  q: string;
  selectedCity?: string;
  categorySlug?: string | null;
  allCitiesLabel: string;
  allCategoriesLabel: string;
  cityItems: Item[];
  categoryItems: CategoryItem[];
  basePath?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
};

export default function VendorExploreFilters({
  locale,
  q,
  selectedCity,
  categorySlug,
  allCitiesLabel,
  allCategoriesLabel,
  cityItems,
  categoryItems,
  basePath = 'vendors',
  showSearch = false,
  searchPlaceholder = 'Search vendor names or styles...',
}: VendorExploreFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSwitching, setIsSwitching] = useState(false);
  const [categorySliderMode, setCategorySliderMode] = useState(false);
  const [citySliderMode, setCitySliderMode] = useState(false);
  const categoryWrapRef = useRef<HTMLDivElement | null>(null);
  const categoryNavRef = useRef<HTMLElement | null>(null);
  const cityWrapRef = useRef<HTMLDivElement | null>(null);
  const cityRowRef = useRef<HTMLDivElement | null>(null);
  const normalizedBasePath = basePath.replace(/^\/+/, '');
  const baseHref = `/${locale}/${normalizedBasePath}`;

  useEffect(() => {
    setIsSwitching(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const computeModes = () => {
      if (categoryWrapRef.current && categoryNavRef.current) {
        setCategorySliderMode(categoryNavRef.current.scrollWidth > categoryWrapRef.current.clientWidth + 4);
      }
      if (cityWrapRef.current && cityRowRef.current) {
        setCitySliderMode(cityRowRef.current.scrollWidth > cityWrapRef.current.clientWidth + 4);
      }
    };

    computeModes();
    window.addEventListener('resize', computeModes);
    return () => window.removeEventListener('resize', computeModes);
  }, [categoryItems, cityItems, selectedCity, categorySlug, q]);

  function navigateSmooth(href: string) {
    if (href === `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`) return;
    setIsSwitching(true);
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as Document & { startViewTransition?: (cb: () => void) => void }).startViewTransition?.(() => {
        router.push(href);
      });
      return;
    }
    router.push(href);
  }

  function handleLinkClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    navigateSmooth(href);
  }

  return (
    <div className={`transition-opacity duration-300 ${isSwitching ? 'opacity-70' : 'opacity-100'}`}>
      <div
        ref={categoryWrapRef}
        className={`mb-6 border-b border-[#d7deea] ${categorySliderMode ? 'overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : 'overflow-visible'}`}
      >
        {showSearch && (
          <form action={baseHref} method="get" className="mb-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#8a99ad]" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder={searchPlaceholder}
                className="h-14 w-full rounded-[22px] border border-[#ccd6e4] bg-white pl-14 pr-4 text-base text-[#33475f] outline-none transition placeholder:text-[#7f8fa6] focus:border-[#11190C] md:text-lg"
              />
              {selectedCity && <input type="hidden" name="city" value={selectedCity} />}
              {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            </div>
          </form>
        )}

        <nav
          ref={categoryNavRef}
          className={`flex items-center gap-1 ${categorySliderMode ? 'min-w-max flex-nowrap' : 'w-full flex-wrap'}`}
        >
          {(() => {
            const href = `${baseHref}${selectedCity ? `?city=${encodeURIComponent(selectedCity)}` : ''}${q ? `${selectedCity ? '&' : '?'}q=${encodeURIComponent(q)}` : ''}`;
            return (
              <Link
                href={href}
                onClick={(event) => handleLinkClick(event, href)}
                className={`-mb-px inline-flex items-center px-4 py-3.5 text-base font-semibold transition ${
                  !categorySlug
                    ? 'border-b-2 border-[#e0703d] text-[#e0703d]'
                    : 'border-b-2 border-transparent text-[#6d7f98] hover:text-[#33475f]'
                }`}
              >
                {allCategoriesLabel}
              </Link>
            );
          })()}
          {categoryItems.map((category) => {
            const isActive = categorySlug === category.slug;
            const href = `${baseHref}?category=${category.slug}${selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
            return (
              <Link
                key={category.slug}
                href={href}
                onClick={(event) => handleLinkClick(event, href)}
                className={`-mb-px inline-flex items-center px-4 py-3.5 text-base font-semibold transition ${
                  isActive
                    ? 'border-b-2 border-[#e0703d] text-[#e0703d]'
                    : 'border-b-2 border-transparent text-[#6d7f98] hover:text-[#33475f]'
                }`}
              >
                {category.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        ref={cityWrapRef}
        className={`mt-6 ${citySliderMode ? 'overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : 'overflow-visible'}`}
      >
        <div
          ref={cityRowRef}
          className={`flex gap-2.5 ${citySliderMode ? 'min-w-max flex-nowrap pb-1' : 'flex-wrap'}`}
        >
        {(() => {
          const href = `${baseHref}${q ? `?q=${encodeURIComponent(q)}` : ''}`;
          return (
            <Link
              href={href}
              onClick={(event) => handleLinkClick(event, href)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !selectedCity ? 'bg-[#11190C] text-[#D9FF0A]' : 'border border-[#d2d9e5] bg-white text-[#33475f] hover:bg-[#eef2f8]'
              }`}
            >
              {allCitiesLabel}
            </Link>
          );
        })()}
        {cityItems.map((city) => {
          const isActive = selectedCity === city.value;
          const href = `${baseHref}?city=${encodeURIComponent(city.value)}${categorySlug ? `&category=${categorySlug}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
          return (
            <Link
              key={city.value}
              href={href}
              onClick={(event) => handleLinkClick(event, href)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive ? 'bg-[#11190C] text-[#D9FF0A]' : 'border border-[#d2d9e5] bg-white text-[#33475f] hover:bg-[#eef2f8]'
              }`}
            >
              {city.label}
            </Link>
          );
        })}
        </div>
      </div>
    </div>
  );
}
