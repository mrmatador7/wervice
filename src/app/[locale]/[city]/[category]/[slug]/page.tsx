import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getVendorBySlug, getSimilarVendors } from '@/lib/db/vendors';
import { labelForCategory } from '@/lib/categories';
import { capitalizeCity } from '@/lib/utils';
import { vendorUrl, cityToSlug } from '@/lib/vendor-url';
import VendorDetailPage from '@/components/vendor/VendorDetailPage';
import DashboardShell from '@/components/home/DashboardShell';
import { toAbsoluteUrl } from '@/lib/seo/site-url';
import { localizeCityLabel } from '@/lib/types/vendor';

interface VendorPageProps {
  params: Promise<{ locale: string; city: string; category: string; slug: string }>;
}

export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    return { title: 'Vendor Not Found | Wervice' };
  }

  const categoryLabel = labelForCategory(vendor.category, locale);
  const cityLabel = localizeCityLabel(capitalizeCity(vendor.city), locale);
  const rawDesc = vendor.description?.trim() || '';
  const descClean = (rawDesc && rawDesc !== 'No description provided' && rawDesc !== 'No description') ? rawDesc : null;
  const metaDesc = descClean
    ? descClean.substring(0, 150) + (descClean.length > 150 ? '...' : '')
    : `Find and book ${vendor.business_name} for your wedding in ${cityLabel}. Professional ${categoryLabel.toLowerCase()} services.`;

  const imageUrl = vendor.profile_photo_url || vendor.gallery_photos?.[0] || '';

  return {
    title: `${vendor.business_name} — ${categoryLabel} in ${cityLabel} | Wervice`,
    description: metaDesc,
    keywords: [vendor.business_name, categoryLabel, cityLabel, 'wedding vendor', 'Morocco wedding'],
    alternates: {
      canonical: toAbsoluteUrl(vendorUrl(vendor, locale)),
      languages: {
        en: toAbsoluteUrl(vendorUrl(vendor, 'en')),
        fr: toAbsoluteUrl(vendorUrl(vendor, 'fr')),
        ar: toAbsoluteUrl(vendorUrl(vendor, 'ar')),
        'x-default': toAbsoluteUrl(vendorUrl(vendor, 'en')),
      },
    },
    openGraph: {
      title: `${vendor.business_name} — ${categoryLabel} in ${cityLabel}`,
      description: metaDesc,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vendor.business_name} — ${categoryLabel} in ${cityLabel}`,
      description: metaDesc,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { locale, city, category, slug } = await params;

  const vendor = await getVendorBySlug(slug);

  if (!vendor) notFound();

  // Canonical redirect if city or category in URL don't match the DB record
  const correctCity = cityToSlug(vendor.city);
  const correctCategory = vendor.category;
  if (city !== correctCity || category !== correctCategory) {
    redirect(vendorUrl(vendor, locale));
  }

  const similarVendors = await getSimilarVendors(vendor.category, vendor.city, vendor.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: vendor.business_name,
    description: vendor.description || `${labelForCategory(vendor.category, locale)} services in ${localizeCityLabel(capitalizeCity(vendor.city), locale)}`,
    '@id': toAbsoluteUrl(vendorUrl(vendor, locale)),
    url: toAbsoluteUrl(vendorUrl(vendor, locale)),
    address: {
      '@type': 'PostalAddress',
      addressLocality: localizeCityLabel(capitalizeCity(vendor.city), locale),
      addressCountry: 'MA',
    },
    ...(vendor.profile_photo_url && { image: vendor.profile_photo_url }),
    ...(vendor.starting_price && {
      priceRange: `From ${vendor.starting_price.toLocaleString()} MAD`,
    }),
  };

  const images = (vendor.gallery_photos || []).filter(Boolean) as string[];
  const whatsappNumber = vendor.phone?.replace(/\D/g, '') || '';
  const rawDesc = vendor.description?.trim() || '';
  const description = (rawDesc && rawDesc !== 'No description provided' && rawDesc !== 'No description') ? rawDesc : null;

  return (
    <DashboardShell locale={locale} activeItem="all-vendors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <VendorDetailPage
        name={vendor.business_name}
        city={localizeCityLabel(capitalizeCity(vendor.city), locale)}
        category={vendor.category}
        categoryLabel={labelForCategory(vendor.category, locale)}
        description={description}
        priceFrom={vendor.starting_price || 0}
        phone={vendor.phone || ''}
        whatsapp={whatsappNumber}
        instagram={vendor.instagram || null}
        googleMaps={vendor.google_maps || null}
        logoUrl={vendor.profile_photo_url || null}
        images={images}
        videoUrl={vendor.video_url || undefined}
        locale={locale}
        similarVendors={similarVendors}
      />
    </DashboardShell>
  );
}
