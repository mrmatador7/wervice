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
    label: 'Planning',
    description: 'Actively planning my wedding',
    icon: Heart,
  },
  {
    id: 'exploring' as OnboardingIntent,
    label: 'Exploring',
    description: 'Researching options and gathering ideas',
    icon: Users,
  },
  {
    id: 'vendor' as OnboardingIntent,
    label: 'Vendor',
    description: 'I\'m a wedding professional',
    icon: Briefcase,
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
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-wervice-ink">
            Partner's Name <span className="text-wervice-taupe">(Optional)</span>
          </label>
          <p className="text-sm text-wervice-taupe mt-1">
            If you have a partner, enter their name to personalize your experience
          </p>
        </div>

        <input
          type="text"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder="Enter your partner's name"
          className={inputStyles.base}
        />
      </div>

      {/* Planning Intent */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-wervice-ink">
            What's your current planning stage?
          </label>
          <p className="text-sm text-wervice-taupe mt-1">
            This helps us provide the most relevant recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {INTENT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = intent === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setIntent(option.id)}
                className={`p-4 border rounded-xl text-left transition-all hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wervice-lime ${
                  isSelected
                    ? 'bg-wervice-lime text-wervice-ink border-transparent shadow-soft'
                    : 'border-wv-gray3 bg-white hover:border-wervice-lime/50 text-wervice-ink'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-wervice-ink text-wervice-lime' : 'bg-wv-gray2 text-wervice-taupe'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{option.label}</h4>
                    <p className={`text-sm mt-1 ${
                      isSelected ? 'text-wervice-ink/80' : 'text-wervice-taupe'
                    }`}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.form>
  );
}
