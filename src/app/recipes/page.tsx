'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  Star,
  ChefHat,
  Camera,
  FileText,
  X,
  Save,
  Loader2,
} from 'lucide-react';

// shadcn/ui bileşenleri
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [isLoading, setIsLoading] = useState(false);
  // 1. State ekle
  const [openStepsModal, setOpenStepsModal] = useState(false);
  const [modalSteps, setModalSteps] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState<string>('');
  // State ekle
  const [openMealPlanModal, setOpenMealPlanModal] = useState(false);
  const [selectedRecipeForPlan, setSelectedRecipeForPlan] = useState<any>(null);
  const [planDay, setPlanDay] = useState('Pazartesi');
  const [planMealType, setPlanMealType] = useState('kahvaltı');
  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const mealTypes = [
    { value: 'kahvaltı', label: 'Kahvaltı' },
    { value: 'ara öğün 1', label: 'Ara Öğün 1' },
    { value: 'öğle', label: 'Öğle Yemeği' },
    { value: 'ara öğün 2', label: 'Ara Öğün 2' },
    { value: 'akşam', label: 'Akşam Yemeği' },
    { value: 'gece ara öğünü', label: 'Gece Ara Öğünü' },
  ];

  // Session kontrolü layout'ta; mount olduğunda API'den tarifleri çek
  useEffect(() => {
    setChecked(true);
    const load = async () => {
      try {
        const params = new URLSearchParams();
        if (search?.trim()) params.set('q', search.trim());
        params.set('page', '1');
        params.set('pageSize', '1000');
        const res = await fetch(`/api/recipes?${params.toString()}`);
        const data = await res.json();
        const apiItems = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        setRecipes(apiItems);
      } catch {
        setRecipes([]);
      }
    };
    load();
  }, [router, search]);

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

  const handleCreateRecipe = async () => {
    if (!title.trim()) {
      alert('Tarif başlığı boş olamaz');
      return;
    }

    // Session kontrolü layout'ta yapılır

    setIsLoading(true);

    const newRecipe = {
      _id: Date.now().toString(),
      userId: 'session',
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

      // Mongo API'ye kaydetme (gelecek geliştirme): Şimdilik UI state güncellendi

      // Form alanlarını temizle
      setTitle('');
      setDescription('');
      setCategory([]);
      setImage('');
      setIngredients([]);
      setSteps([]);
      setIsCreating(false);

      // Başarı animasyonu
      setTimeout(() => {
        alert('Tarif başarıyla eklendi!');
      }, 500);
    } catch (error) {
      console.error('Tarif kaydedilirken hata oluştu:', error);
      alert('Tarif kaydedilemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecipes = async (userEmail: string) => {
    try {
      const recipesKey = `recipes_${userEmail}`;
      const storedRecipes = localStorage.getItem(recipesKey);

      if (storedRecipes) {
        // Kullanıcıya özel tarifler varsa yükle
        const parsedRecipes = JSON.parse(storedRecipes);
        setRecipes(parsedRecipes);
      } else {
        // İlk kez giriş yapıyorsa, genel recipes-clean.json'dan yükle
        try {
          const mod = await import('@/data/recipes-clean.json');
          const defaultRecipes = mod.default || [];
          setRecipes(defaultRecipes);
          localStorage.setItem(recipesKey, JSON.stringify(defaultRecipes));
        } catch (importError) {
          console.error('Default recipes import error:', importError);
          setRecipes([]);
        }
      }
    } catch (error) {
      console.error('Tarifler yüklenirken hata:', error);
      setRecipes([]);
    }
  };

  useEffect(() => {
    if (checked) {
      const userEmail = '';
      if (userEmail) {
        loadRecipes(userEmail).catch(console.error);
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

  const handleUpdateRecipe = async () => {
    if (!editingRecipe) return;

    if (!title.trim()) {
      alert('Tarif başlığı boş olamaz');
      return;
    }

    // Session kontrolü layout'ta yapılır

    setIsLoading(true);

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
      const updatedRecipes = recipes.map((r) => (r._id === editingRecipe._id ? updatedRecipe : r));
      setRecipes(updatedRecipes);

      // Mongo API'ye kaydetme (gelecek geliştirme): Şimdilik UI state güncellendi

      setEditingRecipe(null);
      setTitle('');
      setDescription('');
      setCategory([]);
      setImage('');
      setIngredients([]);
      setSteps([]);

      setTimeout(() => {
        alert('Tarif başarıyla güncellendi!');
      }, 500);
    } catch (error) {
      console.error('Tarif güncellenirken hata oluştu:', error);
      alert('Tarif güncellenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (confirm('Bu tarifi silmek istediğinizden emin misiniz?')) {
      const updatedRecipes = recipes.filter((r) => r._id !== recipeId);
      setRecipes(updatedRecipes);

      // Mongo API'ye silme (gelecek geliştirme): Şimdilik UI state güncellendi
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingRecipe(null);
    setTitle('');
    setDescription('');
    setCategory([]);
    setImage('');
    setIngredients([]);
    setSteps([]);
  };

  if (!checked) return null;

  return (
    <TooltipProvider>
      <div
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
        }}
      >
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-fitness-blue to-fitness-green rounded-full">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-fitness-blue to-fitness-green bg-clip-text text-transparent">
                  Tarifler
                </h1>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Sağlıklı ve lezzetli tarifler keşfedin veya kendi tarifinizi ekleyin!
              </p>
            </motion.div>

            {/* Search ve Add Button - Sağ üst köşede */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between"
            >
              {/* Sol taraf - Boş bırakılıyor */}
              <div className="flex-1"></div>

              {/* Sağ taraf - Arama ve Ekleme butonu */}
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tariflerde ara..."
                    className="pl-10 bg-white/90 backdrop-blur-sm border-0 shadow-lg"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-gradient-to-r from-fitness-blue to-fitness-green hover:from-fitness-blue/90 hover:to-fitness-green/90 text-white font-medium shadow-lg w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tarif Ekle
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6"
            >
              <div className="flex flex-wrap gap-2 justify-center">
                {CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-fitness-blue to-fitness-green text-white shadow-lg'
                        : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-fitness-blue/10 border border-gray-200'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recipe Form Dialog */}
            <Dialog open={isCreating || !!editingRecipe} onOpenChange={resetForm}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    {editingRecipe ? (
                      <Edit className="w-5 h-5 text-fitness-blue" />
                    ) : (
                      <Plus className="w-5 h-5 text-fitness-green" />
                    )}
                    {editingRecipe ? 'Tarifi Düzenle' : 'Yeni Tarif'}
                  </DialogTitle>
                  <DialogDescription>Tarifinizin detaylarını girin ve kaydedin.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Tarif başlığı"
                      className="bg-white/90 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tarif açıklaması"
                      rows={3}
                      className="bg-white/90 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategoriler
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.filter((c) => c !== 'Tümü' && c !== 'Kendi Tariflerim').map(
                        (cat) => (
                          <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className={`px-3 py-1 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                              category.includes(cat)
                                ? 'bg-gradient-to-r from-fitness-blue to-fitness-green text-white border-transparent'
                                : 'bg-white/90 text-gray-600 border-gray-200 hover:border-fitness-blue/50'
                            }`}
                            onClick={() =>
                              setCategory((prev) =>
                                prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                              )
                            }
                          >
                            {cat}
                          </motion.button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Resim
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="bg-white/90 backdrop-blur-sm"
                    />
                    {image && (
                      <motion.img
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={image}
                        alt="Tarif görseli"
                        className="mt-2 w-32 h-32 object-cover rounded-xl border shadow-lg"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Malzemeler
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        placeholder="Malzeme ekle..."
                        className="flex-1 bg-white/90 backdrop-blur-sm"
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') handleAddIngredient();
                        }}
                      />
                      <Button onClick={handleAddIngredient} variant="outline" size="sm">
                        Ekle
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {ingredients.map((ing, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="w-2 h-2 bg-fitness-green rounded-full"></span>
                          <span className="text-sm">{ing}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setIngredients(ingredients.filter((_, index) => index !== i))
                            }
                            className="ml-auto p-1 h-6 w-6"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hazırlama Adımları
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        value={stepInput}
                        onChange={(e) => setStepInput(e.target.value)}
                        placeholder="Adım ekle..."
                        className="flex-1 bg-white/90 backdrop-blur-sm"
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') handleAddStep();
                        }}
                      />
                      <Button onClick={handleAddStep} variant="outline" size="sm">
                        Ekle
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <Badge variant="secondary" className="mt-1">
                            {i + 1}
                          </Badge>
                          <span className="text-sm flex-1">{step}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSteps(steps.filter((_, index) => index !== i))}
                            className="p-1 h-6 w-6"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={resetForm}>
                    İptal
                  </Button>
                  <Button
                    onClick={editingRecipe ? handleUpdateRecipe : handleCreateRecipe}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-fitness-blue to-fitness-green hover:from-fitness-blue/90 hover:to-fitness-green/90"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {editingRecipe ? 'Güncelle' : 'Oluştur'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Recipes Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                      <div className="relative">
                        {recipe.image ? (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={recipe.image}
                              alt={recipe.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-fitness-blue/10 to-fitness-green/10 flex items-center justify-center">
                            <ChefHat className="w-16 h-16 text-fitness-blue/30" />
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();
                                    handleEditRecipe(recipe);
                                  }}
                                  className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Düzenle</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();
                                    handleDeleteRecipe(recipe._id);
                                  }}
                                  className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Sil</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>

                        {/* Category Badge */}
                        {recipe.category?.[0] && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-gradient-to-r from-fitness-blue to-fitness-green text-white border-0">
                              {recipe.category[0]}
                            </Badge>
                          </div>
                        )}

                        {/* Difficulty Badge */}
                        {recipe.difficulty && (
                          <div className="absolute bottom-2 left-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                recipe.difficulty === 'kolay'
                                  ? 'bg-green-100 text-green-700'
                                  : recipe.difficulty === 'orta'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {recipe.difficulty === 'kolay'
                                ? 'Kolay'
                                : recipe.difficulty === 'orta'
                                  ? 'Orta'
                                  : 'Zor'}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 truncate min-w-0">
                          {recipe.title}
                        </CardTitle>

                        {recipe.description && (
                          <p className="text-gray-600 text-sm line-clamp-2 truncate mb-3 min-w-0">
                            {recipe.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{recipe.prepTime || 5} dk</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{recipe.servings || 4} kişi</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{recipe.calories || 200} kcal</span>
                          </div>
                        </div>

                        {/* Ingredients Preview */}
                        {recipe.ingredients && recipe.ingredients.length > 0 && (
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Malzemeler:</span>{' '}
                            {recipe.ingredients.slice(0, 3).join(', ')}
                            {recipe.ingredients.length > 3 &&
                              ` +${recipe.ingredients.length - 3} daha`}
                          </div>
                        )}
                        {/* Kart içeriğinde, ingredients önizlemesinden sonra steps özetini ekle */}
                        {recipe.steps && recipe.steps.length > 0 && (
                          <div className="text-xs text-gray-500 mt-2">
                            <span className="font-medium">Adımlar:</span>{' '}
                            {recipe.steps.slice(0, 2).join(' → ')}
                            {recipe.steps.length > 2 && (
                              <>
                                ...
                                <button
                                  className="ml-2 text-fitness-blue underline hover:text-fitness-green transition-colors text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModalSteps(recipe.steps);
                                    setModalTitle(recipe.title);
                                    setOpenStepsModal(true);
                                  }}
                                >
                                  Tüm adımları gör
                                </button>
                              </>
                            )}
                          </div>
                        )}
                        {/* Tarif kartında action buttons altına ekle */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2 text-xs"
                          onClick={() => {
                            setSelectedRecipeForPlan(recipe);
                            setOpenMealPlanModal(true);
                            setPlanDay('Pazartesi');
                            setPlanMealType('kahvaltı');
                          }}
                        >
                          Öğün Planına Ekle
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredRecipes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-fitness-blue/10 to-fitness-green/10 rounded-full flex items-center justify-center">
                  <ChefHat className="w-12 h-12 text-fitness-blue/50" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz tarif bulunamadı</h3>
                <p className="text-gray-600 mb-4">
                  {search || selectedCategory !== 'Tümü'
                    ? 'Arama kriterlerinizi değiştirmeyi deneyin'
                    : 'İlk tarifinizi ekleyerek başlayın!'}
                </p>
                {!search && selectedCategory === 'Tümü' && (
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-gradient-to-r from-fitness-blue to-fitness-green hover:from-fitness-blue/90 hover:to-fitness-green/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    İlk Tarifi Ekle
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>
      {/* TooltipProvider'ın hemen içine, steps modalının dışına ekle */}
      {openStepsModal && (
        <Dialog open={openStepsModal} onOpenChange={setOpenStepsModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{modalTitle} - Tüm Hazırlama Adımları</DialogTitle>
            </DialogHeader>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
              {modalSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <DialogFooter>
              <Button onClick={() => setOpenStepsModal(false)} variant="outline">
                Kapat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {/* TooltipProvider'ın hemen içine, steps modalının dışına ekle */}
      {openMealPlanModal && selectedRecipeForPlan && (
        <Dialog open={openMealPlanModal} onOpenChange={setOpenMealPlanModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Öğün Planına Ekle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gün</label>
                <select
                  className="w-full border rounded p-2"
                  value={planDay}
                  onChange={(e) => setPlanDay(e.target.value)}
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Öğün Türü</label>
                <select
                  className="w-full border rounded p-2"
                  value={planMealType}
                  onChange={(e) => setPlanMealType(e.target.value)}
                >
                  {mealTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenMealPlanModal(false)}>
                İptal
              </Button>
              <Button
                onClick={() => {
                  // localStorage'dan mealPlans'ı al
                  const mealPlans = JSON.parse(localStorage.getItem('mealPlans') || '[]');
                  // yeni planı oluştur
                  const newPlan = {
                    id: Date.now().toString(),
                    day: planDay,
                    mealType: planMealType,
                    recipeId: selectedRecipeForPlan._id,
                    recipeTitle: selectedRecipeForPlan.title,
                    calories: selectedRecipeForPlan.calories || 0,
                  };
                  // ekle ve kaydet
                  localStorage.setItem('mealPlans', JSON.stringify([...mealPlans, newPlan]));
                  setOpenMealPlanModal(false);
                }}
              >
                Ekle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </TooltipProvider>
  );
}
