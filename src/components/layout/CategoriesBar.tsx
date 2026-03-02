'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { WERVICE_CATEGORIES } from '@/lib/categories';

const CATEGORIES = WERVICE_CATEGORIES.map((c) => ({ slug: c.slug, label: c.label }));

export default function CategoriesBar() {
  const { locale } = useLocale();

  return (
    <div className="w-full bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-1 overflow-x-auto scrollbar-hide py-1.5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/categories/${category.slug}`}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-[#11190C] hover:bg-gray-50 rounded-lg whitespace-nowrap transition-all"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Custom scrollbar hide */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

