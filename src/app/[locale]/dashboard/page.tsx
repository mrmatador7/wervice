import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import DashboardClient from './components/DashboardClient';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? 'en';
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/signin`);
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch saved vendors (favorites)
  const { data: favorites } = await supabase
    .from('favorites')
    .select(`
      *,
      vendor:vendors(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardClient 
      user={user}
      profile={profile}
      favorites={favorites || []}
      locale={locale}
    />
  );
}
