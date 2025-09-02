'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FireIcon,
  HeartIcon,
  UserGroupIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  CakeIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';
import Testimonials from '../components/Testimonials';
import SuccessStories from '../components/SuccessStories';

const slogans = [
  'Kilo vermek mi istiyorsun? 💪',
  'Kas yapmak mı? 🏋️‍♂️',
  'Sağlıklı kalmak mı? 🥗',
  'Hepsi burada, hepsi sana özel! 🤖',
  'Yapay Zeka ile Akıllı Sağlık!',
  'Kişisel Fitness Asistanın!',
  'Hayalindeki Vücuda Ulaş!',
];

const advantages = [
  {
    icon: (
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
        <FireIcon className="w-8 h-8 text-fitness-orange" />
      </motion.div>
    ),
    title: 'Akıllı Planlama',
    desc: 'Hedeflerine uygun kişiselleştirilmiş planlar.',
  },
  {
    icon: (
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <HeartIcon className="w-8 h-8 text-fitness-green" />
      </motion.div>
    ),
    title: 'Sağlık Takibi',
    desc: 'Vücut değerlerini ve ilerlemeni kolayca takip et.',
  },
  {
    icon: (
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <UserGroupIcon className="w-8 h-8 text-fitness-blue" />
      </motion.div>
    ),
    title: 'Topluluk',
    desc: 'Motivasyonunu artıran aktif bir topluluk.',
  },
  {
    icon: (
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <SparklesIcon className="w-8 h-8 text-fitness-pink" />
      </motion.div>
    ),
    title: 'Yapay Zeka Desteği',
    desc: 'Akıllı öneriler ve sohbet ile her zaman yanında.',
  },
];

const steps = [
  {
    icon: (
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
        <DevicePhoneMobileIcon className="w-7 h-7 text-fitness-blue" />
      </motion.div>
    ),
    title: 'Kayıt Ol',
    desc: 'Hemen ücretsiz kaydol.',
  },
  {
    icon: (
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <CakeIcon className="w-7 h-7 text-fitness-orange" />
      </motion.div>
    ),
    title: 'Profilini Doldur',
    desc: 'Kişisel bilgilerini ve hedeflerini gir.',
  },
  {
    icon: (
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <ArrowTrendingUpIcon className="w-7 h-7 text-fitness-green" />
      </motion.div>
    ),
    title: 'İlerlemeni Takip Et',
    desc: 'Gelişimini grafiklerle izle.',
  },
];

const emojiVariants = {
  initial: { rotate: 0, scale: 1 },
  animate: {
    rotate: [0, 15, -15, 0],
    scale: [1, 1.2, 1],
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
};

const starVariants = {
  initial: { scale: 1, color: '#FFD700' },
  animate: {
    scale: [1, 1.2, 1],
    color: ['#FFD700', '#FFFACD', '#FFD700'],
    transition: { repeat: Infinity, duration: 1.5 },
  },
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [sloganIndex, setSloganIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Eğer kullanıcı giriş yaptıysa profile yönlendir
    const token =
      typeof document !== 'undefined'
        ? document.cookie.split('; ').find((row) => row.startsWith('token='))
        : null;
    if (token) {
      router.push('/profile');
    }
  }, [router]);

  if (loading) return <Loader />;

  // Modern Yorumlar
  const testimonials = [
    {
      name: 'Ayşe',
      comment: 'Bu uygulama sayesinde 8 kilo verdim ve çok daha enerjik hissediyorum!',
      stars: 5,
    },
    {
      name: 'Mehmet',
      comment: 'Planlar ve topluluk motivasyonu harika, herkese tavsiye ederim.',
      stars: 5,
    },
    {
      name: 'Elif',
      comment: 'Yapay zeka önerileriyle sağlıklı tarifler keşfettim.',
      stars: 4,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-light dark:bg-fitness-dark relative overflow-x-hidden">
      {/* Hareketli arka plan daireleri */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-fitness-blue opacity-20 rounded-full blur-3xl z-0"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-fitness-green opacity-20 rounded-full blur-3xl z-0"
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
      />

      {/* Hero + Slogan */}
      <section className="relative z-10 flex flex-col items-center justify-center py-20">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent drop-shadow-lg mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          MyDiet Ai
        </motion.h1>
        <AnimatePresence mode="wait">
          <motion.div
            className="text-xl md:text-2xl font-semibold text-center mb-6 min-h-[2.5rem]"
            key={sloganIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
          >
            {slogans[sloganIndex]}
          </motion.div>
        </AnimatePresence>
        <p className="max-w-2xl text-center text-gray-700 dark:text-gray-200 mb-8 text-lg">
          Yapay zeka destekli kişisel sağlık ve fitness asistanı ile hedeflerine ulaş. Akıllı
          planlama, beslenme takibi, topluluk ve daha fazlası burada!
        </p>
        <motion.button
          className="px-8 py-3 rounded-full bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange text-white font-bold text-lg shadow-lg transition-all duration-300 hover:opacity-90 hover:scale-105"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/auth/register')}
        >
          Hemen Başla
        </motion.button>
      </section>

      {/* Tanıtım ve Bilgilendirme */}
      <section className="relative z-10 py-12 bg-white/80 dark:bg-neutral-900/80 border-y border-fitness-blue/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent">
            Sağlıklı Yaşam, Akıllı Takip!
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-6">
            MyDiet Ai, sağlıklı yaşam yolculuğunda sana rehberlik eden, tamamen
            kişiselleştirilebilir ve yapay zeka destekli bir platformdur. Hedeflerine ulaşmak için
            ihtiyacın olan her şey tek bir yerde: Akıllı planlama, beslenme ve egzersiz takibi,
            motivasyon artırıcı topluluk, gelişmiş analizler ve daha fazlası!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <BoltIcon className="w-12 h-12 text-fitness-blue mb-2" />
              <h3 className="font-bold text-xl mb-1">Yapay Zeka ile Kişisel Asistan</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Hedeflerine ve alışkanlıklarına göre sana özel öneriler, planlar ve hatırlatmalar
                sunar.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <ScaleIcon className="w-12 h-12 text-fitness-green mb-2" />
              <h3 className="font-bold text-xl mb-1">Gelişmiş Takip & Analiz</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Kilo, vücut ölçüleri, su tüketimi, uyku ve daha fazlasını kolayca takip et,
                gelişimini grafiklerle izle.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <UserGroupIcon className="w-12 h-12 text-fitness-orange mb-2" />
              <h3 className="font-bold text-xl mb-1">Topluluk ve Motivasyon</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Benzer hedeflere sahip insanlarla iletişim kur, başarı hikayelerini paylaş,
                motivasyonunu artır.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-fitness-pink mb-2" />
              <h3 className="font-bold text-xl mb-1">7/24 Destek ve Sohbet</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sorularını anında sor, uzmanlardan ve topluluktan destek al.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Avantajlar */}
      <section className="relative z-10 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {adv.icon}
              <div className="font-bold text-lg mt-3 mb-1">{adv.title}</div>
              <div className="text-gray-500 dark:text-gray-300 text-sm">{adv.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="relative z-10 py-12 bg-white/80 dark:bg-neutral-900/80 border-y border-fitness-blue/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent">
            Nasıl Çalışır?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-br from-fitness-blue/10 via-fitness-green/10 to-fitness-orange/10 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {step.icon}
                <div className="font-bold text-lg mt-3 mb-1">{step.title}</div>
                <div className="text-gray-500 dark:text-gray-300 text-sm">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="relative z-10 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent">
            Öne Çıkan Özellikler
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-gray-700 dark:text-gray-200">
            <li>
              <b>✔ Kişiselleştirilmiş Planlar:</b> Hedeflerine ve yaşam tarzına uygun, tamamen sana
              özel planlar oluştur.
            </li>
            <li>
              <b>✔ Akıllı Hatırlatıcılar:</b> Su içmeyi, egzersiz yapmayı ve öğünlerini asla
              unutma.
            </li>
            <li>
              <b>✔ Gelişmiş Analizler:</b> Tüm gelişimini grafiklerle ve detaylı raporlarla takip
              et.
            </li>
            <li>
              <b>✔ Topluluk Desteği:</b> Soru sor, başarı hikayelerini paylaş, motivasyonunu artır.
            </li>
            <li>
              <b>✔ Güvenli ve Gizli:</b> Tüm verilerin güvenle saklanır, gizliliğin ön planda
              tutulur.
            </li>
            <li>
              <b>✔ Mobil Uyumlu:</b> Her cihazdan kolayca erişim ve kullanım.
            </li>
          </ul>
        </div>
      </section>

      {/* Sıkça Sorulan Sorular */}
      <section className="relative z-10 py-12 bg-white/80 dark:bg-neutral-900/80 border-y border-fitness-blue/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent">
            Sıkça Sorulan Sorular
          </h2>
          <div className="space-y-6 text-left text-gray-700 dark:text-gray-200">
            <div>
              <b>MyDiet Ai ücretsiz mi?</b>
              <p>
                Evet, temel özellikler tamamen ücretsizdir. İsterseniz premium özelliklere
                yükseltebilirsiniz.
              </p>
            </div>
            <div>
              <b>Verilerim güvende mi?</b>
              <p>
                Evet, tüm verileriniz şifreli olarak saklanır ve asla üçüncü kişilerle paylaşılmaz.
              </p>
            </div>
            <div>
              <b>Planlarımı değiştirebilir miyim?</b>
              <p>İstediğiniz zaman hedeflerinizi ve planlarınızı güncelleyebilirsiniz.</p>
            </div>
            <div>
              <b>Toplulukta neler yapabilirim?</b>
              <p>
                Diğer kullanıcılarla sohbet edebilir, sorular sorabilir, başarı hikayelerini
                paylaşabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kullanıcı Yorumları */}
      <section className="relative z-10 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent">
          Kullanıcı Yorumları
        </h2>
        <div className="max-w-4xl mx-auto overflow-x-auto flex gap-6 pb-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="min-w-[320px] bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-all relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <StarIcon className="w-8 h-8 text-yellow-400 mb-2" />
              </motion.div>
              <div className="font-bold text-lg mb-1">{t.name}</div>
              <div className="text-gray-500 dark:text-gray-300 text-sm mb-2">{t.comment}</div>
              <div className="flex gap-1">
                {[...Array(t.stars)].map((_, idx) => (
                  <motion.span
                    key={idx}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.2 }}
                  >
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Güvenlik ve Gizlilik */}
      <section className="relative z-10 py-12 bg-white/80 dark:bg-neutral-900/80 border-y border-fitness-blue/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent">
            Güvenlik ve Gizliliğiniz Bizim İçin Önemli
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
            Tüm verileriniz modern güvenlik standartları ile korunur. Kişisel bilgileriniz asla
            üçüncü kişilerle paylaşılmaz. Gizlilik politikamıza her zaman ulaşabilirsiniz.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-12 flex flex-col items-center">
        <motion.button
          className="px-10 py-4 rounded-full bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange text-white font-bold text-2xl shadow-xl transition-all duration-300 hover:opacity-90 hover:scale-105"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/auth/register')}
        >
          Şimdi Katıl!
        </motion.button>
        <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg text-center max-w-2xl">
          Hemen ücretsiz kaydol, sağlıklı yaşam yolculuğuna bugün başla! MyDiet Ai ile hedeflerine
          ulaşmak artık çok daha kolay ve eğlenceli.
        </p>
      </section>
    </div>
  );
}
