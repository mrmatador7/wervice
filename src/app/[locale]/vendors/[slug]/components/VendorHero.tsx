'use client';

import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiMessageCircle, FiStar, FiChevronDown } from 'react-icons/fi';
import { Vendor } from '@/lib/types';

// Analytics mock - replace with your actual analytics implementation
const analytics = {
  track: (event: string, data: Record<string, unknown>) => {
    console.log('Analytics:', event, data);
    // In real app: analytics.track(event, data);
  }
};

interface VendorHeroProps {
  vendor: Vendor;
}

export function VendorHero({ vendor }: VendorHeroProps) {
  const [activeTab, setActiveTab] = useState('overview');

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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'photos', label: 'Photos' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'location', label: 'Location' },
  ];

  return (
    <section className="relative bg-white border-b border-[#CAC4B7]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-4">
            {/* Breadcrumb */}
            <nav className="text-sm text-[#787664]">
              <span>Home</span>
              <span className="mx-2">›</span>
              <span>{vendor.city}</span>
              <span className="mx-2">›</span>
              <span className="capitalize">{vendor.category.replace('-', ' ')}</span>
              <span className="mx-2">›</span>
              <span className="text-[#11190C] font-medium">{vendor.name}</span>
            </nav>

            {/* Name and Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#11190C] mb-2">
                {vendor.name}
              </h1>
              {vendor.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <FiStar className="w-5 h-5 fill-[#D9FF0A] text-[#D9FF0A]" />
                    <span className="font-semibold text-[#11190C]">{vendor.rating}</span>
                  </div>
                  {vendor.reviewsCount && (
                    <span className="text-[#787664]">
                      ({vendor.reviewsCount} reviews)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Location and Category */}
            <div className="flex flex-wrap items-center gap-4 text-[#787664]">
              <div className="flex items-center gap-1">
                <FiMapPin className="w-4 h-4" />
                <span>{vendor.city}{vendor.address && ` • ${vendor.address}`}</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 bg-[#F3F1EE] text-[#11190C] text-sm font-medium rounded-full capitalize">
                {vendor.category.replace('-', ' ')}
              </span>
              {vendor.verified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D9FF0A] text-[#11190C] text-sm font-medium rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>

            {/* Price Range */}
            {vendor.priceRange && (
              <div className="text-lg font-semibold text-[#11190C]">
                {vendor.priceRange.from && vendor.priceRange.to
                  ? `From ${vendor.priceRange.from.toLocaleString()} to ${vendor.priceRange.to.toLocaleString()} ${vendor.priceRange.currency || 'MAD'}`
                  : vendor.priceRange.from
                  ? `From ${vendor.priceRange.from.toLocaleString()} ${vendor.priceRange.currency || 'MAD'}`
                  : 'Price on request'
                }
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            <button
              onClick={handleCallClick}
              disabled={!vendor.phone}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#11190C] text-white font-semibold rounded-xl hover:bg-[#0a0f0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Call vendor"
            >
              <FiPhone className="w-4 h-4" />
              Call
            </button>

            <button
              onClick={handleEmailClick}
              disabled={!vendor.email}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D9FF0A] text-[#11190C] font-semibold rounded-xl hover:bg-[#c4e600] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Email vendor"
            >
              <FiMail className="w-4 h-4" />
              Email
            </button>

            {vendor.whatsapp && (
              <button
                onClick={handleWhatsAppClick}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200"
                aria-label="Contact via WhatsApp"
              >
                <FiMessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-t border-[#CAC4B7]/30 pt-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#D9FF0A] text-[#11190C]'
                    : 'border-transparent text-[#787664] hover:text-[#11190C] hover:border-[#CAC4B7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
