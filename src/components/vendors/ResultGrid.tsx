import VendorCard from "./VendorCard";
import { Vendor, VendorFilters } from "@/lib/types/vendor";
import { labelForCategory } from "@/lib/categories";

interface ResultGridProps {
  vendors: Vendor[];
  totalCount: number;
  currentFilters: VendorFilters;
}

export default function ResultGrid({ vendors, totalCount, currentFilters }: ResultGridProps) {
  const currentPage = currentFilters.page || 1;
  const pageSize = 12; // This should match the PAGE_SIZE in vendors-server.ts
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startItem}–{endItem} of {totalCount} vendors
        </p>
        <select className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
          <option>Relevance</option>
          <option>Rating</option>
          <option>Price (low to high)</option>
          <option>Price (high to low)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </div>
  );
}
