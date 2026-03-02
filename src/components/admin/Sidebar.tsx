'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  CreditCard,
  Tag,
  MapPin,
  BarChart3,
  MessageSquare,
  FileText,
  Settings,
  Menu,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Vendors', href: '/admin/vendors', icon: Users },
  { name: 'Users', href: '/admin/users', icon: UserCheck },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Cities', href: '/admin/cities', icon: MapPin },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Blog & SEO', href: '/admin/blog-seo', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useUser();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href || pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2.5 rounded-xl bg-white shadow-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Toggle sidebar"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 z-40
        transition-all duration-300 ease-in-out w-[280px]
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base">W</span>
            </div>
            <span className="font-semibold text-gray-900 text-base">Wervice Admin</span>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Main Menu Label */}
        <div className="px-5 py-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Main Menu</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all
                  ${active
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Card */}
        <div className="mx-4 mb-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Upgrade to Pro</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Unlock advanced features and unlimited Generation.
            </p>
          </div>
          <button className="w-full px-4 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
            Upgrade now
          </button>
        </div>

        {/* User Profile */}
        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors group">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@wervice.com'}
              </p>
            </div>
            <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
          </button>
        </div>
      </div>
    </>
  );
}

