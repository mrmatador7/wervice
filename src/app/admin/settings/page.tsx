'use client';

import { useState } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'roles', label: 'Roles & Permissions' },
    { id: 'commission', label: 'Commission & Tax' },
    { id: 'cities', label: 'City Management' },
    { id: 'languages', label: 'Languages' },
    { id: 'integrations', label: 'Integrations' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Configure your admin dashboard and business settings"
      />

      <div className="bg-wv.card rounded-xl shadow-card">
        {/* Tabs */}
        <div className="border-b border-wv.line">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-wv.lime text-wv.lime'
                    : 'border-transparent text-wv.sub hover:text-wv.text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-wv.text mb-4">Brand Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-wv.text mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Wervice"
                      className="w-full p-3 bg-wv.bg border border-wv.line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-wv.text mb-2">
                      Currency
                    </label>
                    <select className="w-full p-3 bg-wv.bg border border-wv.line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wv.limeDark">
                      <option value="MAD">Moroccan Dirham (MAD)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-wv.text mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-wv.text mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      defaultValue="support@wervice.ma"
                      className="w-full p-3 bg-wv.bg border border-wv.line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-wv.text mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+212 6 12 34 56 78"
                      className="w-full p-3 bg-wv.bg border border-wv.line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commission' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-wv.text mb-4">Commission Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-wv.text mb-2">
                      Default Commission (%)
                    </label>
                    <input
                      type="number"
                      defaultValue="15"
                      min="0"
                      max="50"
                      className="w-full p-3 bg-wv.bg border border-wv.line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-wv.text mb-2">
                      Minimum Commission (%)
                    </label>
                    <input
                      type="number"
                      defaultValue="10"
                      min="0"
                      max="30"
                      className="w-full p-3 bg-wv.bg border border-wv.line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-wv.text mb-2">
                      Maximum Commission (%)
                    </label>
                    <input
                      type="number"
                      defaultValue="25"
                      min="10"
                      max="50"
                      className="w-full p-3 bg-wv.bg border border-wv.line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-wv.text mb-4">External Integrations</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-wv.bg rounded-lg">
                    <div>
                      <h4 className="font-medium text-wv.text">Google Analytics 4</h4>
                      <p className="text-sm text-wv.sub">Track website traffic and user behavior</p>
                    </div>
                    <button className="px-4 py-2 bg-wv.lime text-wv.black rounded-lg font-medium hover:bg-wv.limeDark">
                      Configure
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-wv.bg rounded-lg">
                    <div>
                      <h4 className="font-medium text-wv.text">Stripe Payments</h4>
                      <p className="text-sm text-wv.sub">Process payments and manage subscriptions</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium cursor-not-allowed">
                      Connected
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-wv.line">
            <button className="flex items-center gap-2 px-6 py-3 bg-wv.lime text-wv.black rounded-lg font-medium hover:bg-wv.limeDark">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
