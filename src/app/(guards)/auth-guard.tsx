'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthGuard({ children, locale }: { children: React.ReactNode; locale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function ensureProfileAndMaybeRedirect() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return; // public pages work

      const uid = session.user.id;

      // Try to get profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id,onboarded')
        .eq('id', uid)
        .single();

      if (error && error.code === 'PGRST116') {
        // No row -> create minimal profile, onboarded=false
        console.log('AuthGuard: Profile not found, creating for user:', uid);
        const { error: insertError } = await supabase.from('profiles').insert({
          id: uid,
          onboarded: false,
          user_type: 'couple',
          user_status: 'active'
        });

        if (insertError) {
          console.error('AuthGuard: Error creating profile:', insertError);
        } else {
          console.log('AuthGuard: Profile created successfully');
        }
      }

      // Re-fetch to get current state
      const { data: fresh } = await supabase
        .from('profiles')
        .select('onboarded')
        .eq('id', uid)
        .single();

      const isOnboarding = pathname?.includes('/onboarding');

      if (fresh?.onboarded === false && !isOnboarding) {
        router.replace(`/${locale}/onboarding`);
      }
    }

    ensureProfileAndMaybeRedirect();
    return () => { mounted = false; };
  }, [pathname, router, supabase, locale]);

  return <>{children}</>;
}
