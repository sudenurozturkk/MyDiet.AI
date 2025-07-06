"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GoalsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        router.push('/auth/login');
      } else {
        setChecked(true);
      }
    }
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
} 