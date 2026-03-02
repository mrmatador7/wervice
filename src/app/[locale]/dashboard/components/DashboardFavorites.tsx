'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { WERVICE_CATEGORIES } from '@/lib/categories';

interface DashboardFavoritesProps {
  favorites: any[];
  locale: string;
}

export default function DashboardFavorites({ favorites, locale }: DashboardFavoritesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categoryOptions = [{ value: 'all', label: 'All' }, ...WERVICE_CATEGORIES.map((c) => ({ value: c.dbCategory, label: c.label }))];

  const filteredFavorites = favorites.filter((fav) => {
    const matchesSearch = fav.vendor?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || fav.vendor?.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#11190C]">Saved Vendors</h1>
        <p className="text-gray-600 mt-1">
          {favorites.length} vendor{favorites.length !== 1 ? 's' : ''} saved to your favorites
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search saved vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
          />
        </div>
        <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-[#D9FF0A] transition-colors flex items-center gap-2">
          <FiFilter className="w-5 h-5" />
          <span className="font-medium">Filter</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categoryOptions.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilterCategory(cat.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterCategory === cat.value
                ? 'bg-[#11190C] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Favorites Grid */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-[#D9FF0A] transition-all group"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                {fav.vendor?.cover && (
                  <img
                    src={fav.vendor.cover}
                    alt={fav.vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold">
                  {fav.vendor?.category || 'Category'}
                </div>
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FiMapPin className="w-3 h-3" />
                  {fav.vendor?.city || 'City'}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-[#11190C] text-lg mb-2 line-clamp-1">
                  {fav.vendor?.name || 'Vendor Name'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {fav.vendor?.priceFromMAD ? `From ${fav.vendor.priceFromMAD} MAD` : 'Price on request'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiSearch className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-[#11190C] mb-2">No favorites found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start saving vendors to see them here'}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#11190C] text-white rounded-full font-semibold hover:bg-[#2A2F25] transition-all"
          >
            Browse Vendors
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
}

