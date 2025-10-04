'use client';

import * as React from 'react';

interface PopoverProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export default function Popover({ children, isOpen, onClose, triggerRef }: PopoverProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Handle outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        panelRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
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
  }, [isOpen, onClose, triggerRef]);

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

  return (
    <>
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute z-50 mt-2 w-72 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/10"
        >
          {children}
        </div>
      )}
    </>
  );
}
