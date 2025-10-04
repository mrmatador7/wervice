"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import CityDropdown from "../ui/CityDropdown";
import CategoryDropdown from "../ui/CategoryDropdown";

// Category slug to display name mapping (matches VENDOR_CATEGORIES)
const categorySlugToDisplay: Record<string, string> = {
  'venues': 'Venues',
  'catering': 'Catering',
  'planning': 'Planning',
  'photo-video': 'Photo & Video',
  'music': 'Music',
  'decor': 'Decor',
  'beauty': 'Beauty',
  'dresses': 'Dresses'
};

// Mock analytics - replace with your actual analytics implementation
const analytics = {
  track: (event: string, data: Record<string, unknown>) => {
    console.log('Analytics:', event, data);
    // In real app: analytics.track(event, data);
  }
};


export default function SearchBarSimple(){
  const router = useRouter();
  const locale = useLocale();
  const p = useSearchParams();
  const [city, setCity] = useState<string>("");
  const [cat, setCat] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Sync component state with URL params
  useEffect(() => {
    setCity(p.get("city") || "");
    setCat(p.get("category") || "");
  }, [p]);

  const isDisabled = !city && !cat;

  const onSearch = async () => {
    if (isDisabled) {
      // Show toast message
      alert("Choose a city or category");
      return;
    }

    setIsLoading(true);

    try {
      // Build URL based on selections
      let url: string;
      const restParams = ""; // For future use with additional params

      if (city && cat) {
        // Both city and category selected
        url = `/${locale}/cities/${city}?category=${cat}${restParams}`;
      } else if (city) {
        // Only city selected
        url = `/${locale}/cities/${city}${restParams}`;
      } else {
        // Only category selected - convert slug to display name for vendors page
        const displayCategory = categorySlugToDisplay[cat] || cat;
        url = `/${locale}/vendors?category=${displayCategory}${restParams}`;
      }

      // Track search event
      analytics.track('search_submitted', {
        city: city || null,
        category: cat || null,
        locale,
        timestamp: new Date().toISOString(),
      });

      // Navigate to destination
      router.push(url, { scroll: false });
    } catch (error) {
      console.error('Search error:', error);
      alert('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl" data-testid="wervice-search">
      <div className="rounded-2xl bg-white bg-clip-padding ring-1 ring-black/10 shadow-[0_8px_22px_rgba(17,25,12,0.06)]">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] items-stretch">

          {/* CITY */}
          <div className="flex items-center px-1 sm:px-2">
            <CityDropdown
              value={city}
              onChange={setCity}
              placeholder="Choose city"
              size="lg"
              className="flex-1"
            />
          </div>

          {/* CATEGORY */}
          <div className="flex items-center px-1 sm:px-2">
            <CategoryDropdown
              value={cat}
              onChange={setCat}
              placeholder="Choose category"
              size="lg"
              className="flex-1"
            />
          </div>

          {/* BUTTON (floating pill) */}
          <div className="relative flex h-16 items-center justify-center p-1">
            <button aria-label="Search vendors"
              className="h-14 w-full rounded-full bg-[#D9FF0A] text-[#11190C] font-semibold
                         inline-flex items-center justify-center gap-2 px-4
                         shadow-md
                         hover:brightness-95 active:scale-[.985]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11190C]/10
                         disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled || isLoading}
              onClick={onSearch}>
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  Search
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}