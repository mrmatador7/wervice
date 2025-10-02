"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import CityDropdown from "../ui/CityDropdown";
import CategoryDropdown from "../ui/CategoryDropdown";


export default function SearchBarSimple(){
  const router = useRouter();
  const p = useSearchParams();
  const [city, setCity] = useState<string>(p.get("city") || "");
  const [cat, setCat] = useState<string>(p.get("category") || "");

  const isDisabled = !city && !cat;

  const onSearch = () => {
    if (isDisabled) return;

    const q = new URLSearchParams();
    if (city) q.set("city", city.toLowerCase());
    if (cat)  q.set("category", cat.toLowerCase().replace(/ & /g,"-and-").replace(/ /g,"-"));
    router.push(`/search?${q.toString()}`);
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
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11190C]/10"
              disabled={isDisabled}
              onClick={onSearch}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Search
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}