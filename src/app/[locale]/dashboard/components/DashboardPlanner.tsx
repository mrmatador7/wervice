'use client';

import { useState } from 'react';
import { FiPlus, FiCheck, FiCalendar } from 'react-icons/fi';

interface DashboardPlannerProps {
  profile: any;
}

const defaultCategories = [
  { id: 'venue', name: 'Venue', icon: '🏛️', completed: false },
  { id: 'catering', name: 'Catering', icon: '🍽️', completed: false },
  { id: 'photography', name: 'Photography', icon: '📸', completed: false },
  { id: 'music', name: 'Music & DJ', icon: '🎵', completed: false },
  { id: 'beauty', name: 'Beauty & Makeup', icon: '💄', completed: false },
  { id: 'dresses', name: 'Wedding Dress', icon: '👗', completed: false },
  { id: 'decor', name: 'Decoration', icon: '🎨', completed: false },
  { id: 'invitations', name: 'Invitations', icon: '💌', completed: false },
];

export default function DashboardPlanner({ profile }: DashboardPlannerProps) {
  const [plannedVendors, setPlannedVendors] = useState(defaultCategories);
  const [weddingDate, setWeddingDate] = useState(profile?.wedding_date || '');

  const toggleVendor = (id: string) => {
    setPlannedVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, completed: !v.completed } : v))
    );
  };

  const completedCount = plannedVendors.filter((v) => v.completed).length;
  const progressPercentage = (completedCount / plannedVendors.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#11190C]">Wedding Planner</h1>
        <p className="text-gray-600 mt-1">Track your wedding planning progress</p>
      </div>

      {/* Wedding Date Card */}
      <div className="bg-gradient-to-br from-[#D9FF0A] to-[#BEE600] rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <FiCalendar className="w-7 h-7 text-[#11190C]" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#11190C]">Your Wedding Date</h2>
            <p className="text-[#11190C]/70 text-sm">Set your big day to help vendors know your timeline</p>
          </div>
        </div>
        <input
          type="date"
          value={weddingDate}
          onChange={(e) => setWeddingDate(e.target.value)}
          className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border-2 border-white/60 rounded-2xl focus:outline-none focus:border-white text-lg font-semibold text-[#11190C]"
        />
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#11190C]">Planning Progress</h2>
            <p className="text-gray-600">
              {completedCount} of {plannedVendors.length} categories completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-[#11190C]">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#D9FF0A] to-[#BEE600] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Vendor Checklist */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#11190C]">Vendor Checklist</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#11190C] text-white rounded-xl font-medium hover:bg-[#2A2F25] transition-all">
            <FiPlus className="w-5 h-5" />
            Add Custom
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plannedVendors.map((vendor) => (
            <button
              key={vendor.id}
              onClick={() => toggleVendor(vendor.id)}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                vendor.completed
                  ? 'border-[#D9FF0A] bg-[#D9FF0A]/10'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  vendor.completed ? 'bg-[#D9FF0A]' : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                {vendor.completed && <FiCheck className="w-4 h-4 text-[#11190C] font-bold" />}
              </div>

              {/* Icon */}
              <div className="text-3xl">{vendor.icon}</div>

              {/* Text */}
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    vendor.completed ? 'text-[#11190C] line-through' : 'text-[#11190C]'
                  }`}
                >
                  {vendor.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {vendor.completed ? 'Booked ✓' : 'Not yet booked'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

