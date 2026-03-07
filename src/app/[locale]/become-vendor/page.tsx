import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BecomeVendorHero from './components/BecomeVendorHero';
import WhyChooseWervice from '../vendors/components/WhyChooseWervice';
import VendorHowItWorks from '../vendors/components/VendorHowItWorks';
import VendorPricing from '../vendors/components/VendorPricing';
import VendorSignupForm from '../vendors/components/VendorSignupForm';
import { AUTH_UI_ENABLED } from '@/lib/config';

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

interface VendorSignupPageProps {
  params: Promise<{ locale: string }>;
}

export default async function VendorSignupPage({ params }: VendorSignupPageProps) {
  const { locale } = await params;

  if (!AUTH_UI_ENABLED) {
    redirect(`/${locale}`);
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <BecomeVendorHero />
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
