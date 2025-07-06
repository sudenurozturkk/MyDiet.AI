import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Ayşe K.',
    text: 'FitTurkAI sayesinde 6 ayda 12 kilo verdim ve çok daha enerjik hissediyorum! Planlar ve topluluk desteği harika.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Mehmet T.',
    text: 'Uygulamanın beslenme takibi ve ilerleme analizleri motivasyonumu hep yüksek tuttu. Herkese tavsiye ederim!',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Elif S.',
    text: 'Kişisel planlar ve önerilerle hedefime çok daha hızlı ulaştım. Arayüzü de çok kullanışlı.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white dark:bg-neutral-dark">
      <h2 className="text-3xl font-bold text-center mb-10 text-fitness-blue dark:text-fitness-green">
        Kullanıcı Başarı Hikâyeleri
      </h2>
      <div className="max-w-2xl mx-auto">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          loop
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center bg-neutral-light dark:bg-fitness-dark rounded-2xl shadow-lg p-8 animate-fade-in">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-fitness-blue shadow"
                  onError={(e) =>
                    (e.currentTarget.src =
                      'https://ui-avatars.com/api/?name=' + encodeURIComponent(t.name))
                  }
                />
                <p className="text-lg text-gray-700 dark:text-gray-200 mb-2 text-center">
                  “{t.text}”
                </p>
                <span className="font-semibold text-fitness-pink dark:text-fitness-orange">
                  {t.name}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
