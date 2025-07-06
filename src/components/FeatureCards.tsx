import { motion } from 'framer-motion';

const features = [
  {
    title: 'Akıllı Planlama',
    desc: 'Hedefine uygun kişiselleştirilmiş planlar ve öneriler.',
    icon: '🧠',
  },
  {
    title: 'Beslenme Takibi',
    desc: 'Günlük beslenmeni kolayca kaydet ve analiz et.',
    icon: '🥗',
  },
  {
    title: 'İlerleme Analizi',
    desc: 'Grafiklerle gelişimini takip et, motivasyonunu artır.',
    icon: '📈',
  },
  {
    title: 'Topluluk',
    desc: 'Başarı hikâyelerini paylaş, destek al.',
    icon: '🤝',
  },
];

export default function FeatureCards() {
  return (
    <section className="py-12 bg-neutral-light dark:bg-fitness-dark">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="rounded-2xl bg-white dark:bg-neutral-dark shadow-lg p-6 flex flex-col items-center text-center cursor-pointer border border-transparent hover:border-fitness-blue transition-all"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.07, boxShadow: '0 8px 32px 0 rgba(30,144,255,0.15)' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <span className="text-4xl mb-3">{f.icon}</span>
            <h3 className="font-bold text-lg mb-2 text-fitness-blue dark:text-fitness-green">
              {f.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
