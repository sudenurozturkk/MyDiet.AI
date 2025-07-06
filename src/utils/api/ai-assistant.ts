interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Backend API URL'sini environment variable'dan al, yoksa default kullan
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function generateResponse(messages: ChatMessage[]): Promise<string> {
  try {
    // Son kullanıcı mesajını al
    const lastUserMessage = messages.find(msg => msg.role === 'user')?.content || '';
    
    if (!lastUserMessage.trim()) {
      return 'Lütfen bir soru yazın.';
    }
    
    // Backend API'ye istek gönder
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        soru: lastUserMessage
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API hatası: ${response.status}`);
    }

    const data = await response.json();
    return data.cevap || 'Yanıt alınamadı.';
  } catch (error) {
    console.error('AI asistan hatası:', error);
    return 'Üzgünüm, şu anda AI asistanına bağlanamıyorum. Lütfen daha sonra tekrar deneyin.';
  }
} 