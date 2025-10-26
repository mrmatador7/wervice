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
      className="max-w-md mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-wervice-lime to-lime-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
        <Calendar className="w-8 h-8 text-wervice-ink" />
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-wervice-ink">
          When is your wedding day?
        </h3>
        <p className="text-gray-500">
          Select your wedding date to check vendor availability
        </p>
      </div>

      {/* Date Input */}
      <div className="space-y-4">
        {/* Date picker with visual calendar */}
        <div className="bg-gradient-to-br from-wv-gray1 to-white border-2 border-wv-gray2 rounded-2xl p-6 hover:border-wervice-lime transition-all">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Wedding Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wervice-lime pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDateString}
              max={maxDateString}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-wervice-lime focus:border-wervice-lime transition-all outline-none text-lg font-medium bg-white cursor-pointer"
              required
            />
          </div>
          
          {selectedDate && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">
                ✓ Date selected: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Planning tip */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">Planning Tip</h4>
              <p className="text-xs text-gray-600">
                We recommend booking at least 6-12 months in advance for the best vendor availability and prices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
