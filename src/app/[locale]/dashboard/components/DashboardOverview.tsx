'use client';

import Link from 'next/link';
import { FiArrowRight, FiHeart, FiMessageCircle, FiCalendar, FiTrendingUp } from 'react-icons/fi';

interface DashboardOverviewProps {
  profile: any;
  favorites: any[];
  locale: string;
}

export default function DashboardOverview({ profile, favorites, locale }: DashboardOverviewProps) {
  const weddingDate = profile?.wedding_date ? new Date(profile.wedding_date) : null;
  const daysUntilWedding = weddingDate 
    ? Math.ceil((weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const city = profile?.city || 'Morocco';
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#11190C]">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Ready to plan your dream wedding in {city}?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#11190C] transition-colors">
            This Month
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#11190C] border border-gray-200 rounded-lg transition-colors">
            Reset Data
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wedding Countdown */}
        <div className="bg-gradient-to-br from-[#D9FF0A] to-[#BEE600] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-[#11190C]" />
            </div>
            <button className="text-[#11190C] opacity-60 hover:opacity-100">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          <div>
            <h3 className="text-[#11190C] font-semibold mb-2">Wedding Countdown</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#11190C]">
                {daysUntilWedding || '---'}
              </span>
              <span className="text-sm text-[#11190C]/70 font-medium">
                {daysUntilWedding ? 'days left' : 'Set your date'}
              </span>
            </div>
          </div>
          <Link
            href={`/${locale}/vendors`}
            className="mt-6 flex items-center gap-2 text-[#11190C] font-medium hover:gap-3 transition-all"
          >
            <span>Set date</span>
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Favorites Saved */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
              <FiHeart className="w-6 h-6 text-red-500" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          <div>
            <h3 className="text-gray-600 font-semibold mb-2">Favorites Saved</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#11190C]">
                {favorites.length}
              </span>
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <FiTrendingUp className="w-4 h-4" />
                +3.2%
              </span>
            </div>
          </div>
          <Link
            href={`/${locale}/vendors`}
            className="mt-6 flex items-center gap-2 text-gray-600 font-medium hover:text-[#11190C] hover:gap-3 transition-all"
          >
            <span>View summary</span>
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Vendors Contacted */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
              <FiMessageCircle className="w-6 h-6 text-blue-500" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          <div>
            <h3 className="text-gray-600 font-semibold mb-2">Vendors Contacted</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#11190C]">0</span>
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <FiTrendingUp className="w-4 h-4" />
                +4.7%
              </span>
            </div>
          </div>
          <Link
            href={`/${locale}/vendors`}
            className="mt-6 flex items-center gap-2 text-gray-600 font-medium hover:text-[#11190C] hover:gap-3 transition-all"
          >
            <span>Analyze performance</span>
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Continue Planning CTA */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#11190C] mb-2">
              Continue Planning Your Wedding
            </h2>
            <p className="text-gray-600 max-w-xl">
              Browse thousands of verified vendors in {city}. Find venues, photographers, caterers, and more.
            </p>
          </div>
          <Link
            href={`/${locale}`}
            className="px-8 py-4 bg-[#11190C] text-white rounded-full font-semibold hover:bg-[#2A2F25] transition-all shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            Browse Vendors
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Recent Favorites */}
      {favorites.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#11190C]">Recently Saved</h2>
            <Link
              href={`/${locale}/vendors`}
              className="text-sm text-gray-600 hover:text-[#11190C] font-medium flex items-center gap-1"
            >
              View all
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {favorites.slice(0, 3).map((fav: any) => (
              <div
                key={fav.id}
                className="group p-4 rounded-2xl border border-gray-100 hover:border-[#D9FF0A] hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 mb-3 overflow-hidden">
                  {fav.vendor?.cover && (
                    <img
                      src={fav.vendor.cover}
                      alt={fav.vendor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <h3 className="font-semibold text-[#11190C] mb-1 line-clamp-1">
                  {fav.vendor?.name || 'Vendor'}
                </h3>
                <p className="text-sm text-gray-500">
                  {fav.vendor?.category || 'Category'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
