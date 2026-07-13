'use client';

import React from 'react';
import { Sidebar } from '@/components/layouts/Sidebar';
import { TopNavbar } from '@/components/layouts/TopNavbar';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
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
  return (
    <AuthProvider>
      <ProtectedContent>{children}</ProtectedContent>
    </AuthProvider>
  );
}
