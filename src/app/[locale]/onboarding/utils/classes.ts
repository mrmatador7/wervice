import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Common button styles following Wervice design system
 */
export const buttonStyles = {
  base: 'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wervice-lime disabled:opacity-50 disabled:cursor-not-allowed',

  variants: {
    primary: 'bg-wervice-lime text-wervice-ink hover:bg-wv-limeDark shadow-card hover:shadow-cardHover',
    secondary: 'bg-white border border-wervice-taupe/20 text-wervice-ink hover:bg-wervice-shell',
    ghost: 'bg-transparent text-wervice-taupe hover:text-wervice-ink hover:bg-wervice-shell/50',
  },

  sizes: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  },
};

/**
 * Common card styles
 */
export const cardStyles = {
  base: 'rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wervice-lime',

  variants: {
    default: 'bg-white border-wv-gray3 hover:border-wervice-lime/50',
    selected: 'bg-wervice-lime text-wervice-ink border-transparent shadow-soft',
    disabled: 'bg-wv-gray2 border-wv-gray3 opacity-50 cursor-not-allowed',
  },
};

/**
 * Common input styles
 */
export const inputStyles = {
  base: 'w-full rounded-lg border border-wv-gray3 bg-white px-4 py-3 text-wervice-ink placeholder:text-wervice-taupe/60 focus:outline-none focus:ring-2 focus:ring-wervice-lime focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed',

  error: 'border-red-300 focus:ring-red-500',
};

/**
 * Step navigation utilities
 */
export const stepNavigation = {
  getNextStep: (currentStep: number): number => Math.min(currentStep + 1, 10),
  getPrevStep: (currentStep: number): number => Math.max(currentStep - 1, 1),
  isFirstStep: (step: number): boolean => step === 1,
  isLastStep: (step: number): boolean => step === 10,
};
