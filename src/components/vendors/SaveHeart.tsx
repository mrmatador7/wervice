'use client';

import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SaveHeartProps {
  vendorId: string;
  className?: string;
}

export function SaveHeart({ vendorId, className = '' }: SaveHeartProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleToggleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Optimistic UI update
      setIsSaved(!isSaved);

      // TODO: Implement actual save/unsave logic with Supabase
      // For now, just simulate the action
      await new Promise(resolve => setTimeout(resolve, 300));

      // In a real implementation, you would:
      // 1. Check if user is authenticated
      // 2. Add/remove from user's saved vendors
      // 3. Update UI based on response

    } catch (error) {
      // Revert optimistic update on error
      setIsSaved(!isSaved);
      console.error('Failed to save vendor:', error);
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
        className={`w-4 h-4 transition-all duration-200 ${
          isSaved
            ? 'fill-red-500 text-red-500 scale-110'
            : 'text-neutral-600 group-hover:text-red-500 group-hover:scale-110'
        }`}
      />
    </button>
  );
}
