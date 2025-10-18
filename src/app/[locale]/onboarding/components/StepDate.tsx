'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { inputStyles } from '../utils/classes';
import type { OnboardingData } from '../schemas/onboarding.schemas';

interface StepDateProps {
  data: OnboardingData;
  currentStepData: any;
  onContinue: (data: any) => Promise<boolean>;
  onSkip: () => void;
  isSaving: boolean;
}

export function StepDate({ data, currentStepData, onContinue, isSaving }: StepDateProps) {
  const [selectedDate, setSelectedDate] = useState(currentStepData?.date || '');

  const handleContinue = async () => {
    if (!selectedDate) return;
    await onContinue({ date: selectedDate });
  };

  // Calculate minimum date (today + 30 days for planning)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 30);
  const minDateString = minDate.toISOString().split('T')[0];

  // Calculate maximum date (2 years from now)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const maxDateString = maxDate.toISOString().split('T')[0];

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
      {/* Date Picker */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-wervice-lime rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-wervice-ink" />
          </div>
          <h3 className="text-xl font-semibold text-wervice-ink">
            When is your wedding day?
          </h3>
          <p className="text-wervice-taupe max-w-md mx-auto">
            Select your wedding date to help us find available vendors and provide accurate recommendations.
          </p>
        </div>

        <div className="max-w-sm mx-auto space-y-4">
          <div>
            <label className="text-sm font-medium text-wervice-ink block mb-2">
              Wedding Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDateString}
              max={maxDateString}
              className={inputStyles.base}
              required
            />
            <p className="text-xs text-wervice-taupe mt-2">
              We recommend planning at least 6-12 months in advance for the best vendor availability.
            </p>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
