'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  UserIcon, 
  SparklesIcon, 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { generateResponse } from '@/utils/api/ai-assistant';
import { useSession } from 'next-auth/react';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface ChatWidgetProps {
  fullscreen?: boolean;
}

export default function ChatWidget() {
  const { status } = useSession();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSend = async () => {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: 'user', content: input }];
    setMessages(next);
    setInput('');
    setLoading(true);
    const res = await generateResponse(next, conversationId);
    if (res) {
      setConversationId(res.conversationId);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
    } else {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Üzgünüm, bir hata oluştu.' }]);
    }
    setLoading(false);
  };

  if (status !== 'authenticated') {
    return <div className="p-4 text-sm">Sohbeti kullanmak için lütfen giriş yapın.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block px-3 py-2 rounded-2xl ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-left text-slate-500 text-sm">Yazıyor...</div>}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSend();
          }}
          placeholder="Mesaj yazın..."
          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
        />
        <button onClick={onSend} disabled={loading} className="px-4 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50">
          Gönder
        </button>
      </div>
    </div>
  );
} 