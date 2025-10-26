'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  CreditCard,
  Tag,
  BarChart3,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Vendors', href: '/admin/vendors', icon: Users },
  { name: 'Users', href: '/admin/users', icon: UserCheck },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Blog & SEO', href: '/admin/blog-seo', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href || pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-wv.card shadow-soft border border-wv.line hover:bg-wv.line focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
          aria-label="Toggle sidebar"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen bg-wv.card shadow-card border-r border-wv.line z-40
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-wv.line">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-wv.lime rounded-lg flex items-center justify-center">
                <span className="text-wv.black font-bold text-sm">W</span>
              </div>
              <span className="font-semibold text-wv.text">Wervice Admin</span>
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-1.5 rounded-lg hover:bg-wv.line focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={16} className={`transition-transform ${isCollapsed ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? 'bg-wv.lime text-wv.black border-l-4 border-wv.limeDark'
                    : 'text-wv.sub hover:bg-wv.line hover:text-wv.text'
                  }
                  ${isCollapsed ? 'justify-center px-2' : ''}
                `}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={18} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-wv.danger
              hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300
              ${isCollapsed ? 'justify-center px-2' : ''}
            `}
            aria-label="Logout"
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}

