'use client';

import * as React from 'react';
import Link from 'next/link';
import { FiShield } from 'react-icons/fi';

export default function TrustBand() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" data-section="trust-band">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Card 1: Verified Vendors */}
          <div
            className="group flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-50/80 to-blue-100/60 p-8 shadow-sm ring-1 ring-[#11190C]/6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:ring-lime-200/50"
            data-card="verified-vendors"
          >
            <div className="text-center">
              <div className="mb-2 text-6xl font-black text-[#11190C]">
                95%
              </div>
              <div className="mb-2 text-lg font-semibold text-[#11190C]">
                Verified Vendors
              </div>
              <div className="text-sm text-[#666]">
                Every vendor undergoes thorough verification and background checks.
              </div>
            </div>
          </div>

          {/* Card 2: Secure Payments */}
          <div
            className="group flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-[#11190C]/6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:ring-lime-200/50"
            data-card="security"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime-50 ring-1 ring-lime-200/50">
                <FiShield className="h-6 w-6 text-lime-600" aria-hidden="true" />
              </div>

              <div className="flex-1">
                <div className="mb-1 text-3xl font-bold text-[#11190C]">
                  100M MAD
                </div>
                <div className="text-sm font-medium text-[#666]">
                  Secure Payments
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-lg font-semibold text-[#11190C]">
                Secure Payments
              </h4>
              <p className="mb-3 text-sm leading-relaxed text-[#555]">
                SSL-encrypted transactions with multiple payment options.
              </p>
              <Link
                href="/safety"
                className="inline-flex items-center gap-1 text-sm font-medium text-lime-600 transition-colors hover:text-lime-700 hover:underline focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
              >
                Read more →
              </Link>
            </div>
          </div>

          {/* Card 3: Budget Management */}
          <div
            className="group rounded-2xl bg-gradient-to-br from-lime-50/60 via-white to-mint-50/40 p-8 shadow-sm ring-1 ring-[#11190C]/6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:ring-lime-200/50"
            data-card="budget"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="mb-3 text-xl font-bold text-[#11190C]">
                  Budget Management
                </h3>
                <p className="text-sm leading-relaxed text-[#555]">
                  Keep your wedding budget healthy with personalized insights and smart tracking tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
