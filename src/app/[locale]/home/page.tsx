import Header from '@/components/layout/Header';
import Hero from '../components/Hero';
import CategoriesSection from '../categories/components/CategoriesSection';
import CitiesCarousel from '@/components/cities/CitiesCarousel';
import ListingsRail from '@/components/sections/ListingsRail';
import BecomeVendorSection from './components/BecomeVendorSection';
import FeaturedVendorsSection from '@/components/home/FeaturedVendorsSection';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import CategoriesShowcase, {
  CategoryItem,
} from "@/components/sections/CategoriesShowcase";
import { getTranslations } from 'next-intl/server';
import { fetchVendors } from '@/lib/supabase/vendors';

// Force dynamic rendering since we use cookies for Supabase client
export const dynamic = 'force-dynamic';

// Feature flag to control Browse by Category section
const SHOW_BROWSE_BY_CATEGORY = true;

const DRESS_ITEMS: CategoryItem[] = [
  {
    id: "beloved",
    name: "Beloved",
    subtitle: "Wedding dresses",
    cover: "/catalog/dresses/beloved.jpg",
    href: "/catalog/dresses/beloved",
  },
  {
    id: "leblanc",
    name: "Le Blanc",
    subtitle: "Wedding dresses",
    cover: "/catalog/dresses/le-blanc.jpg",
    href: "/catalog/dresses/le-blanc",
  },
  {
    id: "rosa-clara",
    name: "Rosa Clarà",
    subtitle: "Wedding dresses",
    cover: "/catalog/dresses/rosa-clara.jpg",
    href: "/catalog/dresses/rosa-clara",
  },
  {
    id: "essense",
    name: "Essense of Australia",
    subtitle: "Wedding dresses",
    cover: "/catalog/dresses/essense.jpg",
    href: "/catalog/dresses/essense",
  },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? 'en';
  const t = await getTranslations({ locale, namespace: 'home' });

  // Fetch vendors for the homepage carousel directly from the database
  // Note: fetchVendors already filters out vendors without images
  const { vendors } = await fetchVendors({ limit: 12, sort: 'newest' });

  // Convert API response format to ListingItem format expected by ListingsRail
  // Additional filter to ensure only vendors with images are shown
  const vendorListings = vendors && vendors.length > 0 ? vendors
    .filter((vendor: any) => {
      const hasGallery = Array.isArray(vendor.gallery_urls) && vendor.gallery_urls.length > 0;
      const hasGalleryPhotos = Array.isArray(vendor.gallery_photos) && vendor.gallery_photos.length > 0;
      const hasProfilePhoto = vendor.profile_photo_url && vendor.profile_photo_url.trim() && 
                              vendor.profile_photo_url !== 'null' && vendor.profile_photo_url !== 'undefined';
      return hasGallery || hasGalleryPhotos || hasProfilePhoto;
    })
    .map((vendor: any) => ({
      id: vendor.id,
      name: vendor.business_name,
      city: vendor.city,
      category: vendor.category,
      coverImage: vendor.profile_photo_url || (vendor.gallery_urls?.[0]) || (vendor.gallery_photos?.[0]) || '/placeholder-vendor.jpg',
      rating: vendor.rating || 4.5,
      isFavorite: false,
    })) : [];

  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <Hero locale={locale} />

      {/* Categories Section */}
      {SHOW_BROWSE_BY_CATEGORY && (
        <CategoriesSection />
      )}

      {/* Cities Carousel */}
      <section className="py-8 bg-[#F7F8FB]">
        <Container>
          <CitiesCarousel variant="small" className="-mx-4 md:-mx-6 lg:-mx-8" />
        </Container>
      </section>

      {/* Featured Vendors Section */}
      <FeaturedVendorsSection locale={locale} />

      {/* Dress Catalog */}
      <section className="py-8">
        <Container>
          <CategoriesShowcase
            title={t('dressCatalog.title')}
            subtitle={t('dressCatalog.subtitle')}
            ctaLabel={t('dressCatalog.ctaLabel')}
            ctaHref="/catalog/dresses"
            seeMoreHref="/catalog/dresses"
            items={DRESS_ITEMS}
            railCardWidth={280}
            railCardHeight={360}
          />
        </Container>
      </section>

      {/* New Vendors */}
      <ListingsRail
        title={t('newVendors.title')}
        items={vendorListings}
        variant="carousel"
      />

      <BecomeVendorSection />

      <Footer />
    </div>
  );
}
