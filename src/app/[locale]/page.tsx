import ExplorerHome from '@/components/home/ExplorerHome';
import { fetchVendors } from '@/lib/supabase/vendors';
import { vendorUrl } from '@/lib/vendor-url';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? 'en';
  const { vendors } = await fetchVendors({ limit: 9, sort: 'newest' });

  const dynamicCards = (vendors || []).map((vendor) => {
    const image =
      vendor.profile_photo_url ||
      vendor.gallery_urls?.[0] ||
      vendor.gallery_photos?.[0] ||
      '/images/sample/venues-1.jpg';

    return {
      id: vendor.id,
      title: vendor.business_name,
      subtitle: `${vendor.city} • ${vendor.category.replace('-', ' ')}`,
      image,
      href: vendorUrl(vendor, locale),
    };
  });

  const fallbackForYou = [
    {
      id: 'fy-1',
      title: 'Riad Albaidaa',
      subtitle: 'Venue • Marrakech',
      image: '/images/sample/venues-1.jpg',
      href: `/${locale}/vendors`,
    },
    {
      id: 'fy-2',
      title: 'Le Jardin Secret',
      subtitle: 'Inspiration • Marrakech',
      image: '/cities/Marrakech.jpg',
      href: `/${locale}/vendors`,
    },
    {
      id: 'fy-3',
      title: 'Nomad Dinner Edit',
      subtitle: 'Catering • Marrakech',
      image: '/images/hero/cover.jpg',
      href: `/${locale}/vendors`,
    },
  ];

  const forYouCards = dynamicCards.slice(0, 3).length === 3 ? dynamicCards.slice(0, 3) : fallbackForYou;

  const recommendedVendors = (vendors || []).slice(0, 24).map((vendor) => ({
    id: vendor.id,
    title: vendor.business_name,
    city: vendor.city,
    category: vendor.category,
    logoUrl: vendor.profile_photo_url,
    galleryImages: vendor.gallery_urls || vendor.gallery_photos || [],
    href: vendorUrl(vendor, locale),
  }));

  return (
    <ExplorerHome
      locale={locale}
      forYouCards={forYouCards}
      recommendedVendors={recommendedVendors}
    />
  );
}
