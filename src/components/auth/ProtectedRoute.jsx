'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait — don't redirect yet

    if (!user) {
      router.replace('/login');
      return;
    }

    if (adminOnly && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [user, loading, isAdmin, adminOnly, router]);

  // Still checking localStorage — show nothing (no flash, no redirect)
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-4 border-brand-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authed — render nothing while redirect happens
  if (!user) return null;
  if (adminOnly && !isAdmin) return null;

  return children;
}