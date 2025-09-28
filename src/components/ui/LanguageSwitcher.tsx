'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('language');
  const router = useRouter();
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en';

  const switchLocale = (locale: string) => {
    startTransition(() => {
      router.push(`/${locale}`);
      setIsOpen(false);
    });
  };

  const languages = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'fr', name: t('french'), flag: '🇫🇷' },
    { code: 'ar', name: t('arabic'), flag: '🇲🇦' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center space-x-1 text-lime-400 hover:text-white transition-colors px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-lg">
          {languages.find(lang => lang.code === currentLocale)?.flag}
        </span>
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === currentLocale)?.code.toUpperCase()}
        </span>
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
        <div className="absolute right-0 mt-2 w-32 bg-black border border-lime-400/20 rounded-md shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-lime-400/10 transition-colors ${currentLocale === lang.code ? 'text-lime-400' : 'text-white'
                }`}
            >
              <span>{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
