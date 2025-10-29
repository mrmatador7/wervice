'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import AIChatModal from '@/components/ai/AIChatModal';

const EXAMPLE_PROMPTS = [
  { emoji: '💄', text: 'makeup artist in Casablanca' },
  { emoji: '🏡', text: 'garden venue in Marrakech' },
  { emoji: '🎵', text: 'DJ for 200 guests in Agadir' },
  { emoji: '📸', text: 'outdoor photographer in Rabat' },
];

interface AISearchBarProps {
  locale: string;
}

export default function AISearchBar({ locale }: AISearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce for showing suggestions
  useEffect(() => {
    if (query.length > 0) {
      const timer = setTimeout(() => {
        setShowSuggestions(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openChat = (searchQuery: string) => {
    setInitialQuery(searchQuery);
    setIsChatOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      openChat(query);
      setQuery(''); // Clear input after opening chat
    }
  };

  const handlePillClick = (prompt: string) => {
    openChat(prompt);
  };

  return (
    <>
      <div ref={containerRef} className="w-full max-w-[920px] mx-auto relative z-10">
        <form onSubmit={handleSubmit} className="relative">
          {/* Main Input Container */}
          <div
            className={`relative flex items-center bg-white rounded-full border-2 transition-all duration-300 ${
              isFocused
                ? 'border-[#D9FF0A] shadow-[0_0_0_4px_rgba(217,255,10,0.15)]'
                : 'border-gray-200 shadow-lg hover:shadow-xl'
            }`}
          >
            {/* Wervice AI Logo */}
            <div className="flex items-center justify-center pl-6 pr-3">
              <div className="w-7 h-7 rounded-full bg-[#0B0F0A] flex items-center justify-center p-1">
                <img 
                  src="/Wervice AI.svg" 
                  alt="Wervice AI" 
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Ask anything… e.g. 'Rooftop venue in Marrakech for 120 guests'"
              aria-label="AI search"
              className="flex-1 py-4 px-2 text-base md:text-lg text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
            />

            {/* Action Button */}
            <button
              type="submit"
              aria-label="Ask Wervice AI"
              className="flex items-center gap-2 px-6 py-3 m-2 bg-[#D9FF0A] hover:bg-[#BEE600] text-[#0B0F0A] font-semibold rounded-full transition-all duration-200 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Ask Wervice AI</span>
              <span className="sm:hidden">Ask AI</span>
            </button>
          </div>

          {/* Suggestion Pills */}
          {(!query || showSuggestions) && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start overflow-x-auto pb-2">
              {EXAMPLE_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePillClick(prompt.text)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-white hover:border-[#D9FF0A] hover:shadow-md transition-all duration-200 whitespace-nowrap"
                >
                  <span>{prompt.emoji}</span>
                  <span>{prompt.text}</span>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* AI Chat Modal */}
      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialQuery={initialQuery}
      />
    </>
  );
}

