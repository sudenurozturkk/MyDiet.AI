export default function PlansPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-fitness-green via-fitness-blue to-fitness-orange/30">
      <div className="bg-white/80 dark:bg-neutral-900/80 rounded-2xl shadow-2xl p-10 w-full max-w-2xl flex flex-col items-center animate-fade-in">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-fitness-green via-fitness-blue to-fitness-orange bg-clip-text text-transparent mb-4">
          Planlarım
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-200 text-center text-lg max-w-xl">
          Kişisel antrenman ve beslenme planlarını burada görüntüleyebilir, yeni planlar
          oluşturabilir veya mevcut planlarını düzenleyebilirsin.
        </p>
        <div className="flex flex-wrap gap-6 justify-center mt-4">
          <div className="bg-gradient-to-br from-fitness-blue/80 to-fitness-green/80 rounded-xl p-6 shadow-lg text-white w-56 text-center hover:scale-105 transition">
            <span className="text-3xl">🏋️‍♂️</span>
            <div className="font-bold mt-2">Antrenman Planı</div>
            <div className="text-sm mt-1">Haftalık ve günlük antrenmanlarını takip et.</div>
          </div>
          <div className="bg-gradient-to-br from-fitness-orange/80 to-fitness-green/80 rounded-xl p-6 shadow-lg text-white w-56 text-center hover:scale-105 transition">
            <span className="text-3xl">🥗</span>
            <div className="font-bold mt-2">Beslenme Planı</div>
            <div className="text-sm mt-1">Kişisel diyet ve öğünlerini planla.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
