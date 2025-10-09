'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';

interface VendorRecommendation {
  vendor: any;
  score: number;
  reasons: string[];
}

export default function AccountPage() {
  const t = useTranslations('account');
  const { locale } = useParams() as { locale: string };
  const [recommendations, setRecommendations] = useState<Record<string, VendorRecommendation[]>>({});
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);

  // Load vendor recommendations on mount
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await fetch(`/${locale}/api/recommend/vendors`);
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations || {});
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    loadRecommendations();
  }, [locale]);

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title', { defaultValue: 'My Account' })}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('subtitle', { defaultValue: 'Welcome to your account dashboard. Manage your profile, bookings, and preferences.' })}
            </p>
          </div>

          {/* Account Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('profile.title', { defaultValue: 'Profile' })}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('profile.description', { defaultValue: 'Manage your personal information and preferences.' })}
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                {t('profile.action', { defaultValue: 'Edit Profile →' })}
              </button>
            </div>

            {/* Bookings Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('bookings.title', { defaultValue: 'My Bookings' })}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('bookings.description', { defaultValue: 'View and manage your wedding service bookings.' })}
              </p>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                {t('bookings.action', { defaultValue: 'View Bookings →' })}
              </button>
            </div>

            {/* Favorites Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('favorites.title', { defaultValue: 'Favorites' })}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('favorites.description', { defaultValue: 'Your saved vendors and wedding ideas.' })}
              </p>
              <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                {t('favorites.action', { defaultValue: 'View Favorites →' })}
              </button>
            </div>

            {/* Settings Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('settings.title', { defaultValue: 'Settings' })}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('settings.description', { defaultValue: 'Configure your account preferences and notifications.' })}
              </p>
              <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                {t('settings.action', { defaultValue: 'Account Settings →' })}
              </button>
            </div>

            {/* Support Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('support.title', { defaultValue: 'Help & Support' })}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('support.description', { defaultValue: 'Get help with your account and bookings.' })}
              </p>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                {t('support.action', { defaultValue: 'Contact Support →' })}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t('stats.title', { defaultValue: 'Your Wedding Journey' })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">--</div>
                <div className="text-gray-600">
                  {t('stats.daysLeft', { defaultValue: 'Days Until Wedding' })}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">--</div>
                <div className="text-gray-600">
                  {t('stats.servicesBooked', { defaultValue: 'Services Booked' })}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">--</div>
                <div className="text-gray-600">
                  {t('stats.totalSaved', { defaultValue: 'Total Saved' })}
                </div>
              </div>
            </div>
          </div>

          {/* Suggested for You Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Suggested for You
            </h2>

            {isLoadingRecommendations ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D9FF0A] mx-auto"></div>
                <p className="text-gray-600 mt-4">Finding perfect vendors for you...</p>
              </div>
            ) : Object.keys(recommendations).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(recommendations).map(([category, vendors]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                      {category.replace('_', ' ')} Vendors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vendors.slice(0, 6).map((rec: VendorRecommendation, index: number) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{rec.vendor.name}</h4>
                            <div className="flex items-center">
                              <span className="text-yellow-400">⭐</span>
                              <span className="text-sm text-gray-600 ml-1">
                                {rec.vendor.rating || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {rec.vendor.description || 'Professional wedding services'}
                          </p>
                          <div className="text-xs text-green-600 mb-3">
                            {rec.reasons.slice(0, 2).join(' • ')}
                          </div>
                          <button className="w-full bg-[#D9FF0A] hover:bg-[#D9FF0A]/90 text-[#11190C] font-medium py-2 px-4 rounded transition-colors text-sm">
                            Contact Vendor
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <p>Complete your onboarding to see personalized vendor recommendations!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
