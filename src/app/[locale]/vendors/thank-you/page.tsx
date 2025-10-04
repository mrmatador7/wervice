import Link from 'next/link';

export default function VendorThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-[#D7FF1F] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Thank you for applying!
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          Our team will review your application and contact you shortly.
        </p>

        {/* Back to Homepage Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
