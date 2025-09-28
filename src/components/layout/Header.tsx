'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { HeaderProps } from '@/models/types';
import LanguageSwitcher from '../ui/LanguageSwitcher';



export default function Header({ }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('header');
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-black text-lime-400 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale === 'en' ? '' : locale}`} className="flex items-center hover:opacity-80 transition-opacity">
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
