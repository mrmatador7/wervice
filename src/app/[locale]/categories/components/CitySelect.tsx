'use client';

import { useState, useRef, useEffect } from 'react';
import { FiMapPin, FiChevronDown } from 'react-icons/fi';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';

const CITY_OPTIONS = ['All Cities', ...MOROCCAN_CITIES.filter((c) => c.value !== 'all').map((c) => c.label)];

interface CitySelectProps {
  value?: string;
  onChange?: (city: string) => void;
  placeholder?: string;
  className?: string;
}

export function CitySelect({
  value = 'All Cities',
  onChange,
  placeholder = 'Select city',
  className = ''
}: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update internal state when value prop changes
  useEffect(() => {
    setSelectedCity(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (city: string) => {
    setSelectedCity(city);
    setIsOpen(false);
    onChange?.(city);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E9E6E2] bg-white px-4 py-2 text-sm font-medium text-[#11190C] shadow-sm ring-1 ring-black/5 hover:bg-[#F3F1EE] focus:outline-none focus:ring-2 focus:ring-[#D9FF0A] transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Select city, currently ${selectedCity}`}
      >
        <FiMapPin className="h-4 w-4 text-neutral-600" />
        <span className="truncate">{selectedCity || placeholder}</span>
        <FiChevronDown className={`h-4 w-4 text-neutral-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full min-w-[200px] rounded-2xl bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
          <ul
            className="max-h-60 overflow-auto py-1"
            role="listbox"
            aria-label="City options"
          >
            {CITY_OPTIONS.map((city) => (
              <li key={city}>
                <button
                  type="button"
                  onClick={() => handleSelect(city)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-[#F3F1EE] focus:bg-[#F3F1EE] focus:outline-none transition-colors ${
                    selectedCity === city
                      ? 'bg-[#D9FF0A]/10 text-[#11190C] font-medium'
                      : 'text-neutral-700'
                  }`}
                  role="option"
                  aria-selected={selectedCity === city}
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
