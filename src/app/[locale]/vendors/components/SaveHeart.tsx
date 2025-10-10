'use client';

import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';

interface SaveHeartProps {
  vendorId: string;
  className?: string;
}

export function SaveHeart({ vendorId, className = '' }: SaveHeartProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Optimistic UI update
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);

      // Call API to save/unsave vendor
      const response = await fetch(`/api/vendors/${vendorId}/save`, {
        method: newSavedState ? 'POST' : 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update save status');
      }

      const data = await response.json();
      setIsSaved(data.saved);

      console.log(data.saved ? 'Vendor saved' : 'Vendor unsaved', vendorId);
    } catch (error) {
      // Revert optimistic update on error
      setIsSaved(!isSaved);
      console.error('Error saving vendor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggleSave();
      }}
      className={`group relative w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm ring-1 ring-black/5 flex items-center justify-center hover:bg-white transition-all duration-200 ${className}`}
      aria-label={isSaved ? 'Remove from saved' : 'Save vendor'}
      aria-pressed={isSaved}
    >
      <FiHeart
        className={`w-4 h-4 transition-all duration-200 ${isSaved
          ? 'fill-red-500 text-red-500 scale-110'
          : 'text-neutral-600 group-hover:text-red-500 group-hover:scale-110'
          }`}
      />
    </button>
  );
}
