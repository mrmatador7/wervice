import Header from '@/components/layout/Header';
import Hero from '../components/Hero';
import CategoriesSection from '../categories/components/CategoriesSection';
import CitiesCarousel from '@/components/cities/CitiesCarousel';
import ListingsRail from '@/components/sections/ListingsRail';
import BecomeVendorSection from './components/BecomeVendorSection';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { homepageListings } from '@/data/mockListings';
import CategoriesShowcase, {
  CategoryItem,
} from "@/components/sections/CategoriesShowcase";

// Feature flag to control Browse by Category section
const SHOW_BROWSE_BY_CATEGORY = false;

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
            title="Dress catalog"
            subtitle="Discover the latest trends in wedding dresses by top designers and bridesmaid dresses. Choose your favorite from our catalog!"
            ctaLabel="Explore the catalog"
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
        title="New Vendors"
        items={homepageListings}
        variant="carousel"
      />


      <BecomeVendorSection />

      <Footer />
    </div>
  );
}
