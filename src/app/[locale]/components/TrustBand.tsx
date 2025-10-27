'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiShield, FiBarChart, FiSettings } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export default function TrustBand() {
  const t = useTranslations('home');

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" data-section="trust-band">
        {/* Row 1 */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Card A: Photo tile */}
          <div
            className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#11190C]/6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:ring-lime-200/50 lg:col-span-4"
            data-card="applications"
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src="/images/wervice/peace-of-mind.jpg"
                alt="Wervice support team assisting couples"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {/* Support chip */}
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-[#11190C] ring-1 ring-black/5">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400"></span>
                  Support
                </div>

                <h3 className="mb-2 text-xl font-bold text-[#11190C] lg:text-2xl">
                  {t('trustBand.applicationsProcessed')}
                </h3>
                <p className="text-sm leading-relaxed text-[#555]">
                  {t('trustBand.supportDescription')}
                </p>
              </div>
            </div>
          </div>

          {/* Card B: Stat tile */}
          <div
            className="group flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-50/80 to-blue-100/60 p-6 shadow-sm ring-1 ring-[#11190C]/6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:ring-lime-200/50 lg:col-span-4"
            data-card="conversion"
          >
            <div className="text-center">
              <div className="mb-2 text-5xl font-black text-[#11190C] lg:text-6xl">
                95%
              </div>
              <div className="mb-1 text-lg font-semibold text-[#11190C]">
                {t('trustBand.verifiedVendors')}
              </div>
              <div className="text-sm text-[#666]">
                {t('trustBand.vendorsDescription')}
              </div>
            </div>
          </div>

          {/* Card C: Security tile */}
          <div
            className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#11190C]/6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:ring-lime-200/50 lg:col-span-4"
            data-card="security"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime-50 ring-1 ring-lime-200/50">
                <FiShield className="h-6 w-6 text-lime-600" aria-hidden="true" />
              </div>

              <div className="flex-1">
                <div className="mb-1 text-2xl font-bold text-[#11190C] lg:text-3xl">
                  100M MAD
                </div>
                <div className="text-sm font-medium text-[#666]">
                  {t('trustBand.securePayments')}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-lg font-semibold text-[#11190C]">
                {t('trustBand.securePayments')}
              </h4>
              <p className="mb-3 text-sm leading-relaxed text-[#555]">
                {t('trustBand.paymentsDescription')}
              </p>
              <Link
                href="/safety"
                className="inline-flex items-center gap-1 text-sm font-medium text-lime-600 transition-colors hover:text-lime-700 hover:underline focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
              >
                Read more →
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Card D: Financial health */}
          <div
            className="group rounded-2xl bg-gradient-to-br from-lime-50/60 via-white to-mint-50/40 p-6 shadow-sm ring-1 ring-[#11190C]/6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:ring-lime-200/50 lg:col-span-8"
            data-card="health"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="mb-3 text-xl font-bold text-[#11190C] lg:text-2xl">
                  Maintain financial health
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-[#555] lg:text-base">
                  Keep your wedding budget healthy with personalised insights.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 ring-1 ring-black/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-100">
                    <FiBarChart className="h-4 w-4 text-lime-600" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#11190C]">Reports</div>
                    <div className="text-xs text-[#666]">Turn data into actionable insights</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 ring-1 ring-black/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <FiSettings className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#11190C]">Management</div>
                    <div className="text-xs text-[#666]">Oversight & Smart Tools</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card E: Time saved */}
          <div
            className="group flex flex-col justify-center rounded-2xl bg-gradient-to-br from-purple-50/60 to-purple-100/40 p-6 text-center shadow-sm ring-1 ring-[#11190C]/6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:ring-lime-200/50 lg:col-span-4"
            data-card="time-saved"
          >
            <div className="text-4xl font-black text-[#11190C] lg:text-5xl">
              45%
            </div>
            <div className="mt-2 text-sm leading-relaxed text-[#555]">
              Approval time decreases by up to 45% for vendor replies & booking confirmations.
            </div>
          </div>
        </div>
      </div>
  );
}
