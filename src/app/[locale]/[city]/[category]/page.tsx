import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VendorsPage from '@/app/[locale]/vendors/page';
import { labelForCategory, normalizeCategory } from '@/lib/categories';
import { localizeCityLabel } from '@/lib/types/vendor';
import { toAbsoluteUrl } from '@/lib/seo/site-url';
import { slugToCityName } from '@/lib/vendor-url';

interface CityCategoryPageProps {
  params: Promise<{ locale: string; city: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function generateMetadata({ params }: CityCategoryPageProps): Promise<Metadata> {
  const { locale, city: citySlug, category } = await params;
  const cityName = slugToCityName(citySlug);
  const normalizedCategory = normalizeCategory(category);
  if (!cityName || !normalizedCategory) return {};

  const cityLabel = localizeCityLabel(cityName, locale);
  const categoryLabel = labelForCategory(normalizedCategory, locale);
  const titleByLocale: Record<string, string> = {
    en: `Wedding ${categoryLabel} in ${cityLabel} | Wervice`,
    fr: `${categoryLabel} de mariage a ${cityLabel} | Wervice`,
    ar: `${categoryLabel} لحفلات الزفاف في ${cityLabel} | Wervice`,
  };
  const descriptionByLocale: Record<string, string> = {
    en: `Discover verified ${categoryLabel.toLowerCase()} vendors in ${cityLabel}. Compare photos, pricing, and contact details on Wervice.`,
    fr: `Decouvrez des prestataires ${categoryLabel.toLowerCase()} verifies a ${cityLabel}. Comparez photos, tarifs et contacts sur Wervice.`,
    ar: `اكتشف مزودي خدمات ${categoryLabel.toLowerCase()} الموثقين في ${cityLabel}. قارن الصور والأسعار وطرق التواصل على Wervice.`,
  };
  const canonicalPath = `/${locale}/${citySlug}/${normalizedCategory}`;

  return {
    title: titleByLocale[locale] || titleByLocale.en,
    description: descriptionByLocale[locale] || descriptionByLocale.en,
    alternates: {
      canonical: toAbsoluteUrl(canonicalPath),
      languages: {
        en: toAbsoluteUrl(`/en/${citySlug}/${normalizedCategory}`),
        fr: toAbsoluteUrl(`/fr/${citySlug}/${normalizedCategory}`),
        ar: toAbsoluteUrl(`/ar/${citySlug}/${normalizedCategory}`),
        'x-default': toAbsoluteUrl(`/en/${citySlug}/${normalizedCategory}`),
      },
    },
  };
}

export default async function CityCategoryPage({ params, searchParams }: CityCategoryPageProps) {
  const { locale, city: citySlug, category } = await params;
  const resolvedSearchParams = await searchParams;
  const cityName = slugToCityName(citySlug);
  const normalizedCategory = normalizeCategory(category);

  if (!cityName || !normalizedCategory) notFound();

  const q = firstParam(resolvedSearchParams.q);
  return (
    <VendorsPage
      params={Promise.resolve({ locale })}
      searchParams={Promise.resolve({
        ...resolvedSearchParams,
        city: cityName,
        category: normalizedCategory,
        q,
      })}
    />
  );
}
