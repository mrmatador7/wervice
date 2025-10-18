'use client';

import { Vendor } from '@/lib/types/vendor';
import VendorCard from './VendorCard';
import VendorEmptyState from './VendorEmptyState';
import VendorPagination from './VendorPagination';
import { Suspense } from 'react';

interface VendorGridProps {
  vendors: Vendor[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

function VendorCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 md:p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

function VendorGrid({
  vendors,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  onClearFilters,
}: VendorGridProps) {
  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <VendorCardSkeleton key={i} />
          ))}
        </div>
        <div className="flex justify-center">
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
      </>
    );
  }

  if (vendors.length === 0) {
    return <VendorEmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>

      {totalPages > 1 && (
        <VendorPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}

export default VendorGrid;
