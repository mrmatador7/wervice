import VendorCard from './VendorCard';
import SkeletonCard from './SkeletonCard';
import { CurrencyCode } from '@/lib/types/vendor';

interface VendorGridProps {
  vendors: any[];
  isLoading?: boolean;
  currency?: CurrencyCode;
}

export default function VendorGrid({
  vendors,
  isLoading,
  currency = 'MAD'
}: VendorGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 xl:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!vendors?.length) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-wv-black mb-2">No vendors found</h3>
        <p className="text-neutral-600 mb-6 max-w-md mx-auto">
          Try adjusting your search terms, city, or price range to find more options.
        </p>
        <button
          onClick={() => window.location.href = window.location.pathname}
          className="inline-flex items-center px-6 py-3 bg-wv-lime hover:bg-wv-limeDark text-wv-black font-semibold rounded-full transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 xl:gap-8">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          currency={currency}
        />
      ))}
    </div>
  );
}
