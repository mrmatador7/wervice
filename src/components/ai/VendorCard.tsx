'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, MessageCircle } from 'lucide-react';
import { vendorUrl } from '@/lib/vendor-url';

interface VendorCardProps {
  vendor: {
    id: string;
    name: string;
    city: string;
    category: string;
    priceFrom: number;
    whatsapp: string;
    image: string;
    slug: string;
  };
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in ${vendor.name} for my wedding. Can you share more details?`
  );
  const whatsappLink = `https://wa.me/${vendor.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Image */}
      <div className="relative h-32 bg-gray-100">
        <Image
          src={vendor.image}
          alt={vendor.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
          {vendor.name}
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <span>{vendor.city}</span>
          <span>•</span>
          <span>{vendor.category}</span>
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-3">
          Starting from <span className="text-[#D9FF0A] bg-[#0B0F0A] px-2 py-0.5 rounded">{vendor.priceFrom}</span> MAD
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={vendorUrl({ city: vendor.city, category: vendor.category, slug: vendor.slug }, 'en')}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            View
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <MessageCircle className="w-3 h-3" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

