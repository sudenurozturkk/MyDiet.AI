'use client';
import NavbarWrapper from '@/components/layout/NavbarWrapper';
import SidebarWrapper from '@/components/layout/SidebarWrapper';
import ChatWidget from '@/components/chat/ChatWidget';
import { usePathname } from 'next/navigation';

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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProtected = protectedRoutes.some((p) => pathname.startsWith(p));
  const isChatPage = pathname === '/chat';

  return (
    <>
      {!isProtected && <NavbarWrapper />}
      <div className="flex flex-1">
        {isProtected && <SidebarWrapper />}
        <div className="flex-1">{children}</div>
      </div>
      {isProtected && !isChatPage && <ChatWidget />}
    </>
  );
} 