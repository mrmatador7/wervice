'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Combobox from '@/components/ui/Combobox';
import type { SimpleItem } from '@/lib/wervice-data';

export default function SearchBar({
  cities,
  categories,
  locale = 'en',
}: {
  cities: SimpleItem[];
  categories: SimpleItem[];
  locale?: string;
}) {
  const router = useRouter();
  const [city, setCity] = React.useState<SimpleItem | null>(null);
  const [category, setCategory] = React.useState<SimpleItem | null>(null);

  const onSearch = () => {
    // Routing logic: prefer both; fallback to category or city
    if (city && category) router.push(`/${locale}/categories/${category.slug}?city=${city.slug}`);
    else if (category) router.push(`/${locale}/categories/${category.slug}`);
    else if (city) router.push(`/${locale}/cities/${city.slug}`);
    else router.push(`/${locale}/categories/venues`);
  };

  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <Combobox
        label="City"
        placeholder="Select a city"
        items={cities}
        selected={city}
        onSelect={setCity}
        icon={<span>📍</span>}
      />
      <Combobox
        label="Category"
        placeholder="Select a category"
        items={categories}
        selected={category}
        onSelect={setCategory}
        icon={<span>👤</span>}
      />
      <button
        onClick={onSearch}
        className="h-12 rounded-xl bg-[#D9FF0A] px-6 text-sm font-semibold text-[#11190C] shadow-sm transition hover:-translate-y-[1px] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9FF0A] focus-visible:ring-offset-2"
      >
        Search
      </button>
    </div>
  );
}
