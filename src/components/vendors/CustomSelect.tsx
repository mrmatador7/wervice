'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get display label for current value
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  // Close on click outside
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

  // Close on Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 transition-colors min-w-[140px]"
        aria-expanded={isOpen}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 flex-shrink-0 text-zinc-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Options List */}
          <div className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-1">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left transition-colors rounded-lg ${
                      isSelected ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        isSelected ? 'font-bold text-zinc-900' : 'font-medium text-zinc-700'
                      }`}
                    >
                      {option.label}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-zinc-900" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

