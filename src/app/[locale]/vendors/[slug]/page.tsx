import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getVendorBySlug, getSimilarVendors } from '@/data/vendors.mock';
import { VendorHero } from './components/VendorHero';
import { VendorGallery } from './components/VendorGallery';
import { VendorInfoRow } from './components/VendorInfoRow';
import { VendorAbout } from './components/VendorAbout';
import { VendorAmenities } from './components/VendorAmenities';
import { VendorContactPanel } from './components/VendorContactPanel';
import { VendorReviews } from './components/VendorReviews';
import { VendorLocation } from './components/VendorLocation';
import { VendorSimilar } from './components/VendorSimilar';
import { VendorStickyActions } from './components/VendorStickyActions';

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);

  if (!vendor) {
    return {
      title: 'Vendor Not Found',
    };
  }

  const t = await getTranslations('vendor');

  return {
    title: `${vendor.name} - ${vendor.category} in ${vendor.city} | Wervice`,
    description: vendor.description?.slice(0, 155) || `${vendor.name} - Professional ${vendor.category} services in ${vendor.city}, Morocco. Book now on Wervice.`,
    keywords: `${vendor.category}, ${vendor.city}, Morocco, wedding services, ${vendor.name}`,
    openGraph: {
      title: `${vendor.name} - ${vendor.category} in ${vendor.city}`,
      description: vendor.description?.slice(0, 155) || `${vendor.name} - Professional ${vendor.category} services in ${vendor.city}, Morocco.`,
      images: [vendor.coverImage],
      type: 'website',
    },
  };
}

export default async function VendorPage({ params }: PageProps) {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const similarVendors = getSimilarVendors(vendor, 6);

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': vendor.category === 'venues' ? 'EventVenue' : 'LocalBusiness',
    name: vendor.name,
    description: vendor.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: vendor.city,
      addressCountry: 'Morocco',
      streetAddress: vendor.address,
    },
    telephone: vendor.phone,
    email: vendor.email,
    url: vendor.website,
    image: vendor.coverImage,
    ...(vendor.location && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: vendor.location.lat,
        longitude: vendor.location.lng,
      },
    }),
    ...(vendor.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: vendor.rating,
        reviewCount: vendor.reviewsCount,
      },
    }),
    priceRange: vendor.priceRange ? `${vendor.priceRange.currency || 'MAD'} ${vendor.priceRange.from || 0} - ${vendor.priceRange.to || '∞'}` : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="min-h-screen">
        <Header />

        <main className="pb-20">
          {/* Hero Section */}
          <VendorHero vendor={vendor} />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Media Gallery */}
            <VendorGallery vendor={vendor} />

            {/* Key Info Row */}
            <VendorInfoRow vendor={vendor} />

            {/* About Section */}
            <VendorAbout vendor={vendor} />

            {/* Amenities & Services */}
            <VendorAmenities vendor={vendor} />

            {/* Contact Panel */}
            <VendorContactPanel vendor={vendor} />

            {/* Reviews */}
            <VendorReviews vendor={vendor} />

            {/* Location */}
            <VendorLocation vendor={vendor} />

            {/* Similar Vendors */}
            <VendorSimilar vendors={similarVendors} />
          </div>
        </main>

        {/* Mobile Sticky Actions */}
        <VendorStickyActions vendor={vendor} />

        <Footer />
      </div>
    </>
  );
}