'use client';

import { FiMapPin, FiExternalLink } from 'react-icons/fi';
import { Vendor } from '@/lib/types';

interface VendorLocationProps {
  vendor: Vendor;
}

export function VendorLocation({ vendor }: VendorLocationProps) {
  const handleOpenInMaps = () => {
    if (vendor.location) {
      const url = `https://www.google.com/maps?q=${vendor.location.lat},${vendor.location.lng}`;
      window.open(url, '_blank');
    } else if (vendor.address) {
      const url = `https://www.google.com/maps?q=${encodeURIComponent(vendor.address)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <section className="py-10 sm:py-12">
      <div className="bg-white rounded-2xl p-8 shadow-[0_6px_18px_rgba(17,25,12,0.06)] ring-1 ring-black/5">
        <h2 className="text-2xl font-bold text-[#11190C] mb-6">Location & Directions</h2>

        {vendor.location ? (
          <div className="space-y-4">
            {/* Map Placeholder */}
            <div className="relative aspect-[16/9] bg-[#F3F1EE] rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FiMapPin className="w-12 h-12 text-[#787664] mx-auto mb-2" />
                  <p className="text-[#787664] font-medium">Interactive Map</p>
                  <p className="text-sm text-[#787664]/70">Click &ldquo;Open in Google Maps&rdquo; below</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenInMaps}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D9FF0A] text-[#11190C] font-semibold rounded-xl hover:bg-[#c4e600] transition-colors"
            >
              <FiExternalLink className="w-4 h-4" />
              Open in Google Maps
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-[#F3F1EE] rounded-xl">
              <FiMapPin className="w-5 h-5 text-[#787664] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#11190C] mb-1">Address</h3>
                <p className="text-[#787664]">{vendor.address || `${vendor.name}, ${vendor.city}, Morocco`}</p>
              </div>
            </div>

            {vendor.address && (
              <button
                onClick={handleOpenInMaps}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D9FF0A] text-[#11190C] font-semibold rounded-xl hover:bg-[#c4e600] transition-colors"
              >
                <FiExternalLink className="w-4 h-4" />
                Get Directions
              </button>
            )}
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-[#CAC4B7]/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-[#11190C]">City:</span>
              <span className="ml-2 text-[#787664]">{vendor.city}</span>
            </div>
            {vendor.category && (
              <div>
                <span className="font-medium text-[#11190C]">Category:</span>
                <span className="ml-2 text-[#787664] capitalize">{vendor.category.replace('-', ' ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
