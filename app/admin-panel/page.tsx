'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Session Status:', status);
    console.log('🔑 Session Data:', session);
    console.log('👤 User Role:', session?.user?.role);

    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (status === 'unauthenticated') {
      console.log('⚠️ User is not authenticated');
      router.replace('/login');
      return;
    }

    if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        console.log('⚠️ User is not admin');
        router.replace('/unauthorized');
        return;
      }
      console.log('✅ User is admin');
      setIsLoading(false);
    }
  }, [session, status, router]);

  if (isLoading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🎉 خوش آمدی ادمین عزیز!</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">شما با موفقیت وارد پنل مدیریت شدید.</p>
      </div>
    </div>
  );
} 