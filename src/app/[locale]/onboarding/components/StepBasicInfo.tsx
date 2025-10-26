'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Heart, Briefcase } from 'lucide-react';
import { inputStyles } from '../utils/classes';
import type { OnboardingData, OnboardingIntent } from '../schemas/onboarding.schemas';

interface StepBasicInfoProps {
  data: OnboardingData;
  currentStepData: any;
  onContinue: (data: any) => Promise<boolean>;
  onSkip: () => void;
  isSaving: boolean;
}

const INTENT_OPTIONS = [
  {
    id: 'planning' as OnboardingIntent,
    label: 'Actively Planning',
    description: 'I have a date and I\'m ready to book vendors',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'exploring' as OnboardingIntent,
    label: 'Just Exploring',
    description: 'Browsing for inspiration and ideas',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'vendor' as OnboardingIntent,
    label: 'I\'m a Vendor',
    description: 'Wedding professional looking to connect',
    icon: Briefcase,
    color: 'from-purple-500 to-indigo-500',
  },
];

export function StepBasicInfo({ data, currentStepData, onContinue, isSaving }: StepBasicInfoProps) {
  const [partnerName, setPartnerName] = useState(currentStepData?.partnerName || '');
  const [intent, setIntent] = useState<OnboardingIntent>(currentStepData?.intent || 'planning');

  const handleContinue = async () => {
    const data = {
      partnerName: partnerName.trim() || undefined,
      intent,
    };
    await onContinue(data);
  };

  return (
    <motion.form
      id="step-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleContinue();
      }}
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Partner Name */}
      <div className="space-y-3">
        <label className="block">
          <span className="text-sm font-semibold text-wervice-ink flex items-center gap-2">
            <User className="w-4 h-4" />
            Partner's Name
            <span className="text-xs font-normal text-wervice-taupe">(Optional)</span>
          </span>
          <p className="text-sm text-wervice-taupe mt-1.5 mb-3">
            Add your partner's name to make it extra special
          </p>
          <input
            type="text"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="e.g., Sarah"
            className="mt-2 w-full px-4 py-3 border border-wv-gray3 rounded-xl focus:ring-2 focus:ring-wervice-lime focus:border-transparent transition-all outline-none text-base"
          />
        </label>
      </div>

      {/* Planning Intent */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-wervice-ink mb-1">
            Where are you in your journey?
          </h3>
          <p className="text-sm text-wervice-taupe">
            This helps us personalize your experience
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {INTENT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = intent === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setIntent(option.id)}
                className={`group p-5 border-2 rounded-xl text-left transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-600 shadow-md'
                    : 'border-wv-gray2 bg-white hover:border-indigo-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected 
                      ? `bg-gradient-to-br ${option.color} text-white shadow-lg` 
                      : 'bg-wv-gray1 text-wervice-taupe group-hover:bg-wv-gray2'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h4 className={`font-semibold mb-1.5 ${isSelected ? 'text-indigo-900' : 'text-wervice-ink'}`}>
                      {option.label}
                    </h4>
                    <p className={`text-sm leading-relaxed ${
                      isSelected ? 'text-indigo-700' : 'text-wervice-taupe'
                    }`}>
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">✓</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.form>
  );
}
