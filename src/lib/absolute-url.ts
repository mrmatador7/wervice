import { getSiteUrl } from '@/lib/seo/site-url';

export function absoluteUrl(path = '/') {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window === 'undefined'
      ? getSiteUrl()
      : `${window.location.protocol}//${window.location.host}`);
  if (!path.startsWith('/')) path = `/${path}`;
  return `${base}${path}`;
}
