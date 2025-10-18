import Header from '@/components/layout/Header';
import Hero from '../components/Hero';
import CategoriesSection from '../categories/components/CategoriesSection';
import CitiesCarousel from '@/components/cities/CitiesCarousel';
import ListingsRail from '@/components/sections/ListingsRail';
import BecomeVendorSection from './components/BecomeVendorSection';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import CategoriesShowcase, {
  CategoryItem,
} from "@/components/sections/CategoriesShowcase";
import { getTranslations } from 'next-intl/server';

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

  // Fetch vendors for the homepage carousel
  const vendors = await fetch('/api/vendors?limit=12', {
    next: { tags: ['vendors'] }
  }).then(res => res.json()).catch(() => []);

  // Convert API response format to ListingItem format expected by ListingsRail
  const vendorListings = vendors?.length > 0 ? vendors.map((vendor: any) => ({
    id: vendor.id,
    name: vendor.name,
    city: vendor.city,
    category: vendor.category,
    coverImage: vendor.profile_photo_url || '/placeholder-vendor.jpg',
    rating: vendor.rating || 4.5,
    isFavorite: false,
  })) : [
    // Fallback test data
    {
      id: 'test-1',
      name: 'Test Wedding Venue',
      city: 'marrakech',
      category: 'venues',
      coverImage: '/placeholder-vendor.jpg',
      rating: 4.5,
      isFavorite: false,
    }
  ];

  return (
    <div className="min-h-screen">
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
