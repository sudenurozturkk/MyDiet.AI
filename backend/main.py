from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import requests
from gradio_client import Client

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    soru: str
    gecmis: str = ""

class ChatResponse(BaseModel):
    cevap: str

SPACE_API_URL = "https://aiyildiz-aiyildizfitturkai.hf.space/predict"

def call_space_api(message: str) -> str:
    client = Client("AIYildiz/AIYildizFitTurkAI")
    result = client.predict(
        soru=message,
        api_name="/predict"
    )
    return result

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        ai_response = call_space_api(request.soru)
        return ChatResponse(cevap=ai_response)
    except Exception as e:
        return ChatResponse(
            cevap=f"❌ Hata oluştu: {str(e)}\n\nLütfen daha sonra tekrar deneyin."
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "api": "FitTürkAI", "model": "Space"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 