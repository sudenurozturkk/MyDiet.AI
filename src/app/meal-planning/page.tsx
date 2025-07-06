'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  category: string[];
  calories?: number;
  image?: string;
}

interface MealPlan {
  id: string;
  day: string;
  mealType: 'kahvaltı' | 'öğle' | 'ara öğün' | 'akşam' | 'gece ara öğünü';
  recipeId: string;
  recipeTitle: string;
  calories: number;
}

const daysOfWeek = [
  'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'
];

const mealTypes = [
  { value: 'kahvaltı', label: 'Kahvaltı', icon: '🌅' },
  { value: 'ara öğün 1', label: 'Ara Öğün 1', icon: '🍎' },
  { value: 'öğle', label: 'Öğle Yemeği', icon: '🌞' },
  { value: 'ara öğün 2', label: 'Ara Öğün 2', icon: '🍪' },
  { value: 'akşam', label: 'Akşam Yemeği', icon: '🌙' },
  { value: 'gece ara öğünü', label: 'Gece Ara Öğünü', icon: '🥛' },
];

export default function MealPlanningPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Pazartesi');
  const [selectedMealType, setSelectedMealType] = useState<string>('kahvaltı');
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');

  useEffect(() => {
    fetchRecipes();
    loadMealPlans();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Tarifler yüklenirken hata:', error);
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
    if (!selectedRecipe) return;

    const recipe = recipes.find(r => r._id === selectedRecipe);
    if (!recipe) return;

    const newMealPlan: MealPlan = {
      id: Date.now().toString(),
      day: selectedDay,
      mealType: selectedMealType as MealPlan['mealType'],
      recipeId: selectedRecipe,
      recipeTitle: recipe.title,
      calories: recipe.calories || 0
    };

    const updatedPlans = [...mealPlans, newMealPlan];
    saveMealPlans(updatedPlans);
    setSelectedRecipe('');
  };

  const removeMealPlan = (id: string) => {
    const updatedPlans = mealPlans.filter(plan => plan.id !== id);
    saveMealPlans(updatedPlans);
  };

  const getMealPlansForDay = (day: string) => {
    return mealPlans.filter(plan => plan.day === day);
  };

  const getTotalCaloriesForDay = (day: string) => {
    const dayPlans = getMealPlansForDay(day);
    return dayPlans.reduce((total, plan) => total + plan.calories, 0);
  };

  const getMealPlansForDayAndType = (day: string, mealType: string) => {
    return mealPlans.filter(plan => plan.day === day && plan.mealType === mealType);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          📅 Haftalık Öğün Planlama
        </h1>
        <p className="text-gray-600">
          Haftalık öğün planınızı oluşturun ve günlük kalori alımınızı takip edin.
        </p>
      </motion.div>

      {/* Öğün Ekleme Formu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          ➕ Yeni Öğün Ekle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gün
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {daysOfWeek.map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Öğün Türü
            </label>
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mealTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarif
            </label>
            <select
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tarif seçin</option>
              {recipes.map(recipe => (
                <option key={recipe._id} value={recipe._id}>
                  {recipe.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={addMealPlan}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              ➕ Ekle
            </button>
          </div>
        </div>
      </motion.div>

      {/* Haftalık Plan */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {daysOfWeek.map((day, index) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-lg shadow-lg min-h-[400px]"
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-center">{day}</h3>
              <div className="text-center mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {getTotalCaloriesForDay(day)} kcal
                </span>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {mealTypes.map(mealType => {
                const dayMeals = getMealPlansForDayAndType(day, mealType.value);
                return (
                  <div key={mealType.value} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span>{mealType.icon}</span>
                      {mealType.label}
                    </div>
                    <div className="space-y-2">
                      {dayMeals.map(meal => (
                        <div
                          key={meal.id}
                          className="p-2 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {meal.recipeTitle}
                              </p>
                              <p className="text-xs text-gray-500">
                                {meal.calories} kcal
                              </p>
                            </div>
                            <button
                              onClick={() => removeMealPlan(meal.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                      {dayMeals.length === 0 && (
                        <div className="text-xs text-gray-400 text-center py-2">
                          Henüz öğün eklenmemiş
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Haftalık Özet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white rounded-lg shadow-lg p-6 mt-8"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🍽️ Haftalık Özet
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {daysOfWeek.map(day => {
            const totalCalories = getTotalCaloriesForDay(day);
            const mealCount = getMealPlansForDay(day).length;
            return (
              <div key={day} className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">{day}</h3>
                <p className="text-2xl font-bold text-blue-600">{totalCalories}</p>
                <p className="text-sm text-gray-500">kcal</p>
                <p className="text-xs text-gray-400">{mealCount} öğün</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Haftalık Toplam</h3>
            <p className="text-3xl font-bold text-green-600">
              {daysOfWeek.reduce((total, day) => total + getTotalCaloriesForDay(day), 0)} kcal
            </p>
            <p className="text-sm text-gray-500">
              Ortalama günlük: {Math.round(daysOfWeek.reduce((total, day) => total + getTotalCaloriesForDay(day), 0) / 7)} kcal
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 