'use client';

import * as React from 'react';

interface SheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sheet({ children, isOpen, onClose }: SheetProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Handle outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/50" />

          {/* Sheet */}
          <div
            ref={panelRef}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#11190C]">Price Filter</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-[#F3F1EE] transition-colors"
                aria-label="Close price filter"
              >
                <svg className="w-5 h-5 text-[#787664]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </>
      )}
    </>
  );
}
