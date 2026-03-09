import type { Metadata } from "next";
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params)?.locale || 'en';

  return {
    title: "Welcome to Wervice | Success",
    description: "Your vendor subscription has started successfully.",
  };
}

export default function VendorSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7FF1F]/10 via-white to-[#D7FF1F]/5 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-[#D7FF1F] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="font-decorative text-4xl md:text-5xl text-gray-900 mb-6">
          Welcome to Wervice!
        </h1>

        {/* Message */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Your vendor subscription has started successfully. Complete your profile to appear in search results and start connecting with couples.
        </p>

        {/* CTA Button */}
        <Link
          href="/vendor/dashboard"
          className="inline-block bg-black text-white font-ui-primary text-lg px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors duration-200 shadow-lg"
        >
          Go to Vendor Portal
        </Link>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-sm">
          <h3 className="font-ui-secondary text-lg text-gray-900 mb-4">
            What&apos;s next?
          </h3>
          <ul className="text-left space-y-2 text-gray-600">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#D7FF1F] rounded-full"></div>
              Complete your vendor profile with more photos
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#D7FF1F] rounded-full"></div>
              Set up your pricing packages
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#D7FF1F] rounded-full"></div>
              Start receiving inquiries from couples
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
