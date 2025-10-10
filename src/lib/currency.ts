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

// Exchange rates for converting to/from MAD (Moroccan Dirham)
// These are approximate rates - in production, fetch from a reliable API
const EXCHANGE_RATES: Record<Currency, number> = {
  MAD: 1,        // Base currency
  EUR: 10.9,     // 1 EUR = 10.9 MAD
  USD: 10.1      // 1 USD = 10.1 MAD
};

// Convert amount from any currency to MAD
export function convertToMAD(amount: number, fromCurrency: Currency): number {
  if (fromCurrency === 'MAD') return amount;
  const rate = EXCHANGE_RATES[fromCurrency];
  return Math.round(amount * rate);
}

// Convert amount from MAD to target currency
export function convertFromMAD(amountMAD: number, toCurrency: Currency): number {
  if (toCurrency === 'MAD') return amountMAD;
  const rate = EXCHANGE_RATES[toCurrency];
  return Math.round(amountMAD / rate);
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
    MAD: { MAD: 1, USD: 1/10.1, EUR: 1/10.9 },
    USD: { MAD: 10.1, USD: 1, EUR: 10.1/10.9 },
    EUR: { MAD: 10.9, USD: 10.9/10.1, EUR: 1 },
  };

  const rate = exchangeRate || (RATES[from]?.[to] || 1);
  return Math.round(amount * rate * 100) / 100; // Round to 2 decimal places
}

// Simple convert function for MAD to other currencies
export function convert(amountMAD: number, currency: Currency): number {
  if (currency === 'MAD') return amountMAD;
  return convertFromMAD(amountMAD, currency);
}

// Budget bands for wedding planning (in MAD - base currency for storage)
export const BUDGET_BANDS = {
  'under_50k': { min: 0, max: 50000, label: 'Under 50,000 MAD' },
  '50-100k': { min: 50000, max: 100000, label: '50,000 - 100,000 MAD' },
  '100-200k': { min: 100000, max: 200000, label: '100,000 - 200,000 MAD' },
  '200k_plus': { min: 200000, max: null, label: '200,000 MAD+' },
  'unsure': { min: null, max: null, label: 'Not sure yet' }
} as const;

export type BudgetBandKey = keyof typeof BUDGET_BANDS;

// Get budget band label formatted for the specified currency
export function getBudgetBandLabel(bandKey: BudgetBandKey, currency: Currency = DEFAULT_CURRENCY): string {
  const band = BUDGET_BANDS[bandKey];
  if (!band) return 'Unknown budget range';

  if (bandKey === 'unsure') return band.label;

  if (band.min === null && band.max === null) return band.label;

  // Convert MAD amounts to display currency
  const displayMin = band.min !== null ? convertFromMAD(band.min, currency) : null;
  const displayMax = band.max !== null ? convertFromMAD(band.max, currency) : null;

  if (band.min === 0) return `Under ${formatCurrency(displayMax!, currency, { showSymbol: false })} ${currency}`;
  if (band.max === null) return `${formatCurrency(displayMin!, currency, { showSymbol: false })} ${currency}+`;

  return `${formatCurrency(displayMin!, currency, { showSymbol: false })} - ${formatCurrency(displayMax!, currency, { showSymbol: false })} ${currency}`;
}

// Get the MAD min/max values for a budget band
export function getBudgetBandMADValues(bandKey: BudgetBandKey): { min: number | null; max: number | null } {
  const band = BUDGET_BANDS[bandKey];
  return band ? { min: band.min, max: band.max } : { min: null, max: null };
}