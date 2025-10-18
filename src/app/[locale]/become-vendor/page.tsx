import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VendorHero from '../vendors/components/VendorHero';
import WhyChooseWervice from '../vendors/components/WhyChooseWervice';
import VendorHowItWorks from '../vendors/components/VendorHowItWorks';
import VendorPricing from '../vendors/components/VendorPricing';
import VendorSignupForm from '../vendors/components/VendorSignupForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('vendor');

  return {
    title: 'Become a Wervice Vendor - Join Morocco\'s Wedding Marketplace',
    description: 'Join Morocco\'s premier wedding marketplace and connect with couples planning their big day. Start your vendor subscription today.',
    keywords: 'wedding vendors Morocco, vendor subscription, wedding marketplace, Moroccan weddings',
    openGraph: {
      title: 'Become a Wervice Vendor',
      description: 'Join Morocco\'s premier wedding marketplace and connect with couples planning their big day.',
      type: 'website',
    },
  };
}

export default function VendorSignupPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="-mt-8 md:-mt-12">
        <VendorHero
          title="Become a Wervice Vendor"
          subtitle="Join Morocco's premier wedding marketplace and connect with couples planning their big day"
          totalCount={0}
        />
        <WhyChooseWervice />
        <VendorHowItWorks />
        <Suspense fallback={<div>Loading pricing...</div>}>
          <VendorPricing />
        </Suspense>
        <VendorSignupForm />
      </main>
      <Footer />
    </div>
  );
}