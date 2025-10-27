'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, MoreVertical, Send, Copy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import SuggestionChip from './SuggestionChip';
import VendorCard from './VendorCard';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  vendors?: any[];
  timestamp: Date;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const SUGGESTION_PROMPTS = [
  "Find a garden venue in Marrakech for 150 guests",
  "Makeup artist in Casablanca under 1500 MAD",
  "DJ available next month in Agadir",
  "Photographer for outdoor ceremony in Rabat",
  "Traditional henna artist in Fès",
  "Rooftop venues in Tangier"
];

// Mock AI response function
const fetchAIResponse = async (query: string): Promise<{ answer: string; vendors: any[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500));
  
  // Mock response
  return {
    answer: `Here are the best wedding ${query.includes('venue') ? 'venues' : 'vendors'} I found for you in Morocco. These options match your requirements perfectly.`,
    vendors: [
      {
        id: 'v1',
        name: 'Palais Malak',
        city: 'Marrakech',
        category: 'Venues',
        priceFrom: 1200,
        whatsapp: '212600000000',
        image: '/public/sample/venues-1.jpg',
        slug: 'palais-malak'
      },
      {
        id: 'v2',
        name: 'Kasr Riad Asmar',
        city: 'Marrakech',
        category: 'Venues',
        priceFrom: 1500,
        whatsapp: '212611111111',
        image: '/public/sample/venues-2.jpg',
        slug: 'kasr-riad-asmar'
      },
      {
        id: 'v3',
        name: 'Salle Des Fêtes',
        city: 'Casablanca',
        category: 'Venues',
        priceFrom: 1000,
        whatsapp: '212622222222',
        image: '/public/sample/venues-3.jpg',
        slug: 'salle-des-fetes'
      }
    ]
  };
};

export default function AIChatModal({ isOpen, onClose, initialQuery = '' }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Ensure component is mounted (client-side only for portal)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle initial query
  useEffect(() => {
    if (isOpen && initialQuery && messages.length === 0) {
      handleSendMessage(initialQuery);
    }
  }, [isOpen, initialQuery]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const handleSendMessage = async (query: string = inputValue) => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      setError('Type something to ask');
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: trimmedQuery,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setError('');

    try {
      // Fetch AI response
      const response = await fetchAIResponse(trimmedQuery);
      
      // Add AI message
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response.answer,
        vendors: response.vendors,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      // Add error message
      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        type: 'ai',
        content: "Sorry, I couldn't process that. Try rephrasing.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleRegenerateMessage = (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex > 0) {
      const previousUserMessage = messages[messageIndex - 1];
      if (previousUserMessage.type === 'user') {
        // Remove the AI message and regenerate
        setMessages(prev => prev.slice(0, messageIndex));
        handleSendMessage(previousUserMessage.content);
      }
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-chat-title"
          >
            {/* Modal */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-[1100px] h-[80vh] bg-[#FAFAF7] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
          {/* Main Conversation Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img 
                  src="/Wervice AI.svg" 
                  alt="Wervice AI" 
                  className="w-8 h-8"
                />
                <div>
                  <h2 id="ai-chat-title" className="text-xl font-bold text-[#0B0F0A]">
                    Wervice AI
                  </h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Ask anything about wedding vendors in Morocco
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !isTyping && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0B0F0A] flex items-center justify-center p-3">
                      <img 
                        src="/Wervice AI.svg" 
                        alt="Wervice AI" 
                        className="w-full h-full"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      How can I help you today?
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Ask me about venues, vendors, pricing, or anything wedding-related in Morocco
                    </p>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  type={message.type}
                  content={message.content}
                  vendors={message.vendors}
                  onCopy={() => handleCopyMessage(message.content)}
                  onRegenerate={message.type === 'ai' ? () => handleRegenerateMessage(message.id) : undefined}
                />
              ))}

              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0B0F0A] flex items-center justify-center p-1">
                    <img 
                      src="/Wervice AI.svg" 
                      alt="Wervice AI" 
                      className="w-full h-full"
                    />
                  </div>
                  <div className="bg-[#EBF8EE] rounded-2xl px-4 py-3 max-w-[80%]">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Footer Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything… e.g. 'Rooftop venue in Marrakech for 120 guests'"
                  className={`flex-1 px-4 py-3 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D9FF0A] focus:border-transparent transition-all ${
                    showError ? 'border-red-500 animate-shake' : 'border-gray-300'
                  }`}
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D9FF0A] hover:bg-[#BEE600] text-[#0B0F0A] font-semibold rounded-full transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl"
                  aria-label="Send message"
                >
                  <span className="hidden md:inline">Ask Wervice AI</span>
                  <span className="md:hidden">Ask</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {showError && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
          </div>

          {/* Right Sidebar - Suggestions (Hidden on mobile) */}
          <div className="hidden md:flex md:w-80 border-l border-gray-200 bg-white/50 backdrop-blur-sm flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Suggestions</h3>
              <p className="text-xs text-gray-600 mt-1">Try asking about...</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {SUGGESTION_PROMPTS.map((prompt, index) => (
                <SuggestionChip
                  key={index}
                  text={prompt}
                  onClick={() => handleSuggestionClick(prompt)}
                />
              ))}
            </div>
          </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

