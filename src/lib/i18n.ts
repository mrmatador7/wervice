import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Ensure that a valid locale is used
  if (!locale || !['en', 'fr', 'ar'].includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
