'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
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
  searchParams: Promise<{ lead?: string }>;
}

export default function VendorSubscribeSuccessPage({
  searchParams
}: SuccessPageProps) {
  const [leadData, setLeadData] = useState<VendorLead | null>(null);
  const params = use(searchParams);
  const leadId = params.lead;

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
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-[#D7FF1F] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg" role="img" aria-label="Success">
        <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Title */}
      <h1
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        tabIndex={-1}
      >
        Thanks! We&apos;ll contact you to activate your subscription.
      </h1>

      {/* Subtext */}
      <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
        Our team will review your details and reach out via WhatsApp or email within 24–48 hours.
      </p>

      {/* Summary Card */}
      {leadData && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 text-left max-w-2xl mx-auto">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Business Name</dt>
              <dd className="text-gray-900 font-semibold">{leadData.businessName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Category</dt>
              <dd className="text-gray-900 font-semibold">{leadData.category}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Monthly Price</dt>
              <dd className="text-gray-900 font-semibold">{leadData.mappedMonthlyPrice || 'TBD'} DHS</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">City</dt>
              <dd className="text-gray-900 font-semibold">{leadData.city}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">WhatsApp</dt>
              <dd className="text-gray-900 font-semibold">{leadData.whatsapp}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Email</dt>
              <dd className="text-gray-900 font-semibold">{leadData.email}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Next Steps */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Next steps</h2>
        <ul className="space-y-4 max-w-2xl mx-auto">
          <li className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">📞</span>
            <div className="text-left">
              <p className="text-gray-900">Expect a WhatsApp message or email from our team.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🖼</span>
            <div className="text-left">
              <p className="text-gray-900">Prepare 5–10 high-quality photos of your services.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">📋</span>
            <div className="text-left">
              <p className="text-gray-900">We&apos;ll publish your profile once verified.</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Footer Button */}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-block w-full sm:w-auto bg-[#D7FF1F] text-black font-semibold px-8 py-3 rounded-xl hover:bg-[#c4e600] transition-all duration-200 shadow-lg hover:shadow-xl text-center"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}