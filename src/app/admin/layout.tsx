import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { UserProvider } from '@/contexts/UserContext';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import AdminGuard from '@/app/(guards)/admin-guard';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/en/dashboard');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = profile?.user_type === 'admin' || profile?.user_type === 'super_admin';
  if (!isAdmin) {
    redirect('/en/dashboard');
  }

  return (
    <UserProvider>
      <AdminGuard>
        <div className="min-h-screen bg-gray-50">
          <div className="flex">
            <Sidebar />
            <main className="flex-1 min-w-0">
              <Topbar />
              <div className="p-6 md:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </AdminGuard>
    </UserProvider>
  );
}
