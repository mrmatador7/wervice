import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from './components/Hero';
import CategoriesSection from './categories/components/CategoriesSection';
import CitiesCarousel from '@/components/cities/CitiesCarousel';
import FeaturedVendorsSection from '@/components/home/FeaturedVendorsSection';
import BecomeVendorSection from '@/components/sections/VendorCTA';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? 'en';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f4f4f4]">
        {/* Hero Section */}
        <div className="bg-[#f7f7f7]">
          <Hero locale={locale} />
        </div>

        {/* Categories Section */}
        <section className="py-12 bg-[#f0f0f0]">
          <CategoriesSection />
        </section>

        {/* Cities Carousel */}
        <section className="py-12 bg-[#f1f1f1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CitiesCarousel variant="small" className="-mx-4 md:-mx-6 lg:-mx-8" />
          </div>
        </section>

        {/* Featured Vendors Section */}
        <section className="py-12 bg-[#f3f3f3]">
          <FeaturedVendorsSection locale={locale} />
        </section>

        {/* Become Vendor Section */}
        <section className="py-12 bg-[#f4f4f4]">
          <BecomeVendorSection />
        </section>
      </main>
      <Footer />
    </>
  );
}
