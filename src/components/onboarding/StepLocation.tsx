'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { OnboardingData } from '@/app/[locale]/onboarding/page';

interface StepLocationProps {
  data: OnboardingData;
  onSave: (step: string, data: any, skip?: boolean) => void;
  onBack?: () => void;
  isSaving: boolean;
}

const MOROCCAN_CITIES = [
  'Casablanca', 'Marrakech', 'Rabat', 'Tangier', 'Agadir',
  'Fes', 'Meknes', 'El Jadida', 'Kenitra', 'Tetouan'
];

const VENUE_SETTINGS = [
  { value: 'luxury', labelKey: 'luxury' },
  { value: 'outdoor', labelKey: 'outdoor' },
  { value: 'beachfront', labelKey: 'beachfront' },
  { value: 'riad', labelKey: 'riad' },
  { value: 'villa', labelKey: 'villa' }
];

export default function StepLocation({ data, onSave, isSaving }: StepLocationProps) {
  const t = useTranslations('onboarding');
  const [city, setCity] = useState(data.location?.city || '');
  const [setting, setSetting] = useState(data.location?.setting || '');

  const isValid = city.length > 0;

  const handleNext = () => {
    if (isValid) {
      onSave('location', {
        city,
        setting: setting || undefined
      });
    }
  };

  const handleSkip = () => {
    onSave('location', { skipped: true }, true);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">📍</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#11190C] text-center mb-3">
          {t('location.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-[#787664] text-center mb-8">
          {t('location.subtitle')}
        </p>

        {/* Form */}
        <div className="space-y-6">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-[#11190C] mb-2">
              {t('location.city')} *
            </label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9FF0A] focus:border-transparent"
            >
              <option value="">{t('location.selectCity')}</option>
              {MOROCCAN_CITIES.map((cityOption) => (
                <option key={cityOption} value={cityOption}>
                  {cityOption}
                </option>
              ))}
            </select>
          </div>

          {/* Setting */}
          <div>
            <label className="block text-sm font-medium text-[#11190C] mb-3">
              {t('location.setting')}
            </label>
            <div className="grid grid-cols-1 gap-3">
              {VENUE_SETTINGS.map((option) => (
                <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-[#D9FF0A] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="setting"
                    value={option.value}
                    checked={setting === option.value}
                    onChange={(e) => setSetting(e.target.value)}
                    className="w-4 h-4 text-[#D9FF0A] focus:ring-[#D9FF0A]"
                  />
                  <span className="ml-3 text-[#11190C]">{t(`location.${option.labelKey}`)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
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
    </div>
  );
}
