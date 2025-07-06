'use client';
import { AnimatePresence, motion } from 'framer-motion';

export default function MotionLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={typeof window !== 'undefined' ? window.location.pathname : 'main'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex-grow"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
