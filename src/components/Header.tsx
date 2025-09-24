'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeaderProps } from '@/types';
import { NAVBAR_CATEGORIES } from '@/constants';


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
          <div className="hidden md:flex items-center space-x-6">
            {/* Location Picker */}
            <select
              className="w-48 px-4 py-2 rounded-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>Select Location</option>
              <option value="marrakech">Marrakech</option>
              <option value="casablanca">Casablanca</option>
              <option value="agadir">Agadir</option>
              <option value="tangier">Tangier</option>
              <option value="rabat">Rabat</option>
              <option value="fes">Fes</option>
            </select>

            {/* Category Links */}
            <div className="flex items-center space-x-4">
              {NAVBAR_CATEGORIES.map(category => (
                <Link
                  key={category.key}
                  href={`/categories/${category.key}`}
                  className="px-3 py-1 rounded-full text-sm font-medium transition-colors text-lime-400 hover:bg-lime-400 hover:text-black"
                >
                  {category.label}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="btn-primary text-sm px-6 py-2">Sign Up</button>
              <button className="btn-primary text-sm px-6 py-2">Login</button>
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
              {/* Location Picker */}
              <select
                className="w-full px-4 py-3 rounded-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Select Location</option>
                <option value="marrakech">Marrakech</option>
                <option value="casablanca">Casablanca</option>
                <option value="agadir">Agadir</option>
                <option value="tangier">Tangier</option>
                <option value="rabat">Rabat</option>
                <option value="fes">Fes</option>
              </select>

              {/* Category Links */}
              <div className="grid grid-cols-2 gap-2">
                {NAVBAR_CATEGORIES.map(category => (
                  <Link
                    key={category.key}
                    href={`/categories/${category.key}`}
                    className="px-3 py-2 rounded-full text-sm font-medium transition-colors text-lime-400 border border-lime-400 hover:bg-lime-400 hover:text-black text-center"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 pt-2">
                <button className="btn-primary text-sm py-3 w-full">Sign Up</button>
                <button className="btn-primary text-sm py-3 w-full">Login</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
