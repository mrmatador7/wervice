'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { ChevronUp } from 'lucide-react';

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
  const { locale: currentLocale } = useLocale();
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  // Load currency from localStorage on mount
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const currentCurrency = currencies.find(curr => curr.code === selectedCurrency) || currencies[0];

  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

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
    localStorage.setItem('preferred-currency', currencyCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Language and currency selection"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{currentLanguage.flag}</span>
        <span className="font-semibold">{currentLanguage.code.toUpperCase()}</span>
        <span className="text-zinc-400">|</span>
        <span className="font-semibold">{currentCurrency.symbol}</span>
        <ChevronUp
          className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Languages Section */}
          <div className="p-3">
            <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Language
            </h3>
            <div className="space-y-0.5">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => switchLocale(language.code)}
                  disabled={isPending}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors rounded-lg ${
                    currentLocale === language.code
                      ? 'bg-zinc-100'
                      : 'hover:bg-zinc-50'
                  } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-lg leading-none">{language.flag}</span>
                  <span className={`text-sm ${
                    currentLocale === language.code ? 'font-bold' : 'font-medium'
                  }`}>
                    {language.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-200" />

          {/* Currency Section */}
          <div className="p-3">
            <h3 className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Currency
            </h3>
            <div className="space-y-0.5">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => selectCurrency(currency.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors rounded-lg ${
                    selectedCurrency === currency.code
                      ? 'bg-zinc-100'
                      : 'hover:bg-zinc-50'
                  }`}
                >
                  <span className={`text-sm ${
                    selectedCurrency === currency.code ? 'font-bold' : 'font-medium'
                  }`}>
                    {currency.name}
                  </span>
                  <span className={`text-xs ${
                    selectedCurrency === currency.code 
                      ? 'font-bold text-zinc-900' 
                      : 'font-medium text-zinc-500'
                  }`}>
                    {currency.symbol}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop - Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}