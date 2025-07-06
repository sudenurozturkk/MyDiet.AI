import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  return (
    <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center bg-hero-gradient text-white py-16 overflow-hidden">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-center drop-shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Hayalindeki Vücuda Ulaş!
      </motion.h1>
      <motion.p
        className="mt-6 text-lg md:text-2xl text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Yapay Zeka Destekli Kişisel Sağlık ve Fitness Asistanı
      </motion.p>
      <motion.div
        className="mt-10 flex flex-col md:flex-row gap-4 justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.7 }}
      >
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 rounded-full bg-fitness-pink text-white font-bold text-lg shadow-lg transition-all duration-300 hover:bg-fitness-orange"
        >
          Planını Oluştur
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 rounded-full bg-fitness-blue text-white font-bold text-lg shadow-lg transition-all duration-300 hover:bg-fitness-green"
          onClick={() => router.push('/auth/register')}
        >
          Hemen Başla
        </motion.button>
      </motion.div>
    </section>
  );
}
