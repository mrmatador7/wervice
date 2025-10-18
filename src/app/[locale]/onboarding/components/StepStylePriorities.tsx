'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Star, Sparkles } from 'lucide-react';
import type { OnboardingData } from '../schemas/onboarding.schemas';

interface StepStylePrioritiesProps {
  data: OnboardingData;
  currentStepData: any;
  onContinue: (data: any) => Promise<boolean>;
  onSkip: () => void;
  isSaving: boolean;
}

const WEDDING_STYLES = [
  { id: 'modern', label: 'Modern', emoji: '✨', description: 'Contemporary and sleek' },
  { id: 'traditional', label: 'Traditional', emoji: '🏰', description: 'Classic Moroccan elegance' },
  { id: 'luxury', label: 'Luxury', emoji: '💎', description: 'High-end and glamorous' },
  { id: 'garden', label: 'Garden', emoji: '🌸', description: 'Outdoor and natural' },
  { id: 'beach', label: 'Beach', emoji: '🏖️', description: 'Coastal and relaxed' },
  { id: 'boho', label: 'Boho Chic', emoji: '🕊️', description: 'Free-spirited and artistic' },
  { id: 'vintage', label: 'Vintage', emoji: '📻', description: 'Retro and nostalgic' },
  { id: 'minimalist', label: 'Minimalist', emoji: '⚪', description: 'Clean and simple' },
];

const PRIORITIES = [
  { id: 'venue', label: 'Venue', emoji: '🏛️', description: 'Perfect location and ambiance' },
  { id: 'photography', label: 'Photography', emoji: '📸', description: 'Capture every special moment' },
  { id: 'decor', label: 'Décor', emoji: '🎨', description: 'Beautiful styling and flowers' },
  { id: 'food', label: 'Food & Catering', emoji: '🍽️', description: 'Delicious cuisine and service' },
  { id: 'music', label: 'Music & Entertainment', emoji: '🎵', description: 'Perfect soundtrack and fun' },
  { id: 'beauty', label: 'Beauty & Hair', emoji: '💄', description: 'Glam team for the big day' },
  { id: 'dress', label: 'Wedding Dress', emoji: '👗', description: 'Perfect attire for everyone' },
  { id: 'planner', label: 'Wedding Planner', emoji: '📋', description: 'Expert coordination' },
];

export default function StepStylePriorities({ data, currentStepData, onContinue, isSaving }: StepStylePrioritiesProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(currentStepData?.styles || data.stylePriorities?.styles || []);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(currentStepData?.topPriorities || data.stylePriorities?.topPriorities || []);

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handlePriorityToggle = (priorityId: string) => {
    setSelectedPriorities(prev =>
      prev.includes(priorityId)
        ? prev.filter(id => id !== priorityId)
        : prev.length < 3 ? [...prev, priorityId] : prev // Max 3 priorities
    );
  };

  const handleStyleRemove = (styleId: string) => {
    setSelectedStyles(prev => prev.filter(id => id !== styleId));
  };

  const handlePriorityRemove = (priorityId: string) => {
    setSelectedPriorities(prev => prev.filter(id => id !== priorityId));
  };

  const handleContinue = async () => {
    return await onContinue({
      styles: selectedStyles,
      topPriorities: selectedPriorities,
    });
  };

  const isValid = selectedStyles.length > 0;

  return (
    <motion.form
      id="step-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleContinue();
      }}
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-text" />
        </div>
        <h2 className="text-3xl font-bold text-text">What's your wedding vision?</h2>
        <p className="text-muted max-w-md mx-auto">
          Tell us about your style preferences and what matters most to you for personalized recommendations.
        </p>
      </div>

      {/* Wedding Styles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-lime" />
          <h3 className="text-lg font-semibold text-text">Wedding Styles</h3>
          <span className="text-sm text-muted">Select all that appeal to you</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {WEDDING_STYLES.map((style) => {
            const isSelected = selectedStyles.includes(style.id);
            return (
              <button
                key={style.id}
                onClick={() => handleStyleToggle(style.id)}
                aria-pressed={isSelected}
                role="button"
                className={`relative p-4 border rounded-xl text-center transition-all hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime ${
                  isSelected
                    ? 'bg-lime text-text border-transparent shadow-soft'
                    : 'border-border bg-white hover:border-lime/50 text-text'
                }`}
              >
                <div className="text-2xl mb-2">{style.emoji}</div>
                <div className="font-medium text-sm">
                  {style.label}
                </div>
                <div className={`text-xs mt-1 ${
                  isSelected ? 'text-text/80' : 'text-muted'
                }`}>
                  {style.description}
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 text-white/90">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selectedStyles.length > 0 && (
          <div className="bg-gray-50 border border-border rounded-lg p-4">
            <p className="text-sm text-muted mb-2">Selected styles:</p>
            <div className="flex flex-wrap gap-2">
              {selectedStyles.map(styleId => {
                const style = WEDDING_STYLES.find(s => s.id === styleId);
                return (
                  <span
                    key={styleId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full"
                  >
                    {style?.emoji} {style?.label}
                    <button
                      onClick={() => handleStyleRemove(styleId)}
                      className="ml-1 hover:bg-neutral-200 rounded-full w-4 h-4 flex items-center justify-center"
                      aria-label={`Remove ${style?.label}`}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Priorities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-lime" />
          <h3 className="text-lg font-semibold text-text">Top Priorities</h3>
          <span className="text-sm text-muted">Choose up to 3 that matter most</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRIORITIES.map((priority) => {
            const isSelected = selectedPriorities.includes(priority.id);
            const isDisabled = !isSelected && selectedPriorities.length >= 3;

            return (
              <button
                key={priority.id}
                onClick={() => handlePriorityToggle(priority.id)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                aria-disabled={isDisabled}
                role="button"
                className={`p-4 border rounded-xl text-left transition-all hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime ${
                  isSelected
                    ? 'bg-lime text-text border-transparent shadow-soft'
                    : isDisabled
                    ? 'border-border/50 bg-gray-50 opacity-50 cursor-not-allowed text-muted pointer-events-none'
                    : 'border-border bg-white hover:border-lime/50 text-text'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-lime text-text' : 'bg-gray-50 text-muted'
                  }`}>
                    <span className="text-lg">{priority.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {priority.label}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      isSelected ? 'text-text/80' : 'text-muted'
                    }`}>
                      {priority.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-lime rounded-full flex items-center justify-center">
                      <span className="text-xs text-text font-bold">✓</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedPriorities.length > 0 && (
          <div className="bg-lime/5 border border-lime/20 rounded-lg p-4">
            <p className="text-sm text-muted mb-2">Your top priorities:</p>
            <div className="flex flex-wrap gap-2">
              {selectedPriorities.map(priorityId => {
                const priority = PRIORITIES.find(p => p.id === priorityId);
                return (
                  <span
                    key={priorityId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full"
                  >
                    {priority?.emoji} {priority?.label}
                    <button
                      onClick={() => handlePriorityRemove(priorityId)}
                      className="ml-1 hover:bg-neutral-200 rounded-full w-4 h-4 flex items-center justify-center"
                      aria-label={`Remove ${priority?.label}`}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </motion.form>
  );
}
