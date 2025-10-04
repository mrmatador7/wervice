'use client';

import { FiPhone, FiMail, FiMessageCircle } from 'react-icons/fi';
import { Vendor } from '@/lib/types';

// Analytics mock - replace with your actual analytics implementation
const analytics = {
  track: (event: string, data: Record<string, unknown>) => {
    console.log('Analytics:', event, data);
    // In real app: analytics.track(event, data);
  }
};

interface VendorContactPanelProps {
  vendor: Vendor;
}

export function VendorContactPanel({ vendor }: VendorContactPanelProps) {
  const handleContactClick = (method: string) => {
    analytics.track('vendor_contact_click', {
      vendor: vendor.slug,
      method,
      timestamp: new Date().toISOString(),
    });
  };

  const handleCallClick = () => {
    if (vendor.phone) {
      handleContactClick('call');
      window.location.href = `tel:${vendor.phone}`;
    }
  };

  const handleEmailClick = () => {
    if (vendor.email) {
      handleContactClick('email');
      window.location.href = `mailto:${vendor.email}`;
    }
  };

  const handleWhatsAppClick = () => {
    if (vendor.whatsapp) {
      handleContactClick('whatsapp');
      window.open(`https://wa.me/${vendor.whatsapp}`, '_blank');
    }
  };

  return (
    <section className="py-10 sm:py-12">
      <div className="bg-white rounded-2xl p-8 shadow-[0_6px_18px_rgba(17,25,12,0.06)] ring-1 ring-black/5">
        <h2 className="text-2xl font-bold text-[#11190C] mb-6">Contact {vendor.name}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Call */}
          {vendor.phone && (
            <button
              onClick={handleCallClick}
              className="flex items-center gap-3 p-4 bg-[#11190C] text-white rounded-xl hover:bg-[#0a0f0a] transition-colors group"
              aria-label={`Call ${vendor.name}`}
            >
              <FiPhone className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Call</div>
                <div className="text-sm opacity-90">{vendor.phone}</div>
              </div>
            </button>
          )}

          {/* Email */}
          {vendor.email && (
            <button
              onClick={handleEmailClick}
              className="flex items-center gap-3 p-4 bg-[#D9FF0A] text-[#11190C] rounded-xl hover:bg-[#c4e600] transition-colors group"
              aria-label={`Email ${vendor.name}`}
            >
              <FiMail className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Email</div>
                <div className="text-sm opacity-80 truncate">{vendor.email}</div>
              </div>
            </button>
          )}

          {/* WhatsApp */}
          {vendor.whatsapp && (
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center gap-3 p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors group"
              aria-label={`Contact ${vendor.name} via WhatsApp`}
            >
              <FiMessageCircle className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">WhatsApp</div>
                <div className="text-sm opacity-90">{vendor.whatsapp}</div>
              </div>
            </button>
          )}
        </div>

        <div className="text-sm text-[#787664] bg-[#F3F1EE] rounded-lg p-4">
          <p>
            💡 <strong>Direct contact:</strong> Contact the vendor directly to confirm availability and discuss your specific needs.
          </p>
        </div>
      </div>
    </section>
  );
}
