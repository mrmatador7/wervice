import { redirect, notFound } from 'next/navigation';
import { VALID_CATEGORY_SLUGS } from '@/lib/categories';

interface PageProps {
  params: Promise<{ locale: string; categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function CategoryRedirectPage({ params, searchParams }: PageProps) {
  const { locale, categorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  if (!VALID_CATEGORY_SLUGS.includes(categorySlug as (typeof VALID_CATEGORY_SLUGS)[number])) {
    notFound();
  }

  const city = firstParam(resolvedSearchParams.city);
  const q = (firstParam(resolvedSearchParams.q) || '').trim();

  const qs = new URLSearchParams();
  qs.set('category', categorySlug);
  if (city) qs.set('city', city);
  if (q) qs.set('q', q);
  redirect(`/${locale}/vendors?${qs.toString()}`);
}

export async function generateStaticParams() {
  return VALID_CATEGORY_SLUGS.map((categorySlug) => ({ categorySlug }));
}
