import { redirect } from 'next/navigation';

interface AuthCodeErrorPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; error_description?: string }>;
}

export default async function AuthCodeErrorPage({ params, searchParams }: AuthCodeErrorPageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const raw = query.error_description || query.error;
  const suffix = raw ? `&error=${encodeURIComponent(raw)}` : '';
  redirect(`/${locale}/auth-access?mode=signup${suffix}`);
}
