import { FiCheck } from 'react-icons/fi';
import { Vendor } from '@/lib/types';

interface VendorAmenitiesProps {
  vendor: Vendor;
}

export function VendorAmenities({ vendor }: VendorAmenitiesProps) {
  if ((!vendor.amenities || vendor.amenities.length === 0) &&
      (!vendor.services || vendor.services.length === 0)) {
    return null;
  }

  return (
    <section className="py-10 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Amenities */}
        {vendor.amenities && vendor.amenities.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_6px_18px_rgba(17,25,12,0.06)] ring-1 ring-black/5">
            <h3 className="text-xl font-semibold text-[#11190C] mb-6">Amenities</h3>
            <div className="space-y-3">
              {vendor.amenities.map((amenity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[#D9FF0A] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="w-3 h-3 text-[#11190C]" />
                  </div>
                  <span className="text-[#787664] leading-relaxed">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        {vendor.services && vendor.services.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_6px_18px_rgba(17,25,12,0.06)] ring-1 ring-black/5">
            <h3 className="text-xl font-semibold text-[#11190C] mb-6">Services</h3>
            <div className="space-y-3">
              {vendor.services.map((service, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[#D9FF0A] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="w-3 h-3 text-[#11190C]" />
                  </div>
                  <span className="text-[#787664] leading-relaxed">{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
