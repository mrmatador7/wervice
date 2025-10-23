// Re-export utilities for better organization
export * from './index';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility to create a delay
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Utility to check if we're in the browser
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Utility to safely access localStorage
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail
    }
  },
  removeItem: (key: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  }
};

/**
 * Capitalize city names properly
 */
/**
 * Basic capitalize function: capitalizes first letter and lowercases the rest
 */
function capitalizeWord(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Capitalize city names properly, handling multi-word cities and null/undefined values
 */
export function capitalizeCity(city: string | null | undefined): string {
  if (!city) return '';

  // Handle special cases for multi-word cities
  const specialCases: Record<string, string> = {
    'eljadida': 'El Jadida',
    'el jadida': 'El Jadida',
    'eljada': 'El Jadida',
    'elJadida': 'El Jadida',
  };

  const lowerCity = city.toLowerCase();
  if (specialCases[lowerCity]) {
    return specialCases[lowerCity];
  }

  // Default: capitalize first letter of each word
  return city
    .split(' ')
    .map(capitalizeWord)
    .join(' ');
}

/**
 * Normalize city names for consistent filtering
 */
export function normalizeCity(city: string | undefined): string | undefined {
  if (!city) return undefined;
  
  // Normalize to lowercase for consistent filtering
  return city.toLowerCase().trim();
}
