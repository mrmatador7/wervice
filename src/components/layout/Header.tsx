"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import LanguageCurrencyDropdown from "../ui/LanguageDropdown";
import { useUser } from "@/contexts/UserContext";
import { useLocale } from "@/contexts/LocaleContext";

export default function Header() {
  const { locale: currentLocale } = useLocale();
  const { user, profile, signOut } = useUser();
  const userType = profile?.user_type ?? 'user';
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only showing auth buttons after client-side mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header
      className="
          sticky top-0 z-40
          w-full backdrop-blur supports-[backdrop-filter]:bg-[#F3F1EE]/70 bg-[#F3F1EE]/90
          border-b border-black/5
        "
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Left: Logo */}
          <Link href={`/${currentLocale}`} aria-label="Wervice home" className="shrink-0">
            <img
              src="/wervice-logo-black.png"
              alt="Wervice"
              className="h-6 w-auto"
            />
          </Link>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language & Currency */}
            <LanguageCurrencyDropdown />

            {/* Auth-related buttons - only render on client to prevent hydration mismatch */}
            {isClient && (
              <>
                {/* Admin Dashboard - For admin and super_admin users */}
                {user && (userType === 'admin' || userType === 'super_admin') ? (
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100"
                  >
                    Admin
                  </Link>
                ) : user ? (
                  /* Dashboard - For regular authenticated users */
                  <Link
                    href={`/${currentLocale}/dashboard`}
                    className="inline-flex items-center rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-[#11190C] shadow-sm hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                ) : null}

                {/* Sign In / Sign Out */}
                {user ? (
                  <button
                    onClick={signOut}
                    className="inline-flex items-center rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-[#11190C] shadow-sm hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href={`/${currentLocale}/auth/signin`}
                    className="inline-flex items-center rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-[#11190C] shadow-sm hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}

            {/* Become a Vendor */}
            <Link
              href={`/${currentLocale}/become-vendor`}
              className="inline-flex items-center rounded-lg bg-[#D9FF0A] px-3.5 py-2 text-sm font-semibold text-[#11190C] shadow-sm hover:brightness-95"
            >
              Become a Vendor
            </Link>

            {/* Mobile menu (optional) */}
            <button className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white shadow-sm hover:bg-gray-50" aria-label="Open menu">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}