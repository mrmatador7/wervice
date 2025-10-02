'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

export interface WervSelectOption {
  label: string;
  value: string;
}

export interface WervSelectProps {
  label?: string;
  placeholder?: string;
  value: string | null;
  onChange: (value: string) => void;
  options: WervSelectOption[];
  className?: string;
  width?: 'auto' | 'full';
  accent?: 'neon' | 'default';
}

export default function WervSelect({
  label,
  placeholder = 'Select an option',
  value,
  onChange,
  options,
  className = '',
  width = 'full',
  accent = 'default',
}: WervSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
    triggerRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex(prev => Math.min(prev + 1, options.length - 1));
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setHighlightedIndex(options.length - 1);
        break;
      case 'Enter':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex].value);
        } else {
          setIsOpen(true);
          setHighlightedIndex(selectedOption ? options.findIndex(opt => opt.value === selectedOption.value) : 0);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        if (!isOpen) {
          setHighlightedIndex(selectedOption ? options.findIndex(opt => opt.value === selectedOption.value) : 0);
        } else {
          setHighlightedIndex(-1);
        }
        break;
    }
  }, [isOpen, highlightedIndex, options, selectedOption, handleSelect]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
          listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [isOpen, highlightedIndex]);

  const widthClasses = width === 'full' ? 'w-full' : 'w-auto';

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`h-11 px-4 rounded-xl bg-white border shadow-sm flex items-center justify-between ${widthClasses} hover:border-neutral-300 focus:outline-none transition-all duration-200 ${
          accent === 'neon' && isOpen
            ? 'border-[#D7FF1F] focus:ring-2 focus:ring-[#D7FF1F] focus:ring-offset-2'
            : 'border-neutral-200 focus:ring-2 focus:ring-lime-300/70'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="werv-select-list"
        role="combobox"
      >
        <span className={`truncate ${selectedOption ? 'text-gray-900' : 'text-neutral-500'}`}>
          {selectedOption?.label || placeholder}
        </span>

        <FiChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 origin-top animate-in fade-in slide-in-from-top-1 duration-150"
          style={{ animationDuration: '150ms' }}
        >
          <ul
            ref={listRef}
            id="werv-select-list"
            role="listbox"
            className="max-h-64 overflow-auto rounded-xl bg-white shadow-xl border border-neutral-200 ring-1 ring-black/5 py-2"
          >
            {options.map((option, index) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-120 relative overflow-hidden ${
                    option.value === value
                      ? 'text-lime-600 bg-lime-50 font-medium'
                      : 'text-gray-900 hover:bg-neutral-50'
                  } ${highlightedIndex === index && option.value !== value
                    ? 'bg-neutral-50'
                    : ''
                  }`}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {/* Animated highlight bar for selected/active */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-120 ${
                      highlightedIndex === index || option.value === value
                        ? 'bg-lime-400'
                        : 'bg-transparent'
                    }`}
                    style={{
                      transform: highlightedIndex === index || option.value === value
                        ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 120ms ease-out'
                    }}
                  />

                  {/* Option label */}
                  <span className="flex-1 truncate">{option.label}</span>

                  {/* Checkmark for selected */}
                  {option.value === value && (
                    <FiCheck className="w-4 h-4 flex-shrink-0 text-lime-600" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
