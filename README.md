# 🏥 FitTürkAI - Kişisel Sağlık ve Fitness Asistanı

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Türkçe konuşan AI destekli kişisel sağlık ve fitness takip uygulaması**

[🎯 Demo](https://fitturkai-demo.vercel.app) • [📚 Dokümantasyon](#-özellikler) • [🤖 Hugging Face Space](https://huggingface.co/spaces/AIYildiz/AIYildizFitTurkAI) • [📞 Destek](#-iletişim)

</div>

## 📖 Hakkında

FitTürkAI, kullanıcıların sağlık ve fitness hedeflerini takip etmelerine, kişiselleştirilmiş öneriler almalarına ve ilerlemelerini görselleştirmelerine olanak tanıyan modern bir web uygulamasıdır. Türkçe konuşan AI asistanı ile desteklenen uygulama, sağlıklı yaşam yolculuğunuzda size rehberlik eder.

### 🎯 Hedef Kitle
- Sağlıklı yaşam hedefleri olan bireyler
- Fitness ve beslenme takibi yapmak isteyenler
- Kişiselleştirilmiş sağlık önerileri arayan kullanıcılar
- Türkçe destekli AI asistanı tercih edenler

## ✨ Özellikler

### 🤖 AI Asistan
- **Türkçe konuşan AI:** Sağlık ve fitness konularında uzmanlaşmış AI asistanı
- **Kişiselleştirilmiş öneriler:** Kullanıcı verilerine göre özelleştirilmiş tavsiyeler
- **Interaktif chat:** Real-time sohbet deneyimi
- **Sohbet geçmişi:** Tüm konuşmaların kaydedilmesi ve erişimi

### 📊 Takip ve Yönetim
- **Hedef belirleme:** Kilo, fitness, beslenme ve yaşam tarzı hedefleri
- **İlerleme takibi:** Kilometre taşları ve görsel ilerleme çubukları
- **Not alma:** Kategorize edilmiş notlar ve etiketleme sistemi
- **Tarif yönetimi:** Kişisel tariflerin kaydedilmesi ve organizasyonu

### 🎨 Kullanıcı Deneyimi
- **Modern tasarım:** Gradient renkler ve smooth animasyonlar
- **Responsive:** Tüm cihazlarda mükemmel görünüm
- **Dark mode:** Göz yorgunluğunu azaltan karanlık tema
- **Hızlı performans:** localStorage tabanlı hızlı veri erişimi

### 🔐 Güvenlik ve Gizlilik
- **Yerel veri saklama:** Veriler kullanıcının tarayıcısında güvenli şekilde saklanır
- **Basit authentication:** E-posta tabanlı güvenli giriş sistemi
- **Veri kontrolü:** Kullanıcının veriler üzerinde tam kontrolü

## 🛠️ Teknoloji Stack'i

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.8.3
- **UI Library:** React 18
- **Styling:** Tailwind CSS 3.4.17
- **Animations:** Framer Motion 9.1.7
- **Icons:** Heroicons 2.2.0
- **Charts:** Chart.js, Recharts, Ant Design Plots

### Backend
- **Framework:** FastAPI 0.104.1
- **Language:** Python 3.9+
- **AI Integration:** Hugging Face Spaces API
- **HTTP Client:** Gradio Client
- **CORS:** Cross-origin resource sharing

### AI Model
- **Platform:** Hugging Face Spaces
- **Model:** AIYildiz/AIYildizFitTurkAI
- **Language:** Türkçe optimized
- **Specialization:** Sağlık ve fitness danışmanlığı

## 🚀 Kurulum ve Çalıştırma

### Seçenek 1: Hugging Face Space API (Önerilen - Ücretsiz)

Bu seçenek ile AI modelini kendi bilgisayarınızda çalıştırmanıza gerek yok. Ücretsiz Hugging Face API kullanılır.

#### 1. Projeyi Klonlayın
```bash
git clone https://github.com/aiyildiz/fitturkai.git
cd fitturkai
```

#### 2. Frontend Kurulumu
```bash
npm install
npm run dev
```

#### 3. Backend Kurulumu
```bash
cd backend
pip install -r requirements.txt
python main.py
```

#### 4. Uygulamayı Açın
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Seçenek 2: Yerel Model (Gelişmiş Kullanıcılar)

Bu seçenek ile AI modelini kendi bilgisayarınızda çalıştırabilirsiniz.

#### 1. Model İndirme
AI modelini [Hugging Face](https://huggingface.co/AIYildiz/AIYildizFitTurkAI) üzerinden indirin ve `backend/` klasörüne yerleştirin.

#### 2. Backend Konfigürasyonu
`backend/main.py` dosyasında yerel model kullanımı için gerekli değişiklikleri yapın:

```python
# Yerel model kullanımı için
from llama_cpp import Llama

llm = Llama(
    model_path="./model-dosyasi.gguf",
    n_ctx=4096,
    n_threads=8,
    verbose=False
)
```

#### 3. Sistem Gereksinimleri
- **RAM:** Minimum 8GB (16GB önerilen)
- **Storage:** 5-10GB boş alan
- **CPU:** Modern işlemci (GPU opsiyonel)

## 📁 Proje Yapısı

```
fitturkai/
├── 📁 src/                           # Frontend kaynak kodları
│   ├── 📁 app/                      # Next.js App Router sayfaları
│   │   ├── 📁 auth/                 # Authentication sayfaları
│   │   ├── 📁 chat/                 # Chat sayfası
│   │   ├── 📁 goals/                # Hedefler sayfası
│   │   ├── 📁 notes/                # Notlar sayfası
│   │   ├── 📁 profile/              # Profil sayfası
│   │   ├── 📁 recipes/              # Tarifler sayfası
│   │   └── 📄 layout.tsx            # Ana layout
│   ├── 📁 components/               # React bileşenleri
│   │   ├── 📄 Sidebar.tsx           # Yan menü
│   │   └── 📄 Dashboard.tsx         # Dashboard widget'ı
│   ├── 📁 data/                     # JSON veri dosyaları
│   │   ├── 📄 chats.json           # Örnek sohbet verileri
│   │   ├── 📄 goals.json           # Varsayılan hedefler
│   │   ├── 📄 notes.json           # Örnek notlar
│   │   └── 📄 recipes.json         # Tarif koleksiyonu
│   └── 📁 utils/                    # Yardımcı fonksiyonlar
│       └── 📁 api/                  # API istemci fonksiyonları
│           └── 📄 ai-assistant.ts   # AI asistan entegrasyonu
├── 📁 backend/                      # Backend API
│   ├── 📄 main.py                  # FastAPI uygulaması
│   ├── 📄 requirements.txt         # Python bağımlılıkları
│   └── 📄 README.md                # Backend dokümantasyonu
├── 📁 public/                       # Statik dosyalar
├── 📄 package.json                 # NPM bağımlılıkları
├── 📄 tailwind.config.js           # Tailwind CSS konfigürasyonu
├── 📄 next.config.mjs              # Next.js konfigürasyonu
└── 📄 README.md                    # Bu dosya
```

## 🔧 Konfigürasyon

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend
HUGGING_FACE_TOKEN=your_token_here  # Opsiyonel
```

### Hugging Face Space Değiştirme
Backend'de farklı bir Space kullanmak için `backend/main.py` dosyasında:

```python
# Mevcut Space
client = Client("AIYildiz/AIYildizFitTurkAI")

# Yeni Space ile değiştir
client = Client("your-username/your-space-name")
```

## 🎮 Kullanım

### 1. Hesap Oluşturma
- E-posta adresi ile kayıt olun
- Demo hesap: `fitturkai@demo.com` / `123456`

### 2. Profil Ayarlama
- Kişisel bilgilerinizi girin
- Sağlık hedeflerinizi belirleyin
- Tercihleri ayarlayın

### 3. AI Asistan ile Sohbet
- Chat sayfasında AI asistanı ile konuşun
- Sağlık ve fitness sorularınızı sorun
- Kişiselleştirilmiş öneriler alın

### 4. Hedefler Belirleme
- Kilo, fitness, beslenme hedefleri ekleyin
- Kilometre taşları oluşturun
- İlerlemenizi takip edin

### 5. Notlar ve Tarifler
- Önemli notlarınızı kaydedin
- Favori tariflerinizi saklayın
- Kategorilere ayırın ve etiketleyin

## 🧪 Test ve Geliştirme

### Frontend Geliştirme
```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run lint         # ESLint kontrolü
npm run lint:fix     # ESLint otomatik düzeltme
npm run format       # Prettier formatlaması
```

### Backend Test
```bash
cd backend
python main.py       # Sunucuyu başlat
# Test için: http://localhost:8000/docs
```

### API Endpoints
- `POST /chat` - AI ile sohbet
- `GET /health` - Sistem durumu kontrolü

## 🌟 Özellik Roadmap

### Yakın Gelecek (v1.1)
- [ ] Haftalık/aylık raporlar
- [ ] Egzersiz video entegrasyonu
- [ ] Besin değeri hesaplayıcısı
- [ ] AI Agent sistemi ile otomatik haftalık öğün planı 
- [ ] 

### Orta Vadeli (v1.5)
- [ ] Mobil uygulama (React Native)
- [ ] Wearable device entegrasyonu
- [ ] Gelişmiş analytics dashboard
- [ ] Multi-language support

### Uzun Vadeli (v2.0)
- [ ] Machine learning insights
- [ ] Doktor/diyetisyen bağlantısı
- [ ] Community features
- [ ] Premium subscription

## 🤝 Katkıda Bulunma

### Katkı Türleri
- 🐛 Bug raporları
- 💡 Özellik önerileri
- 📝 Dokümantasyon iyileştirmeleri
- 🔧 Kod katkıları
- 🎨 UI/UX tasarım önerileri

### Katkı Süreci
1. **Fork:** Bu repository'yi fork edin
2. **Branch:** Yeni bir feature branch oluşturun
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit:** Değişikliklerinizi commit edin
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
4. **Push:** Branch'inizi push edin
   ```bash
   git push origin feature/amazing-feature
   ```
5. **PR:** Pull Request açın

### Commit Mesaj Formatı
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
```

## 📝 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

### Geliştirici
- **GitHub:** [@aiyildiz](https://github.com/aiyildiz)
- **E-posta:** aiyildiz@gmail.com

### Destek
- **Issues:** [GitHub Issues](https://github.com/aiyildiz/fitturkai/issues)
- **Discussions:** [GitHub Discussions](https://github.com/aiyildiz/fitturkai/discussions)
- **Documentation:** [Wiki](https://github.com/aiyildiz/fitturkai/wiki)

### AI Model
- **Hugging Face Space:** [AIYildiz/AIYildizFitTurkAI](https://huggingface.co/spaces/AIYildiz/AIYildizFitTurkAI)
- **Model Repository:** [Model Detayları](https://huggingface.co/AIYildiz/AIYildizFitTurkAI)
- **Q8 Model Repository:** [Model Detayları](https://huggingface.co/AIYildiz/AIYildiz-FitTurkAI-Q8)
## 🙏 Teşekkürler

Bu projeye katkıda bulunan herkese teşekkür ederiz:

- **Hugging Face** - AI model hosting için
- **Next.js Team** - Framework desteği için
- **FastAPI Team** - Backend framework için
- **Tailwind CSS** - UI styling için
- **Open Source Community** - Kullanılan tüm paketler için

## 📊 İstatistikler

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/aiyildiz/fitturkai?style=social)
![GitHub forks](https://img.shields.io/github/forks/aiyildiz/fitturkai?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/aiyildiz/fitturkai?style=social)
![GitHub issues](https://img.shields.io/github/issues/aiyildiz/fitturkai)
![GitHub pull requests](https://img.shields.io/github/issues-pr/aiyildiz/fitturkai)

</div>

---

<div align="center">

**🏥 FitTürkAI ile sağlıklı yaşam yolculuğunuza başlayın!**

Made with ❤️ in Turkey 🇹🇷

</div>
