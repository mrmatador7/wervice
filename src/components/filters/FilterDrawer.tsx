'use client';

import { useState } from 'react';
import PriceFilter from './PriceFilter';

interface FilterDrawerProps {
  cityName: string;
  category: string;
  onPriceChange: (minPrice: number | null, maxPrice: number | null) => void;
}

export default function FilterDrawer({ cityName, category, onPriceChange }: FilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-wervice-sand/50 rounded-full text-wervice-ink font-medium hover:border-wervice-sand transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          Filters
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-wervice-sand/20">
                <h2 className="text-lg font-semibold text-wervice-ink">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-wervice-sand/10 transition-colors"
                  aria-label="Close filters"
                >
                  <svg className="w-5 h-5 text-wervice-taupe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <PriceFilter
                  cityName={cityName}
                  category={category}
                  onPriceChange={onPriceChange}
                />
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-wervice-sand/20">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2 bg-wervice-lime text-black rounded-full font-medium hover:bg-[#c4e600] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
