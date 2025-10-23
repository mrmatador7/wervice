import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { labelForCategory } from '@/lib/categories';
import { capitalizeCity } from '@/lib/utils';
import type { VendorDetail } from '@/lib/db/vendors';

interface VendorHeroProps {
  vendor: VendorDetail;
  locale: string;
}

export default function VendorHero({ vendor, locale }: VendorHeroProps) {
  const categoryLabel = labelForCategory(vendor.category);
  const cityLabel = capitalizeCity(vendor.city);
  const heroImage = vendor.profile_photo_url || vendor.gallery_photos?.[0];

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-zinc-600">
        <Link href={`/${locale}`} className="hover:text-zinc-900 transition">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/${locale}/vendors`} className="hover:text-zinc-900 transition">
          Vendors
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link 
          href={`/${locale}/vendors?category=${vendor.category}`} 
          className="hover:text-zinc-900 transition"
        >
          {categoryLabel}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-zinc-900 font-medium">{vendor.business_name}</span>
      </nav>

      {/* Hero Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Info */}
          <div className="flex flex-col justify-center space-y-4">
            <div>
              {vendor.plan && (
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 mb-3">
                  {vendor.plan === 'premium' ? '⭐ Premium' : vendor.plan === 'verified' ? '✓ Verified' : 'Standard'}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 leading-tight">
                {vendor.business_name}
              </h1>
              <p className="mt-2 text-lg text-zinc-600">
                {categoryLabel} • {cityLabel}
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-100">
              {vendor.starting_price ? (
                <div className="space-y-1">
                  <p className="text-sm text-zinc-500">Starting from</p>
                  <p className="text-2xl font-bold text-zinc-900">
                    MAD {vendor.starting_price.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-lg text-zinc-600">Price on request</p>
              )}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative aspect-[4/3] lg:aspect-[3/2] overflow-hidden rounded-xl">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={vendor.business_name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100 flex items-center justify-center">
                <span className="text-zinc-400 text-lg">No image available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

