'use client';

import Header from '@/components/layout/Header';
import Hero from './components/Hero';
import FeaturedDeals from './components/FeaturedDeals';
import InspirationGrid from './components/InspirationGrid';
import PremiumSection from './components/PremiumSection';
import UltimatePackage from './components/UltimatePackage';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  const handleViewOffers = () => {
    // Smooth scroll to featured deals section
    document.getElementById('featured-deals')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header />

      <Hero onViewOffers={handleViewOffers} />

      {/* Featured Deals - showing all categories */}
      <FeaturedDeals />

      {/* Inspiration Grid - showing all categories */}
      <InspirationGrid />

      <PremiumSection />

      <UltimatePackage />

      <Footer />
    </div>
  );
}
