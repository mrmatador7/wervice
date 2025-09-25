'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { HeaderProps } from '@/models/types';
import WerviceSearchBar from '../ui/WerviceSearchBar';
import LanguageSwitcher from '../ui/LanguageSwitcher';



export default function Header({}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('header');

  return (
    <header className="sticky top-0 z-50 bg-black text-lime-400 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/wervice-logo.png"
              alt="Wervice Logo"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1">
            {/* Left spacer for centering */}
            <div className="w-40"></div>

            {/* Search Bar - Centered */}
            <div className="max-w-lg w-full flex justify-center">
              <WerviceSearchBar
                onSearch={(location, category) => {
                  console.log('Search:', { location, category });
                  // Handle search logic here
                }}
              />
            </div>

            {/* Action Links - Right side */}
            <div className="flex items-center space-x-3 w-40 justify-end">
              <LanguageSwitcher />
              <Link href="/signup" className="btn-auth font-ui-primary uppercase tracking-wide">{t('signUp')}</Link>
              <Link href="/login" className="btn-auth font-ui-primary uppercase tracking-wide">{t('login')}</Link>
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
              {/* Search Bar - Mobile */}
              <div className="px-2">
                <WerviceSearchBar
                  onSearch={(location, category) => {
                    console.log('Mobile Search:', { location, category });
                    // Handle search logic here
                  }}
                />
              </div>


              {/* Action Links */}
              <div className="flex flex-col space-y-3 pt-2">
                <LanguageSwitcher />
                <Link href="/signup" className="btn-auth w-full text-center">{t('signUp')}</Link>
                <Link href="/login" className="btn-auth w-full text-center">{t('login')}</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
