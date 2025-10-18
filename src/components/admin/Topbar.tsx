'use client';

import { useState } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('This Month');
  const [language, setLanguage] = useState('EN');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const dateRanges = ['Today', 'This Week', 'This Month', 'Last 30 Days', 'Custom'];
  const languages = ['EN', 'FR', 'AR'];

  return (
    <header className="sticky top-0 z-30 bg-wv.card shadow-soft border-b border-wv.line">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wv.sub" size={18} />
            <input
              type="text"
              placeholder="Search vendors, users, bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-wv.bg border border-wv.line rounded-lg text-sm placeholder-wv.sub focus:outline-none focus:ring-2 focus:ring-wv.limeDark focus:border-transparent"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-4">
          {/* Date Range Selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-wv.bg border border-wv.line rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-wv.limeDark focus:border-transparent"
              aria-label="Select date range"
            >
              {dateRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-wv.sub pointer-events-none" size={16} />
          </div>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-wv.bg border border-wv.line rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-wv.limeDark focus:border-transparent"
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-wv.sub pointer-events-none" size={16} />
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-wv.line focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-wv.sub" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-wv.danger rounded-full"></span>
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-wv.line focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
              aria-label="Admin menu"
              aria-expanded={showProfileMenu}
            >
              <div className="w-8 h-8 bg-wv.lime rounded-full flex items-center justify-center">
                <User size={16} className="text-wv.black" />
              </div>
              <ChevronDown size={16} className="text-wv.sub" />
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-wv.card rounded-lg shadow-card border border-wv.line py-2 z-20">
                  <a
                    href="/admin/profile"
                    className="block px-4 py-2 text-sm text-wv.text hover:bg-wv.line"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Profile
                  </a>
                  <a
                    href="/admin/settings"
                    className="block px-4 py-2 text-sm text-wv.text hover:bg-wv.line"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Settings
                  </a>
                  <hr className="my-2 border-wv.line" />
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-wv.danger hover:bg-red-50"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

