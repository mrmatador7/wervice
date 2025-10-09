'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { OnboardingData } from '@/app/[locale]/onboarding/page';

interface StepDateProps {
  data: OnboardingData;
  onSave: (step: string, data: any, skip?: boolean) => void;
  onBack?: () => void;
  isSaving: boolean;
}

export default function StepDate({ data, onSave, isSaving }: StepDateProps) {
  const t = useTranslations('onboarding');
  const [dateType, setDateType] = useState<'picked' | 'monthYear' | 'unsure'>(
    data.timeline?.dateType || 'unsure'
  );
  const [weddingDate, setWeddingDate] = useState(data.timeline?.weddingDate || '');
  const [month, setMonth] = useState(data.timeline?.month || new Date().getMonth() + 1);
  const [year, setYear] = useState(data.timeline?.year || new Date().getFullYear() + 1);

  const isValid =
    dateType === 'unsure' ||
    (dateType === 'picked' && weddingDate) ||
    (dateType === 'monthYear' && month && year);

  const handleNext = () => {
    if (isValid) {
      const timelineData: any = { dateType };

      if (dateType === 'picked' && weddingDate) {
        timelineData.weddingDate = weddingDate;
      } else if (dateType === 'monthYear') {
        timelineData.month = month;
        timelineData.year = year;
      }

      onSave('date', timelineData);
    }
  };

  const handleSkip = () => {
    onSave('date', { dateType: 'unsure' }, true);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">📅</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#11190C] text-center mb-3">
          {t('date.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-[#787664] text-center mb-8">
          {t('date.subtitle')}
        </p>

        {/* Date Type Selection */}
        <div className="space-y-4 mb-8">
          {/* Picked Date */}
          <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#D9FF0A] cursor-pointer">
            <input
              type="radio"
              name="dateType"
              value="picked"
              checked={dateType === 'picked'}
              onChange={(e) => setDateType(e.target.value as any)}
              className="w-4 h-4 text-[#D9FF0A] focus:ring-[#D9FF0A]"
            />
            <div className="ml-4 flex-1">
              <div className="font-medium text-[#11190C]">{t('date.picked')}</div>
              {dateType === 'picked' && (
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#D9FF0A] focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              )}
            </div>
          </label>

          {/* Month and Year */}
          <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#D9FF0A] cursor-pointer">
            <input
              type="radio"
              name="dateType"
              value="monthYear"
              checked={dateType === 'monthYear'}
              onChange={(e) => setDateType(e.target.value as any)}
              className="w-4 h-4 text-[#D9FF0A] focus:ring-[#D9FF0A]"
            />
            <div className="ml-4 flex-1">
              <div className="font-medium text-[#11190C]">{t('date.monthYear')}</div>
              {dateType === 'monthYear' && (
                <div className="flex gap-3 mt-2">
                  <select
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#D9FF0A] focus:border-transparent"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#D9FF0A] focus:border-transparent"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const y = new Date().getFullYear() + i;
                      return (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>
          </label>

          {/* Not sure */}
          <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#D9FF0A] cursor-pointer">
            <input
              type="radio"
              name="dateType"
              value="unsure"
              checked={dateType === 'unsure'}
              onChange={(e) => setDateType(e.target.value as any)}
              className="w-4 h-4 text-[#D9FF0A] focus:ring-[#D9FF0A]"
            />
            <span className="ml-4 font-medium text-[#11190C]">{t('date.unsure')}</span>
          </label>
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
