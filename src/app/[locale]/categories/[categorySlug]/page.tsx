import { notFound, redirect } from 'next/navigation';
import { normalizeCategory } from '@/lib/categories';

interface PageProps {
  params: Promise<{ locale: string; categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function CategoryLandingPage({ params, searchParams }: PageProps) {
  const { locale, categorySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const normalizedCategory = normalizeCategory(categorySlug);
  if (!normalizedCategory) notFound();

  const city = firstParam(resolvedSearchParams.city);
  const q = (firstParam(resolvedSearchParams.q) || '').trim();

  const qs = new URLSearchParams();
  qs.set('category', normalizedCategory);
  if (city && city !== 'all') qs.set('city', city);
  if (q) qs.set('q', q);

  redirect(`/${locale}/vendors?${qs.toString()}`);
}
