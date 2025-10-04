'use client';

import { FiPhone, FiMail } from 'react-icons/fi';
import { Vendor } from '@/lib/types';

// Analytics mock - replace with your actual analytics implementation
const analytics = {
  track: (event: string, data: Record<string, unknown>) => {
    console.log('Analytics:', event, data);
    // In real app: analytics.track(event, data);
  }
};

interface VendorStickyActionsProps {
  vendor: Vendor;
}

export function VendorStickyActions({ vendor }: VendorStickyActionsProps) {
  const handleCallClick = () => {
    if (vendor.phone) {
      analytics.track('vendor_contact_click', {
        vendor: vendor.slug,
        method: 'call',
        location: 'sticky-mobile',
        timestamp: new Date().toISOString(),
      });
      window.location.href = `tel:${vendor.phone}`;
    }
  };

  const handleEmailClick = () => {
    if (vendor.email) {
      analytics.track('vendor_contact_click', {
        vendor: vendor.slug,
        method: 'email',
        location: 'sticky-mobile',
        timestamp: new Date().toISOString(),
      });
      window.location.href = `mailto:${vendor.email}`;
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#CAC4B7]/30 shadow-[0_-4px_12px_rgba(17,25,12,0.08)]">
      <div className="flex">
        <button
          onClick={handleCallClick}
          disabled={!vendor.phone}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-[#11190C] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Call vendor"
        >
          <FiPhone className="w-5 h-5" />
          Call
        </button>

        <div className="w-px bg-[#CAC4B7]/30"></div>

        <button
          onClick={handleEmailClick}
          disabled={!vendor.email}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#D9FF0A] text-[#11190C] font-semibold hover:bg-[#c4e600] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Email vendor"
        >
          <FiMail className="w-5 h-5" />
          Email
        </button>
      </div>
    </div>
  );
}
