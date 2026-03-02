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
    <div className="animate-pulse rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
      <div className="aspect-[4/3] rounded-[20px] bg-gray-200" />
      <div className="space-y-4 px-2 pt-6">
        <div className="mx-auto h-7 w-3/4 rounded bg-gray-200" />
        <div className="h-14 rounded-full bg-gray-200" />
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
