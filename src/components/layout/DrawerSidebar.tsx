'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings } from 'react-feather';
import {
  BookOpenIcon,
  FlagIcon,
  ChartBarIcon,
  FireIcon,
  UserIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const links = [
  { name: 'Profil', href: '/profile', icon: UserIcon },
  { name: 'Notlar', href: '/notes', icon: BookOpenIcon },
  { name: 'Hedefler', href: '/goals', icon: FlagIcon },
  { name: 'İlerleme', href: '/progress', icon: ChartBarIcon },
  { name: 'Tarifler', href: '/recipes', icon: FireIcon },
  { name: 'Ayarlar', href: '/dashboard', icon: Settings },
];

export default function DrawerSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    localStorage.removeItem('userEmail');
    onClose();
    router.push('/auth/login');
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-50 flex"
        >
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          {/* Drawer */}
          <aside className="relative w-72 max-w-full h-full bg-white dark:bg-neutral-900 shadow-2xl flex flex-col p-6">
            <button
              className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
              onClick={onClose}
              aria-label="Kapat"
            >
              <X size={24} />
            </button>
            <div className="mb-8 mt-2 text-center">
              <span className="font-extrabold text-2xl bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent select-none">
                Menü
              </span>
            </div>
            <nav className="flex flex-col gap-2 mt-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-fitness-blue/10 dark:hover:bg-fitness-green/10 text-gray-700 dark:text-gray-200 text-lg"
                  onClick={onClose}
                >
                  <link.icon className="w-6 h-6" />
                  {link.name}
                </Link>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="mt-8 w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
            >
              Çıkış Yap
            </button>
          </aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
