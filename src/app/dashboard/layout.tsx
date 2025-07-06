"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userEmail = localStorage.getItem('userEmail');
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (!userEmail || !token) {
        router.replace('/auth/login');
      } else {
        setChecked(true);
      }
    }
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
} 