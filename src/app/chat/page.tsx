'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  UserIcon, 
  SparklesIcon, 
  PlusIcon, 
  TrashIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { generateResponse } from '@/utils/api/ai-assistant';
import { useRouter } from 'next/navigation';

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
  isFavorite?: boolean;
}

export default function ChatPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        router.push('/auth/login');
        return;
      }
      setChecked(true);
      
      // Kullanıcıya özel sohbet verilerini her zaman yükle
      loadChatSessions(userEmail);
    }
  }, [router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Yeni Sohbet',
      messages: [{
        id: 1,
        content: 'Merhaba! FitTürkAI sağlık asistanınıza hoş geldiniz. Size nasıl yardımcı olabilirim?',
        isUser: false,
        timestamp: new Date(),
      }],
      createdAt: new Date(),
      isFavorite: false,
    };
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    setCurrentSessionId(newSession.id);
    saveChatSessions(updatedSessions, newSession.id);
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    
    if (currentSessionId === sessionId) {
      if (updatedSessions.length > 0) {
        const newActiveSessionId = updatedSessions[0].id;
        setCurrentSessionId(newActiveSessionId);
        saveChatSessions(updatedSessions, newActiveSessionId);
      } else {
        setCurrentSessionId(null);
        // Tüm sohbetler silinirse yeni bir sohbet oluştur
        createInitialSession();
      }
    } else {
      saveChatSessions(updatedSessions, currentSessionId || undefined);
    }
  };

  const toggleFavorite = (sessionId: string) => {
    const updatedSessions = sessions.map(s => 
      s.id === sessionId ? { ...s, isFavorite: !s.isFavorite } : s
    );
    setSessions(updatedSessions);
    saveChatSessions(updatedSessions, currentSessionId || undefined);
  };

  const updateSessionTitle = (sessionId: string, title: string) => {
    const updatedSessions = sessions.map(s => 
      s.id === sessionId ? { ...s, title } : s
    );
    setSessions(updatedSessions);
    saveChatSessions(updatedSessions, currentSessionId || undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentSession) return;

    const userMessage: Message = {
      id: currentSession.messages.length + 1,
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    if (currentSession.messages.length === 1) {
      const title = input.length > 30 ? input.substring(0, 30) + '...' : input;
      updateSessionTitle(currentSession.id, title);
    }

    const updatedMessages = [...currentSession.messages, userMessage];
    const updatedSessions = sessions.map(s => 
      s.id === currentSession.id ? { ...s, messages: updatedMessages } : s
    );
    setSessions(updatedSessions);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const apiMessages = [
        ...currentSession.messages.map((msg) => ({
          role: msg.isUser ? ('user' as const) : ('assistant' as const),
          content: msg.content,
        })),
        { role: 'user' as const, content: input },
      ];

      const response = await generateResponse(apiMessages);

      const aiMessage: Message = {
        id: updatedMessages.length + 1,
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      const finalSessions = sessions.map(s => 
        s.id === currentSession.id 
          ? { ...s, messages: finalMessages }
          : s
      );
      setSessions(finalSessions);
      saveChatSessions(finalSessions, currentSessionId || undefined);
    } catch (error) {
      const errorMessage: Message = {
        id: updatedMessages.length + 1,
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin.',
        isUser: false,
        timestamp: new Date(),
      };
      const errorSessions = sessions.map(s => 
        s.id === currentSession.id 
          ? { ...s, messages: [...updatedMessages, errorMessage] }
          : s
      );
      setSessions(errorSessions);
      saveChatSessions(errorSessions, currentSessionId || undefined);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const loadChatSessions = (userEmail: string) => {
    try {
      const chatKey = `chatSessions_${userEmail}`;
      const storedSessions = localStorage.getItem(chatKey);
      
      if (storedSessions) {
        // Kayıtlı sohbetler varsa yükle
        const parsedSessions = JSON.parse(storedSessions).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(parsedSessions);
        
        // Son aktif sohbeti yükle
        const lastActiveSessionId = localStorage.getItem(`lastActiveSession_${userEmail}`);
        if (lastActiveSessionId && parsedSessions.find((s: any) => s.id === lastActiveSessionId)) {
          setCurrentSessionId(lastActiveSessionId);
        } else if (parsedSessions.length > 0) {
          setCurrentSessionId(parsedSessions[0].id);
        }
      } else {
        // İlk kez giriş yapıyorsa varsayılan sohbet oluştur
        createInitialSession();
      }
    } catch (error) {
      console.error('Sohbet verileri yüklenirken hata:', error);
      createInitialSession();
    }
  };

  const createInitialSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Yeni Sohbet',
      messages: [{
        id: 1,
        content: 'Merhaba! FitTürkAI sağlık asistanınıza hoş geldiniz. Size nasıl yardımcı olabilirim? Beslenme, egzersiz, sağlık hedefleri konusunda sorularınızı paylaşabilirsiniz.',
        isUser: false,
        timestamp: new Date(),
      }],
      createdAt: new Date(),
      isFavorite: false,
    };
    setSessions([newSession]);
    setCurrentSessionId(newSession.id);
    saveChatSessions([newSession], newSession.id);
  };

  const saveChatSessions = (sessions: ChatSession[], activeSessionId?: string) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;
      
      const chatKey = `chatSessions_${userEmail}`;
      localStorage.setItem(chatKey, JSON.stringify(sessions));
      
      if (activeSessionId) {
        localStorage.setItem(`lastActiveSession_${userEmail}`, activeSessionId);
      }
    } catch (error) {
      console.error('Sohbet verileri kaydedilirken hata:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions, currentSessionId]);

  if (!checked || !currentSession) return null;

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-inter overflow-hidden">
      <div className="h-full flex">
        <div className="flex-1 flex bg-white/95 dark:bg-neutral-900/90 shadow-2xl border border-gray-200 dark:border-slate-700">
          
          {/* Ana Chat Bölümü */}
          <div className="flex-1 flex flex-col">
            
            {/* Başlık Alanı - Üstte */}
            <div className="flex items-center justify-center px-8 py-6 bg-gradient-to-r from-fitness-blue/5 to-fitness-green/5 dark:from-fitness-blue/10 dark:to-fitness-green/10 border-b border-gray-200 dark:border-slate-700 relative">
              
              {/* Başlık - Merkezi */}
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="w-14 h-14 bg-gradient-to-r from-fitness-blue to-fitness-green rounded-2xl flex items-center justify-center shadow-lg">
                  <HeartIcon className="w-7 h-7 text-white" />
                </div>
                
                {/* Başlık */}
                <div className="text-center">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-fitness-blue via-fitness-green to-fitness-orange bg-clip-text text-transparent">
                    FitTürkAI Asistanı
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                    Kişisel sağlık danışmanınız
                  </p>
                </div>
              </div>
              
              {/* Sağ Üst Kontroller - Absolute Position */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
                {/* Favorile Butonu */}
                <motion.button
                  onClick={() => toggleFavorite(currentSession.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    currentSession.isFavorite 
                      ? 'bg-gradient-to-r from-fitness-blue to-fitness-green text-white shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Sohbeti Favorile"
                >
                  <StarIcon className="w-5 h-5" />
                </motion.button>

                {/* Sidebar Toggle */}
                <motion.button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  {sidebarOpen ? (
                    <ChevronRightIcon className="w-5 h-5" />
                  ) : (
                    <ChevronLeftIcon className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Chat Container - Ortalanmış */}
            <div className="flex-1 flex justify-center bg-gray-50/50 dark:bg-slate-800/50 overflow-hidden">
              <div className="w-full max-w-4xl flex flex-col h-full">
                
                {/* Sağlık Uyarısı */}
                <div className="mx-6 mt-4 mb-2">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                        ⚕️ Önemli Sağlık Uyarısı
                      </h4>
                      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                        FitTürkAI bir yapay zeka asistanıdır ve gerçek bir sağlık uzmanı değildir. 
                        Verilen öneriler genel bilgi amaçlıdır ve hata yapabilir. Sağlık sorunlarınız için 
                        mutlaka <strong>doktorunuza danışınız</strong>. Acil durumlarda 112'yi arayın.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Mesajlar Alanı */}
                <div className="flex-1 overflow-y-auto scrollbar-none px-6 pb-6 space-y-6">
                  <AnimatePresence mode="popLayout">
                    {currentSession.messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end gap-3 max-w-[85%] ${
                          message.isUser ? 'flex-row-reverse' : 'flex-row'
                        }`}>
                          
                          {/* Avatar */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                            message.isUser 
                              ? 'bg-gradient-to-br from-fitness-blue to-sky-500' 
                              : 'bg-gradient-to-br from-fitness-green to-emerald-500'
                          }`}>
                            {message.isUser ? (
                              <UserIcon className="w-5 h-5 text-white" />
                            ) : (
                              <SparklesIcon className="w-5 h-5 text-white" />
                            )}
                          </div>

                          {/* Mesaj Balonu */}
                          <div className={`relative px-5 py-4 rounded-3xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                            message.isUser
                              ? 'bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 text-slate-800 dark:text-slate-200 border border-fitness-blue/20'
                              : 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-slate-800 dark:text-slate-200 border border-fitness-green/30'
                          } ${message.isUser ? 'rounded-br-lg' : 'rounded-bl-lg'}`}>
                            
                            {/* Mesaj İçeriği */}
                            <p className="text-base leading-relaxed whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
                            
                            {/* Zaman */}
                            <p className={`text-xs mt-3 font-medium ${
                              message.isUser 
                                ? 'text-fitness-blue dark:text-sky-400' 
                                : 'text-fitness-green dark:text-emerald-400'
                            }`}>
                              {message.timestamp.toLocaleTimeString('tr-TR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>

                            {/* Mesaj Kuyruğu */}
                            <div className={`absolute bottom-0 w-4 h-4 ${
                              message.isUser 
                                ? 'right-0 translate-x-2 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 border-r border-b border-fitness-blue/20' 
                                : 'left-0 -translate-x-2 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-l border-b border-fitness-green/30'
                            } rotate-45`}></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Yazıyor Animasyonu */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-end gap-3 max-w-[85%]">
                        <div className="w-10 h-10 bg-gradient-to-br from-fitness-green to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-fitness-green/30 rounded-3xl rounded-bl-lg px-5 py-4 shadow-lg">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-fitness-green rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-fitness-green rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-fitness-green rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Mesaj Gönderme Formu - Sticky */}
                <div className="sticky bottom-0 bg-white/95 dark:bg-neutral-900/90 p-6 border-t border-gray-200 dark:border-slate-700">
                  <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        className="w-full px-6 py-4 rounded-full border border-gray-300 dark:border-gray-600 focus:border-fitness-blue focus:ring-2 focus:ring-fitness-blue/20 transition-all duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm text-base outline-none"
                        disabled={isLoading}
                        autoFocus
                      />
                      {input.trim() && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-fitness-blue dark:text-sky-400 font-medium">
                          Enter ↵
                        </div>
                      )}
                    </div>
                    
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isLoading || !input.trim()}
                      className="p-4 rounded-full bg-gradient-to-r from-fitness-blue to-fitness-green hover:from-fitness-blue/80 hover:to-fitness-green/80 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      aria-label="Mesaj Gönder"
                    >
                      <PaperAirplaneIcon className="w-6 h-6" />
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Sohbet Geçmişi Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 350, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-80 bg-gradient-to-b from-emerald-50 via-sky-50 to-slate-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-l border-gray-200 dark:border-slate-700 overflow-hidden"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                      Sohbet Geçmişi
                    </h2>
                    <motion.button
                      onClick={createNewSession}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-xl bg-gradient-to-r from-fitness-blue to-fitness-green text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 scrollbar-none">
                    {sessions.map((session) => (
                      <motion.div
                        key={session.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg group ${
                          currentSessionId === session.id
                            ? 'bg-gradient-to-r from-fitness-blue/10 to-fitness-green/10 border border-fitness-blue/30 shadow-lg'
                            : 'bg-white/90 dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
                        }`}
                        onClick={() => setCurrentSessionId(session.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-semibold truncate ${
                                currentSessionId === session.id 
                                  ? 'text-slate-800 dark:text-slate-200' 
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}>
                                {session.title}
                              </p>
                              {session.isFavorite && (
                                <StarIcon className="w-4 h-4 text-fitness-orange fill-current" />
                              )}
                            </div>
                            <p className={`text-xs mt-1 ${
                              currentSessionId === session.id 
                                ? 'text-fitness-blue dark:text-sky-400' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {session.messages.length} mesaj • {session.createdAt.toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession(session.id);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
