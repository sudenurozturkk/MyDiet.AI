# FitTurkAI Backend

Bu klasör, FitTurkAI uygulamasının backend API'sini içerir. FastAPI ve Hugging Face Space API'si kullanarak AI modeliyle iletişim kurar.

## Kurulum

1. **Python bağımlılıklarını yükleyin:**
   ```bash
   pip install -r requirements.txt
   ```

## Çalıştırma

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend API'si `http://localhost:8000` adresinde çalışacaktır.

## API Endpoints

### POST /chat
Kullanıcı mesajını alır ve Hugging Face Space'teki AI asistanından yanıt döner.

**Request:**
```json
{
  "soru": "Kullanıcının mesajı",
  "gecmis": "Sohbet geçmişi (opsiyonel)"
}
```

**Response:**
```json
{
  "cevap": "AI asistanının yanıtı"
}
```

### GET /health
Sistem durumunu kontrol eder.

**Response:**
```json
{
  "status": "healthy",
  "api": "FitTürkAI", 
  "model": "Space"
}
```

## Model Konfigürasyonu

- **Model:** Hugging Face Space API (sudenurozturk/AIYildiz-FitTurkAI)
- **API Client:** gradio_client
- **Endpoint:** /predict
- **Timeout:** 60 saniye

## Geliştirme

- CORS ayarları geliştirme için açık bırakılmıştır
- Production'da `allow_origins` listesini sınırlayın
- Space API parametreleri ihtiyaca göre ayarlanabilir 