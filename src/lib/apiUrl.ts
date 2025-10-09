// lib/apiUrl.ts
export function apiUrl(path: string) {
  // Always use absolute /api/... to avoid i18n-prefixed URLs
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  // Ensure no accidental double slashes
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
