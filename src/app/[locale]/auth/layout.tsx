import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AUTH_UI_ENABLED } from '@/lib/config';

interface AuthLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;

  if (!AUTH_UI_ENABLED) {
    redirect(`/${locale}`);
  }

  return <>{children}</>;
}

