from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import requests
from gradio_client import Client
import json
import os
from datetime import datetime
from typing import List, Dict, Any

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chat dosyası yolu
CHAT_FILE_PATH = "../src/data/chats.json"

class ChatRequest(BaseModel):
    soru: str
    gecmis: str = ""

class ChatResponse(BaseModel):
    cevap: str

class ChatSession(BaseModel):
    id: str
    title: str
    messages: List[Dict[str, Any]]
    createdAt: str
    isFavorite: bool = False
    userEmail: str

class SaveChatRequest(BaseModel):
    userEmail: str
    sessions: List[ChatSession]
    activeSessionId: str = None

class LoadChatRequest(BaseModel):
    userEmail: str

SPACE_API_URL = "https://aiyildiz-aiyildizfitturkai.hf.space/predict"

def call_space_api(message: str) -> str:
    client = Client("AIYildiz/AIYildizFitTurkAI")
    result = client.predict(
        soru=message,
        api_name="/predict"
    )
    return result

def load_chats_from_file():
    """Chats.json dosyasından tüm chat verilerini yükle"""
    try:
        if os.path.exists(CHAT_FILE_PATH):
            with open(CHAT_FILE_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []
    except Exception as e:
        print(f"Chat dosyası yüklenirken hata: {e}")
        return []

def save_chats_to_file(chats_data):
    """Chats.json dosyasına tüm chat verilerini kaydet"""
    try:
        with open(CHAT_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(chats_data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Chat dosyası kaydedilirken hata: {e}")
        return False

def get_user_chats(user_email: str):
    """Belirli kullanıcının chat verilerini getir"""
    all_chats = load_chats_from_file()
    user_chats = []
    active_session_id = None
    
    for chat in all_chats:
        if chat.get("userEmail") == user_email:
            if chat.get("type") == "session":
                active_session_id = chat.get("activeSessionId")
            elif chat.get("type") == "chat":
                user_chats.append(chat)
    
    return user_chats, active_session_id

def save_user_chats(user_email: str, sessions: List[dict], active_session_id: str = None):
    """Kullanıcının chat verilerini kaydet"""
    all_chats = load_chats_from_file()
    
    # Kullanıcının eski verilerini temizle
    all_chats = [chat for chat in all_chats if chat.get("userEmail") != user_email]
    
    # Yeni chat verilerini ekle
    for session in sessions:
        chat_data = {
            "type": "chat",
            "userEmail": user_email,
            **session
        }
        all_chats.append(chat_data)
    
    # Aktif session'ı kaydet
    if active_session_id:
        session_data = {
            "type": "session",
            "userEmail": user_email,
            "activeSessionId": active_session_id
        }
        all_chats.append(session_data)
    
    return save_chats_to_file(all_chats)

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        ai_response = call_space_api(request.soru)
        return ChatResponse(cevap=ai_response)
    except Exception as e:
        return ChatResponse(
            cevap=f"❌ Hata oluştu: {str(e)}\n\nLütfen daha sonra tekrar deneyin."
        )

@app.post("/save-chat")
async def save_chat(request: SaveChatRequest):
    try:
        success = save_user_chats(
            request.userEmail, 
            [session.dict() for session in request.sessions], 
            request.activeSessionId
        )
        
        if success:
            return {"status": "success", "message": "Chat verileri chats.json dosyasına kaydedildi"}
        else:
            raise HTTPException(status_code=500, detail="Chat verileri kaydedilemedi")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat kaydedilemedi: {str(e)}")

@app.post("/load-chat")
async def load_chat(request: LoadChatRequest):
    try:
        user_chats, active_session_id = get_user_chats(request.userEmail)
        
        return {
            "sessions": user_chats,
            "activeSessionId": active_session_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat yüklenemedi: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "api": "FitTürkAI", "model": "Space", "storage": "chats.json"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 