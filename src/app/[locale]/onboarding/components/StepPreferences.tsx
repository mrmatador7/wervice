'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { OnboardingData } from '@/app/[locale]/onboarding/page';

interface StepPreferencesProps {
  data: OnboardingData;
  onSave: (step: string, data: any, skip?: boolean) => void;
  onBack?: () => void;
  isSaving: boolean;
}

const PREFERENCE_OPTIONS = [
  { value: 'contact', labelKey: 'contact' },
  { value: 'browse', labelKey: 'browse' },
  { value: 'helping', labelKey: 'helping' }
];

export default function StepPreferences({ data, onSave, isSaving }: StepPreferencesProps) {
  const t = useTranslations('onboarding');
  const [contactPreference, setContactPreference] = useState(
    data.preferences?.contactPreference || ''
  );

  const isValid = contactPreference.length > 0;

  const handleNext = () => {
    if (isValid) {
      onSave('preferences', { contactPreference });
    }
  };

  const handleSkip = () => {
    onSave('preferences', { contactPreference: 'browse' }, true);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">💬</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#11190C] text-center mb-3">
          {t('preferences.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-[#787664] text-center mb-8">
          {t('preferences.subtitle')}
        </p>

        {/* Preference Options */}
        <div className="space-y-4 mb-8">
          {PREFERENCE_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#D9FF0A] cursor-pointer transition-colors">
              <input
                type="radio"
                name="contactPreference"
                value={option.value}
                checked={contactPreference === option.value}
                onChange={(e) => setContactPreference(e.target.value)}
                className="w-4 h-4 text-[#D9FF0A] focus:ring-[#D9FF0A]"
              />
              <span className={`ml-3 font-medium ${contactPreference === option.value ? 'text-[#11190C]' : 'text-[#787664]'}`}>
                {t(`preferences.${option.labelKey}`)}
              </span>
            </label>
          ))}
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
