import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'fr', 'ar'] as const;
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` is valid
  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
