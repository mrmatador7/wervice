// Currency formatting utilities for Wervice
// Supports dynamic currency based on user preference or query param

import { CurrencyCode } from './types/vendor';

export type Currency = CurrencyCode;

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  MAD: 'MAD',
  USD: '$',
  EUR: '€',
};

const CURRENCY_NAMES: Record<Currency, string> = {
  MAD: 'Moroccan Dirham',
  USD: 'US Dollar',
  EUR: 'Euro',
};

// Default currency for Morocco-based service
export const DEFAULT_CURRENCY: Currency = 'MAD';

// Format price with proper thousands separators and currency symbol
export function formatCurrency(
  amount: number | null | undefined,
  currency: Currency = DEFAULT_CURRENCY,
  options: {
    showSymbol?: boolean;
    compact?: boolean;
    locale?: string;
  } = {}
): string {
  const { showSymbol = true, compact = false, locale = 'en-US' } = options;

  if (amount == null || amount === 0) {
    return showSymbol ? `0 ${currency}` : '0';
  }

  try {
    // For compact display (like "2.5K")
    if (compact && amount >= 1000) {
      const formatter = new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
      });
      const formatted = formatter.format(amount);
      return showSymbol ? `${formatted} ${currency}` : formatted;
    }

    // Standard formatting
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const formatted = formatter.format(amount);
    return showSymbol ? `${formatted} ${currency}` : formatted;
  } catch (error) {
    // Fallback for any formatting errors
    return showSymbol ? `${amount} ${currency}` : amount.toString();
  }
}

// Format price range (min-max)
export function formatPriceRange(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: Currency = DEFAULT_CURRENCY,
  options: {
    compact?: boolean;
    locale?: string;
  } = {}
): string {
  if (!min && !max) return 'Contact for pricing';

  if (min && max) {
    if (min === max) {
      return formatCurrency(min, currency, options);
    }
    return `${formatCurrency(min, currency, { ...options, showSymbol: false })} - ${formatCurrency(max, currency, options)}`;
  }

  if (min) {
    return `From ${formatCurrency(min, currency, options)}`;
  }

  if (max) {
    return `Up to ${formatCurrency(max, currency, options)}`;
  }

  return 'Contact for pricing';
}

// Get currency from various sources (user preference, query param, etc.)
export function getCurrencyFromContext(
  userCurrency?: Currency | null,
  queryCurrency?: string | null
): Currency {
  // Priority: query param > user preference > default
  if (queryCurrency && isValidCurrency(queryCurrency)) {
    return queryCurrency as Currency;
  }

  if (userCurrency && isValidCurrency(userCurrency)) {
    return userCurrency;
  }

  return DEFAULT_CURRENCY;
}

// Validate currency code
export function isValidCurrency(currency: string | null | undefined): currency is Currency {
  if (!currency) return false;
  return Object.keys(CURRENCY_SYMBOLS).includes(currency.toUpperCase());
}

// Get currency symbol
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS[DEFAULT_CURRENCY];
}

// Get currency name
export function getCurrencyName(currency: Currency): string {
  return CURRENCY_NAMES[currency] || CURRENCY_NAMES[DEFAULT_CURRENCY];
}

// Convert between currencies (basic implementation - in reality would use exchange rates)
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  exchangeRate?: number
): number {
  if (from === to) return amount;

  // Basic exchange rates (would normally fetch from API)
  const RATES: Record<Currency, Record<Currency, number>> = {
    MAD: { USD: 0.091, EUR: 0.085 },
    USD: { MAD: 11.0, EUR: 0.93 },
    EUR: { MAD: 11.8, USD: 1.08 },
  };

  const rate = exchangeRate || (RATES[from]?.[to] || 1);
  return Math.round(amount * rate * 100) / 100; // Round to 2 decimal places
}

// Simple convert function for MAD to other currencies
export function convert(amountMAD: number, currency: Currency): number {
  if (currency === 'MAD') return amountMAD;

  const rates = { MAD: 1, EUR: 0.093, USD: 0.10 };
  return Math.round(amountMAD * rates[currency]);
}

// Budget bands for wedding planning (in MAD)
export const BUDGET_BANDS = {
  'under-50000': { min: 0, max: 50000, label: 'Under 50,000 MAD' },
  '50000-100000': { min: 50000, max: 100000, label: '50,000 - 100,000 MAD' },
  '100000-150000': { min: 100000, max: 150000, label: '100,000 - 150,000 MAD' },
  '150000-200000': { min: 150000, max: 200000, label: '150,000 - 200,000 MAD' },
  'over-200000': { min: 200000, max: null, label: 'Over 200,000 MAD' },
  'unsure': { min: null, max: null, label: 'Not sure yet' }
};

// Get budget band label formatted for the specified currency
export function getBudgetBandLabel(bandKey: string, currency: Currency = DEFAULT_CURRENCY): string {
  const band = BUDGET_BANDS[bandKey as keyof typeof BUDGET_BANDS];
  if (!band) return 'Unknown budget range';

  if (bandKey === 'unsure') return band.label;

  if (band.min === null && band.max === null) return band.label;
  if (band.min === 0) return `Under ${formatCurrency(band.max!, currency, { showSymbol: false })} ${currency}`;
  if (band.max === null) return `Over ${formatCurrency(band.min!, currency, { showSymbol: false })} ${currency}`;

  return `${formatCurrency(band.min!, currency, { showSymbol: false })} - ${formatCurrency(band.max!, currency, { showSymbol: false })} ${currency}`;
}