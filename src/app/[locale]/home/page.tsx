'use client';

import Header from '@/components/layout/Header';
import Hero from './components/Hero';
import CategoriesSection from '@/components/CategoriesSection';
import CitiesCarousel from '@/components/CitiesCarousel';
import CategoryRails from '@/components/CategoryRails';
import ListingsRail from '@/components/ListingsRail';
import BlogArticles from '@/components/BlogArticles';
import BecomeVendorSection from './components/BecomeVendorSection';
import Footer from '@/components/layout/Footer';
import { homepageListings } from '@/lib/mockListings';

export default function HomePage() {
  const handleViewOffers = () => {
    // Smooth scroll to featured deals section
    document.getElementById('featured-deals')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header />

      <Hero onViewOffers={handleViewOffers} />

      {/* Categories Section */}
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
  );
}
