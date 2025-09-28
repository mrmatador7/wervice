'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { HeaderProps } from '@/models/types';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';




export default function Header({ }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isLoading: isLoadingAuth } = useAuth();
  const t = useTranslations('header');
  const locale = useLocale();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    console.log('🚪 Signing out user...');
    try {
      await supabase.auth.signOut();
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-black text-lime-400 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src="/wervice-logo.png"
              alt="Wervice Logo"
              className="h-8 w-auto"
              width="120"
              height="32"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-end flex-1">
            {/* Action Links - Right side */}
            <div className="flex items-center space-x-3 w-40 justify-end">
              <LanguageSwitcher />
              {isLoadingAuth ? (
                // Loading auth state
                <div className="w-8 h-8 bg-lime-400/20 rounded-full animate-pulse"></div>
              ) : user ? (
                // User is authenticated - show user dropdown
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-lime-400 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center text-black font-semibold">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm">▼</span>
                  </button>

                  {/* User Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-black border border-lime-400/20 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <Link
                          href={`/${locale}/profile`}
                          className="block px-4 py-2 text-sm text-lime-400 hover:bg-lime-400/10 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          href={`/${locale}/dashboard`}
                          className="block px-4 py-2 text-sm text-lime-400 hover:bg-lime-400/10 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href={`/${locale}/reservations`}
                          className="block px-4 py-2 text-sm text-lime-400 hover:bg-lime-400/10 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Reservations
                        </Link>
                        <Link
                          href={`/${locale}/help`}
                          className="block px-4 py-2 text-sm text-lime-400 hover:bg-lime-400/10 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Help Center
                        </Link>
                        <hr className="border-lime-400/20 my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-lime-400 hover:bg-lime-400/10 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // User is not authenticated - show auth links
                <>
                  <Link href={`/${locale}/auth/signup`} className="btn-auth font-ui-primary uppercase tracking-wide">{t('signUp')}</Link>
                  <Link href={`/${locale}/auth/signin`} className="btn-auth font-ui-primary uppercase tracking-wide">{t('login')}</Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-lime-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 pb-6 border-t border-lime-400/20 pt-4">
            <div className="flex flex-col space-y-4">
              {/* Action Links */}
              <div className="flex flex-col space-y-3 pt-2">
                <LanguageSwitcher />
                {isLoadingAuth ? (
                  // Loading auth state for mobile
                  <div className="flex justify-center py-4">
                    <div className="w-8 h-8 bg-lime-400/20 rounded-full animate-pulse"></div>
                  </div>
                ) : user ? (
                  // User is authenticated - show user menu items
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 bg-lime-400/10 rounded-md">
                      <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center text-black font-semibold">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-lime-400 text-sm">{user.email}</span>
                    </div>
                    <Link href={`/${locale}/profile`} className="block btn-auth w-full text-center">Profile</Link>
                    <Link href={`/${locale}/dashboard`} className="block btn-auth w-full text-center">Dashboard</Link>
                    <Link href={`/${locale}/reservations`} className="block btn-auth w-full text-center">Reservations</Link>
                    <Link href={`/${locale}/help`} className="block btn-auth w-full text-center">Help Center</Link>
                    <button onClick={handleLogout} className="btn-auth w-full text-center">Logout</button>
                  </div>
                ) : (
                  // User is not authenticated - show auth links
                  <>
                    <Link href={`/${locale}/auth/signup`} className="btn-auth w-full text-center">{t('signUp')}</Link>
                    <Link href={`/${locale}/auth/signin`} className="btn-auth w-full text-center">{t('login')}</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
