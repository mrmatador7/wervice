'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
}: VendorExploreFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    setIsSwitching(false);
  }, [pathname, searchParams]);

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
      <div className="mb-6 overflow-x-auto border-b border-[#d7deea] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <nav className="flex min-w-max items-center gap-1">
          {(() => {
            const href = `/${locale}/vendors${selectedCity ? `?city=${encodeURIComponent(selectedCity)}` : ''}${q ? `${selectedCity ? '&' : '?'}q=${encodeURIComponent(q)}` : ''}`;
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
            const href = `/${locale}/vendors?category=${category.slug}${selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
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

      <div className="mt-6 flex flex-wrap gap-2.5">
        {(() => {
          const href = `/${locale}/vendors${q ? `?q=${encodeURIComponent(q)}` : ''}`;
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
          const href = `/${locale}/vendors?city=${encodeURIComponent(city.value)}${categorySlug ? `&category=${categorySlug}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
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
  );
}
