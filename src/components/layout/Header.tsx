"use client";
import Link from "next/link";

export default function Header(){
  return (
    <header
      className="
        sticky top-0 z-40
        w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90
        border-b border-black/5
      "
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Left: Logo */}
          <Link href="/" aria-label="Wervice home" className="shrink-0">
            <img
              src="/wervice-logo-black.png"
              alt="Wervice"
              className="h-6 w-auto"
            />
          </Link>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language */}
            <button
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#11190C] shadow-sm hover:bg-[#F3F1EE]"
              aria-label="Language & currency"
            >
              EN | USD
              <svg width="14" height="14" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
            </button>

            {/* Sign In */}
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-[#11190C] shadow-sm hover:bg-[#F3F1EE]"
            >
              Sign In
            </Link>

            {/* Become a Vendor */}
            <Link
              href="/become-vendor"
              className="inline-flex items-center rounded-lg bg-[#D9FF0A] px-3.5 py-2 text-sm font-semibold text-[#11190C] shadow-sm hover:brightness-95"
            >
              Become a Vendor
            </Link>

            {/* Mobile menu (optional) */}
            <button className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white shadow-sm" aria-label="Open menu">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}