import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AUTH_UI_ENABLED } from '@/lib/config';

interface VendorSubscribeLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function VendorSubscribeLayout({
  children,
  params,
}: VendorSubscribeLayoutProps) {
  const { locale } = await params;

  if (!AUTH_UI_ENABLED) {
    redirect(`/${locale}`);
  }

  return <>{children}</>;
}

