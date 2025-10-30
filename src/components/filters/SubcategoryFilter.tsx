'use client';

import { useRouter, useSearchParams } from 'next/navigation';
// TODO: Implement subcategory functionality
// import { getSubcategories, MainCategory } from '@/lib/categories';

type MainCategory = string; // Temporary type

interface SubcategoryFilterProps {
  mainCategory?: MainCategory;
}

export default function SubcategoryFilter({ mainCategory }: SubcategoryFilterProps) {
  // TODO: Implement subcategory functionality
  // For now, don't render anything
  return null;
}
