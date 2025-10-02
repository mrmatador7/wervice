import dynamic from 'next/dynamic';
import SearchBarSimple from '@/components/hero/SearchBarSimple';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Section from '@/components/layout/Section';

// Try to load real sections; if not present, fall back to placeholders
const PopularCities = dynamic(() => import('@/components/sections/PopularCities').catch(() => import('@/components/placeholders/PopularCities')));
const CategoryBlocks = dynamic(() => import('@/components/sections/CategoryBlocks').catch(() => import('@/components/placeholders/CategoryBlocks')));
const NewVendors = dynamic(() => import('@/components/sections/NewVendors').catch(() => import('@/components/placeholders/NewVendors')));
const PlanWithConfidence = dynamic(() => import('@/components/sections/PlanWithConfidence').catch(() => import('@/components/placeholders/PlanWithConfidence')));
const WeddingInsights = dynamic(() => import('@/components/sections/WeddingInsights').catch(() => import('@/components/placeholders/WeddingInsights')));
const VendorCTA = dynamic(() => import('@/components/sections/VendorCTA').catch(() => import('@/components/placeholders/VendorCTA')));
const Newsletter = dynamic(() => import('@/components/sections/Newsletter').catch(() => import('@/components/placeholders/Newsletter')));

export default function Page() {
  console.log("[HOME_FILE]", __filename);
  return (
    <main data-testid="home-entry" className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="pt-[calc(var(--header-h,64px)+40px)] pb-8 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#11190C]">Plan your wedding, your way.</h1>
        <p className="mt-2 text-base sm:text-lg text-[#787664]">Compare trusted vendors, read reviews, and book fast — all in one place.</p>
        <div className="mt-4"><SearchBarSimple /></div>
      </section>

      {/* 1) Popular Cities */}
      <Section variant="tinted">
        <PopularCities />
      </Section>

      {/* 2) Categories (Venues / Catering / Photo & Video) */}
      <Section variant="default">
        <CategoryBlocks />
      </Section>

      {/* 3) New Vendors */}
      <Section variant="lime">
        <NewVendors />
      </Section>

      {/* 4) Plan With Confidence */}
      <Section variant="default">
        <PlanWithConfidence />
      </Section>

      {/* 5) Wedding Insights & Stories */}
      <Section variant="tinted">
        <WeddingInsights />
      </Section>

      {/* 6) Vendor CTA */}
      <Section variant="lime">
        <VendorCTA />
      </Section>

      {/* 7) Newsletter */}
      <Section variant="default">
        <Newsletter />
      </Section>

      {/* Footer */}
      <Footer />
    </main>
  );
}