'use client';
import { usePathname } from 'next/navigation';
import DashboardSidebar from './DashboardSidebar';

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/notes',
  '/goals',
  '/progress',
  '/recipes',
  '/meal-planning',
  '/chat',
];

export default function SidebarWrapper() {
  const pathname = usePathname();
  const showSidebar = protectedRoutes.some((p) => pathname.startsWith(p));
  if (!showSidebar) return null;
  return (
    <div className="hidden md:block">
      <DashboardSidebar />
    </div>
  );
}

export function useSidebarVisible() {
  const pathname = usePathname();
  const showSidebar = protectedRoutes.some((p) => pathname.startsWith(p));
  return showSidebar;
}
