import { labelForCategory } from '@/lib/categories';
import { capitalizeCity } from '@/lib/utils';
import { vendorUrl } from '@/lib/vendor-url';
import type { SimilarVendor } from '@/lib/db/vendors';
import { localizeCityLabel } from '@/lib/types/vendor';
import VendorBrowseCard from '@/components/home/VendorBrowseCard';

interface SimilarVendorsProps {
  items: SimilarVendor[];
  locale: string;
}

export default function SimilarVendors({ items, locale }: SimilarVendorsProps) {
  if (items.length === 0) return null;

  return (
    <div>
      {/* Heading row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-900">Similar Vendors</h2>
        <span className="text-sm text-gray-400">{items.length} result{items.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((vendor) => {
          const categoryLabel = labelForCategory(vendor.category, locale);
          const cityLabel = localizeCityLabel(capitalizeCity(vendor.city), locale);
          const gallery = vendor.gallery_photos || [];
          const logo = vendor.profile_photo_url || gallery[0] || '/images/sample/venues-1.jpg';

          return (
            <VendorBrowseCard
              key={vendor.id}
              vendorId={vendor.id}
              href={vendorUrl(vendor, locale)}
              title={vendor.business_name}
              location={cityLabel}
              categoryLabel={categoryLabel}
              logoUrl={logo}
              galleryImages={gallery.length > 0 ? gallery : [logo]}
            />
          );
        })}
      </div>
    </div>
  );
}
