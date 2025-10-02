import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import VendorSubscribeForm from '@/components/vendors/VendorSubscribeForm';

interface PageProps {
  searchParams: Promise<{ cadence?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const locale = 'en'; // Default for now

  return {
    title: "Start your Wervice Vendor Subscription",
    description: "Fill out your business details — we'll review and contact you to activate your subscription.",
  };
}

export default async function VendorSubscribePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const defaultCategory = params.category as string;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Start your Wervice Vendor Subscription
            </h1>
            <p className="text-gray-600">
              Fill out your business details. We'll review and contact you to activate your subscription.
            </p>
          </div>

          {/* Form */}
          <VendorSubscribeForm defaultCategory={defaultCategory} />
        </div>
      </div>
    </div>
  );
}
