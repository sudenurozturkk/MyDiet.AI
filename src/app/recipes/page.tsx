'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import NavBar from '@/components/NavBar'
import RecipeCard from '@/components/RecipeCard';
import CategoryFilter from '@/components/CategoryFilter';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Tümü',
  'Tatlı',
  'Ana Yemek',
  'Atıştırmalık',
  'Meyve',
  'Vejetaryen',
  'Kendi Tariflerim',
];

const userId = 'user123'; // Geçici kullanıcı

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [image, setImage] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [stepInput, setStepInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<any | null>(null);

  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '';
  const recipesKey = `recipes_${userEmail}`;

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
    const stored = localStorage.getItem(recipesKey);
    let parsed = [];
    try {
      parsed = stored ? JSON.parse(stored) : [];
    } catch {
      parsed = [];
    }
    if (!stored || (Array.isArray(parsed) && parsed.length === 0)) {
      import('../../data/recipes.json').then((mod) => {
        setRecipes(mod.default);
        localStorage.setItem(recipesKey, JSON.stringify(mod.default));
      });
    } else {
      setRecipes(parsed);
    }
  }, [checked, recipesKey]);

  useEffect(() => {
    if (!checked) return;
    localStorage.setItem(recipesKey, JSON.stringify(recipes));
  }, [recipes, checked, recipesKey]);

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase());
    let matchesCategory = true;
    if (selectedCategory === 'Kendi Tariflerim') {
      matchesCategory = r.userId === userId;
    } else if (selectedCategory !== 'Tümü') {
      matchesCategory = (r.category || [])
        .map((c: string) => c.toLowerCase())
        .includes(selectedCategory.toLowerCase());
    }
    return matchesSearch && matchesCategory;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleAddStep = () => {
    if (stepInput.trim()) {
      setSteps([...steps, stepInput.trim()]);
      setStepInput('');
    }
  };

  const handleCreateRecipe = () => {
    if (!title.trim()) {
      alert('Tarif başlığı boş olamaz');
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Kullanıcı oturumu yok');
      return;
    }

    const newRecipe = {
      _id: Date.now().toString(),
      userId: userEmail,
      title: title.trim(),
      description: description.trim(),
      category,
      image,
      ingredients,
      steps,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    try {
      // Yeni tarifi en başa ekle
      const updatedRecipes = [newRecipe, ...recipes];
      setRecipes(updatedRecipes);
      
      // localStorage'a kaydet
      const recipesKey = `recipes_${userEmail}`;
      localStorage.setItem(recipesKey, JSON.stringify(updatedRecipes));
      
      // Form alanlarını temizle
      setTitle('');
      setDescription('');
      setCategory([]);
      setImage('');
      setIngredients([]);
      setSteps([]);
      setIsCreating(false);
      
      alert('Tarif başarıyla eklendi!');
    } catch (error) {
      console.error('Tarif kaydedilirken hata oluştu:', error);
      alert('Tarif kaydedilemedi');
    }
  };

  const loadRecipes = (userEmail: string) => {
    try {
      const recipesKey = `recipes_${userEmail}`;
      const storedRecipes = localStorage.getItem(recipesKey);
      
      if (storedRecipes) {
        // Kullanıcıya özel tarifler varsa yükle
        const parsedRecipes = JSON.parse(storedRecipes);
        setRecipes(parsedRecipes);
      } else {
        // İlk kez giriş yapıyorsa, genel recipes.json'dan yükle
        import('../../data/recipes.json').then((mod) => {
          const defaultRecipes = mod.default;
          setRecipes(defaultRecipes);
          localStorage.setItem(recipesKey, JSON.stringify(defaultRecipes));
        }).catch(() => {
          setRecipes([]);
        });
      }
    } catch (error) {
      console.error('Tarifler yüklenirken hata:', error);
      setRecipes([]);
    }
  };

  useEffect(() => {
    if (checked) {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        loadRecipes(userEmail);
      }
    }
  }, [checked]);

  const handleEditRecipe = (recipe: any) => {
    setEditingRecipe(recipe);
    setTitle(recipe.title);
    setDescription(recipe.description);
    setCategory(recipe.category || []);
    setImage(recipe.image || '');
    setIngredients(recipe.ingredients || []);
    setSteps(recipe.steps || []);
    setIsCreating(false);
  };

  const handleUpdateRecipe = () => {
    if (!editingRecipe) return;
    
    if (!title.trim()) {
      alert('Tarif başlığı boş olamaz');
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Kullanıcı oturumu yok');
      return;
    }

    const updatedRecipe = {
      ...editingRecipe,
      title: title.trim(),
      description: description.trim(),
      category,
      image,
      ingredients,
      steps,
      updatedAt: new Date(),
    };
    
    try {
      const updatedRecipes = recipes.map(r => r._id === editingRecipe._id ? updatedRecipe : r);
      setRecipes(updatedRecipes);
      
      // localStorage'a kaydet
      const recipesKey = `recipes_${userEmail}`;
      localStorage.setItem(recipesKey, JSON.stringify(updatedRecipes));
      
      setEditingRecipe(null);
      setTitle('');
      setDescription('');
      setCategory([]);
      setImage('');
      setIngredients([]);
      setSteps([]);
      
      alert('Tarif başarıyla güncellendi!');
    } catch (error) {
      console.error('Tarif güncellenirken hata oluştu:', error);
      alert('Tarif güncellenemedi');
    }
  };

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-neutral-dark font-sans">
      {/* <NavBar /> */}

      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2 font-sans drop-shadow">
              Tarifler
            </h1>
            <p className="text-gray-800 dark:text-gray-200 text-lg">
              Sağlıklı ve lezzetli tarifler keşfedin veya kendi tarifinizi ekleyin!
            </p>
          </motion.div>

          <div className="mb-4 flex flex-col md:flex-row gap-2 items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tariflerde ara..."
              className="input flex-1 rounded-xl shadow focus:ring-2 focus:ring-fitness-blue bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
            />
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange text-white font-bold shadow hover:opacity-90 hover:scale-105 transition-all" onClick={() => setIsCreating(true)}>
              + Tarif Ekle
            </button>
          </div>

          <CategoryFilter
            categories={CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <AnimatePresence>
            {(isCreating || editingRecipe) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 border-2 border-fitness-blue/30 mb-8 max-w-2xl mx-auto"
              >
                <h2 className="text-2xl font-bold text-fitness-blue dark:text-fitness-green mb-4">
                  {editingRecipe ? 'Tarifi Düzenle' : 'Yeni Tarif'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input w-full rounded-xl shadow focus:ring-2 focus:ring-fitness-blue bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
                      placeholder="Tarif başlığı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="input w-full rounded-xl shadow focus:ring-2 focus:ring-fitness-blue bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
                      rows={3}
                      placeholder="Tarif açıklaması"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kategoriler
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.filter((c) => c !== 'Tümü' && c !== 'Kendi Tariflerim').map(
                        (cat) => (
                          <button
                            key={cat}
                            type="button"
                            className={`px-3 py-1 rounded-full border-2 text-sm font-medium transition-all duration-200 ${category.includes(cat) ? 'bg-fitness-blue text-white border-fitness-blue' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
                            onClick={() =>
                              setCategory((prev) =>
                                prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                              )
                            }
                          >
                            {cat}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Resim
                    </label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {image && (
                      <img
                        src={image}
                        alt="Tarif görseli"
                        className="mt-2 w-32 h-32 object-cover rounded-xl border"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Malzemeler
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        placeholder="Malzeme ekle..."
                        className="input flex-1 rounded-xl shadow focus:ring-2 focus:ring-fitness-blue bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleAddIngredient();
                        }}
                      />
                      <button onClick={handleAddIngredient} className="btn-secondary rounded-xl">
                        Ekle
                      </button>
                    </div>
                    <ul className="list-disc pl-5">
                      {ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Adımlar
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={stepInput}
                        onChange={(e) => setStepInput(e.target.value)}
                        placeholder="Adım ekle..."
                        className="input flex-1 rounded-xl shadow focus:ring-2 focus:ring-fitness-blue bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleAddStep();
                        }}
                      />
                      <button onClick={handleAddStep} className="btn-secondary rounded-xl">
                        Ekle
                      </button>
                    </div>
                    <ol className="list-decimal pl-5">
                      {steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setEditingRecipe(null);
                        setTitle('');
                        setDescription('');
                        setCategory([]);
                        setImage('');
                        setIngredients([]);
                        setSteps([]);
                      }}
                      className="btn-secondary rounded-xl"
                    >
                      İptal
                    </button>
                    {editingRecipe ? (
                      <button
                        onClick={handleUpdateRecipe}
                        className="btn-primary rounded-xl"
                      >
                        Kaydet
                      </button>
                    ) : (
                      <button
                        onClick={handleCreateRecipe}
                        className="btn-primary rounded-xl"
                      >
                        Oluştur
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                title={recipe.title}
                image={recipe.image}
                description={recipe.description}
                category={recipe.category?.[0]}
                onClick={() => handleEditRecipe(recipe)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
