import { notFound, redirect } from 'next/navigation';
import { normalizeCategory } from '@/lib/categories';
import { slugToCityName } from '@/lib/vendor-url';

interface CityCategoryPageProps {
  params: Promise<{ locale: string; city: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function CityCategoryPage({ params, searchParams }: CityCategoryPageProps) {
  const { locale, city: citySlug, category } = await params;
  const resolvedSearchParams = await searchParams;
  const cityName = slugToCityName(citySlug);
  const normalizedCategory = normalizeCategory(category);

  if (!cityName || !normalizedCategory) notFound();

  const q = (firstParam(resolvedSearchParams.q) || '').trim();
  const qs = new URLSearchParams();
  qs.set('city', cityName);
  qs.set('category', normalizedCategory);
  if (q) qs.set('q', q);

  redirect(`/${locale}/vendors?${qs.toString()}`);
}
