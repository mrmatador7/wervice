import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase-server';
import { getOnboarding } from './actions/onboarding.actions';
import OnboardingClient from './components/OnboardingClient';

interface OnboardingPageProps {
  params: Promise<{ locale: string }>;
}

// Server component that handles data fetching and auth
export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params;

  // Get current user
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(`/${locale}/auth/signin`);
  }

  // Check if user is already onboarded
  const { data: onboardingData } = await getOnboarding(user.id);

  if (onboardingData?.onboarded) {
    redirect(`/${locale}/dashboard`);
  }

  // Get current step from URL search params
  // This will be handled by the client component

  return <OnboardingClient uid={user.id} initialData={onboardingData} />;
}
