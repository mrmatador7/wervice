'use client';

import Link from 'next/link';
import { FiStar, FiTrendingUp, FiZap, FiArrowRight } from 'react-icons/fi';

interface DashboardRecommendationsProps {
  profile: any;
  locale: string;
}

export default function DashboardRecommendations({ profile, locale }: DashboardRecommendationsProps) {
  const city = profile?.city || 'Morocco';

  // Mock data - in production, this would come from AI/database
  const aiRecommendations = [
    {
      id: 1,
      name: 'Palais Malak',
      category: 'Venues',
      city: 'Tangier',
      image: '/public/venues-1.jpg',
      price: 'From 15,000 MAD',
      reason: 'Based on your favorites',
    },
    {
      id: 2,
      name: 'Studio Lumière',
      category: 'Photography',
      city: 'Casablanca',
      image: '/public/photo.png',
      price: 'From 8,000 MAD',
      reason: 'Popular in your city',
    },
    {
      id: 3,
      name: 'Riad Garden Events',
      category: 'Catering',
      city: 'Marrakech',
      image: '/public/catering.png',
      price: 'From 250 MAD/guest',
      reason: 'Trending this week',
    },
  ];

  const trending = [
    { id: 1, name: 'Garden Venues in Marrakech', count: 42, icon: '🏡' },
    { id: 2, name: 'Top Photographers 2025', count: 38, icon: '📸' },
    { id: 3, name: 'All-in-One Packages', count: 24, icon: '✨' },
    { id: 4, name: 'Traditional Moroccan Catering', count: 31, icon: '🍽️' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#11190C]">Recommendations</h1>
        <p className="text-gray-600 mt-1">
          Personalized vendor suggestions powered by Wervice AI
        </p>
      </div>

      {/* AI Banner */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl p-8 shadow-lg text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center p-3">
            <img 
              src="/Wervice AI.svg" 
              alt="Wervice AI" 
              className="w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Wervice AI Recommendations</h2>
            <p className="text-white/80">Based on your preferences and planning progress</p>
          </div>
        </div>
        <p className="text-white/90">
          We've analyzed your saved vendors, budget, and wedding style to find the perfect matches for you in {city}.
        </p>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#11190C]">For You</h2>
          <button className="text-sm text-gray-600 hover:text-[#11190C] font-medium">
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiRecommendations.map((vendor) => (
            <div
              key={vendor.id}
              className="group rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-[#D9FF0A] transition-all bg-white"
            >
              <div className="relative aspect-[16/9] bg-gradient-to-br from-purple-100 to-blue-100">
                <div className="absolute top-3 left-3 bg-[#D9FF0A] px-3 py-1.5 rounded-full text-xs font-bold text-[#11190C] flex items-center gap-1">
                  <FiZap className="w-3 h-3" />
                  AI Pick
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    {vendor.category}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{vendor.city}</span>
                </div>
                <h3 className="font-bold text-[#11190C] text-lg mb-1">{vendor.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{vendor.price}</p>
                <div className="flex items-center gap-2 mb-4">
                  <FiStar className="w-4 h-4 text-[#D9FF0A]" />
                  <span className="text-xs text-gray-600">{vendor.reason}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Categories */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiTrendingUp className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-[#11190C]">Trending Now</h2>
          </div>
          <Link
            href={`/${locale}`}
            className="text-sm text-gray-600 hover:text-[#11190C] font-medium flex items-center gap-1"
          >
            View all
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trending.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}`}
              className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-[#D9FF0A] hover:shadow-md transition-all bg-white group"
            >
              <div className="text-4xl">{item.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#11190C] group-hover:text-[#11190C] mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500">{item.count} vendors available</p>
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#11190C] group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* New This Week */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#11190C] mb-2">New Vendors This Week</h2>
            <p className="text-gray-600">
              12 new vendors joined in {city}. Be the first to discover them!
            </p>
          </div>
          <Link
            href={`/${locale}`}
            className="px-6 py-3 bg-[#11190C] text-white rounded-full font-semibold hover:bg-[#2A2F25] transition-all shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            Explore New
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

