import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import VendorHero from '@/components/vendors/VendorHero';
import WhyChooseWervice from '@/components/vendors/WhyChooseWervice';
import VendorHowItWorks from '@/components/vendors/VendorHowItWorks';
import VendorPricing from '@/components/vendors/VendorPricing';
import VendorSignupForm from '@/components/vendors/VendorSignupForm';

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
    <div className="min-h-screen bg-white">
      <VendorHero />
      <WhyChooseWervice />
      <VendorHowItWorks />
      <VendorPricing />
      <VendorSignupForm />
    </div>
  );
}