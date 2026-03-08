export const SUPPORTED_LOCALES = ['en', 'fr', 'ar'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.wervice.com').replace(/\/+$/, '');
}

export function toAbsoluteUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${cleanPath}`;
}

export function localeAlternates(pathWithoutLocale: string): Record<string, string> {
  const cleanPath = pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`;
  const languages: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    languages[locale] = toAbsoluteUrl(`/${locale}${cleanPath}`);
  }
  languages['x-default'] = toAbsoluteUrl(`/en${cleanPath}`);
  return languages;
}
