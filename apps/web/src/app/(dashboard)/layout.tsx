'use client';

import React from 'react';
import { Sidebar } from '@/components/layouts/Sidebar';
import { TopNavbar } from '@/components/layouts/TopNavbar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen onComplete={() => {}} />;
  }

  if (!isAuthenticated) return null;

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
