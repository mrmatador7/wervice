'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, MoreVertical, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import SuggestionChip from './SuggestionChip';
import { WERVICE_CATEGORIES, labelForCategory } from '@/lib/categories';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';
import type { AIVendorCardVendor } from './VendorCard';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  vendors?: AIVendorCardVendor[];
  timestamp: Date;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

// Suggestions based on real categories and cities
const SUGGESTION_PROMPTS = [
  'Garden or riad venue in Marrakech',
  'Makeup artist in Casablanca',
  'Wedding photographer in Rabat',
  'Caterer or traiteur in Fes',
  'Negafa in Casablanca or Rabat',
  'Event planner in Marrakech',
  'Florist in Rabat',
  'Venue in Agadir',
];

// Map natural language / keywords to DB category
const QUERY_TO_DB_CATEGORY: Record<string, string> = {};
WERVICE_CATEGORIES.forEach((c) => {
  QUERY_TO_DB_CATEGORY[c.dbCategory] = c.dbCategory;
  QUERY_TO_DB_CATEGORY[c.label.toLowerCase()] = c.dbCategory;
  QUERY_TO_DB_CATEGORY[c.slug] = c.dbCategory;
});
['venue', 'venues', 'riad', 'palace', 'salle'].forEach((k) => { QUERY_TO_DB_CATEGORY[k] = 'venues'; });
['photo', 'photographer', 'photography', 'video', 'videographer'].forEach((k) => { QUERY_TO_DB_CATEGORY[k] = 'photography'; });
['makeup', 'make-up', 'beauty', 'hair', 'henna', 'coiffure'].forEach((k) => { QUERY_TO_DB_CATEGORY[k] = 'beauty'; });
['caterer', 'catering', 'traiteur', 'food'].forEach((k) => { QUERY_TO_DB_CATEGORY[k] = 'catering'; });
['planner', 'planning', 'organizer', 'event planner'].forEach((k) => { QUERY_TO_DB_CATEGORY[k] = 'planning'; });
['flower', 'florist', 'floral'].forEach((k) => { QUERY_TO_DB_CATEGORY[k] = 'florist'; });
['cake', 'cakes', 'pastry'].forEach((k) => { QUERY_TO_DB_CATEGORY[k] = 'cakes'; });
['decor', 'decoration'].forEach((k) => { QUERY_TO_DB_CATEGORY[k] = 'decor'; });
['dress', 'dresses', 'caftan', 'takchita'].forEach((k) => { QUERY_TO_DB_CATEGORY[k] = 'dresses'; });
['negafa', 'tanguif'].forEach((k) => { QUERY_TO_DB_CATEGORY[k] = 'negafa'; });
['music', 'dj', 'artist', 'band', 'orchestra'].forEach((k) => { QUERY_TO_DB_CATEGORY[k] = 'music'; });

// Map query keywords to subcategory slugs (from subcategories.ts)
const QUERY_TO_SUBCATEGORY: Record<string, string> = {};
// Venues
['riad', 'riads', 'villa', 'villas'].forEach((k) => { QUERY_TO_SUBCATEGORY[k] = 'riads-villas'; });
['garden', 'gardens', 'outdoor', 'jardin'].forEach((k) => { QUERY_TO_SUBCATEGORY[k] = 'outdoor-gardens'; });
['hotel', 'resort'].forEach((k) => { QUERY_TO_SUBCATEGORY[k] = 'hotels-resorts'; });
['palace', 'palais', 'luxury'].forEach((k) => { QUERY_TO_SUBCATEGORY[k] = 'luxury-palaces'; });
['beach', 'plage'].forEach((k) => { QUERY_TO_SUBCATEGORY[k] = 'beach-venues'; });
['hall', 'salle', 'halls'].forEach((k) => { QUERY_TO_SUBCATEGORY[k] = 'wedding-halls'; });
// Beauty
['makeup', 'make-up', 'maquillage'].forEach((k) => { QUERY_TO_SUBCATEGORY[k] = 'makeup-artist'; });
['hair', 'coiffure', 'hairstylist'].forEach((k) => { QUERY_TO_SUBCATEGORY[k] = 'hair-stylist'; });
// Photo & Film
['photographer', 'photo', 'photography'].forEach((k) => { QUERY_TO_SUBCATEGORY[k] = 'wedding-photographer'; });
['videographer', 'video', 'film'].forEach((k) => { QUERY_TO_SUBCATEGORY[k] = 'videographer'; });

function parseQueryToFilters(query: string): { q?: string; city?: string; category?: string; subcategory?: string } {
  const lower = query.toLowerCase().trim();
  const filters: { q?: string; city?: string; category?: string; subcategory?: string } = {};

  // Detect city (from canonical list)
  for (const { label, value } of MOROCCAN_CITIES) {
    if (value === 'all') continue;
    if (lower.includes(label.toLowerCase()) || lower.includes(value.toLowerCase())) {
      filters.city = label;
      break;
    }
  }

  // Detect category from keywords
  const words = lower.split(/\s+/).filter(Boolean);
  for (const word of words) {
    const key = word.replace(/[^a-z]/g, '');
    if (QUERY_TO_DB_CATEGORY[key]) {
      filters.category = QUERY_TO_DB_CATEGORY[key];
      break;
    }
  }
  if (!filters.category) {
    if (lower.includes('event planner') || lower.includes('wedding planner')) filters.category = 'planning';
    else if (lower.includes('makeup') || lower.includes('make-up') || lower.includes('hair')) filters.category = 'beauty';
    else if (lower.includes('photographer') || lower.includes('videographer') || lower.includes('photo & film')) filters.category = 'photography';
    else if (lower.includes('venue') || lower.includes('riad') || lower.includes('palace')) filters.category = 'venues';
    else if (lower.includes('caterer') || lower.includes('traiteur')) filters.category = 'catering';
  }

  // Subcategory (type) from query — only set when we have a matching category
  for (const word of words) {
    const key = word.replace(/[^a-z]/g, '');
    if (QUERY_TO_SUBCATEGORY[key]) {
      filters.subcategory = QUERY_TO_SUBCATEGORY[key];
      break;
    }
  }
  if (!filters.subcategory) {
    if (lower.includes('makeup artist')) filters.subcategory = 'makeup-artist';
    else if (lower.includes('hair stylist') || lower.includes('hairstylist')) filters.subcategory = 'hair-stylist';
    else if (lower.includes('riad') || lower.includes('riads')) filters.subcategory = 'riads-villas';
    else if (lower.includes('garden')) filters.subcategory = 'outdoor-gardens';
  }

  // Only use short q for text search when we have no category (e.g. "caftan" or business name). Don't send full sentence — it over-restricts.
  if (!filters.category && query.trim().length < 80) {
    filters.q = query.trim();
  }

  return filters;
}

async function fetchVendorsForQuery(query: string): Promise<{ answer: string; vendors: AIVendorCardVendor[] }> {
  const filters = parseQueryToFilters(query);
  const params = new URLSearchParams();
  params.set('limit', '6');
  params.set('allow_no_image', '1'); // Include vendors without images so AI always gets results
  if (filters.category) params.set('category', filters.category);
  if (filters.city) params.append('city', filters.city);
  if (filters.subcategory) params.append('subcategory', filters.subcategory);
  if (filters.q) params.set('q', filters.q);

  const res = await fetch(`/api/vendors?${params.toString()}`);
  if (!res.ok) {
    return { answer: "I couldn't search vendors right now. Please try again.", vendors: [] };
  }

  const data = await res.json();
  const list = Array.isArray(data.vendors) ? data.vendors : [];
  const total = data.total ?? list.length;

  const categoryLabel = filters.category ? labelForCategory(filters.category) : 'vendors';
  const cityLabel = filters.city ? ` in ${filters.city}` : ' in Morocco';
  let answer: string;
  if (list.length === 0) {
    answer = `I didn't find any ${categoryLabel.toLowerCase()}${cityLabel} matching your request. Try another city or category.`;
  } else {
    answer = `Here are ${list.length} ${categoryLabel.toLowerCase()}${cityLabel}${list.length < total ? ` (showing ${list.length} of ${total})` : ''}.`;
  }

  const vendors: AIVendorCardVendor[] = list.map((v: Record<string, unknown>) => ({
    id: String(v.id ?? ''),
    business_name: String(v.business_name ?? v.name ?? ''),
    slug: String(v.slug ?? ''),
    city: String(v.city ?? ''),
    category: String(v.category ?? ''),
    profile_photo_url: (v.profile_photo_url ?? v.logo_url ?? null) as string | null,
    gallery_photos: (v.gallery_photos ?? v.gallery_urls ?? null) as string[] | null,
    gallery_urls: (v.gallery_urls ?? v.gallery_photos ?? null) as string[] | null,
    starting_price: typeof v.starting_price === 'number' ? v.starting_price : null,
  }));

  return { answer, vendors };
}

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
      const response = await fetchVendorsForQuery(trimmedQuery);
      
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
                      Search by city, category (venues, beauty, photo & film, caterer, negafa…), or describe what you need
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
                  placeholder="e.g. Riad venue in Marrakech, makeup artist in Casablanca"
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

