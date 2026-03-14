import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VendorsPage from '@/app/[locale]/vendors/page';
import { localizeCityLabel } from '@/lib/types/vendor';
import { toAbsoluteUrl } from '@/lib/seo/site-url';
import { slugToCityName } from '@/lib/vendor-url';

interface CityPageProps {
  params: Promise<{ locale: string; city: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { locale, city: citySlug } = await params;
  const cityName = slugToCityName(citySlug);
  if (!cityName) return {};

  const cityLabel = localizeCityLabel(cityName, locale);
  const titleByLocale: Record<string, string> = {
    en: `Wedding Vendors in ${cityLabel} | Wervice`,
    fr: `Prestataires de mariage à ${cityLabel} | Wervice`,
    ar: `مزودو خدمات الزفاف في ${cityLabel} | Wervice`,
  };
  const descriptionByLocale: Record<string, string> = {
    en: `Discover verified wedding vendors in ${cityLabel}. Compare categories, pricing, and portfolios on Wervice.`,
    fr: `Decouvrez des prestataires de mariage verifies à ${cityLabel}. Comparez categories, tarifs et portfolios sur Wervice.`,
    ar: `اكتشف مزودي خدمات الزفاف الموثقين في ${cityLabel}. قارن الفئات والأسعار ومعارض الأعمال على Wervice.`,
  };
  const canonicalPath = `/${locale}/${citySlug}`;

  return {
    title: titleByLocale[locale] || titleByLocale.en,
    description: descriptionByLocale[locale] || descriptionByLocale.en,
    alternates: {
      canonical: toAbsoluteUrl(canonicalPath),
      languages: {
        en: toAbsoluteUrl(`/en/${citySlug}`),
        fr: toAbsoluteUrl(`/fr/${citySlug}`),
        ar: toAbsoluteUrl(`/ar/${citySlug}`),
        'x-default': toAbsoluteUrl(`/en/${citySlug}`),
      },
    },
  };
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const { locale, city: citySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const cityName = slugToCityName(citySlug);
  if (!cityName) notFound();

  const q = firstParam(resolvedSearchParams.q);
  return (
    <VendorsPage
      params={Promise.resolve({ locale })}
      searchParams={Promise.resolve({
        ...resolvedSearchParams,
        city: cityName,
        q,
      })}
    />
  );
}
