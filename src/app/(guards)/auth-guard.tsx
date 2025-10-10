'use client';

import { ReactNode } from 'react';

export default function AuthGuard({ children }: { children: ReactNode; locale: string }) {
  // Remove all authentication checks - allow immediate access to all pages
  return <>{children}</>;
}
