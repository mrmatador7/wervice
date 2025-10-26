'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
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

export default function StepStylePriorities({ data, currentStepData, onContinue, isSaving }: StepStylePrioritiesProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(currentStepData?.styles || data.stylePriorities?.styles || []);

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleContinue = async () => {
    return await onContinue({
      styles: selectedStyles,
      topPriorities: [], // Empty array since we removed priorities
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
      className="max-w-md mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-wervice-lime to-lime-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
        <Palette className="w-8 h-8 text-wervice-ink" />
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-wervice-ink">
          What's your wedding style?
        </h3>
        <p className="text-gray-500">
          Choose the styles that match your vision
        </p>
      </div>

      {/* Wedding Styles */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700">
          Wedding Style (select all that apply)
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          {WEDDING_STYLES.map((style) => {
            const isSelected = selectedStyles.includes(style.id);
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handleStyleToggle(style.id)}
                className={`p-4 border-2 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-50 to-white border-orange-500 shadow-md'
                    : 'border-gray-200 bg-white hover:border-orange-200'
                }`}
              >
                <div className="text-2xl mb-1">{style.emoji}</div>
                <div className="font-medium text-sm text-wervice-ink">{style.label}</div>
                {isSelected && (
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mx-auto mt-2">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Counter */}
        {selectedStyles.length > 0 && (
          <div className="bg-gradient-to-r from-wv-gray1 to-white border border-wv-gray2 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-wervice-ink">{selectedStyles.length}</span> style{selectedStyles.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>
    </motion.form>
  );
}
