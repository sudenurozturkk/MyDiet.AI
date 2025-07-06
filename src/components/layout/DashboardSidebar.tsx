'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  FlagIcon,
  ChartBarIcon,
  FireIcon,
  UserIcon,
  HomeIcon,
  Cog6ToothIcon,
  CalendarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Menu, ChevronLeft, ChevronRight } from 'react-feather';

const links = [
  { name: 'Notlar', href: '/notes', icon: BookOpenIcon },
  { name: 'Hedefler', href: '/goals', icon: FlagIcon },
  { name: 'İlerleme', href: '/progress', icon: ChartBarIcon },
  { name: 'Tarifler', href: '/recipes', icon: FireIcon },
  { name: 'Öğün Planlama', href: '/meal-planning', icon: CalendarIcon },
  { name: 'FitTürkAI Asistan', href: '/chat', icon: SparklesIcon },
  { name: 'Profil', href: '/profile', icon: UserIcon },
  { name: 'Ayarlar', href: '/dashboard', icon: Cog6ToothIcon },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    localStorage.removeItem('userEmail');
    router.push('/auth/login');
  };
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`hidden md:flex flex-col ${collapsed ? 'w-20' : 'w-56'} min-h-screen bg-white dark:bg-neutral-900 shadow-xl py-8 px-2 transition-all duration-300 fixed top-0 left-0 z-30`}
    >
      <div className={`mb-8 flex items-center justify-between ${collapsed ? 'px-0' : 'px-2'}`}>
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Eğer logo dosyası yoksa sadece yazı göster */}
          {/* <img src="/logo.png" alt="Logo" className="w-8 h-8" /> */}
          <span
            className={`font-extrabold bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent select-none whitespace-nowrap transition-all duration-300 ${collapsed ? 'text-2xl' : 'text-xl md:text-2xl'}`}
            style={{ maxWidth: collapsed ? 32 : 140, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {collapsed ? 'F' : 'FitTurkAI'}
          </span>
        </div>
        <button
          type="button"
          className="p-2 rounded hover:bg-fitness-blue/10 dark:hover:bg-fitness-green/10 transition"
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Sidebar Aç/Kapa"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-fitness-blue/10 dark:hover:bg-fitness-green/10 ${
              pathname === link.href
                ? 'bg-fitness-blue/20 dark:bg-fitness-green/20 text-fitness-blue dark:text-fitness-green'
                : 'text-gray-700 dark:text-gray-200'
            } ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <link.icon className="w-5 h-5" />
            {!collapsed && link.name}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className={`mt-8 w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition ${collapsed ? 'px-0 text-xs' : ''}`}
      >
        {!collapsed ? 'Çıkış Yap' : <ChevronLeft size={18} />}
      </button>
    </motion.aside>
  );
}
