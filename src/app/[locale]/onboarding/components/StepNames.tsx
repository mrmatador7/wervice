'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { OnboardingData } from '@/app/[locale]/onboarding/page';

interface StepNamesProps {
  data: OnboardingData;
  onSave: (step: string, data: any, skip?: boolean) => void;
  onBack?: () => void;
  isSaving: boolean;
}

export default function StepNames({ data, onSave, isSaving }: StepNamesProps) {
  const t = useTranslations('onboarding');
  const [firstName, setFirstName] = useState(data.user?.firstName || '');
  const [partnerFirstName, setPartnerFirstName] = useState(data.user?.partnerFirstName || '');
  const [phone, setPhone] = useState(data.user?.phone || '');
  const [relationshipStage, setRelationshipStage] = useState<'engaged' | 'soon' | 'celebration'>(
    data.user?.relationshipStage || 'engaged'
  );

  const isValid = firstName.trim().length > 0 && phone.trim().length > 0;

  const handleNext = () => {
    if (isValid) {
      onSave('names', {
        firstName: firstName.trim(),
        partnerFirstName: partnerFirstName.trim() || undefined,
        phone: phone.trim(),
        relationshipStage
      });
    }
  };

  const handleSkip = () => {
    onSave('names', {
      skipped: true,
      relationshipStage: 'exploring' // Default for skipped
    }, true);
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
          {t('names.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-[#787664] text-center mb-8">
          {t('names.subtitle')}
        </p>

        {/* Form */}
        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-[#11190C] mb-2">
              {t('names.yourName')} *
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9FF0A] focus:border-transparent"
              placeholder="John"
            />
          </div>

          {/* Partner First Name */}
          <div>
            <label htmlFor="partnerFirstName" className="block text-sm font-medium text-[#11190C] mb-2">
              {t('names.partnerName')}
            </label>
            <input
              id="partnerFirstName"
              type="text"
              value={partnerFirstName}
              onChange={(e) => setPartnerFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9FF0A] focus:border-transparent"
              placeholder="Jane"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#11190C] mb-2">
              {t('names.phone')} *
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9FF0A] focus:border-transparent"
              placeholder="+212 6XX XXX XXX"
            />
          </div>

          {/* Relationship Stage */}
          <div>
            <label className="block text-sm font-medium text-[#11190C] mb-3">
              {t('names.relationshipStage')}
            </label>
            <div className="space-y-2">
              {[
                { value: 'engaged', label: t('names.engaged') },
                { value: 'soon', label: t('names.soon') },
                { value: 'celebration', label: t('names.celebration') }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="relationshipStage"
                    value={option.value}
                    checked={relationshipStage === option.value}
                    onChange={(e) => setRelationshipStage(e.target.value as any)}
                    className="w-4 h-4 text-[#D9FF0A] focus:ring-[#D9FF0A]"
                  />
                  <span className="ml-3 text-[#11190C]">{option.label}</span>
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
              {isSaving ? t('common.saving') : t('names.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
