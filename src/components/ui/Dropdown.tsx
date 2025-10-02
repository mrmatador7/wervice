'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

export type DropdownOption = {
  value: string;
  label: string;
  iconSrc?: string;
};

export interface DropdownProps {
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'md' | 'lg';
  accent?: 'neon' | 'purple';
  disabled?: boolean;
  className?: string;
  iconSrc?: string;
}

export default function Dropdown({
  placeholder = 'Select an option',
  options,
  value,
  defaultValue,
  onChange,
  size = 'lg',
  accent = 'neon',
  disabled = false,
  className = '',
  iconSrc,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Update internal state when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = useCallback((optionValue: string) => {
    if (value === undefined) {
      setSelectedValue(optionValue);
    }
    onChange?.(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
    triggerRef.current?.focus();
  }, [value, onChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

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
      case 'Enter':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex].value);
        } else {
          setIsOpen(true);
          setHighlightedIndex(0);
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
          setHighlightedIndex(selectedValue ? options.findIndex(opt => opt.value === selectedValue) : 0);
        }
        break;
    }
  }, [disabled, isOpen, highlightedIndex, options, selectedValue, handleSelect]);

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

  const accentClasses = accent === 'neon'
    ? 'bg-[#D7FF1F] text-black'
    : 'bg-[#7C3AED]/90 text-white';

  const sizeClasses = size === 'lg'
    ? 'h-14 md:h-14 text-lg md:text-xl'
    : 'h-12 md:h-12 text-base md:text-lg';

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full ${sizeClasses} px-4 rounded-2xl bg-white border border-zinc-200 shadow-sm
          flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-zinc-300'}
          focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:ring-offset-2
          transition-all duration-200
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="dropdown-list"
        role="combobox"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {(selectedOption?.iconSrc || iconSrc) && (
            <img
              src={selectedOption?.iconSrc || iconSrc}
              alt=""
              className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 object-contain"
            />
          )}
          <span className={`truncate ${selectedOption ? 'text-gray-900' : 'text-slate-400'}`}>
            {selectedOption?.label || placeholder}
          </span>
        </div>

        <FiChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
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
            id="dropdown-list"
            role="listbox"
            className="
              max-h-80 overflow-auto rounded-2xl bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,.25)]
              border border-zinc-200 py-2
              hover:translate-y-[-1px] transition-transform duration-200
            "
          >
            {options.map((option, index) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    w-full px-4 py-4 md:py-5 text-left flex items-center gap-4
                    transition-all duration-120 relative overflow-hidden
                    ${size === 'lg' ? 'text-lg md:text-xl' : 'text-base md:text-lg'}
                    ${option.value === selectedValue
                      ? `${accentClasses} font-medium`
                      : 'text-gray-900 hover:bg-gray-50'
                    }
                    ${highlightedIndex === index && option.value !== selectedValue
                      ? 'bg-gray-50'
                      : ''
                    }
                  `}
                  role="option"
                  aria-selected={option.value === selectedValue}
                >
                  {/* Animated highlight bar */}
                  <div
                    className={`
                      absolute left-0 top-0 bottom-0 w-1 transition-all duration-120
                      ${highlightedIndex === index || option.value === selectedValue
                        ? accentClasses.replace('text-', 'bg-').replace(' bg-', ' ')
                        : 'bg-transparent'
                      }
                    `}
                    style={{
                      transform: highlightedIndex === index || option.value === selectedValue
                        ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 120ms ease-out'
                    }}
                  />

                  {/* Icon */}
                  {option.iconSrc && (
                    <img
                      src={option.iconSrc}
                      alt=""
                      className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 object-contain ml-1"
                    />
                  )}

                  {/* Label */}
                  <span className="flex-1 truncate">{option.label}</span>

                  {/* Checkmark for selected */}
                  {option.value === selectedValue && (
                    <FiCheck className="w-5 h-5 flex-shrink-0 ml-2" />
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
