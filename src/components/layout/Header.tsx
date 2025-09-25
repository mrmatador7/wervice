'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeaderProps } from '@/models/types';
import WerviceSearchBar from '../ui/WerviceSearchBar';



export default function Header({}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black text-lime-400 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src="/wervice-logo.png"
              alt="Wervice Logo"
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

            {/* Action Buttons - Right side */}
            <div className="flex items-center space-x-3 w-40 justify-end">
              <button className="btn-primary font-ui-primary text-sm md:text-base uppercase tracking-wide">Sign Up</button>
              <button className="btn-primary font-ui-primary text-sm md:text-base uppercase tracking-wide">Login</button>
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


              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 pt-2">
                <button className="btn-primary w-full">Sign Up</button>
                <button className="btn-primary w-full">Login</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
