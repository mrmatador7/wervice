'use client';

import { useState } from 'react';
import { Share2, UserPlus, MoreHorizontal } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="h-16 px-8 flex items-center justify-between">
        {/* Left side - Page Title */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Share Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
            <Share2 size={16} />
            <span>Share</span>
          </button>

          {/* Add Members Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
            <UserPlus size={16} />
            <span>Add Members</span>
          </button>

          {/* More Options */}
          <button className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

