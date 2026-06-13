"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (userProfile && userProfile.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading || (user && !userProfile)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Verifying admin access...</p>
      </div>
    );
  }

  if (!user || userProfile?.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
