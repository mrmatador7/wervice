'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { OnboardingData } from '@/app/[locale]/onboarding/page';

interface StepServicesProps {
  data: OnboardingData;
  onSave: (step: string, data: any, skip?: boolean) => void;
  onBack?: () => void;
  isSaving: boolean;
}

const SERVICE_CATEGORIES = [
  { value: 'venues', labelKey: 'venues' },
  { value: 'catering', labelKey: 'catering' },
  { value: 'photo', labelKey: 'photo' },
  { value: 'video', labelKey: 'video' },
  { value: 'dresses', labelKey: 'dresses' },
  { value: 'music', labelKey: 'music' },
  { value: 'beauty', labelKey: 'beauty' },
  { value: 'decor', labelKey: 'decor' },
  { value: 'planning', labelKey: 'planning' },
  { value: 'cars', labelKey: 'cars' },
  { value: 'desserts', labelKey: 'desserts' },
  { value: 'rings', labelKey: 'rings' },
  { value: 'flowers', labelKey: 'flowers' }
];

export default function StepServices({ data, onSave, isSaving }: StepServicesProps) {
  const t = useTranslations('onboarding');
  const [selectedServices, setSelectedServices] = useState<string[]>(data.services || []);

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const isValid = selectedServices.length > 0;

  const handleNext = () => {
    if (isValid) {
      onSave('services', { services: selectedServices });
    }
  };

  const handleSkip = () => {
    onSave('services', { services: ['venues'] }, true); // Default to venues for skipped
  };

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🎯</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#11190C] text-center mb-3">
          {t('services.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-[#787664] text-center mb-8">
          {t('services.subtitle')}
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8 max-h-80 overflow-y-auto">
          {SERVICE_CATEGORIES.map((service) => {
            const isSelected = selectedServices.includes(service.value);
            return (
              <button
                key={service.value}
                onClick={() => toggleService(service.value)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  isSelected
                    ? 'border-[#D9FF0A] bg-[#D9FF0A]/10 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`text-sm font-medium ${isSelected ? 'text-[#11190C]' : 'text-[#787664]'}`}>
                  {t(`services.${service.labelKey}`)}
                </span>
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
