// Formatting utilities for Wervice

import { CurrencyCode } from './types/vendor';

/**
 * Format price with proper currency formatting
 */
export function formatPrice(value: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(value);
}

/**
 * Format rating with proper decimal places
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Format review count with proper pluralization
 */
export function formatReviewCount(count: number): string {
  if (count === 0) return 'No reviews';
  if (count === 1) return '1 review';
  return `${count.toLocaleString()} reviews`;
}

/**
 * Format vendor name with proper capitalization
 */
export function formatVendorName(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format category name for display
 */
export function formatCategoryName(slug: string): string {
  const categoryNames: Record<string, string> = {
    'venues': 'Venues',
    'catering': 'Catering',
    'photography': 'Photo & Video',
    'planning': 'Event Planner',
    'beauty': 'Beauty',
    'decor': 'Decor',
    'music': 'Music',
    'dresses': 'Dresses',
  };
  
  return categoryNames[slug] || slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format distance (if needed for future features)
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(d);
}
