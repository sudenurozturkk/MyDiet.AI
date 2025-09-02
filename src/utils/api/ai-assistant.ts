interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Next.js app router API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function generateResponse(
  messages: ChatMessage[],
  conversationId?: string
): Promise<{ reply: string; conversationId: string } | null> {
  try {
    // Son kullanıcı mesajını al
    const lastUserMessage = messages.find((msg) => msg.role === 'user')?.content || '';

    if (!lastUserMessage.trim()) {
      return null;
    }

    // Next.js API'ye istek gönder
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: lastUserMessage,
        conversationId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API hatası: ${response.status}`);
    }

    const data = await response.json();
    return { reply: data.reply, conversationId: data.conversationId };
  } catch (error) {
    console.error('AI asistan hatası:', error);
    return null;
  }
}
