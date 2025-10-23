'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface VendorPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function VendorPagination({ currentPage, totalPages }: VendorPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set('page', String(page));
    } else {
      params.delete('page');
    }
    router.push(`/en/vendors?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        const pageNum = i + 1;
        return (
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              currentPage === pageNum
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Next
      </button>
    </div>
  );
}
