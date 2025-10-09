'use client';

import { useTranslations } from 'next-intl';
import { OnboardingData } from '@/app/[locale]/onboarding/page';

interface StepFinishProps {
  data: OnboardingData;
  onSave: (step: string, data: any, skip?: boolean) => void;
  onBack?: () => void;
  isSaving: boolean;
}

export default function StepFinish({ onSave, isSaving }: StepFinishProps) {
  const t = useTranslations('onboarding');

  const handleComplete = () => {
    onSave('finish', { completed: true });
  };

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-md mx-auto text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🎉</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#11190C] mb-4">
          {t('finish.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-[#787664] mb-8">
          {t('finish.subtitle')}
        </p>

        {/* Summary */}
        <div className="bg-[#F6F5F2] rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-[#11190C] mb-3">Your preferences:</h3>
          <div className="text-sm text-[#787664] space-y-1">
            <p>✓ Personalized vendor recommendations</p>
            <p>✓ Curated wedding planning experience</p>
            <p>✓ Direct contact with verified vendors</p>
            <p>✓ Budget-friendly options in your area</p>
          </div>
        </div>

        {/* Complete Button */}
        <button
          onClick={handleComplete}
          disabled={isSaving}
          className="w-full bg-[#D9FF0A] hover:bg-[#D9FF0A]/90 disabled:bg-gray-200 disabled:cursor-not-allowed text-[#11190C] font-bold text-lg py-4 px-8 rounded-full transition-colors shadow-lg"
        >
          {isSaving ? t('common.saving') : t('finish.complete')}
        </button>

        {/* Alternative */}
        <button
          onClick={handleComplete}
          disabled={isSaving}
          className="w-full mt-4 border-2 border-[#D9FF0A] hover:bg-[#D9FF0A]/10 disabled:bg-gray-200 disabled:cursor-not-allowed text-[#11190C] font-semibold py-3 px-6 rounded-full transition-colors"
        >
          {t('finish.viewAccount')}
        </button>
      </div>
    </div>
  );
}
