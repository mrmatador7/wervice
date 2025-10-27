import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from './components/Hero';
import CategoriesSection from './categories/components/CategoriesSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import CitiesCarousel from '@/components/cities/CitiesCarousel';
import FeaturedVendorsSection from '@/components/home/FeaturedVendorsSection';
import TrustBand from './components/TrustBand';
import BecomeVendorSection from '@/components/sections/VendorCTA';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? 'en';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
        <Hero locale={locale} />

        {/* Categories Section */}
        <section className="py-12 bg-white/60 backdrop-blur-sm">
          <CategoriesSection />
        </section>

        {/* Featured Section - 3 Column Layout */}
        <section className="py-12 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-green-50/30">
          <FeaturedSection />
        </section>

        {/* Cities Carousel */}
        <section className="py-12 bg-white/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CitiesCarousel variant="small" className="-mx-4 md:-mx-6 lg:-mx-8" />
          </div>
        </section>

        {/* Featured Vendors Section */}
        <section className="py-12 bg-gradient-to-br from-blue-50/20 via-purple-50/20 to-pink-50/20">
          <FeaturedVendorsSection locale={locale} />
        </section>

        {/* Trust Band */}
        <section className="py-8 bg-white/60 backdrop-blur-sm">
          <TrustBand />
        </section>

        {/* Become Vendor Section */}
        <section className="py-12 bg-gradient-to-br from-green-50/30 via-lime-50/20 to-yellow-50/30">
          <BecomeVendorSection />
        </section>
      </main>
      <Footer />
    </>
  );
}
