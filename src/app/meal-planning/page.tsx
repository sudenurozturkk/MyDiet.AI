'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Trash2,
  Calendar,
  Utensils,
  Target,
  TrendingUp,
  Sun,
  Moon,
  Apple,
  Coffee,
  Clock,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// shadcn/ui bileşenleri
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  category: string[];
  calories?: number;
  image?: string;
  userId?: string; // Kullanıcının kimliği
}

interface MealPlan {
  id: string;
  day: string;
  mealType: 'kahvaltı' | 'ara öğün 1' | 'öğle' | 'ara öğün 2' | 'akşam' | 'gece ara öğünü';
  recipeId: string;
  recipeTitle: string;
  calories: number;
}

const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

const mealTypes = [
  { value: 'kahvaltı', label: 'Kahvaltı', icon: Coffee, color: 'bg-orange-100 text-orange-700' },
  { value: 'ara öğün 1', label: 'Ara Öğün 1', icon: Apple, color: 'bg-green-100 text-green-700' },
  { value: 'öğle', label: 'Öğle Yemeği', icon: Sun, color: 'bg-yellow-100 text-yellow-700' },
  { value: 'ara öğün 2', label: 'Ara Öğün 2', icon: Apple, color: 'bg-green-100 text-green-700' },
  { value: 'akşam', label: 'Akşam Yemeği', icon: Moon, color: 'bg-blue-100 text-blue-700' },
  {
    value: 'gece ara öğünü',
    label: 'Gece Ara Öğünü',
    icon: Clock,
    color: 'bg-purple-100 text-purple-700',
  },
];

export default function MealPlanningPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Pazartesi');
  const [selectedMealType, setSelectedMealType] = useState<string>('kahvaltı');
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [addError, setAddError] = useState<string>('');
  const [addSuccess, setAddSuccess] = useState<string>('');

  useEffect(() => {
    fetchRecipes();
    loadMealPlans();
  }, []);

  // DEBUG: Tarif sayısını ekrana yazdır
  console.log('recipes.length:', recipes.length);

  const fetchRecipes = async () => {
    try {
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('pageSize', '1000');
      const response = await fetch(`/api/recipes?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const apiItems = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];

      // Eğer API'den veri gelmezse, local dosyadan yükle
      if (!apiItems || apiItems.length === 0) {
        const localRecipes = await import('@/data/recipes-clean.json');
        setRecipes(localRecipes.default || []);
      } else {
        setRecipes(apiItems);
      }
    } catch (error) {
      console.error('Recipes fetch error:', error);
      // Fallback: Local dosyadan yükle
      try {
        const localRecipes = await import('@/data/recipes-clean.json');
        setRecipes(localRecipes.default || []);
      } catch (localError) {
        console.error('Local recipes load error:', localError);
        setRecipes([]);
      }
    }
  };

  const loadMealPlans = () => {
    const saved = localStorage.getItem('mealPlans');
    if (saved) {
      setMealPlans(JSON.parse(saved));
    }
  };

  const saveMealPlans = (plans: MealPlan[]) => {
    localStorage.setItem('mealPlans', JSON.stringify(plans));
    setMealPlans(plans);
  };

  const addMealPlan = () => {
    setAddError('');
    setAddSuccess('');
    if (!selectedRecipe) {
      setAddError('Lütfen bir tarif seçin.');
      return;
    }
    if (filteredRecipes.length === 0) {
      setAddError('Tarifler yüklenmedi. Lütfen sayfayı yenileyin.');
      return;
    }
    const recipe = filteredRecipes.find((r: Recipe) => String(r._id) === String(selectedRecipe));
    if (!recipe) {
      setAddError('Seçilen tarif bulunamadı. Lütfen tekrar deneyin.');
      return;
    }
    const newMealPlan: MealPlan = {
      id: Date.now().toString(),
      day: selectedDay,
      mealType: selectedMealType as MealPlan['mealType'],
      recipeId: String(selectedRecipe),
      recipeTitle: recipe.title,
      calories: recipe.calories || 0,
    };
    const updatedPlans = [...mealPlans, newMealPlan];
    saveMealPlans(updatedPlans);
    setSelectedRecipe('');
    setAddSuccess('Öğün başarıyla eklendi!');
  };

  const removeMealPlan = (id: string) => {
    const updatedPlans = mealPlans.filter((plan) => plan.id !== id);
    saveMealPlans(updatedPlans);
  };

  const getMealPlansForDay = (day: string) => {
    return mealPlans.filter((plan) => plan.day === day);
  };

  const getTotalCaloriesForDay = (day: string) => {
    const dayPlans = getMealPlansForDay(day);
    return dayPlans.reduce((total, plan) => total + plan.calories, 0);
  };

  const getMealPlansForDayAndType = (day: string, mealType: string) => {
    return mealPlans.filter((plan) => plan.day === day && plan.mealType === mealType);
  };

  // Tarifleri filtrele: Aynı başlığa veya aynı _id'ye sahip olanları tekilleştir
  const filteredRecipes: Recipe[] = Array.from(
    new Map(recipes.map((r: Recipe) => [r.title + r._id, r])).values()
  );

  const DayCard = ({ day, index }: { day: string; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      className="flex flex-col h-full"
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-0 flex-1 overflow-hidden"
      >
        <div className="p-3 sm:p-4 bg-gradient-to-r from-fitness-blue/10 to-fitness-green/10 border-b border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-center text-gray-800">{day}</h3>
          <div className="text-center mt-2">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-fitness-blue to-fitness-green text-white text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
              <Target className="w-3 h-3" />
              {getTotalCaloriesForDay(day)} kcal
            </span>
          </div>
        </div>
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {mealTypes.map((mealType) => {
            const dayMeals = getMealPlansForDayAndType(day, mealType.value);
            return (
              <div key={mealType.value} className="space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <div className={`p-1 rounded-full ${mealType.color}`}>
                    <mealType.icon className="w-3 h-3" />
                  </div>
                  <span className="text-xs">{mealType.label}</span>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {dayMeals.map((meal) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate min-w-0">
                              {meal.recipeTitle}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {meal.calories} kcal
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeMealPlan(meal.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {dayMeals.length === 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-xs text-gray-400 text-center py-3 sm:py-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                          <Plus className="w-4 h-4 mx-auto mb-1" />
                          Öğün ekleyin
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tıklayıp öğün ekleyin</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <div
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-fitness-blue to-fitness-green rounded-full">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-fitness-blue to-fitness-green bg-clip-text text-transparent">
                Haftalık Öğün Planlama
              </h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto px-4">
              Sağlıklı beslenme hedeflerinize ulaşmak için haftalık öğün planınızı oluşturun.
            </p>
          </motion.div>

          {/* Öğün Ekleme Formu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Plus className="w-5 h-5 text-fitness-blue" />
                  Yeni Öğün Ekle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gün</label>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Gün seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Öğün Türü
                    </label>
                    <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Öğün türü seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {mealTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tarif</label>
                    <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tarif seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredRecipes.length === 0 ? (
                          <div className="text-xs text-red-500 p-2">
                            Hiç tarif bulunamadı. Lütfen tarif ekleyin veya sayfayı yenileyin.
                          </div>
                        ) : (
                          filteredRecipes.map((recipe) => (
                            <SelectItem key={recipe._id} value={recipe._id}>
                              {recipe.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <Button
                        onClick={addMealPlan}
                        className="w-full h-10 text-white font-medium bg-gradient-to-r from-fitness-blue to-fitness-green hover:from-fitness-blue/90 hover:to-fitness-green/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ekle
                      </Button>
                      {addError && <div className="text-xs text-red-500 mt-2">{addError}</div>}
                      {addSuccess && (
                        <div className="text-xs text-green-600 mt-2">{addSuccess}</div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Haftalık Plan - Desktop */}
          <div className="hidden md:grid md:grid-cols-7 gap-4 mb-8">
            {daysOfWeek.map((day, index) => (
              <DayCard key={day} day={day} index={index} />
            ))}
          </div>

          {/* Haftalık Plan - Mobile Carousel */}
          <div className="md:hidden mb-6 sm:mb-8">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {daysOfWeek.map((day, index) => (
                  <CarouselItem key={day} className="pl-2 md:pl-4 basis-full">
                    <DayCard day={day} index={index} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1 sm:left-2" />
              <CarouselNext className="right-1 sm:right-2" />
            </Carousel>
          </div>

          {/* Haftalık Özet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="w-5 h-5 text-fitness-green" />
                  Haftalık Özet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
                  {daysOfWeek.map((day, index) => {
                    const totalCalories = getTotalCaloriesForDay(day);
                    const mealCount = getMealPlansForDay(day).length;
                    return (
                      <motion.div
                        key={day}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="text-center p-3 sm:p-4 bg-gradient-to-br from-fitness-blue/5 to-fitness-green/5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium text-gray-900 text-xs sm:text-sm">{day}</h3>
                        <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-fitness-blue to-fitness-green bg-clip-text text-transparent">
                          {totalCalories}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">kcal</p>
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                          <Utensils className="w-3 h-3" />
                          {mealCount} öğün
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Haftalık Toplam</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-fitness-green to-fitness-blue bg-clip-text text-transparent">
                      {daysOfWeek.reduce((total, day) => total + getTotalCaloriesForDay(day), 0)}{' '}
                      kcal
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Ortalama günlük:{' '}
                      {Math.round(
                        daysOfWeek.reduce((total, day) => total + getTotalCaloriesForDay(day), 0) /
                          7
                      )}{' '}
                      kcal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}
