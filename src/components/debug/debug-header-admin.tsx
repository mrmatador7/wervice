// Temporary debug component for header admin access
// Add this to the Header component temporarily

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

export default function DebugHeaderAdmin() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          setDebugInfo({
            error: error.message,
            session: false,
            userId: null,
            email: null,
            profile: null,
            userType: null,
            isAdmin: false,
            isSuperAdmin: false,
            canAccessAdmin: false,
            currentLocale: window.location.pathname.split('/')[1] || 'en',
            adminLink: `/${window.location.pathname.split('/')[1] || 'en'}/admin`
          });
          return;
        }

        let profile = null;
        if (user?.id) {
          const { data } = await supabase
            .from('profiles')
            .select('user_type, email')
            .eq('id', user.id)
            .single();
          profile = data;
        }

        const isAdmin = profile?.user_type === 'admin';
        const isSuperAdmin = profile?.user_type === 'super_admin';
        const canAccessAdmin = isAdmin || isSuperAdmin;

        setDebugInfo({
          session: !!user,
          userId: user?.id,
          email: user?.email,
          profile: profile,
          userType: profile?.user_type,
          isAdmin,
          isSuperAdmin,
          canAccessAdmin,
          currentLocale: window.location.pathname.split('/')[1] || 'en',
          adminLink: `/${window.location.pathname.split('/')[1] || 'en'}/admin`
        });
      } catch (error: unknown) {
        setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        await checkAdminStatus();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="fixed top-20 right-4 bg-yellow-100 border border-yellow-300 p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h4 className="font-bold text-sm mb-2">🔍 Header Admin Debug</h4>
      <div className="text-xs space-y-1">
        <div>Session: {debugInfo.session ? '✅' : '❌'}</div>
        <div>User ID: {debugInfo.userId || 'null'}</div>
        <div>Email: {debugInfo.email || 'null'}</div>
        <div>Profile: {debugInfo.profile ? '✅' : '❌'}</div>
        <div>User Type: <strong>{debugInfo.userType || 'null'}</strong></div>
        <div>Is Admin: {debugInfo.isAdmin ? '✅' : '❌'}</div>
        <div>Is Super Admin: {debugInfo.isSuperAdmin ? '✅' : '❌'}</div>
        <div>Can Access Admin: {debugInfo.canAccessAdmin ? '✅' : '❌'}</div>
        <div>Admin Link: {debugInfo.adminLink}</div>
      </div>
      {debugInfo.canAccessAdmin && (
        <a
          href={debugInfo.adminLink}
          className="block mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          Test Admin Link
        </a>
      )}
    </div>
  );
}
