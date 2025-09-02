'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import Logo from '../Logo';
import { motion, useAnimation } from 'framer-motion';
import { Sun, Moon, Menu } from 'react-feather';
import { useTheme } from 'next-themes';
import DrawerSidebar from './DrawerSidebar';

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [dark, setDark] = useState(false);
  const controls = useAnimation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const darkMode =
      typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false;
    setDark(darkMode);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setTheme(dark ? 'dark' : 'light');
  }, [dark, mounted, setTheme]);

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.name) {
          setUser({ name: data.name, email: data.email });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    localStorage.removeItem('userEmail');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <>
      <DrawerSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <motion.nav
        className={cn(
          'fixed top-0 left-0 w-full z-40 transition-all duration-300',
          scrolled
            ? 'bg-white/90 dark:bg-fitness-dark/90 shadow-lg backdrop-blur-md'
            : 'bg-transparent dark:bg-transparent shadow-none'
        )}
        animate={
          scrolled
            ? { y: 0, boxShadow: '0 2px 16px 0 rgba(30,144,255,0.08)' }
            : { y: 0, boxShadow: '0 0px 0px 0 transparent' }
        }
        initial={false}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="md:hidden p-2 rounded hover:bg-fitness-blue/10 dark:hover:bg-fitness-green/10 transition"
                onClick={() => setDrawerOpen(true)}
                aria-label="Menüyü Aç"
              >
                <Menu size={24} />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <Logo />
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {pathname === '/' && mounted && (
                <button
                  aria-label="Toggle Dark Mode"
                  onClick={() => setDark((d) => !d)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-fitness-dark hover:bg-fitness-blue/10 dark:hover:bg-fitness-green/10 transition-colors"
                >
                  {dark ? (
                    <Sun size={20} className="text-yellow-400" />
                  ) : (
                    <Moon size={20} className="text-fitness-blue" />
                  )}
                </button>
              )}
              <div className="hidden md:flex items-center md:ml-6">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 px-4 py-2"
                    >
                      {user.name ? `Merhaba, ${user.name}` : 'Profilim'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="ml-4 text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-fitness-blue dark:hover:text-fitness-green px-4 py-2 transition-colors duration-200"
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/auth/register"
                      className="ml-4 text-sm font-medium text-white bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange hover:opacity-90 px-4 py-2 rounded-xl transition-all duration-200"
                    >
                      Kayıt Ol
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
