import { redirect, notFound } from 'next/navigation';
import { slugToCityName } from '@/lib/vendor-url';

interface CityPageProps {
  params: Promise<{ locale: string; city: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const { locale, city: citySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const cityName = slugToCityName(citySlug);
  if (!cityName) notFound();

  const q = (firstParam(resolvedSearchParams.q) || '').trim();
  const qs = new URLSearchParams();
  qs.set('city', cityName);
  if (q) qs.set('q', q);

  redirect(`/${locale}/vendors?${qs.toString()}`);
}
