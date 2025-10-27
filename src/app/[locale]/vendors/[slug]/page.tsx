import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getVendorBySlug, getSimilarVendors } from '@/lib/db/vendors';
import { labelForCategory, VALID_CATEGORY_SLUGS } from '@/lib/categories';
import { capitalizeCity } from '@/lib/utils';
import VendorDetailPage from '@/components/vendor/VendorDetailPage';
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

  // Prepare data for VendorDetailPage component
  const images = [
    vendor.profile_photo_url,
    ...(vendor.gallery_photos || [])
  ].filter(Boolean) as string[];

  // Extract packages, guests, highlights from vendor data
  const packages = ['Garden Ceremony', 'Full Day Package', 'Reception Only'];
  const guests = ['50-100', '100-200', '200+'];
  const highlights = [
    'Private garden up to 180 guests',
    'Bridal room included',
    'On-site parking & security',
    'Professional sound system',
    'Customizable decor options'
  ];
  const amenities = [
    'Air conditioning',
    'Catering kitchen',
    'Bridal suite',
    'Outdoor space',
    'Parking available',
    'Wheelchair accessible'
  ];
  const policies = [
    '50% deposit required to secure booking',
    'Cancellation: 30 days notice for full refund',
    'Final payment due 7 days before event',
    'Setup available day before event'
  ];

  // Format phone for WhatsApp (remove spaces and special chars)
  const whatsappNumber = vendor.phone?.replace(/\D/g, '') || '';

  const badges = [
    'Garden',
    'Indoor/Outdoor',
    'Rooftop',
    'Pool Area'
  ];

  return (
    <>
      <Header />
      
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <VendorDetailPage
        name={vendor.business_name}
        city={capitalizeCity(vendor.city)}
        category={labelForCategory(vendor.category)}
        priceFrom={vendor.starting_price || 0}
        phone={vendor.phone || ''}
        whatsapp={whatsappNumber}
        packages={packages}
        guests={guests}
        highlights={highlights}
        amenities={amenities}
        policies={policies}
        images={images}
        videoUrl={undefined}
        mapEmbedUrl={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8!2d-7.6!3d33.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM2JzAwLjAiTiA3wrAzNicwMC4wIlc!5e0!3m2!1sen!2sma!4v1234567890`}
        isVerified={true}
        badges={badges}
      />

      <Footer />
    </>
  );
}

