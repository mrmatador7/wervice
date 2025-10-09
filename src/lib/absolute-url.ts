export function absoluteUrl(path = '/') {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (typeof window === 'undefined'
      ? `http://localhost:3000`
      : `${window.location.protocol}//${window.location.host}`);
  if (!path.startsWith('/')) path = `/${path}`;
  return `${base}${path}`;
}
