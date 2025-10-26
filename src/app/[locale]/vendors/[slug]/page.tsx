import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getVendorBySlug, getSimilarVendors } from '@/lib/db/vendors';
import { labelForCategory, VALID_CATEGORY_SLUGS } from '@/lib/categories';
import { capitalizeCity } from '@/lib/utils';
import VendorHero from '@/components/vendor/VendorHero';
import VendorGallery from '@/components/vendor/VendorGallery';
import VendorContactCard from '@/components/vendor/VendorContactCard';
import VendorAbout from '@/components/vendor/VendorAbout';
import VendorMeta from '@/components/vendor/VendorMeta';
import SimilarVendors from '@/components/vendor/SimilarVendors';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface VendorPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Check if this is a category page - will be redirected, but provide basic metadata
  if (VALID_CATEGORY_SLUGS.includes(slug as any)) {
    return {
      title: 'Redirecting...',
    };
  }

  // Otherwise, it's a vendor detail page
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    return {
      title: 'Vendor Not Found | Wervice',
    };
  }

  const categoryLabel = labelForCategory(vendor.category);
  const cityLabel = capitalizeCity(vendor.city);
  const description = vendor.description
    ? vendor.description.substring(0, 150) + (vendor.description.length > 150 ? '...' : '')
    : `Find and book ${vendor.business_name} for your wedding in ${cityLabel}. Professional ${categoryLabel.toLowerCase()} services.`;

  const imageUrl = vendor.profile_photo_url || vendor.gallery_photos?.[0] || '';

  return {
    title: `${vendor.business_name} — ${categoryLabel} in ${cityLabel} | Wervice`,
    description,
    keywords: [
      vendor.business_name,
      categoryLabel,
      cityLabel,
      'wedding vendor',
      'Morocco wedding',
      'wedding planning',
    ],
    openGraph: {
      title: `${vendor.business_name} — ${categoryLabel} in ${cityLabel}`,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vendor.business_name} — ${categoryLabel} in ${cityLabel}`,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { locale, slug } = await params;

  // Check if this is a category page - redirect to new category structure
  if (VALID_CATEGORY_SLUGS.includes(slug as any)) {
    redirect(`/${locale}/categories/${slug}`);
  }

  // Otherwise, it's a vendor detail page
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const similar = await getSimilarVendors(vendor.category, vendor.city, vendor.id);

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vendor.business_name,
    description: vendor.description || `${labelForCategory(vendor.category)} services in ${capitalizeCity(vendor.city)}`,
    brand: {
      '@type': 'Organization',
      name: vendor.business_name,
    },
    category: labelForCategory(vendor.category),
    ...(vendor.profile_photo_url && {
      image: vendor.profile_photo_url,
    }),
    ...(vendor.starting_price && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'MAD',
        price: vendor.starting_price,
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
      },
    }),
  };

  return (
    <>
      <Header />
      
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <VendorHero vendor={vendor} locale={locale} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <VendorGallery vendor={vendor} />
            <VendorAbout vendor={vendor} />
            <VendorMeta vendor={vendor} />
            <SimilarVendors items={similar} locale={locale} />
          </div>

          {/* Right Column: Sticky Contact Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <VendorContactCard vendor={vendor} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

