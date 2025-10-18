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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-gray-200 rounded-t-lg" />
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function VendorGrid({
  vendors,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  onClearFilters,
}: VendorGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <VendorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (vendors.length === 0) {
    return <VendorEmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
