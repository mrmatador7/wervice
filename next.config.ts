import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'mjaorgeyvdrttqwhvyot.supabase.co',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      // Prevent i18n redirect for API routes - rewrite /api to /api (no-op but prevents redirect)
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
      // Rewrite locale-prefixed API routes to direct API routes
      {
        source: "/:locale(en|fr|ar)/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
