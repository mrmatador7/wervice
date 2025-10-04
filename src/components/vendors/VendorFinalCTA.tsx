'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function VendorFinalCTA() {
  const t = useTranslations('vendor');

  return (
    <section className="py-20 md:py-28 bg-gradient-to-r from-[#D7FF1F] to-[#c4e600]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Text */}
          <h2 className="font-decorative text-3xl md:text-5xl text-black mb-6 leading-tight">
            Ready to grow your business?
          </h2>

          <p className="text-xl md:text-2xl text-gray-800 mb-12 max-w-2xl mx-auto">
            Join hundreds of successful wedding vendors in Morocco and start connecting with couples today.
          </p>

          {/* CTA Button */}
          <Link
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block bg-black text-white font-ui-primary text-lg md:text-xl px-10 py-5 rounded-xl hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-200"
          >
            Start Subscription
          </Link>

          {/* Additional Info */}
          <p className="text-sm text-gray-700 mt-6">
            No setup fees • No commissions • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
