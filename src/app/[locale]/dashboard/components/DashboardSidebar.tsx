'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { 
  FiHome, 
  FiHeart, 
  FiUsers,
  FiCalendar, 
  FiDollarSign,
  FiSettings, 
  FiLogOut, 
  FiStar 
} from 'react-icons/fi';
import { createClient } from '@/lib/supabase-browser';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  userName: string;
}

export default function DashboardSidebar({ activeTab, onTabChange, userName }: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FiHome, badge: null, href: `${pathname}?tab=overview` },
    { id: 'favorites', label: 'Favorites', icon: FiHeart, badge: null, href: `${pathname}?tab=favorites` },
    { id: 'vendors', label: 'Vendor Manager', icon: FiUsers, badge: null, href: `${pathname}?tab=vendors` },
    { id: 'planner', label: 'Wedding Planner', icon: FiCalendar, badge: null, href: `${pathname}?tab=planner` },
    { id: 'budget', label: 'Budget', icon: FiDollarSign, badge: null, href: `${pathname}?tab=budget` },
    { id: 'recommendations', label: 'Recommendations', icon: FiStar, badge: null, href: `${pathname}?tab=recommendations` },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D9FF0A] rounded-xl flex items-center justify-center">
            <span className="text-2xl">💍</span>
          </div>
          <span className="text-xl font-bold text-[#11190C]">Wervice</span>
        </Link>
      </div>

      {/* Welcome */}
      <div className="px-6 py-4">
        <p className="text-sm text-gray-500">Welcome back,</p>
        <h2 className="text-lg font-bold text-[#11190C] truncate">{userName}</h2>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-4 py-4">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Menu
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onTabChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-[#11190C] text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-[#D9FF0A] text-[#11190C] text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* General */}
        <div className="mt-8 space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            General
          </p>
          <Link
            href={`${pathname}?tab=settings`}
            onClick={() => onTabChange('settings')}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${activeTab === 'settings'
                ? 'bg-[#11190C] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <FiSettings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </nav>

      {/* Upgrade Section */}
      <div className="p-4 m-4 bg-gradient-to-br from-[#D9FF0A]/20 to-[#D9FF0A]/5 rounded-2xl border border-[#D9FF0A]/30">
        <div className="flex items-start gap-2 mb-3">
          <span className="text-2xl">✨</span>
          <div>
            <h3 className="font-bold text-[#11190C] text-sm">Premium Planning</h3>
            <p className="text-xs text-gray-600 mt-1">
              Get AI recommendations & priority support
            </p>
          </div>
        </div>
        <button className="w-full bg-[#11190C] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#2A2F25] transition-all">
          Upgrade
        </button>
      </div>
    </aside>
  );
}
