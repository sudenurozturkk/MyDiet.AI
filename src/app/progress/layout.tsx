'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useSession();
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/login');
  }, [status, router]);
  if (status === 'loading') return null;
  return <>{children}</>;
}
