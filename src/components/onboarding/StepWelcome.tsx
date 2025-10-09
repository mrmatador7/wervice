'use client';

import { useTranslations } from 'next-intl';
import { OnboardingData } from '@/app/[locale]/onboarding/page';

interface StepWelcomeProps {
  data: OnboardingData;
  onSave: (step: string, data: any, skip?: boolean) => void;
  onBack?: () => void;
  isSaving: boolean;
}

export default function StepWelcome({ onSave, isSaving }: StepWelcomeProps) {
  const t = useTranslations('onboarding');

  const handleStart = () => {
    onSave('welcome', { started: true });
  };

  const handleSkip = () => {
    onSave('welcome', { skipped: true }, true);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">💐</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#11190C] mb-4">
          {t('welcome.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-[#787664] mb-12 max-w-md mx-auto">
          {t('welcome.subtitle')}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xs mx-auto">
          <button
            onClick={handleStart}
            disabled={isSaving}
            className="flex-1 bg-[#D9FF0A] hover:bg-[#D9FF0A]/90 disabled:bg-gray-200 disabled:cursor-not-allowed text-[#11190C] font-semibold py-4 px-8 rounded-full transition-colors"
          >
            {isSaving ? t('common.saving') : t('welcome.start')}
          </button>

          <button
            onClick={handleSkip}
            disabled={isSaving}
            className="flex-1 border-2 border-[#D9FF0A] hover:bg-[#D9FF0A]/10 disabled:bg-gray-200 disabled:cursor-not-allowed text-[#11190C] font-semibold py-4 px-8 rounded-full transition-colors"
          >
            {t('welcome.skip')}
          </button>
        </div>
      </div>
    </div>
  );
}
