'use client';

import { useState } from 'react';
import { VendorCard, Vendor } from './VendorCard';

interface VendorGridProps {
  vendors: Vendor[];
  total: number;
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
}

export function VendorGrid({
  vendors,
  total,
  currentPage,
  totalPages,
  isLoading = false
}: VendorGridProps) {

  if (vendors.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-24 h-24 bg-[#F3F1EE] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#11190C] mb-2">
          No vendors match your filters
        </h3>
        <p className="text-neutral-600 mb-6 max-w-md mx-auto">
          Try adjusting your search terms, city, or price range to find more options.
        </p>
        <button
          onClick={() => window.location.href = window.location.pathname}
          className="inline-flex items-center px-6 py-3 bg-[#D9FF0A] hover:bg-[#D9FF0A]/90 text-[#11190C] font-semibold rounded-full transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results count */}
      <div className="text-center">
        <p className="text-sm text-neutral-600">
          Showing {vendors.length} of {total.toLocaleString()} vendor{vendors.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7 xl:gap-8">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}

        {/* Loading skeletons */}
        {isLoading && Array.from({ length: 8 }).map((_, i) => (
          <VendorCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>

      {/* Load More Button */}
      {currentPage < totalPages && (
        <div className="text-center pt-8">
          <a
            href={`?page=${currentPage + 1}`}
            className="inline-flex items-center px-8 py-4 bg-[#11190C] hover:bg-black text-white font-semibold rounded-full transition-colors"
          >
            Load More Vendors ({total - vendors.length} remaining)
          </a>
        </div>
      )}
    </div>
  );
}

// Loading skeleton for vendor cards
function VendorCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-neutral-200" />

      {/* Content skeleton */}
      <div className="p-4 md:p-5 space-y-3">
        {/* Name skeleton */}
        <div className="h-5 bg-neutral-200 rounded w-3/4" />

        {/* Location skeleton */}
        <div className="h-4 bg-neutral-200 rounded w-1/2" />

        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 bg-neutral-200 rounded w-16" />
          <div className="h-4 bg-neutral-200 rounded w-12" />
        </div>

        {/* Features skeleton */}
        <div className="flex gap-1.5">
          <div className="h-5 bg-neutral-200 rounded-full w-16" />
          <div className="h-5 bg-neutral-200 rounded-full w-20" />
        </div>

        {/* Price and CTA skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-neutral-200 rounded w-24" />
          <div className="h-9 bg-neutral-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}
