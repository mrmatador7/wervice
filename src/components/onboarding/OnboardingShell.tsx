'use client';

import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';

interface OnboardingShellProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  children: React.ReactNode;
}

export default function OnboardingShell({
  currentStep,
  totalSteps,
  onBack,
  children
}: OnboardingShellProps) {
  const t = useTranslations('onboarding');

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#F6F5F2]">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#787664]">
                {t('progress.step')} {currentStep + 1} {t('progress.of')} {totalSteps}
              </span>
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-[#787664] hover:text-[#11190C] text-sm flex items-center gap-1 transition-colors"
                >
                  ← {t('common.back')}
                </button>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#D9FF0A] h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
