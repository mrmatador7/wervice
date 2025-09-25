'use client';

import { useState } from 'react';

interface WerviceSearchBarProps {
  onSearch?: (location: string, category: string) => void;
  className?: string;
}

const LOCATIONS = [
  'Marrakech',
  'Casablanca',
  'Agadir',
  'Tangier',
  'Rabat',
  'Fes'
];

const CATEGORIES = [
  'Venues',
  'Catering',
  'Photo & Video',
  'Planning Beauty',
  'Decor',
  'Music',
  'Dresses'
];

export default function WerviceSearchBar({ onSearch, className = '' }: WerviceSearchBarProps) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

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
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Main Search Container - Large Pill Shape */}
      <div className="bg-[#F7F8FB] rounded-full p-2 shadow-lg border border-[#E6E8EE] flex items-center">
        {/* Where? Chip */}
        <div className="relative flex-1 mx-2">
          <button
            onClick={() => {
              setIsLocationOpen(!isLocationOpen);
              setIsCategoryOpen(false);
            }}
            className="w-full bg-white rounded-full px-6 py-4 text-left shadow-sm border border-[#E6E8EE] hover:shadow-md transition-shadow duration-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#0B0D2E] rounded-full"></div>
              <span className={`text-sm font-medium ${selectedLocation ? 'text-[#0B0D2E]' : 'text-gray-500'}`}>
                {selectedLocation || 'Where?'}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-[#0B0D2E] transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Location Dropdown */}
          {isLocationOpen && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-[#E6E8EE] py-2 z-50">
              {LOCATIONS.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-4 py-2 text-left hover:bg-[#F7F8FB] transition-colors duration-150 text-sm text-[#0B0D2E] flex items-center space-x-2"
                >
                  <span>📍</span>
                  <span>{location}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-[#E6E8EE] mx-2"></div>

        {/* Category Chip */}
        <div className="relative flex-1 mx-2">
          <button
            onClick={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsLocationOpen(false);
            }}
            className="w-full bg-white rounded-full px-6 py-4 text-left shadow-sm border border-[#E6E8EE] hover:shadow-md transition-shadow duration-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#0B0D2E] rounded-full"></div>
              <span className={`text-sm font-medium ${selectedCategory ? 'text-[#0B0D2E]' : 'text-gray-500'}`}>
                {selectedCategory || 'Category'}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-[#0B0D2E] transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Category Dropdown */}
          {isCategoryOpen && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-[#E6E8EE] py-2 z-50">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="w-full px-4 py-2 text-left hover:bg-[#F7F8FB] transition-colors duration-150 text-sm text-[#0B0D2E] flex items-center space-x-2"
                >
                  <span>💍</span>
                  <span>{category}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-[#0B0D2E] hover:bg-[#1a1f4a] text-white rounded-full p-4 ml-2 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
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
