import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';
import { labelForCategory } from '@/lib/categories';
import { capitalizeCity } from '@/lib/utils';
import { vendorUrl } from '@/lib/vendor-url';
import type { SimilarVendor } from '@/lib/db/vendors';
import { localizeCityLabel } from '@/lib/types/vendor';

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
          const imageUrl = vendor.gallery_photos?.[0] || vendor.profile_photo_url;
          const categoryLabel = labelForCategory(vendor.category, locale);
          const cityLabel = localizeCityLabel(capitalizeCity(vendor.city), locale);

          return (
            <Link
              key={vendor.id}
              href={vendorUrl(vendor, locale)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={vendor.business_name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">{vendor.business_name.charAt(0)}</span>
                  </div>
                )}
                {/* Category pill */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold rounded-full">
                    {categoryLabel}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-gray-700 transition-colors">
                  {vendor.business_name}
                </h3>

                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <FiMapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {cityLabel}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  {vendor.starting_price ? (
                    <div>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">From</p>
                      <p className="text-sm font-bold text-gray-900">{vendor.starting_price.toLocaleString()} MAD</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Price on request</p>
                  )}

                  <span className="w-9 h-9 rounded-full bg-[#D9FF0A] flex items-center justify-center group-hover:bg-[#c8f000] transition-colors flex-shrink-0">
                    <FiArrowRight className="w-4 h-4 text-[#11190C]" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
