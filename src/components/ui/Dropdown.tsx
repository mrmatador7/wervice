'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronUp } from 'lucide-react';

interface DropdownProps {
  trigger: ReactNode | ((isOpen: boolean) => ReactNode);
  children: ReactNode;
  align?: 'left' | 'right';
  width?: string;
  className?: string;
}

export default function Dropdown({
  trigger,
  children,
  align = 'right',
  width = 'w-60',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close on Escape key
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

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {typeof trigger === 'function' ? trigger(isOpen) : trigger}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            className={`absolute ${
              align === 'right' ? 'right-0' : 'left-0'
            } mt-2 ${width} overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200`}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

// Dropdown Section Component
interface DropdownSectionProps {
  title?: string;
  children: ReactNode;
  noPadding?: boolean;
}

export function DropdownSection({ title, children, noPadding = false }: DropdownSectionProps) {
  return (
    <div className={noPadding ? '' : 'p-3'}>
      {title && (
        <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          {title}
        </h3>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

// Dropdown Item Component
interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  icon?: ReactNode;
  rightContent?: ReactNode;
  disabled?: boolean;
}

export function DropdownItem({
  children,
  onClick,
  active = false,
  icon,
  rightContent,
  disabled = false,
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors rounded-lg ${
        active ? 'bg-zinc-100' : 'hover:bg-zinc-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className={`flex-1 text-sm ${active ? 'font-bold' : 'font-medium'}`}>
        {children}
      </span>
      {rightContent && (
        <span
          className={`text-xs ${
            active ? 'font-bold text-zinc-900' : 'font-medium text-zinc-500'
          }`}
        >
          {rightContent}
        </span>
      )}
    </button>
  );
}

// Dropdown Divider Component
export function DropdownDivider() {
  return <div className="border-t border-zinc-200" />;
}

// Dropdown Trigger Button Component
interface DropdownTriggerProps {
  children: ReactNode;
  isOpen?: boolean;
  className?: string;
}

export function DropdownTrigger({ children, isOpen = false, className = '' }: DropdownTriggerProps) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 transition-colors ${className}`}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronUp
        className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
  );
}
