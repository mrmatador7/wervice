'use client';

import GlassmorphismHeader from '@/components/GlassmorphismHeader';
import Hero from './home/components/Hero';
import CategoriesSection from '@/components/CategoriesSection';
import CitiesCarousel from '@/components/CitiesCarousel';
import CategoryRails from '@/components/CategoryRails';
import ListingsRail from '@/components/ListingsRail';
import BlogArticles from '@/components/BlogArticles';
import BecomeVendorSection from './home/components/BecomeVendorSection';
import Footer from '@/components/layout/Footer';
import { homepageListings } from '@/lib/mockListings';

export default function HomePage() {
  const handleViewOffers = () => {
    // Smooth scroll to featured deals section
    document.getElementById('featured-deals')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Beautiful Moroccan wedding scene with traditional elements"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <GlassmorphismHeader />

        {/* Add top padding to account for fixed header */}
        <div className="pt-16">
          <Hero onViewOffers={handleViewOffers} />
        </div>

        {/* Categories Section - Standalone */}
        <CategoriesSection />

        {/* Cities Carousel */}
        <CitiesCarousel variant="small" />

        {/* Category Rails */}
        <CategoryRails />

        {/* New Vendors */}
        <ListingsRail
          title="New Vendors"
          items={homepageListings}
          variant="carousel"
        />

        {/* Blog Articles */}
        <BlogArticles />

        <BecomeVendorSection />

        <Footer />
      </div>
    </div>
  );
}
