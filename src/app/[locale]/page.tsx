import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from './components/Hero';
import CategoriesSection from './categories/components/CategoriesSection';
import CitiesCarousel from '@/components/cities/CitiesCarousel';
import HomeCategoryStrips from './components/HomeCategoryStrips';
import TrustBand from './components/TrustBand';
import BecomeVendorSection from '@/components/sections/VendorCTA';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? 'en';

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero locale={locale} />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Cities Carousel */}
        <section className="py-8 bg-[#F7F8FB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CitiesCarousel variant="small" className="-mx-4 md:-mx-6 lg:-mx-8" />
          </div>
        </section>

        {/* Category Strips */}
        <HomeCategoryStrips city={null} />

        {/* Trust Band */}
        <TrustBand />

        {/* Become Vendor Section */}
        <BecomeVendorSection />
      </main>
      <Footer />
    </>
  );
}
