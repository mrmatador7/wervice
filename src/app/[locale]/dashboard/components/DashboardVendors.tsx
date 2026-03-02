'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiSearch, FiHeart, FiCheck, FiPlus, FiX, FiMapPin } from 'react-icons/fi';
import { vendorUrl } from '@/lib/vendor-url';

interface DashboardVendorsProps {
  profile: any;
  locale: string;
}

const vendorCategories = [
  { id: 'venues', name: 'Venues', icon: '🏛️', hired: 0, favorites: 0 },
  { id: 'catering', name: 'Catering', icon: '🍽️', hired: 0, favorites: 0 },
  { id: 'photography', name: 'Photo & Video', icon: '📸', hired: 0, favorites: 0 },
  { id: 'music', name: 'Music & DJ', icon: '🎵', hired: 0, favorites: 0 },
  { id: 'beauty', name: 'Beauty & Makeup', icon: '💄', hired: 0, favorites: 0 },
  { id: 'dresses', name: 'Wedding Dresses', icon: '👗', hired: 0, favorites: 0 },
  { id: 'decor', name: 'Decoration', icon: '🎨', hired: 0, favorites: 0 },
  { id: 'event-planner', name: 'Event Planner', icon: '📋', hired: 0, favorites: 0 },
];

export default function DashboardVendors({ profile, locale }: DashboardVendorsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'favorites' | 'hired'>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<'categories' | 'search'>('categories');
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const totalFavorites = vendorCategories.reduce((sum, cat) => sum + cat.favorites, 0);
  const totalHired = vendorCategories.reduce((sum, cat) => sum + cat.hired, 0);
  const totalCategories = vendorCategories.length;
  const categoriesHired = vendorCategories.filter(cat => cat.hired > 0).length;

  const filteredCategories = vendorCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setModalStep('search');
    setIsModalOpen(true);
  };

  const handleAddVendor = () => {
    setSelectedCategory(null);
    setModalStep('categories');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setModalStep('categories');
    setVendorSearchQuery('');
    setSearchResults([]);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setModalStep('search');
  };

  const handleBackToCategories = () => {
    setModalStep('categories');
    setSelectedCategory(null);
    setVendorSearchQuery('');
    setSearchResults([]);
  };

  // Search vendors
  useEffect(() => {
    if (modalStep === 'search' && selectedCategory) {
      const searchVendors = async () => {
        setIsSearching(true);
        try {
          const params = new URLSearchParams({
            category: selectedCategory,
          });
          if (vendorSearchQuery) {
            params.append('search', vendorSearchQuery);
          }
          
          const response = await fetch(`/api/vendors?${params}`);
          const data = await response.json();
          setSearchResults(data.vendors || []);
        } catch (error) {
          console.error('Error searching vendors:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      };

      searchVendors();
    }
  }, [selectedCategory, vendorSearchQuery, modalStep]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#11190C]">Vendor Manager</h1>
          <p className="text-gray-600 mt-1">
            {categoriesHired} of {totalCategories} categories hired
          </p>
        </div>
        <button 
          onClick={handleAddVendor}
          className="px-6 py-3 bg-[#D9FF0A] text-[#11190C] rounded-xl font-semibold hover:bg-[#BEE600] transition-all shadow-sm flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          Add vendor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <FiHeart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#11190C]">Favorites</h3>
                <p className="text-sm text-gray-500">Vendors you're considering</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#11190C]">{totalFavorites}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#11190C]">Hired</h3>
                <p className="text-sm text-gray-500">Vendors you've booked</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#11190C]">{totalHired}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'favorites'
              ? 'border-[#11190C] text-[#11190C]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiHeart className="w-4 h-4" />
          Favorites
          <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">
            {totalFavorites}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('hired')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'hired'
              ? 'border-[#11190C] text-[#11190C]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiCheck className="w-4 h-4" />
          Hired
          <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-bold">
            {totalHired}
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search vendor categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
        />
      </div>

      {/* Vendor Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#D9FF0A] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#D9FF0A]/10 transition-colors">
                <span className="text-3xl">{category.icon}</span>
              </div>

              {/* Category Name */}
              <h3 className="font-semibold text-[#11190C] mb-2">{category.name}</h3>

              {/* Stats */}
              <div className="flex items-center gap-3 text-sm">
                {category.favorites > 0 && (
                  <div className="flex items-center gap-1 text-red-500">
                    <FiHeart className="w-4 h-4 fill-current" />
                    <span className="font-medium">{category.favorites}</span>
                  </div>
                )}
                {category.hired > 0 && (
                  <div className="flex items-center gap-1 text-green-500">
                    <FiCheck className="w-4 h-4" />
                    <span className="font-medium">{category.hired}</span>
                  </div>
                )}
                {category.favorites === 0 && category.hired === 0 && (
                  <span className="text-gray-400 text-xs">No vendors yet</span>
                )}
              </div>

              {/* Search Button */}
              <button 
                onClick={() => handleSearchCategory(category.id)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-[#D9FF0A] hover:bg-[#D9FF0A]/5 hover:text-[#11190C] transition-all"
              >
                <FiSearch className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiSearch className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-[#11190C] mb-2">No categories found</h3>
          <p className="text-gray-600">Try a different search term</p>
        </div>
      )}

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                {modalStep === 'search' && (
                  <button
                    onClick={handleBackToCategories}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-[#11190C]">
                    {modalStep === 'categories' 
                      ? 'Add Vendor'
                      : `Search ${vendorCategories.find(c => c.id === selectedCategory)?.name}`
                    }
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {modalStep === 'categories'
                      ? 'Choose a category to browse vendors'
                      : `${searchResults.length} vendors found`
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {modalStep === 'categories' ? (
                /* Categories Grid */
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {vendorCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleSelectCategory(category.id)}
                        className="p-6 rounded-2xl border-2 transition-all text-left hover:border-[#D9FF0A] hover:bg-[#D9FF0A]/5 border-gray-200 bg-white"
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl">{category.icon}</span>
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#11190C] mb-1">
                              {category.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {category.favorites > 0 && (
                                <span className="flex items-center gap-1">
                                  <FiHeart className="w-3 h-3" />
                                  {category.favorites}
                                </span>
                              )}
                              {category.hired > 0 && (
                                <span className="flex items-center gap-1">
                                  <FiCheck className="w-3 h-3" />
                                  {category.hired}
                                </span>
                              )}
                              {category.favorites === 0 && category.hired === 0 && (
                                <span>Browse vendors</span>
                              )}
                            </div>
                          </div>

                          {/* Arrow */}
                          <svg 
                            className="w-5 h-5 text-gray-400" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M9 5l7 7-7 7" 
                            />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Search Results */
                <div className="p-6 space-y-6">
                  {/* Search Bar */}
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search vendors by name, location..."
                      value={vendorSearchQuery}
                      onChange={(e) => setVendorSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Loading State */}
                  {isSearching && (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9FF0A]"></div>
                    </div>
                  )}

                  {/* Results */}
                  {!isSearching && searchResults.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((vendor) => (
                        <Link
                          key={vendor.id}
                          href={vendorUrl(vendor, locale)}
                          onClick={handleCloseModal}
                          className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-[#D9FF0A] hover:shadow-md transition-all group"
                        >
                          <div className="flex gap-4">
                            {/* Vendor Image */}
                            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                              <img
                                src={vendor.cover || '/placeholder.jpg'}
                                alt={vendor.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>

                            {/* Vendor Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-[#11190C] mb-1 line-clamp-1">
                                {vendor.name}
                              </h3>
                              <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                <FiMapPin className="w-4 h-4" />
                                <span className="capitalize">{vendor.city}</span>
                              </div>
                              {vendor.priceFromMAD && (
                                <div className="text-sm font-medium text-[#11190C]">
                                  From {vendor.priceFromMAD.toLocaleString()} MAD
                                </div>
                              )}
                              <div className="mt-2 flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // TODO: Add to favorites
                                  }}
                                  className="flex items-center gap-1 px-3 py-1 text-xs border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                  <FiHeart className="w-3 h-3" />
                                  Save
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // TODO: Mark as hired
                                  }}
                                  className="flex items-center gap-1 px-3 py-1 text-xs border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-colors"
                                >
                                  <FiCheck className="w-3 h-3" />
                                  Hire
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {!isSearching && searchResults.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiSearch className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-[#11190C] mb-2">No vendors found</h3>
                      <p className="text-gray-600">Try adjusting your search or browse other categories</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

