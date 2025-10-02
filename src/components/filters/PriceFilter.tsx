'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Popover from '@/components/ui/Popover';
import Sheet from '@/components/ui/Sheet';

// Mock analytics - replace with your actual analytics implementation
const analytics = {
  track: (event: string, data: any) => {
    console.log('Analytics:', event, data);
    // In real app: analytics.track(event, data);
  }
};

interface PriceFilterProps {
  cityName: string;
  category: string;
  onPriceChange?: (minPrice: number | null, maxPrice: number | null) => void;
  className?: string;
}

export default function PriceFilter({
  cityName,
  category,
  onPriceChange,
  className = ''
}: PriceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [tempMinPrice, setTempMinPrice] = useState<number | null>(null);
  const [tempMaxPrice, setTempMaxPrice] = useState<number | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Price range constants
  const MIN_PRICE = 0;
  const MAX_PRICE = 100000;
  const STEP = 500;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync with URL on mount and URL changes
  useEffect(() => {
    const minPriceParam = searchParams.get('min_price');
    const maxPriceParam = searchParams.get('max_price');

    const newMinPrice = minPriceParam ? parseInt(minPriceParam, 10) : null;
    const newMaxPrice = maxPriceParam ? parseInt(maxPriceParam, 10) : null;

    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);

    // Initialize temp values for popover/sheet
    setTempMinPrice(newMinPrice);
    setTempMaxPrice(newMaxPrice);
  }, [searchParams]);

  const updatePriceFilter = useCallback(
    (newMinPrice: number | null, newMaxPrice: number | null) => {
      const newSearchParams = new URLSearchParams(searchParams);

      if (newMinPrice !== null) {
        newSearchParams.set('min_price', newMinPrice.toString());
      } else {
        newSearchParams.delete('min_price');
      }

      if (newMaxPrice !== null) {
        newSearchParams.set('max_price', newMaxPrice.toString());
      } else {
        newSearchParams.delete('max_price');
      }

      // Clear page parameter when changing price filter
      newSearchParams.delete('page');

      const newUrl = newSearchParams.toString()
        ? `?${newSearchParams.toString()}`
        : window.location.pathname;

      router.push(newUrl, { scroll: false });

      // Notify parent
      onPriceChange?.(newMinPrice, newMaxPrice);

      // Track analytics
      if (newMinPrice !== null || newMaxPrice !== null) {
        analytics.track('price_filter_applied', {
          city: cityName,
          category,
          min_price: newMinPrice,
          max_price: newMaxPrice
        });
      }

      setMinPrice(newMinPrice);
      setMaxPrice(newMaxPrice);
    }, [router, searchParams, onPriceChange, cityName, category]
  );

  const handleChipClick = () => {
    if (isMobile) {
      setIsSheetOpen(true);
    } else {
      setIsPopoverOpen(true);
    }
  };

  const handleClose = () => {
    setIsPopoverOpen(false);
    setIsSheetOpen(false);
    // Reset temp values
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
  };

  const handleApply = () => {
    updatePriceFilter(tempMinPrice, tempMaxPrice);
    handleClose();
  };

  const handleReset = () => {
    setTempMinPrice(null);
    setTempMaxPrice(null);
  };

  const handleMinPriceChange = (value: number) => {
    let newMinPrice: number | null;
    if (value === MIN_PRICE) {
      newMinPrice = null;
    } else {
      newMinPrice = value;
      // If max price exists and new min would be greater than max, adjust max
      if (tempMaxPrice !== null && newMinPrice > tempMaxPrice) {
        setTempMaxPrice(newMinPrice);
      }
    }
    setTempMinPrice(newMinPrice);
  };

  const handleMaxPriceChange = (value: number) => {
    let newMaxPrice: number | null;
    if (value === MAX_PRICE) {
      newMaxPrice = null;
    } else {
      newMaxPrice = value;
      // If min price exists and new max would be less than min, adjust min
      if (tempMinPrice !== null && newMaxPrice < tempMinPrice) {
        setTempMinPrice(newMaxPrice);
      }
    }
    setTempMaxPrice(newMaxPrice);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    if (value === null || (value >= MIN_PRICE && value <= MAX_PRICE)) {
      setTempMinPrice(value);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    if (value === null || (value >= MIN_PRICE && value <= MAX_PRICE)) {
      setTempMaxPrice(value);
    }
  };

  const formatPrice = (price: number | null): string => {
    if (price === null) return '';
    return price.toLocaleString();
  };

  const getPriceRangeText = (): string => {
    if (minPrice === null && maxPrice === null) return 'Price';
    if (minPrice === null) return `Up to ${formatPrice(maxPrice)} MAD`;
    if (maxPrice === null) return `${formatPrice(minPrice)}+ MAD`;
    return `${formatPrice(minPrice)}–${formatPrice(maxPrice)} MAD`;
  };

  const isActive = minPrice !== null || maxPrice !== null;

  const PriceFilterContent = () => (
    <div className="space-y-4">
      {/* Price Range Inputs */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="min-price" className="text-sm font-medium text-[#11190C]">
            Min price (MAD)
          </label>
          <input
            id="min-price"
            type="number"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            value={tempMinPrice || ''}
            onChange={handleMinInputChange}
            placeholder="0"
            className="w-20 px-2 py-1 text-sm border border-[#CAC4B7]/50 rounded focus:outline-none focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A]"
          />
        </div>

        <span className="text-[#787664]">—</span>

        <div className="flex items-center gap-2">
          <label htmlFor="max-price" className="text-sm font-medium text-[#11190C]">
            Max price (MAD)
          </label>
          <input
            id="max-price"
            type="number"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            value={tempMaxPrice || ''}
            onChange={handleMaxInputChange}
            placeholder="100,000"
            className="w-20 px-2 py-1 text-sm border border-[#CAC4B7]/50 rounded focus:outline-none focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A]"
          />
        </div>
      </div>

      {/* Dual Range Slider */}
      <div className="relative">
        <div className="relative h-2 bg-[#CAC4B7]/40 rounded-full">
          {/* Selected range background */}
          <div
            className="absolute top-0 h-2 bg-[#CAC4B7] rounded-full"
            style={{
              left: `${((tempMinPrice || MIN_PRICE) / MAX_PRICE) * 100}%`,
              right: `${100 - (((tempMaxPrice || MAX_PRICE) / MAX_PRICE) * 100)}%`,
            }}
          />
        </div>

        {/* Min price thumb */}
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={tempMinPrice || MIN_PRICE}
          onChange={(e) => handleMinPriceChange(parseInt(e.target.value, 10))}
          className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ zIndex: tempMinPrice !== null ? 3 : 1 }}
          aria-label="Minimum price"
        />

        {/* Max price thumb */}
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={tempMaxPrice || MAX_PRICE}
          onChange={(e) => handleMaxPriceChange(parseInt(e.target.value, 10))}
          className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ zIndex: 2 }}
          aria-label="Maximum price"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleReset}
          className="flex-1 px-4 py-2 text-sm font-medium text-[#11190C] bg-white border border-[#CAC4B7]/50 rounded-lg hover:bg-[#F3F1EE] transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 text-sm font-medium text-black bg-[#D9FF0A] rounded-lg hover:bg-[#c4e600] transition-colors"
        >
          Apply
        </button>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          border: 2px solid #D9FF0A;
          cursor: pointer;
          box-shadow: 0 0 0 2px rgba(217, 255, 10, 0.2);
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .slider-thumb::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          border: 2px solid #D9FF0A;
          cursor: pointer;
          box-shadow: 0 0 0 2px rgba(217, 255, 10, 0.2);
        }
      `}</style>
    </div>
  );

  return (
    <div className={className}>
      {/* Price Filter Chip */}
      <button
        ref={triggerRef}
        onClick={handleChipClick}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
          isActive
            ? 'bg-[#D9FF0A] text-[#11190C]'
            : 'bg-white border border-black/10 text-[#11190C] hover:bg-[#F3F1EE]'
        }`}
        aria-pressed={isActive}
        aria-label="Open price filter"
      >
        {getPriceRangeText()}
      </button>

      {/* Desktop Popover */}
      {!isMobile && (
        <Popover
          isOpen={isPopoverOpen}
          onClose={handleClose}
          triggerRef={triggerRef}
        >
          <PriceFilterContent />
        </Popover>
      )}

      {/* Mobile Sheet */}
      {isMobile && (
        <Sheet
          isOpen={isSheetOpen}
          onClose={handleClose}
        >
          <PriceFilterContent />
        </Sheet>
      )}
    </div>
  );
}
