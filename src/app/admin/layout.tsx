import type { ReactNode } from 'react';
import { UserProvider } from '@/contexts/UserContext';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import AdminGuard from '@/app/(guards)/admin-guard';

export default function AdminLayout({ children }: { children: ReactNode }) {
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
