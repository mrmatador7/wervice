'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPriceFromCategory, categoryPricing } from '@/lib/categoryPricing';

interface VendorLead {
  id: string;
  businessName: string;
  category: string;
  city: string;
  whatsapp: string;
  email: string;
  mappedMonthlyPrice?: number;
}

async function getLeadById(leadId: string): Promise<VendorLead | null> {
  // API has been removed - return null for now
  console.log('Vendor leads API has been removed, cannot fetch lead data');
  return null;
}

interface SuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ lead?: string }>;
}

export default function VendorSubscribeSuccessPage({
  params,
  searchParams
}: SuccessPageProps) {
  const [leadData, setLeadData] = useState<VendorLead | null>(null);
  const routeParams = use(params);
  const locale = routeParams.locale;
  const queryParams = use(searchParams);
  const leadId = queryParams.lead;

  useEffect(() => {
    async function loadLeadData() {
      let data: unknown = null;

      // Try to fetch lead by ID first
      if (leadId) {
        const apiLeadData = await getLeadById(leadId);
        if (apiLeadData) {
          data = apiLeadData;
        }
      }

      // Fallback to sessionStorage
      if (!data) {
        try {
          const sessionData = sessionStorage.getItem('lastVendorLead');
          if (sessionData) {
            data = JSON.parse(sessionData);
          }
        } catch (error) {
          console.error('Failed to load session data:', error);
        }
      }

      // If we have data, compute the price from category
      if (data) {
        const typedData = data as VendorLead;
        // Find category slug from category name
        const categorySlug = Object.keys(categoryPricing).find(
          slug => categoryPricing[slug].name === typedData.category
        );
        typedData.mappedMonthlyPrice = categorySlug ? getPriceFromCategory(categorySlug) : typedData.mappedMonthlyPrice || 0;
        setLeadData(typedData);
      }
    }

    loadLeadData();
  }, [leadId]);

  // Focus the title on mount for accessibility
  useEffect(() => {
    const titleElement = document.querySelector('h1');
    if (titleElement) {
      titleElement.focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F1EE] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[980px] overflow-hidden rounded-[28px] border border-black/10 bg-[#F7F5F2] p-8 shadow-[0_20px_60px_rgba(17,25,12,0.12)] sm:p-10">
        <Link href={`/${locale}`} className="mb-8 inline-flex">
          <Image src="/wervice-logo-black.png" alt="Wervice Logo" width={170} height={50} className="h-10 w-auto" />
        </Link>

        <div className="w-24 h-24 bg-[#D7FF1F] rounded-full flex items-center justify-center mb-6 shadow-lg" role="img" aria-label="Success">
          <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-[#11190C] mb-3" tabIndex={-1}>
          Thanks! We&apos;ll contact you to activate your subscription.
        </h1>
        <p className="text-[#5F6F84] text-lg mb-8 max-w-2xl">
          Our team will review your details and reach out via WhatsApp or email within 24–48 hours.
        </p>

        {leadData && (
          <div className="rounded-2xl border border-[#d7deea] bg-white p-6 mb-8">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-[#5F6F84] mb-1">Business Name</dt>
                <dd className="text-[#11190C] font-semibold">{leadData.businessName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[#5F6F84] mb-1">Category</dt>
                <dd className="text-[#11190C] font-semibold">{leadData.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[#5F6F84] mb-1">Monthly Price</dt>
                <dd className="text-[#11190C] font-semibold">{leadData.mappedMonthlyPrice || 'TBD'} DHS</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[#5F6F84] mb-1">City</dt>
                <dd className="text-[#11190C] font-semibold">{leadData.city}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[#5F6F84] mb-1">WhatsApp</dt>
                <dd className="text-[#11190C] font-semibold">{leadData.whatsapp}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-[#5F6F84] mb-1">Email</dt>
                <dd className="text-[#11190C] font-semibold">{leadData.email}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-[#11190C] mb-4">Next steps</h2>
          <ul className="space-y-3 max-w-2xl">
            <li className="text-[#33475F]">1. Expect a WhatsApp message or email from our team.</li>
            <li className="text-[#33475F]">2. Prepare 5–10 high-quality photos of your services.</li>
            <li className="text-[#33475F]">3. We&apos;ll publish your profile once verified.</li>
          </ul>
        </div>

        <div className="mt-6">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center rounded-xl bg-[#11190C] px-8 py-3 font-semibold text-[#D9FF0A] transition hover:brightness-110"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
