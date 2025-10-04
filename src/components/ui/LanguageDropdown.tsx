'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦' },
];

const currencies: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' },
];

export default function LanguageCurrencyDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en';
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  // For now, we'll just show USD as selected - in a real app, this would be stored in user preferences or localStorage
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const currentCurrency = currencies.find(curr => curr.code === selectedCurrency) || currencies[0];

  const switchLocale = (locale: string) => {
    startTransition(() => {
      // Remove current locale from pathname
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
      // Add new locale
      router.push(`/${locale}${pathWithoutLocale}`);
      setIsOpen(false);
    });
  };

  const selectCurrency = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    // In a real app, you'd save this to user preferences/localStorage
    // For now, we'll just close the dropdown
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#11190C] shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Language and currency selection"
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="font-medium">{currentLanguage.code.toUpperCase()}</span>
        <span className="text-gray-400">|</span>
        <span className="font-medium">{currentCurrency.symbol}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-black/10 rounded-lg shadow-lg z-50">
          {/* Languages Section */}
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Language</div>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLocale(language.code)}
                className={`w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-gray-50 transition-colors rounded ${
                  currentLocale === language.code ? 'bg-gray-50' : ''
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
              </button>
            ))}
          </div>

          {/* Currency Section */}
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Currency</div>
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => selectCurrency(currency.code)}
                className={`w-full flex items-center justify-between px-2 py-2 text-left hover:bg-gray-50 transition-colors rounded ${
                  selectedCurrency === currency.code ? 'bg-gray-50' : ''
                }`}
              >
                <span className="text-sm font-medium">{currency.name}</span>
                <span className="text-sm text-gray-500">{currency.symbol}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}