import { Vendor } from '@/lib/types';

interface VendorAboutProps {
  vendor: Vendor;
}

export function VendorAbout({ vendor }: VendorAboutProps) {
  if (!vendor.description) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="bg-white rounded-2xl p-8 shadow-[0_6px_18px_rgba(17,25,12,0.06)] ring-1 ring-black/5">
        <h2 className="text-2xl font-bold text-[#11190C] mb-6">About {vendor.name}</h2>

        <div className="prose prose-lg max-w-none text-[#787664] leading-relaxed">
          {vendor.description.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph.trim()}
            </p>
          ))}
        </div>

        {/* Highlights */}
        {vendor.services && vendor.services.length > 0 && (
          <div className="mt-8 pt-6 border-t border-[#CAC4B7]/30">
            <h3 className="text-lg font-semibold text-[#11190C] mb-4">What We Offer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vendor.services.slice(0, 6).map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#D9FF0A] rounded-full flex-shrink-0"></div>
                  <span className="text-[#787664]">{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
