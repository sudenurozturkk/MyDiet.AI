'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, HeartIcon, BeakerIcon, FireIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

const iconVariants = {
  initial: { rotate: 0, scale: 1 },
  animate: {
    rotate: [0, 10, -10, 0],
    scale: [1, 1.1, 1],
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
};

export default function ProfilePage() {
  const { status } = useSession();
  const [profile, setProfile] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showAssistantMsg, setShowAssistantMsg] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const load = async () => {
      try {
        const res = await fetch('/api/profile', { cache: 'no-store' });
        if (!res.ok) throw new Error('Profil yüklenemedi');
        const data = await res.json();
        setProfile(data?.data ?? {});
      } catch (e) {
        setError('Profil yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [status]);

  useEffect(() => {
    if (showAssistantMsg) {
      const timer = setTimeout(() => setShowAssistantMsg(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showAssistantMsg]);

  const saveProfile = async () => {
    try {
      setError(null);
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error('Kaydetme başarısız');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setProfile((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] ?? {}),
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (section: string, field: string, action: 'add' | 'remove', value: string) => {
    setProfile((prev: any) => {
      const currentArray = (prev?.[section]?.[field] ?? []) as string[];
      if (action === 'add' && value.trim() && !currentArray.includes(value)) {
        return {
          ...prev,
          [section]: {
            ...(prev?.[section] ?? {}),
            [field]: [...currentArray, value],
          },
        };
      } else if (action === 'remove') {
        return {
          ...prev,
          [section]: {
            ...(prev?.[section] ?? {}),
            [field]: currentArray.filter((item) => item !== value),
          },
        };
      }
      return prev;
    });
  };

  const calculateBMI = () => {
    const height = profile?.personalInfo?.height;
    const weight = profile?.personalInfo?.weight;
    if (height && weight) return (weight / ((height / 100) ** 2)).toFixed(1);
    return '0';
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Zayıf';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Fazla Kilolu';
    return 'Obez';
  };

  const calculateBMR = () => {
    const gender = profile?.personalInfo?.gender;
    const age = profile?.personalInfo?.age;
    const height = profile?.personalInfo?.height;
    const weight = profile?.personalInfo?.weight;
    if (!age || !height || !weight) return 0;
    if (gender === 'Erkek') return Math.round(88.362 + 13.397 * weight + 4.799 * height - 5.677 * age);
    return Math.round(447.593 + 9.247 * weight + 3.098 * height - 4.33 * age);
  };

  const calculateTDEE = () => {
    const bmr = calculateBMR();
    const level = profile?.personalInfo?.activityLevel ?? 'moderate';
    const multipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    return Math.round(bmr * (multipliers[level] ?? 1.55));
  };

  if (status === 'loading' || isLoading) return null;

  return (
    <div className="relative flex min-h-screen bg-neutral-light dark:bg-neutral-dark overflow-x-hidden">
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
      <main className="flex-1 p-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent mb-2">
              Profil
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Kişisel bilgilerini ve tercihlerini yönet.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <motion.div whileHover={{ scale: 1.07, y: -8, boxShadow: '0 8px 32px 0 rgba(30,144,255,0.15)' }} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-5 flex flex-col items-center text-center transition-transform cursor-pointer">
              <motion.div variants={iconVariants} initial="initial" animate="animate" className="p-3 bg-fitness-blue/10 rounded-lg mb-2">
                <UserIcon className="w-7 h-7 text-fitness-blue" />
              </motion.div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Vücut Kitle İndeksi</h3>
              <p className="text-2xl font-bold">{calculateBMI()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{getBMICategory(parseFloat(calculateBMI()))}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.07, y: -8, boxShadow: '0 8px 32px 0 rgba(50,205,50,0.15)' }} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-5 flex flex-col items-center text-center transition-transform cursor-pointer">
              <motion.div variants={iconVariants} initial="initial" animate="animate" className="p-3 bg-fitness-green/10 rounded-lg mb-2">
                <HeartIcon className="w-7 h-7 text-fitness-green" />
              </motion.div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Bazal Metabolizma</h3>
              <p className="text-2xl font-bold">{calculateBMR()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">kcal/gün</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.07, y: -8, boxShadow: '0 8px 32px 0 rgba(255,140,0,0.15)' }} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-5 flex flex-col items-center text-center transition-transform cursor-pointer">
              <motion.div variants={iconVariants} initial="initial" animate="animate" className="p-3 bg-fitness-orange/10 rounded-lg mb-2">
                <FireIcon className="w-7 h-7 text-fitness-orange" />
              </motion.div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Günlük Enerji İhtiyacı</h3>
              <p className="text-2xl font-bold">{calculateTDEE()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">kcal/gün</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.07, y: -8, boxShadow: '0 8px 32px 0 rgba(30,144,255,0.10)' }} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-5 flex flex-col items-center text-center transition-transform cursor-pointer">
              <motion.div variants={iconVariants} initial="initial" animate="animate" className="p-3 bg-fitness-blue/10 rounded-lg mb-2">
                <BeakerIcon className="w-7 h-7 text-fitness-blue" />
              </motion.div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Aktivite Seviyesi</h3>
              <p className="text-2xl font-bold">{profile?.personalInfo?.activityLevel ?? 'Orta Aktif'}</p>
            </motion.div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-heading font-semibold">Profil Bilgileri</h2>
              <div className="relative flex items-center">
                <button onClick={() => { if (isEditing) saveProfile(); setIsEditing(!isEditing); }} className="btn-primary px-6 py-2 rounded-md shadow font-semibold">
                  {isEditing ? 'Kaydet' : 'Düzenle'}
                </button>
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 mb-6 flex gap-4">
              <button onClick={() => setActiveTab('personal')} className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${activeTab === 'personal' ? 'border-fitness-blue text-fitness-blue' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>Kişisel Bilgiler</button>
              <button onClick={() => setActiveTab('health')} className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${activeTab === 'health' ? 'border-fitness-green text-fitness-green' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>Sağlık Bilgileri</button>
              <button onClick={() => setActiveTab('settings')} className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${activeTab === 'settings' ? 'border-fitness-orange text-fitness-orange' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>Ayarlar</button>
            </div>

            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ad Soyad</label>
                    <input type="text" value={profile?.personalInfo?.name ?? ''} onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)} disabled={!isEditing} className="input w-full rounded-lg shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yaş</label>
                    <input type="number" value={profile?.personalInfo?.age ?? ''} onChange={(e) => handleInputChange('personalInfo', 'age', parseInt(e.target.value))} disabled={!isEditing} className="input w-full rounded-lg shadow-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cinsiyet</label>
                    <select value={profile?.personalInfo?.gender ?? ''} onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)} disabled={!isEditing} className="input w-full rounded-lg shadow-sm">
                      <option value="">Seçiniz</option>
                      <option value="Erkek">Erkek</option>
                      <option value="Kadın">Kadın</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aktivite Seviyesi</label>
                    <select value={profile?.personalInfo?.activityLevel ?? 'moderate'} onChange={(e) => handleInputChange('personalInfo', 'activityLevel', e.target.value)} disabled={!isEditing} className="input w-full rounded-lg shadow-sm">
                      <option value="sedentary">Hareketsiz</option>
                      <option value="light">Hafif Aktif</option>
                      <option value="moderate">Orta Aktif</option>
                      <option value="active">Aktif</option>
                      <option value="veryActive">Çok Aktif</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Boy (cm)</label>
                    <input type="number" value={profile?.personalInfo?.height ?? ''} onChange={(e) => handleInputChange('personalInfo', 'height', parseInt(e.target.value))} disabled={!isEditing} className="input w-full rounded-lg shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kilo (kg)</label>
                    <input type="number" value={profile?.personalInfo?.weight ?? ''} onChange={(e) => handleInputChange('personalInfo', 'weight', parseInt(e.target.value))} disabled={!isEditing} className="input w-full rounded-lg shadow-sm" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kan Grubu</label>
                  <select value={profile?.healthInfo?.bloodType ?? ''} onChange={(e) => handleInputChange('healthInfo', 'bloodType', e.target.value)} disabled={!isEditing} className="input w-full rounded-lg shadow-sm">
                    <option value="">Seçiniz</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="0+">0+</option>
                    <option value="0-">0-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alerjiler</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(profile?.healthInfo?.allergies ?? []).map((allergy: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center">
                        {allergy}
                        {isEditing && (
                          <button onClick={() => handleArrayChange('healthInfo', 'allergies', 'remove', allergy)} className="ml-2 text-gray-400 hover:text-red-500">×</button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Alerji ekle..." className="input flex-1 rounded-lg shadow-sm" onKeyDown={(e) => { if (e.key === 'Enter' && newItem.trim()) { handleArrayChange('healthInfo', 'allergies', 'add', newItem.trim()); setNewItem(''); } }} />
                      <button onClick={() => { if (newItem.trim()) { handleArrayChange('healthInfo', 'allergies', 'add', newItem.trim()); setNewItem(''); } }} className="btn-secondary px-4 py-2 rounded-lg shadow font-semibold">Ekle</button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sağlık Durumları</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(profile?.healthInfo?.conditions ?? []).map((condition: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center">
                        {condition}
                        {isEditing && (
                          <button onClick={() => handleArrayChange('healthInfo', 'conditions', 'remove', condition)} className="ml-2 text-gray-400 hover:text-red-500">×</button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Sağlık durumu ekle..." className="input flex-1 rounded-lg shadow-sm" onKeyDown={(e) => { if (e.key === 'Enter' && newItem.trim()) { handleArrayChange('healthInfo', 'conditions', 'add', newItem.trim()); setNewItem(''); } }} />
                      <button onClick={() => { if (newItem.trim()) { handleArrayChange('healthInfo', 'conditions', 'add', newItem.trim()); setNewItem(''); } }} className="btn-secondary px-4 py-2 rounded-lg shadow font-semibold">Ekle</button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kullandığı İlaçlar</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(profile?.healthInfo?.medications ?? []).map((medication: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center">
                        {medication}
                        {isEditing && (
                          <button onClick={() => handleArrayChange('healthInfo', 'medications', 'remove', medication)} className="ml-2 text-gray-400 hover:text-red-500">×</button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="İlaç ekle..." className="input flex-1 rounded-lg shadow-sm" onKeyDown={(e) => { if (e.key === 'Enter' && newItem.trim()) { handleArrayChange('healthInfo', 'medications', 'add', newItem.trim()); setNewItem(''); } }} />
                      <button onClick={() => { if (newItem.trim()) { handleArrayChange('healthInfo', 'medications', 'add', newItem.trim()); setNewItem(''); } }} className="btn-secondary px-4 py-2 rounded-lg shadow font-semibold">Ekle</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
