'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import DashboardSidebar from './DashboardSidebar';
import DashboardOverview from './DashboardOverview';
import DashboardFavorites from './DashboardFavorites';
import DashboardVendors from './DashboardVendors';
import DashboardPlanner from './DashboardPlanner';
import DashboardBudget from './DashboardBudget';
import DashboardSettings from './DashboardSettings';
import DashboardRecommendations from './DashboardRecommendations';

interface DashboardClientProps {
  user: User;
  profile: any;
  favorites: any[];
  locale: string;
}

type ActiveTab = 'overview' | 'favorites' | 'vendors' | 'planner' | 'budget' | 'recommendations' | 'settings';

export default function DashboardClient({ user, profile, favorites, locale }: DashboardClientProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as ActiveTab | null;
  const [activeTab, setActiveTab] = useState<ActiveTab>(tabParam || 'overview');

  // Update active tab when URL changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          userName={profile?.full_name || user.email?.split('@')[0] || 'User'}
        />

        {/* Main Content */}
        <main className="flex-1 ml-[280px] p-8">
          {activeTab === 'overview' && (
            <DashboardOverview 
              profile={profile}
              favorites={favorites}
              locale={locale}
            />
          )}
          {activeTab === 'favorites' && (
            <DashboardFavorites favorites={favorites} locale={locale} />
          )}
          {activeTab === 'vendors' && (
            <DashboardVendors profile={profile} locale={locale} />
          )}
          {activeTab === 'planner' && (
            <DashboardPlanner profile={profile} />
          )}
          {activeTab === 'budget' && (
            <DashboardBudget profile={profile} />
          )}
          {activeTab === 'recommendations' && (
            <DashboardRecommendations profile={profile} locale={locale} />
          )}
          {activeTab === 'settings' && (
            <DashboardSettings user={user} profile={profile} />
          )}
        </main>
      </div>
    </div>
  );
}

