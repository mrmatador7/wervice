import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  await params;

  return <>{children}</>;
}
