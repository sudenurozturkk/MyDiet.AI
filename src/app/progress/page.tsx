'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, ScaleIcon, HeartIcon, ArrowTrendingUpIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import ProgressChart from '@/components/progress/ProgressChart';

// Progress tipi local olarak tanımlanıyor
type Progress = {
  _id?: string;
  userId: string;
  date: string;
  weight: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
    calves?: number;
    height?: number;
  };
  photos?: Record<string, string>;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

const metricIcons: Record<string, JSX.Element> = {
  chest: <UserIcon className="w-5 h-5 text-primary" />, // Göğüs
  waist: <ScaleIcon className="w-5 h-5 text-primary" />, // Bel
  hips: <HeartIcon className="w-5 h-5 text-primary" />, // Kalça
  biceps: <ArrowTrendingUpIcon className="w-5 h-5 text-primary" />, // Biceps
  thighs: <SparklesIcon className="w-5 h-5 text-primary" />, // Bacak
  calves: <SparklesIcon className="w-5 h-5 text-primary" />, // Baldır
};

// Ölçü anahtarlarını Türkçeleştir
const measurementLabels: Record<string, string> = {
  chest: 'Göğüs',
  waist: 'Bel',
  hips: 'Kalça',
  biceps: 'Biceps',
  thighs: 'Uyluk',
  calves: 'Baldır',
};

// cm'den inç'e çeviren yardımcı fonksiyon
type Gender = 'male' | 'female';
const cmToInch = (cm?: number) => (cm ? cm / 2.54 : undefined);

// YMCA vücut yağ oranı formülü
function calculateBodyFatYMCA({ waist, height, weight, gender }: { waist?: number; height?: number; weight?: number; gender: Gender | ''; }) {
  if (!waist || !height || !weight || !gender) return '';
  let result = 0;
  if (gender === 'male') {
    result = (1.634 * waist) - (0.1804 * height) - (0.245 * weight) + 10.5;
  } else {
    result = (1.634 * waist) - (0.1804 * height) - (0.245 * weight) + 6.5;
  }
  if (isNaN(result) || !isFinite(result) || result < 0 || result > 70) return '';
  return Math.round(result * 10) / 10;
}

export default function ProgressPage() {
  const [checked, setChecked] = useState(false);
  const [progressRecords, setProgressRecords] = useState<Progress[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProgress, setEditingProgress] = useState<Progress | null>(null);
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [measurements, setMeasurements] = useState<Progress['measurements']>({
    chest: undefined,
    waist: undefined,
    hips: undefined,
    biceps: undefined,
    thighs: undefined,
    calves: undefined,
  });
  const [photos, setPhotos] = useState<Progress['photos']>({});
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const router = useRouter();

  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '';
  const progressKey = `progress_${userEmail}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!userEmail) {
        router.push('/auth/login');
        return;
      }
      setChecked(true);
    }
  }, [router, userEmail]);

  useEffect(() => {
    if (!checked) return;
    const stored = localStorage.getItem(progressKey);
    let parsed = [];
    try {
      parsed = stored ? JSON.parse(stored) : [];
    } catch {
      parsed = [];
    }
    setProgressRecords(parsed);
    setIsLoading(false);
  }, [checked, progressKey]);

  useEffect(() => {
    if (!checked) return;
    localStorage.setItem(progressKey, JSON.stringify(progressRecords));
  }, [progressRecords, checked, progressKey]);

  const handleCreateProgress = () => {
    setError(null);
    const newProgress = {
      _id: Date.now().toString(),
      userId: 'user123', // Geçici olarak sabit bir kullanıcı ID'si kullanıyoruz
      date,
      weight: Number(weight),
      bodyFat: bodyFat ? Number(bodyFat) : undefined,
      measurements,
      photos,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProgressRecords([newProgress, ...progressRecords]);
    resetForm();
  };

  const handleUpdateProgress = (progress: Progress) => {
    setError(null);
    const updatedProgress: Progress = {
      ...progress,
      date,
      weight: Number(weight),
      bodyFat: bodyFat ? Number(bodyFat) : undefined,
      measurements,
      photos,
      notes,
      updatedAt: new Date(),
    };
    setProgressRecords(progressRecords.map((p) => (p._id === progress._id ? updatedProgress : p)));
    resetForm();
  };

  const handleDeleteProgress = (progressId: string) => {
    setError(null);
    setProgressRecords(progressRecords.filter((p) => p._id !== progressId));
  };

  const handleMeasurementChange = (
    field: keyof NonNullable<Progress['measurements']>,
    value: string | undefined
  ) => {
    setMeasurements((prev) => ({
      ...(prev || {}),
      [field]: value ? Number(value) : undefined,
    }));
  };

  // Ölçü inputlarında değişiklik olduğunda otomatik yağ oranı hesapla
  useEffect(() => {
    if (!gender || !age) return;
    const waist = measurements.waist;
    const height = measurements.height;
    const weightNum = Number(weight);
    const bf = calculateBodyFatYMCA({
      waist,
      height,
      weight: weightNum,
      gender,
    });
    if (bf && !isNaN(bf as number)) setBodyFat(String(bf));
  }, [measurements.waist, measurements.height, weight, gender, age]);

  const resetForm = () => {
    setDate('');
    setWeight('');
    setBodyFat('');
    setMeasurements({
      chest: undefined,
      waist: undefined,
      hips: undefined,
      biceps: undefined,
      thighs: undefined,
      calves: undefined,
    });
    setPhotos({});
    setNotes('');
    setIsCreating(false);
    setEditingProgress(null);
  };

  if (!checked) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-neutral-dark">
        <main className="md:ml-64 p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-blue via-fitness-green to-fitness-orange/30 dark:from-fitness-blue dark:via-fitness-green dark:to-fitness-orange/40 font-sans">
      <main className="md:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2 font-sans drop-shadow">
              İlerleme Takibi
            </h1>
            <p className="text-gray-800 dark:text-gray-200 text-lg">
              Vücut ölçülerinizi ve ilerlemenizi modern grafiklerle takip edin
            </p>
          </motion.div>

          {/* Grafik ve + butonu kartı */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 mb-6 border border-fitness-blue/30 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kilo ve Yağ Oranı Grafiği</h2>
              {!isCreating && !editingProgress && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange text-white rounded-full shadow-md hover:opacity-90 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-fitness-blue focus:ring-offset-2 absolute right-6 top-6 z-10"
                  aria-label="Yeni Kayıt Ekle"
                >
                  <PlusIcon className="w-6 h-6" />
                  <span className="hidden sm:inline font-semibold">Ekle</span>
                </button>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProgressChart
                data={progressRecords.map((item) => ({
                  date: item.date ? new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-',
                  weight: item.weight,
                  bodyFat: item.bodyFat,
                }))}
              />
            </motion.div>
          </motion.div>

          {/* Kayıtlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progressRecords.map((progress) => (
              <motion.div
                key={progress._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                layout
                className="rounded-2xl shadow-lg p-6 border-2 transition-shadow flex flex-col justify-between bg-white dark:bg-neutral-900 border-fitness-blue/30 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="block text-xs text-gray-700 dark:text-gray-300 font-medium mb-1">
                      {progress.date ? new Date(progress.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                    </span>
                    <div className="flex items-end gap-4">
                      <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {progress.weight} <span className="text-base font-semibold text-gray-700 dark:text-gray-300">kg</span>
                      </span>
                      {progress.bodyFat !== undefined && (
                        <span className="text-xl font-bold text-fitness-pink dark:text-fitness-orange">
                          %{progress.bodyFat}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingProgress(progress);
                        setDate(new Date(progress.date ?? '').toISOString().split('T')[0]);
                        setWeight(progress.weight.toString());
                        setBodyFat(progress.bodyFat?.toString() || '');
                        setMeasurements(progress.measurements);
                        setPhotos(progress.photos || {});
                        setNotes(progress.notes || '');
                      }}
                      className="p-2 text-fitness-blue hover:text-fitness-green rounded-full transition-colors"
                      aria-label="Düzenle"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProgress(progress._id)}
                      className="p-2 text-fitness-pink hover:text-fitness-orange rounded-full transition-colors"
                      aria-label="Sil"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Ölçüler */}
                <div className="mt-4">
                  <h4 className="font-semibold text-fitness-blue dark:text-fitness-green mb-2 flex items-center gap-2">
                    <ScaleIcon className="w-5 h-5 text-fitness-blue" /> Ölçüler
                  </h4>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(progress.measurements || {}).map(([key, value]) =>
                      value ? (
                        <div key={key} className="flex items-center gap-2 rounded-lg px-2 py-1 font-semibold text-base shadow-sm bg-gradient-to-r from-fitness-blue/10 via-fitness-green/10 to-fitness-orange/10 text-fitness-blue dark:text-fitness-green border border-fitness-blue/20">
                          {metricIcons[key] || <UserIcon className="w-5 h-5 text-fitness-blue" />}
                          <span className="font-medium">{measurementLabels[String(key) as keyof typeof measurementLabels] || key}:</span>
                          <span className="font-bold">{value} cm</span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>

                {/* Notlar */}
                {progress.notes && (
                  <div className="mt-4 p-3 rounded-lg bg-fitness-orange/90 text-white dark:bg-fitness-orange/90">
                    <p className="text-sm">{progress.notes}</p>
                  </div>
                )}

                {/* Tarihler */}
                <div className="mt-4 text-xs text-gray-700 dark:text-gray-300 flex gap-4">
                  <span>
                    Oluşturulma: {progress.createdAt ? new Date(progress.createdAt).toLocaleDateString('tr-TR') : '-'}
                  </span>
                  <span>
                    Son Güncelleme: {progress.updatedAt ? new Date(progress.updatedAt).toLocaleDateString('tr-TR') : '-'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Kayıt oluşturma/düzenleme formu */}
          <AnimatePresence>
            {(isCreating || editingProgress) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white dark:bg-neutral-dark rounded-2xl shadow-lg p-6 mb-8 border border-neutral-light dark:border-neutral-dark/70 max-w-xl mx-auto"
              >
                <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                  <PlusIcon className="w-6 h-6" /> {editingProgress ? 'İlerleme Kaydını Düzenle' : 'Yeni İlerleme Kaydı'}
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                        <ScaleIcon className="w-5 h-5" /> Tarih
                      </label>
                      <input
                        type="date"
                        value={date ?? ''}
                        onChange={(e) => setDate(e.target.value)}
                        className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                        <UserIcon className="w-5 h-5" /> Kilo (kg)
                      </label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                        <HeartIcon className="w-5 h-5" /> Vücut Yağ Oranı (%)
                      </label>
                      <input
                        type="number"
                        value={bodyFat}
                        onChange={(e) => setBodyFat(e.target.value)}
                        className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                      <ScaleIcon className="w-5 h-5" /> Ölçüler (cm)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <UserIcon className="w-4 h-4" /> Göğüs
                        </label>
                        <input
                          type="number"
                          value={measurements?.chest ?? ''}
                          onChange={(e) => handleMeasurementChange('chest', e.target.value ?? '')}
                          className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <ScaleIcon className="w-4 h-4" /> Bel
                        </label>
                        <input
                          type="number"
                          value={measurements?.waist ?? ''}
                          onChange={(e) => handleMeasurementChange('waist', e.target.value ?? '')}
                          className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <HeartIcon className="w-4 h-4" /> Kalça
                        </label>
                        <input
                          type="number"
                          value={measurements?.hips ?? ''}
                          onChange={(e) => handleMeasurementChange('hips', e.target.value ?? '')}
                          className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <ArrowTrendingUpIcon className="w-4 h-4" /> Biceps
                        </label>
                        <input
                          type="number"
                          value={measurements?.biceps ?? ''}
                          onChange={(e) => handleMeasurementChange('biceps', e.target.value ?? '')}
                          className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <SparklesIcon className="w-4 h-4" /> Bacak
                        </label>
                        <input
                          type="number"
                          value={measurements?.thighs ?? ''}
                          onChange={(e) => handleMeasurementChange('thighs', e.target.value ?? '')}
                          className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <SparklesIcon className="w-4 h-4" /> Baldır
                        </label>
                        <input
                          type="number"
                          value={measurements?.calves ?? ''}
                          onChange={(e) => handleMeasurementChange('calves', e.target.value ?? '')}
                          className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <UserIcon className="w-4 h-4" /> Yaş
                        </label>
                        <input
                          type="number"
                          value={age}
                          onChange={e => setAge(e.target.value)}
                          className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                          min="0"
                          step="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <UserIcon className="w-4 h-4" /> Cinsiyet
                        </label>
                        <select
                          value={gender}
                          onChange={e => setGender(e.target.value as 'male' | 'female')}
                          className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                        >
                          <option value="">Seçiniz</option>
                          <option value="male">Erkek</option>
                          <option value="female">Kadın</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <UserIcon className="w-4 h-4" /> Boy (cm)
                        </label>
                        <input
                          type="number"
                          value={measurements?.height ?? ''}
                          onChange={e => handleMeasurementChange('height', e.target.value ?? '')}
                          className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                      <PencilIcon className="w-5 h-5" /> Notlar
                    </label>
                    <textarea
                      value={notes ?? ''}
                      onChange={(e) => setNotes(e.target.value)}
                      className="input w-full rounded-xl border border-neutral-light dark:border-neutral-dark/70 bg-neutral-light dark:bg-neutral-dark/70 focus:ring-primary focus:border-primary"
                      rows={3}
                      placeholder="Notlar"
                    />
                  </div>
                  <div className="flex justify-end space-x-4 mt-4">
                    <button onClick={resetForm} className="px-4 py-2 rounded-full bg-neutral-light dark:bg-neutral-dark/70 text-gray-700 dark:text-gray-200 font-semibold shadow hover:bg-neutral/70 dark:hover:bg-neutral-dark transition-colors">
                      İptal
                    </button>
                    <button
                      onClick={() =>
                        editingProgress
                          ? handleUpdateProgress(editingProgress)
                          : handleCreateProgress()
                      }
                      className="px-6 py-2 rounded-full bg-primary text-white font-bold shadow hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {editingProgress ? 'Güncelle' : 'Oluştur'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
