'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { OnboardingData } from '@/app/[locale]/onboarding/page';
import { BUDGET_BANDS, getBudgetBandLabel, type Currency, type BudgetBandKey, getBudgetBandMADValues, convertToMAD } from '@/lib/currency';

interface StepBudgetCurrencyProps {
  data: OnboardingData;
  onSave: (step: string, data: any, skip?: boolean) => void;
  onBack?: () => void;
  isSaving: boolean;
}

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'MAD', label: 'MAD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' }
];

export default function StepBudgetCurrency({ data, onSave, isSaving }: StepBudgetCurrencyProps) {
  const t = useTranslations('onboarding');
  const [currency, setCurrency] = useState<Currency>(
    (data.budget?.currency as Currency) || 'MAD'
  );
  const [budgetBand, setBudgetBand] = useState<BudgetBandKey | ''>(
    (data.budget?.budgetBand as BudgetBandKey) || ''
  );

  const isValid = currency && budgetBand;

  const handleNext = () => {
    if (isValid && budgetBand) {
      // Get MAD values for the selected budget band
      const madValues = getBudgetBandMADValues(budgetBand);

      onSave('budget', {
        currency,
        budgetBand,
        // Store normalized MAD values for filtering
        budgetMinMAD: madValues.min,
        budgetMaxMAD: madValues.max
      });
    }
  };

  const handleSkip = () => {
    onSave('budget', {
      currency: 'MAD',
      budgetBand: 'unsure',
      budgetMinMAD: null,
      budgetMaxMAD: null
    }, true);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">💰</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#11190C] text-center mb-3">
          {t('budget.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-[#787664] text-center mb-8">
          {t('budget.subtitle')}
        </p>

        {/* Currency Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#11190C] mb-3">
            {t('budget.currency')}
          </label>
          <div className="flex gap-2">
            {CURRENCIES.map((curr) => (
              <button
                key={curr.value}
                onClick={() => setCurrency(curr.value)}
                className={`flex-1 py-3 px-4 border-2 rounded-lg font-medium transition-all ${currency === curr.value
                    ? 'border-[#D9FF0A] bg-[#D9FF0A]/10 text-[#11190C]'
                    : 'border-gray-200 hover:border-gray-300 text-[#787664]'
                  }`}
              >
                {curr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Bands */}
        <div className="space-y-3 mb-8">
          {(Object.keys(BUDGET_BANDS) as BudgetBandKey[]).map((key) => {
            const isSelected = budgetBand === key;
            const displayLabel = getBudgetBandLabel(key, currency);

            return (
              <label key={key} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#D9FF0A] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="budgetBand"
                  value={key}
                  checked={isSelected}
                  onChange={(e) => setBudgetBand(key)}
                  className="w-4 h-4 text-[#D9FF0A] focus:ring-[#D9FF0A]"
                />
                <span className={`ml-3 font-medium ${isSelected ? 'text-[#11190C]' : 'text-[#787664]'}`}>
                  {displayLabel}
                </span>
              </label>
            );
          })}
        </div>

        {/* Note about conversion */}
        {currency !== 'MAD' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              💡 Budget ranges are displayed in {currency} but will be stored in MAD for accurate vendor matching.
            </p>
          </div>
        )}

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
