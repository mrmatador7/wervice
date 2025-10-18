import { Search, RefreshCw } from 'lucide-react';

interface VendorEmptyStateProps {
  onClearFilters: () => void;
}

function VendorEmptyState({ onClearFilters }: VendorEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Search className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-xl font-semibold text-wv-text mb-2">
        No vendors found
      </h3>

      <p className="text-wv-sub mb-6 max-w-md">
        We couldn't find any vendors matching your criteria. Try adjusting your filters or search terms.
      </p>

      <button
        onClick={onClearFilters}
        className="inline-flex items-center gap-2 px-4 py-2 bg-wervice-lime text-wv-text font-medium rounded-lg hover:bg-wervice-limeDark transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Reset filters
      </button>
    </div>
  );
}

export default VendorEmptyState;
