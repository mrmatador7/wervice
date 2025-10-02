'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { getSubcategories, MainCategory } from '@/lib/categories';

interface SubcategoryFilterProps {
  mainCategory?: MainCategory;
}

export default function SubcategoryFilter({ mainCategory }: SubcategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current subcategory from URL
  const currentSubcategory = searchParams.get('subcategory') || 'all';

  // Get subcategories for the main category
  const subcategories = getSubcategories(mainCategory);

  // If no main category or no subcategories, don't render
  if (!mainCategory || subcategories.length === 0) {
    return null;
  }

  const handleSubcategoryClick = (subcategorySlug: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (subcategorySlug === 'all') {
      newSearchParams.delete('subcategory');
    } else {
      newSearchParams.set('subcategory', subcategorySlug);
    }

    // Clear page parameter when changing subcategory
    newSearchParams.delete('page');

    const newUrl = newSearchParams.toString()
      ? `?${newSearchParams.toString()}`
      : window.location.pathname;

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
        {/* "All" chip */}
        <button
          onClick={() => handleSubcategoryClick('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
            currentSubcategory === 'all' || !currentSubcategory
              ? 'bg-[#D9FF0A] text-[#11190C]'
              : 'bg-white border border-black/10 text-[#11190C] hover:bg-[#F3F1EE]'
          }`}
        >
          All {mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1).replace('-', ' ')}
        </button>

        {/* Subcategory chips */}
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.slug}
            onClick={() => handleSubcategoryClick(subcategory.slug)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              currentSubcategory === subcategory.slug
                ? 'bg-[#D9FF0A] text-[#11190C]'
                : 'bg-white border border-black/10 text-[#11190C] hover:bg-[#F3F1EE]'
            }`}
          >
            {subcategory.label}
          </button>
        ))}
      </div>
    </div>
  );
}
