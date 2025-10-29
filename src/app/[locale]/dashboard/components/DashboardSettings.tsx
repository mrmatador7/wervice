'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { FiSave, FiBell, FiGlobe, FiDollarSign } from 'react-icons/fi';

interface DashboardSettingsProps {
  user: User;
  profile: any;
}

export default function DashboardSettings({ user, profile }: DashboardSettingsProps) {
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: user.email || '',
    phone: profile?.phone || '',
    weddingDate: profile?.wedding_date || '',
    city: profile?.city || '',
    guestCount: profile?.guest_count || '',
    budget: profile?.budget || '',
    language: profile?.language || 'en',
    currency: profile?.currency || 'MAD',
    emailNotifications: true,
    whatsappNotifications: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    // TODO: Save to database
    console.log('Saving settings:', formData);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#11190C]">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and wedding preferences</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#11190C] mb-6 flex items-center gap-2">
          👤 Profile Information
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+212 6XX XXX XXX"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Wedding Details */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#11190C] mb-6 flex items-center gap-2">
          💍 Wedding Details
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Wedding Date
              </label>
              <input
                type="date"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
              >
                <option value="">Select city</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Casablanca">Casablanca</option>
                <option value="Rabat">Rabat</option>
                <option value="Tangier">Tangier</option>
                <option value="Agadir">Agadir</option>
                <option value="Fes">Fès</option>
                <option value="Meknes">Meknes</option>
                <option value="El Jadida">El Jadida</option>
                <option value="Kenitra">Kenitra</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Guests
              </label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                placeholder="e.g., 150"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget Range
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
              >
                <option value="">Select range</option>
                <option value="< 100k">Under 100K MAD</option>
                <option value="100k-250k">100K - 250K MAD</option>
                <option value="250k-500k">250K - 500K MAD</option>
                <option value="500k+">500K+ MAD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#11190C] mb-6 flex items-center gap-2">
          <FiGlobe className="w-5 h-5" />
          Language & Currency
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
            >
              <option value="MAD">MAD - Moroccan Dirham</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#11190C] mb-6 flex items-center gap-2">
          <FiBell className="w-5 h-5" />
          Notifications
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
            <div>
              <div className="font-semibold text-[#11190C]">Email Notifications</div>
              <div className="text-sm text-gray-500">Receive updates about new vendors and offers</div>
            </div>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={formData.emailNotifications}
              onChange={handleChange}
              className="w-5 h-5 text-[#D9FF0A] rounded focus:ring-[#D9FF0A]"
            />
          </label>
          <label className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
            <div>
              <div className="font-semibold text-[#11190C]">WhatsApp Notifications</div>
              <div className="text-sm text-gray-500">Get vendor responses via WhatsApp</div>
            </div>
            <input
              type="checkbox"
              name="whatsappNotifications"
              checked={formData.whatsappNotifications}
              onChange={handleChange}
              className="w-5 h-5 text-[#D9FF0A] rounded focus:ring-[#D9FF0A]"
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={handleSave}
          className="px-8 py-4 bg-[#11190C] text-white rounded-full font-semibold hover:bg-[#2A2F25] transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <FiSave className="w-5 h-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
}

