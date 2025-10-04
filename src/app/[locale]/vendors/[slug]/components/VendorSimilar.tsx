import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiMapPin } from 'react-icons/fi';
import { Vendor } from '@/lib/types';

interface VendorSimilarProps {
  vendors: Vendor[];
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={`/vendors/${vendor.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-[0_6px_18px_rgba(17,25,12,0.06)] ring-1 ring-black/5 hover:shadow-[0_8px_24px_rgba(17,25,12,0.08)] hover:ring-black/10 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={vendor.coverImage}
          alt={vendor.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          {vendor.category.replace('-', ' ')}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[#11190C] mb-2 line-clamp-1 group-hover:text-[#D9FF0A] transition-colors">
          {vendor.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <FiMapPin className="w-4 h-4 text-[#787664]" />
          <span className="text-sm text-[#787664] truncate">{vendor.city}</span>
        </div>

        {vendor.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 fill-[#D9FF0A] text-[#D9FF0A]" />
              <span className="text-sm font-medium text-[#11190C]">{vendor.rating}</span>
            </div>
            {vendor.reviewsCount && (
              <span className="text-sm text-[#787664]">({vendor.reviewsCount})</span>
            )}
          </div>
        )}

        {vendor.priceRange?.from && (
          <div className="text-sm font-medium text-[#11190C]">
            From {vendor.priceRange.from.toLocaleString()} {vendor.priceRange.currency || 'MAD'}
          </div>
        )}
      </div>
    </Link>
  );
}

export function VendorSimilar({ vendors }: VendorSimilarProps) {
  if (vendors.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#11190C] mb-2">Similar Vendors</h2>
        <p className="text-[#787664]">Explore more options in the same category</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.slug} vendor={vendor} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/vendors"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D9FF0A] text-[#11190C] font-semibold rounded-xl hover:bg-[#c4e600] transition-colors"
        >
          View All Vendors
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
