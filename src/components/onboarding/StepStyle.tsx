'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { OnboardingData } from '@/app/[locale]/onboarding/page';

interface StepStyleProps {
  data: OnboardingData;
  onSave: (step: string, data: any, skip?: boolean) => void;
  onBack?: () => void;
  isSaving: boolean;
}

const STYLE_OPTIONS = [
  { value: 'classic', labelKey: 'classic', emoji: '👑' },
  { value: 'modern', labelKey: 'modern', emoji: '✨' },
  { value: 'bohemian', labelKey: 'bohemian', emoji: '🌸' },
  { value: 'moroccan', labelKey: 'moroccan', emoji: '🕌' },
  { value: 'glamorous', labelKey: 'glamorous', emoji: '💎' },
  { value: 'minimalist', labelKey: 'minimalist', emoji: '🌿' }
];

export default function StepStyle({ data, onSave, isSaving }: StepStyleProps) {
  const t = useTranslations('onboarding');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(data.style || []);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const isValid = selectedStyles.length > 0;

  const handleNext = () => {
    if (isValid) {
      onSave('style', { styles: selectedStyles });
    }
  };

  const handleSkip = () => {
    onSave('style', { styles: ['classic'] }, true); // Default style for skipped
  };

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🎨</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#11190C] text-center mb-3">
          {t('style.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-[#787664] text-center mb-8">
          {t('style.subtitle')}
        </p>

        {/* Style Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {STYLE_OPTIONS.map((option) => {
            const isSelected = selectedStyles.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleStyle(option.value)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-[#D9FF0A] bg-[#D9FF0A]/10 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{option.emoji}</span>
                  <span className={`font-medium ${isSelected ? 'text-[#11190C]' : 'text-[#787664]'}`}>
                    {t(`style.${option.labelKey}`)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSkip}
            disabled={isSaving}
            className="flex-1 border-2 border-gray-300 hover:border-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-600 font-medium py-3 px-6 rounded-full transition-colors"
          >
            {t('common.skip')}
          </button>

          <button
            onClick={handleNext}
            disabled={!isValid || isSaving}
            className="flex-1 bg-[#D9FF0A] hover:bg-[#D9FF0A]/90 disabled:bg-gray-200 disabled:cursor-not-allowed text-[#11190C] font-semibold py-3 px-6 rounded-full transition-colors"
          >
            {isSaving ? t('common.saving') : t('common.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
