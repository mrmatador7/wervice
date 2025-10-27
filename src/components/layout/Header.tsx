"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import LanguageCurrencyDropdown from "../ui/LanguageDropdown";
import { useUser } from "@/contexts/UserContext";
import { useLocale } from "@/contexts/LocaleContext";

const MOROCCAN_CITIES = [
  { value: 'all', label: 'All Morocco' },
  { value: 'Marrakech', label: 'Marrakech' },
  { value: 'Casablanca', label: 'Casablanca' },
  { value: 'Rabat', label: 'Rabat' },
  { value: 'Tangier', label: 'Tangier' },
  { value: 'Agadir', label: 'Agadir' },
  { value: 'Fes', label: 'Fès' },
  { value: 'Meknes', label: 'Meknes' },
  { value: 'El Jadida', label: 'El Jadida' },
  { value: 'Kenitra', label: 'Kenitra' }
];

export default function Header() {
  const { locale: currentLocale } = useLocale();
  const { user, profile, signOut } = useUser();
  const userType = profile?.user_type ?? 'user';
  const [isClient, setIsClient] = useState(false);
  const [selectedCity, setSelectedCity] = useState('all');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch by only showing auth buttons after client-side mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (cityValue: string) => {
    setSelectedCity(cityValue);
    setShowLocationDropdown(false);
  };

  const selectedCityLabel = MOROCCAN_CITIES.find(c => c.value === selectedCity)?.label || 'All Morocco';

  return (
    <header
      className="w-full"
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Left: Logo + Location Selector */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href={`/${currentLocale}`} aria-label="Wervice home" className="shrink-0">
              <img
                src="/wervice-logo-black.png"
                alt="Wervice"
                className="h-6 w-auto"
              />
            </Link>

            {/* Location Selector */}
            <div className="hidden md:block">
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-white hover:shadow-sm transition-all"
                >
                  <svg className="w-4 h-4 text-[#11190C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium text-[#11190C]">
                    {selectedCityLabel}
                  </span>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Location Dropdown */}
                {showLocationDropdown && (
                  <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl overflow-hidden min-w-[220px] z-50 border border-gray-100">
                    <div className="p-2 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 px-2">SELECT YOUR CITY</p>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto py-1">
                      {MOROCCAN_CITIES.map((city) => (
                        <button
                          key={city.value}
                          onClick={() => handleCitySelect(city.value)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            selectedCity === city.value 
                              ? 'bg-[#D9FF0A]/10 text-[#11190C] font-semibold' 
                              : 'text-gray-700'
                          }`}
                        >
                          {city.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language & Currency */}
            <LanguageCurrencyDropdown />

            {/* Auth-related buttons - only render on client to prevent hydration mismatch */}
            {isClient && (
              <>
                {user ? (
                  /* User Dropdown Menu */
                  <div ref={userDropdownRef} className="relative">
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-3 py-2 text-sm font-medium text-[#11190C] shadow-sm hover:bg-gray-50 transition-all"
                    >
                      {/* User Avatar/Initial */}
                      <div className="w-7 h-7 rounded-full bg-[#D9FF0A] flex items-center justify-center text-[#11190C] font-semibold text-sm">
                        {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="hidden sm:inline">{profile?.full_name || user.email?.split('@')[0] || 'User'}</span>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserDropdown && (
                      <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl overflow-hidden min-w-[240px] z-50 border border-neutral-100">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50">
                          <p className="text-sm font-semibold text-[#11190C]">{profile?.full_name || 'User'}</p>
                          <p className="text-xs text-neutral-500">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          {/* Admin Dashboard - For admin and super_admin users */}
                          {(userType === 'admin' || userType === 'super_admin') && (
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Admin Dashboard
                            </Link>
                          )}

                          {/* Profile */}
                          <Link
                            href={`/${currentLocale}/account`}
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                          </Link>

                          {/* My Dashboard */}
                          <Link
                            href={`/${currentLocale}/dashboard`}
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            My Dashboard
                          </Link>

                          {/* My Favorites */}
                          <Link
                            href={`/${currentLocale}/favorites`}
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            My Favorites
                          </Link>

                          {/* Settings */}
                          <Link
                            href={`/${currentLocale}/settings`}
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                          </Link>

                          {/* Divider */}
                          <div className="my-1 border-t border-neutral-100"></div>

                          {/* Logout */}
                          <button
                            onClick={() => {
                              setShowUserDropdown(false);
                              signOut();
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Sign In Button */
                  <Link
                    href={`/${currentLocale}/auth/signin`}
                    className="inline-flex items-center rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-[#11190C] shadow-sm hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}

            {/* Become a Vendor - Only show when not logged in */}
            {!user && (
              <Link
                href={`/${currentLocale}/become-vendor`}
                className="inline-flex items-center rounded-lg bg-[#D9FF0A] px-3.5 py-2 text-sm font-semibold text-[#11190C] shadow-sm hover:brightness-95"
              >
                Become a Vendor
              </Link>
            )}

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