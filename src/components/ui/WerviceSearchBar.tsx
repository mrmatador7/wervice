'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface WerviceSearchBarProps {
  onSearch?: (location: string, category: string) => void;
  className?: string;
}

// Location and category arrays are now handled through translations

export default function WerviceSearchBar({ onSearch, className = '' }: WerviceSearchBarProps) {
  const t = useTranslations('search');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const locations = [
    { key: 'marrakech', label: t('locations.marrakech') },
    { key: 'casablanca', label: t('locations.casablanca') },
    { key: 'agadir', label: t('locations.agadir') },
    { key: 'tangier', label: t('locations.tangier') },
    { key: 'rabat', label: t('locations.rabat') },
    { key: 'fes', label: t('locations.fes') }
  ];

  const categories = [
    { key: 'venues', label: t('categories.venues') },
    { key: 'catering', label: t('categories.catering') },
    { key: 'photoVideo', label: t('categories.photoVideo') },
    { key: 'planningBeauty', label: t('categories.planningBeauty') },
    { key: 'decor', label: t('categories.decor') },
    { key: 'music', label: t('categories.music') },
    { key: 'dresses', label: t('categories.dresses') }
  ];

  const handleSearch = () => {
    if (onSearch) {
      onSearch(selectedLocation, selectedCategory);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsLocationOpen(false);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  return (
    <div className={`max-w-xl mx-auto ${className}`}>
      {/* Main Search Container - Pill Shape */}
      <div
        className="bg-white rounded-full p-2 shadow-2xl border border-white/20 backdrop-blur-sm flex items-center"
        style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)' }}
      >
        {/* Where? Chip */}
        <div className="relative flex-1 mx-1.5">
          <button
            onClick={() => {
              setIsLocationOpen(!isLocationOpen);
              setIsCategoryOpen(false);
            }}
            className={`${selectedLocation ? 'w-auto min-w-0 whitespace-nowrap' : 'w-full'} bg-white rounded-full px-6 py-3 text-left shadow-lg border border-gray-800 hover:shadow-xl transition-shadow duration-200 flex items-center justify-between`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className={`text-sm font-medium ${selectedLocation ? 'text-lime-800' : 'text-gray-500'}`}>
                {selectedLocation || t('where')}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-lime-600 transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Location Dropdown */}
          {isLocationOpen && (
            <div className="absolute top-full mt-2 w-full min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-700 py-3 z-50">
              {locations.map((location) => (
                <button
                  key={location.key}
                  onClick={() => handleLocationSelect(location.label)}
                  className="w-full px-6 py-3 text-left hover:bg-lime-50 transition-colors duration-150 text-lime-800 flex items-center space-x-3 text-xs"
                >
                  <span>📍</span>
                  <span>{location.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-lime-200 mx-1.5"></div>

        {/* Category Chip */}
        <div className="relative flex-1 mx-1.5">
          <button
            onClick={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsLocationOpen(false);
            }}
            className={`${selectedCategory ? 'w-auto min-w-0 whitespace-nowrap' : 'w-full'} bg-white rounded-full px-6 py-3 text-left shadow-lg border border-gray-800 hover:shadow-xl transition-shadow duration-200 flex items-center justify-between`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className={`text-sm font-medium ${selectedCategory ? 'text-lime-800' : 'text-gray-500'}`}>
                {selectedCategory || t('category')}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-lime-800 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Category Dropdown */}
          {isCategoryOpen && (
            <div className="absolute top-full mt-2 w-full min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-700 py-3 z-50">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategorySelect(category.label)}
                  className="w-full px-6 py-3 text-left hover:bg-lime-50 transition-colors duration-150 text-xs text-lime-800 flex items-center space-x-3"
                >
                  <span>💍</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="rounded-full p-3 ml-1.5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#d9ff0a] focus:ring-offset-2"
          style={{
            backgroundColor: '#d9ff0a',
            color: 'black'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#c4e600';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#d9ff0a';
          }}
          aria-label="Search for wedding vendors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
