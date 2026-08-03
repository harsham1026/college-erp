'use client';

import React from 'react';
import { Sidebar } from '@/components/layouts/Sidebar';
import { TopNavbar } from '@/components/layouts/TopNavbar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push('/');
        return;
      }

      // Strict role-based route protection
      const role = user.role;

      if (pathname.startsWith('/admin') && !['SUPER_ADMIN', 'ADMIN', 'EXAM_CONTROLLER', 'ACCOUNTANT', 'PRINCIPAL', 'VICE_PRINCIPAL', 'HOD'].includes(role)) {
        router.push('/');
      } else if (pathname.startsWith('/teacher') && !['TEACHER', 'HOD', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SUPER_ADMIN', 'ADMIN'].includes(role)) {
        router.push('/');
      } else if (pathname.startsWith('/student') && !['STUDENT', 'PARENT', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SUPER_ADMIN', 'ADMIN'].includes(role)) {
        router.push('/');
      } else if (pathname.startsWith('/principal') && !['PRINCIPAL', 'VICE_PRINCIPAL', 'SUPER_ADMIN', 'ADMIN'].includes(role)) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  if (isLoading) {
    return <LoadingScreen onComplete={() => {}} />;
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="lg:ml-[280px] transition-all duration-300">
        <TopNavbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedContent>{children}</ProtectedContent>;
}
