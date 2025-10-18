'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiStar, FiMapPin } from 'react-icons/fi';
import { Vendor } from '@/lib/types/vendor';

interface VendorsFeaturedBlockProps {
  vendors: Vendor[];
  city?: string;
  category?: string;
}

export default function VendorsFeaturedBlock({ vendors, city, category }: VendorsFeaturedBlockProps) {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  if (!vendors.length) return null;

  const displayVendors = vendors.slice(0, 6); // Show max 6 featured vendors
  const locationText = city ? city : 'Morocco';
  const categoryText = category ? `${category} vendors` : 'wedding vendors';

  return (
    <section className="py-12 bg-[#F3F1EE]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#11190C] mb-2">
            Featured {categoryText} in {locationText}
          </h2>
          <p className="text-[#787664] text-lg">
            Discover top-rated professionals trusted by couples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayVendors.map((vendor) => (
            <Link
              key={vendor.slug}
              href={`/${currentLocale}/vendors/${vendor.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl border border-[#CAC4B7] shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={vendor.profile_photo_url || '/placeholder-vendor.jpg'}
                    alt={vendor.business_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-[#11190C] rounded-full">
                      {vendor.category}
                    </span>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-[#11190C] text-lg mb-1 group-hover:text-[#D9FF0A] transition-colors">
                    {vendor.business_name}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-[#787664] mb-3">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="w-4 h-4" />
                      <span>{vendor.city}</span>
                    </div>
                    {vendor.rating && (
                      <div className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 fill-[#D9FF0A] text-[#D9FF0A]" />
                        <span>{vendor.rating}</span>
                        {/* TODO: Add reviews count to schema */}
                      </div>
                    )}
                  </div>

                  {/* Price range */}
                  {vendor.starting_price && (
                    <div className="text-[#11190C] font-medium">
                      From MAD {vendor.starting_price.toLocaleString()}+
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
