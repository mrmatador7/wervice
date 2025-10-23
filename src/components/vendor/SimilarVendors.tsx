import Link from 'next/link';
import Image from 'next/image';
import { labelForCategory } from '@/lib/categories';
import { capitalizeCity } from '@/lib/utils';
import type { SimilarVendor } from '@/lib/db/vendors';

interface SimilarVendorsProps {
  items: SimilarVendor[];
  locale: string;
}

export default function SimilarVendors({ items, locale }: SimilarVendorsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Similar Vendors</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((vendor) => {
          const categoryLabel = labelForCategory(vendor.category);
          const cityLabel = capitalizeCity(vendor.city);
          const imageUrl = vendor.profile_photo_url || vendor.gallery_photos?.[0];

          return (
            <Link
              key={vendor.id}
              href={`/${locale}/vendors/${vendor.slug}`}
              className="group rounded-2xl border border-zinc-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={vendor.business_name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100" />
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                {/* Title */}
                <h3 className="font-semibold text-zinc-900 truncate group-hover:text-zinc-700 transition">
                  {vendor.business_name}
                </h3>

                {/* Meta */}
                <p className="text-sm text-zinc-500">
                  {categoryLabel} • {cityLabel}
                </p>

                {/* Price */}
                {vendor.starting_price ? (
                  <p className="text-sm font-medium text-zinc-700">
                    From MAD {vendor.starting_price.toLocaleString()}
                  </p>
                ) : (
                  <p className="text-sm text-zinc-500">Price on request</p>
                )}

                {/* CTA */}
                <div className="pt-2">
                  <span className="text-sm font-medium text-zinc-900 group-hover:underline">
                    View Vendor →
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

