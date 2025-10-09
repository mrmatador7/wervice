'use client';

import Link from 'next/link';
import { formatCategoryName } from '@/lib/format';
// import '../../styles/hero.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeroProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  categorySlug?: string;
}

export default function Hero({
  title,
  subtitle,
  breadcrumbs,
  categorySlug
}: HeroProps) {
  // Auto-generate title from category if not provided
  const displayTitle = title || (categorySlug ? `Wedding ${formatCategoryName(categorySlug)}` : 'Wedding Vendors');
  const displaySubtitle = subtitle || 'Discover verified professionals to bring your wedding vision to life.';

  // Auto-generate breadcrumbs if not provided
  const displayBreadcrumbs = breadcrumbs || [
    { label: 'Home', href: '/' },
    { label: 'Vendors', href: '/vendors' },
    { label: categorySlug ? formatCategoryName(categorySlug) : 'Category' },
  ];

  return (
    <section className="bg-gradient-to-b from-[#F8F7F5] to-white relative">
      {/* Animated background elements would go here */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-wv-lime/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-wv-lime/15 rounded-full blur-xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 md:pt-20 pb-10">
        {!!displayBreadcrumbs?.length && (
          <nav className="mb-4 text-sm text-neutral-600" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {displayBreadcrumbs.map((breadcrumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-neutral-400">/</span>}
                  {breadcrumb.href ? (
                    <Link
                      href={breadcrumb.href}
                      className="hover:text-wv-black transition-colors focus:outline-none focus:ring-2 focus:ring-wv-lime focus:ring-offset-2 rounded"
                    >
                      {breadcrumb.label}
                    </Link>
                  ) : (
                    <span className="text-wv-black font-medium">{breadcrumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-wv-black mb-3">
            {displayTitle}
          </h1>
          {displaySubtitle && (
            <p className="text-lg text-neutral-700 leading-relaxed max-w-2xl">
              {displaySubtitle}
            </p>
          )}
        </div>

        {/* Hero controls slot (FilterBar will sit here on desktop; sticky on scroll) */}
        <div className="mt-8" id="hero-controls"></div>
      </div>
    </section>
  );
}
