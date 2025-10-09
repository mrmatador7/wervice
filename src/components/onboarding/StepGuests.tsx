'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { OnboardingData } from '@/app/[locale]/onboarding/page';

interface StepGuestsProps {
  data: OnboardingData;
  onSave: (step: string, data: any, skip?: boolean) => void;
  onBack?: () => void;
  isSaving: boolean;
}

const GUEST_OPTIONS = [
  { value: '0-50', labelKey: '0-50' },
  { value: '51-100', labelKey: '51-100' },
  { value: '101-200', labelKey: '101-200' },
  { value: '200+', labelKey: '200+' },
  { value: 'unsure', labelKey: 'unsure' }
];

export default function StepGuests({ data, onSave, isSaving }: StepGuestsProps) {
  const t = useTranslations('onboarding');
  const [guestCount, setGuestCount] = useState(data.guests?.guestCount || '');

  const isValid = guestCount.length > 0;

  const handleNext = () => {
    if (isValid) {
      onSave('guests', { guestCount });
    }
  };

  const handleSkip = () => {
    onSave('guests', { guestCount: 'unsure' }, true);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">👥</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#11190C] text-center mb-3">
          {t('guests.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-[#787664] text-center mb-8">
          {t('guests.subtitle')}
        </p>

        {/* Guest Options */}
        <div className="space-y-3 mb-8">
          {GUEST_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#D9FF0A] cursor-pointer transition-colors">
              <input
                type="radio"
                name="guestCount"
                value={option.value}
                checked={guestCount === option.value}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-4 h-4 text-[#D9FF0A] focus:ring-[#D9FF0A]"
              />
              <span className="ml-3 text-[#11190C] font-medium">
                {t(`guests.${option.labelKey}`)}
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
