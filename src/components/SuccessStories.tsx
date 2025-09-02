import { motion } from 'framer-motion';
import Image from 'next/image';

const stories = [
  {
    name: 'Zeynep Y.',
    story:
      'Düzenli olarak uygulamayı kullandım ve 3 ayda hedefime ulaştım. Artık çok daha sağlıklıyım!',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'Ali V.',
    story: 'MyDiet Ai ile kas kütlemi artırdım ve motivasyonumu hiç kaybetmedim. Teşekkürler!',
    image: 'https://randomuser.me/api/portraits/men/43.jpg',
  },
];

export default function SuccessStories() {
  return (
    <section className="py-16 bg-neutral-light dark:bg-fitness-dark">
      <h2 className="text-3xl font-bold text-center mb-10 text-fitness-blue dark:text-fitness-green">
        Hedefe Ulaşanlar
      </h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {stories.map((s, i) => (
          <motion.div
            key={s.name}
            className="flex flex-col md:flex-row items-center bg-white dark:bg-neutral-dark rounded-2xl shadow-lg p-6 gap-6 animate-fade-in"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            viewport={{ once: true }}
          >
            <Image
              src={s.image}
              alt={s.name}
              width={96}
              height={96}
              className="rounded-full object-cover border-4 border-fitness-green mb-4 md:mb-0 shadow"
            />
            <div>
              <p className="text-lg text-gray-700 dark:text-gray-200 mb-2">{s.story}</p>
              <span className="font-semibold text-fitness-pink dark:text-fitness-orange">
                {s.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
