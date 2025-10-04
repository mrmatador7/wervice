import { WeddingCategory } from '@/models/types';
export { useCountdown } from '@/hooks/useCountdown';

/**
 * Formats a price string with MAD currency
 */
export const formatPrice = (amount: number): string => {
  return `${amount.toLocaleString()} MAD`;
};

/**
 * Generates star rating display
 */
export const generateStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
};

/**
 * Scrolls to a section smoothly
 */
export const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

/**
 * Validates if a category is valid
 */
export const isValidCategory = (category: string): category is WeddingCategory => {
  const validCategories: WeddingCategory[] = [
    'venues', 'catering', 'photo-video',
    'planning-beauty', 'decor', 'music', 'dresses'
  ];
  return validCategories.includes(category as WeddingCategory);
};

/**
 * Debounce function for search input
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Formats countdown timer display
 */
export const formatTimeUnit = (value: number): string => {
  return value.toString().padStart(2, '0');
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts category key to display label
 */
export const getCategoryLabel = (category: WeddingCategory): string => {
  const labels: Record<WeddingCategory, string> = {
    venues: 'Venues',
    catering: 'Catering',
    'photo-video': 'Photo & Video',
    'planning-beauty': 'Planning Beauty',
    decor: 'Decor',
    music: 'Music',
    dresses: 'Dresses'
  };
  return labels[category] || category;
};

