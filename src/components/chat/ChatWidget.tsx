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

export default function ChatWidget({ fullscreen = false }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(fullscreen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (sessions.length === 0) {
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
      };
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [sessions, currentSessionId]);

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
    };
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => {
      const updatedSessions = prev.filter(s => s.id !== sessionId);
      
      if (currentSessionId === sessionId) {
        if (updatedSessions.length > 0) {
          setCurrentSessionId(updatedSessions[0].id);
        } else {
          setCurrentSessionId(null);
        }
      }
      
      return updatedSessions;
    });
  };

  const updateSessionTitle = (sessionId: string, title: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title } : s
    ));
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
    setSessions(prev => prev.map(s => 
      s.id === currentSession.id ? { ...s, messages: updatedMessages } : s
    ));
    setInput('');
    setIsLoading(true);

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

      setSessions(prev => prev.map(s => 
        s.id === currentSession.id 
          ? { ...s, messages: [...updatedMessages, aiMessage] }
          : s
      ));
    } catch (error) {
      const errorMessage: Message = {
        id: updatedMessages.length + 1,
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin.',
        isUser: false,
        timestamp: new Date(),
      };
      setSessions(prev => prev.map(s => 
        s.id === currentSession.id 
          ? { ...s, messages: [...updatedMessages, errorMessage] }
          : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentSession) return null;

  return (
    <div className="font-inter">
      {/* Chat Toggle Button */}
      {!fullscreen && (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-emerald-400 to-sky-400 hover:from-emerald-500 hover:to-sky-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Sohbet Asistanını Aç"
        >
          <div className="relative">
            <HeartIcon className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full animate-pulse"></div>
          </div>
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={fullscreen ? { opacity: 0 } : { x: '100%', opacity: 0, scale: 0.95 }}
            animate={fullscreen ? { opacity: 1 } : { x: 0, opacity: 1, scale: 1 }}
            exit={fullscreen ? { opacity: 0 } : { x: '100%', opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`${
              fullscreen 
                ? 'fixed inset-0 z-50 bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900' 
                : 'fixed bottom-24 right-6 h-[600px] w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-40 border border-slate-200 dark:border-slate-700'
            } flex flex-col overflow-hidden`}
          >
            
            {/* Header */}
            <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/10 to-sky-500/10 dark:from-emerald-400/10 dark:to-sky-400/10 border-b border-emerald-100 dark:border-slate-700 ${
              fullscreen ? 'px-6 py-4' : ''
            }`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-sky-400 rounded-xl flex items-center justify-center shadow-md">
                    <HeartIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white dark:border-slate-800 animate-pulse"></div>
                </div>
                <div>
                  <h3 className={`font-semibold text-slate-800 dark:text-slate-200 ${
                    fullscreen ? 'text-lg' : 'text-sm'
                  }`}>
                    FitTürkAI Asistanı
                  </h3>
                  {fullscreen && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Sağlık rehberiniz
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {!fullscreen && (
                  <motion.button
                    onClick={() => setIsMinimized(!isMinimized)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                    aria-label={isMinimized ? "Genişlet" : "Küçült"}
                  >
                    {isMinimized ? 
                      <ChevronUpIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" /> : 
                      <ChevronDownIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    }
                  </motion.button>
                )}
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  aria-label="Kapat"
                >
                  <XMarkIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </motion.button>
              </div>
            </div>

            {(!isMinimized || fullscreen) && (
              <>
                {/* Sessions List */}
                {fullscreen && (
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Sohbet Geçmişi</h4>
                      <motion.button
                        onClick={createNewSession}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-sky-400 hover:from-emerald-500 hover:to-sky-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <PlusIcon className="w-3 h-3" />
                      </motion.button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto scrollbar-none">
                      {sessions.map((session) => (
                        <motion.button
                          key={session.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                            currentSessionId === session.id
                              ? 'bg-gradient-to-r from-emerald-100 to-sky-100 dark:from-emerald-900/30 dark:to-sky-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                          onClick={() => setCurrentSessionId(session.id)}
                        >
                          {session.title}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none scroll-smooth ${
                  fullscreen ? 'px-6' : ''
                }`}>
                  <AnimatePresence mode="popLayout">
                    {currentSession.messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`flex w-full ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end gap-2 ${
                          fullscreen ? 'max-w-lg' : 'max-w-[85%]'
                        } ${message.isUser ? 'flex-row-reverse' : ''}`}>
                          
                          {/* Avatar */}
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
                            message.isUser 
                              ? 'bg-gradient-to-br from-sky-400 to-blue-500' 
                              : 'bg-gradient-to-br from-emerald-400 to-green-500'
                          }`}>
                            {message.isUser ? (
                              <UserIcon className="w-3 h-3 text-white" />
                            ) : (
                              <SparklesIcon className="w-3 h-3 text-white" />
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div className={`relative px-3 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                            fullscreen ? 'text-base' : 'text-sm'
                          } whitespace-pre-wrap break-words ${
                            message.isUser
                              ? 'bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 text-slate-800 dark:text-slate-200'
                              : 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-slate-800 dark:text-slate-200 border border-emerald-100 dark:border-emerald-800'
                          } ${message.isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                            
                            {message.content}
                            
                            {/* Kuyruk */}
                            <div className={`absolute bottom-0 w-2 h-2 ${
                              message.isUser 
                                ? 'right-0 translate-x-0.5 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50' 
                                : 'left-0 -translate-x-0.5 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30'
                            } rotate-45 border-r border-b ${
                              message.isUser 
                                ? 'border-sky-200 dark:border-sky-800' 
                                : 'border-emerald-100 dark:border-emerald-800'
                            }`}></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Typing Animation */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start w-full"
                    >
                      <div className={`flex items-end gap-2 ${
                        fullscreen ? 'max-w-lg' : 'max-w-[85%]'
                      }`}>
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-sm">
                          <SparklesIcon className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-100 dark:border-emerald-800 rounded-2xl rounded-bl-md px-3 py-2 shadow-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form
                  onSubmit={handleSubmit}
                  className={`p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 ${
                    fullscreen ? 'px-6' : ''
                  }`}
                >
                  <div className={`flex gap-2 items-end ${
                    fullscreen ? 'max-w-lg mx-auto' : ''
                  }`}>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Mesajınızı yazın ve Enter'a basın..."
                        className={`w-full px-3 py-2.5 pr-10 rounded-2xl border border-slate-200 dark:border-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:focus:border-emerald-400 transition-all duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 shadow-sm ${
                          fullscreen ? 'text-base' : 'text-sm'
                        } outline-none`}
                        disabled={isLoading}
                        autoFocus
                      />
                      {input.trim() && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-600 dark:text-emerald-400">
                          ↵
                        </div>
                      )}
                    </div>
                    
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isLoading || !input.trim()}
                      className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 hover:from-emerald-500 hover:to-sky-500 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      aria-label="Mesaj Gönder"
                    >
                      <PaperAirplaneIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 