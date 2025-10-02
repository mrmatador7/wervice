import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Thank You - Vendor Application Submitted',
    description: 'Thank you for submitting your vendor application. Our team will contact you soon.',
  };
}

export default function VendorSignupSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7FF1F]/5 via-white to-[#D7FF1F]/10 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[#D7FF1F] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🎉</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Thank you! 🎉
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Your vendor application has been submitted successfully. Our team will review your details and contact you within 24-48 hours to activate your subscription.
        </p>

        {/* What's Next */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
          <ul className="text-left space-y-2 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-[#D7FF1F] rounded-full mt-2 flex-shrink-0"></span>
              <span>We'll review your business details and photos</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-[#D7FF1F] rounded-full mt-2 flex-shrink-0"></span>
              <span>Contact you via WhatsApp or email to activate your subscription</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-[#D7FF1F] rounded-full mt-2 flex-shrink-0"></span>
              <span>Help you set up your vendor profile and start receiving inquiries</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[#D7FF1F] text-gray-900 font-semibold py-3 px-8 rounded-full hover:bg-[#D7FF1F]/90 transition-colors duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
