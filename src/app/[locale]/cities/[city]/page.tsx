import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CityHero from '@/components/city/CityHero';
import CategoryFilters from '@/components/city/CategoryFilters';
import VendorGrid from '@/components/city/VendorGrid';
import CityHighlights from '@/components/city/CityHighlights';
import ReviewsCarousel from '@/components/city/ReviewsCarousel';
import CityGuides from '@/components/city/CityGuides';
import CityCTA from '@/components/city/CityCTA';

// City data and validation
const VALID_CITIES = {
  casablanca: {
    name: 'Casablanca',
    description: 'the Economic Hub',
    image: '/cities/Casablanca.jpg',
    tagline: 'Modern elegance meets Moroccan tradition',
  },
  marrakech: {
    name: 'Marrakech',
    description: 'the Red City',
    image: '/cities/Marrakech.jpg',
    tagline: 'Where ancient traditions meet modern romance',
  },
  rabat: {
    name: 'Rabat',
    description: 'the Modern Capital',
    image: '/cities/Rabat.jpg',
    tagline: 'Elegant sophistication in Morocco\'s capital',
  },
  fes: {
    name: 'Fes',
    description: 'the Imperial City',
    image: '/cities/Fez.jpg',
    tagline: 'Timeless beauty in Morocco\'s spiritual heart',
  },
  tangier: {
    name: 'Tangier',
    description: 'the Gateway to Africa',
    image: '/cities/tanger.jpg',
    tagline: 'Where continents meet in perfect harmony',
  },
  agadir: {
    name: 'Agadir',
    description: 'the Coastal Paradise',
    image: '/cities/Marrakech.jpg',
    tagline: 'Sunset ceremonies by the Atlantic waves',
  },
  meknes: {
    name: 'Meknes',
    description: 'the Versailles of Morocco',
    image: '/cities/meknes.jpg',
    tagline: 'Royal grandeur for your special day',
  },
  'el-jadida': {
    name: 'El Jadida',
    description: 'the Portuguese Gem',
    image: '/cities/El Jadida.jpg',
    tagline: 'Historic charm meets coastal romance',
  },
  kenitra: {
    name: 'Kenitra',
    description: 'the Garden City',
    image: '/cities/Kenitra.webp',
    tagline: 'Blooming gardens for your wedding dreams',
  },
};

type CityKey = keyof typeof VALID_CITIES;

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const citySlug = params.city.toLowerCase() as CityKey;
  const cityData = VALID_CITIES[citySlug];

  if (!cityData) {
    return {
      title: 'City Not Found - Wervice',
    };
  }

  return {
    title: `Plan Your Wedding in ${cityData.name} - Wervice`,
    description: `Discover trusted wedding vendors in ${cityData.name}, ${cityData.description}. Find venues, catering, photography and more for your perfect Moroccan wedding.`,
    keywords: [`wedding ${cityData.name}`, `wedding vendors ${cityData.name}`, `Moroccan wedding ${cityData.name}`, 'wedding planning Morocco'],
    openGraph: {
      title: `Plan Your Wedding in ${cityData.name}`,
      description: `Find the best wedding vendors in ${cityData.name} for your dream Moroccan wedding.`,
      images: [cityData.image],
    },
  };
}

// Import the client component
import VendorGridWithFilters from './VendorGridWithFilters';

export default function CityPage({ params }: { params: { city: string } }) {
  const citySlug = params.city.toLowerCase() as CityKey;
  const cityData = VALID_CITIES[citySlug];

  if (!cityData) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <CityHero city={cityData} />

      {/* Category Filters & Vendor Grid */}
      <VendorGridWithFilters city={cityData} />

      {/* City Highlights */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CityHighlights city={cityData} />
        </div>
      </section>

      {/* Reviews Carousel */}
      <section className="py-12 sm:py-16 bg-wervice-shell/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ReviewsCarousel city={cityData} />
        </div>
      </section>

      {/* Guides/Blog */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CityGuides city={cityData} />
        </div>
      </section>

      {/* CTA Banner */}
      <CityCTA city={cityData} />
      </main>
      <Footer />
    </>
  );
}

// Generate static params for all valid cities
export async function generateStaticParams() {
  return [
    { locale: 'en', city: 'casablanca' },
    { locale: 'en', city: 'marrakech' },
    { locale: 'fr', city: 'casablanca' },
    { locale: 'fr', city: 'marrakech' },
  ];
}
