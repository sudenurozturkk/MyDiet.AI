'use client';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/notes',
  '/goals',
  '/progress',
  '/recipes',
  '/chat',
];

export default function NavbarWrapper() {
  const pathname = usePathname();
  const showSidebar = protectedRoutes.some((p) => pathname.startsWith(p));
  if (showSidebar) return null;
  return <Navbar />;
}
