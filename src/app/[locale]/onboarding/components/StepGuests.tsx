'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import type { OnboardingData } from '../schemas/onboarding.schemas';

interface StepGuestsProps {
  data: OnboardingData;
  currentStepData: any;
  onContinue: (data: any) => Promise<boolean>;
  onSkip: () => void;
  isSaving: boolean;
}

const GUEST_RANGES = [
  { min: 50, max: 150, label: '50-150' },
  { min: 151, max: 500, label: '151-500' },
  { min: 501, max: 1000, label: '501-1000' },
  { min: 1001, max: 10000, label: '1000+' },
];

export function StepGuests({ data, currentStepData, onContinue, isSaving }: StepGuestsProps) {
  const [selectedRange, setSelectedRange] = useState(() => {
    const count = currentStepData?.count || 100;
    const range = GUEST_RANGES.find(r => count >= r.min && count <= r.max);
    return range || GUEST_RANGES[0];
  });

  const handleContinue = async () => {
    // Use the middle of the range as the count
    // For 1000+, use 1500 instead of the midpoint of 1001-10000
    let count;
    if (selectedRange.label === '1000+') {
      count = 1500;
    } else {
      count = Math.floor((selectedRange.min + selectedRange.max) / 2);
    }
    await onContinue({ count });
  };

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
        <Users className="w-8 h-8 text-wervice-ink" />
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-wervice-ink">
          How many guests are you expecting?
        </h3>
        <p className="text-gray-500">
          Select your approximate guest count
        </p>
      </div>

      {/* Slider */}
      <div className="space-y-6">
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-4">
            {GUEST_RANGES.map((range, index) => (
              <span 
                key={range.label}
                className={`text-xs font-medium ${
                  selectedRange.label === range.label ? 'text-wervice-ink' : 'text-gray-400'
                }`}
              >
                {range.label}
              </span>
            ))}
          </div>
          
          {/* Custom Slider */}
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div 
              className="absolute h-full bg-gradient-to-r from-wervice-lime to-lime-500 rounded-full transition-all duration-300"
              style={{ 
                width: `${(GUEST_RANGES.findIndex(r => r.label === selectedRange.label) / (GUEST_RANGES.length - 1)) * 100}%` 
              }}
            />
            <input
              type="range"
              min="0"
              max={GUEST_RANGES.length - 1}
              value={GUEST_RANGES.findIndex(r => r.label === selectedRange.label)}
              onChange={(e) => setSelectedRange(GUEST_RANGES[parseInt(e.target.value)])}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            {/* Slider thumb */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-4 border-wervice-lime transition-all duration-300 pointer-events-none"
              style={{ 
                left: `calc(${(GUEST_RANGES.findIndex(r => r.label === selectedRange.label) / (GUEST_RANGES.length - 1)) * 100}% - 12px)` 
              }}
            />
          </div>
        </div>

        {/* Selected Info */}
        <div className="bg-gradient-to-r from-wv-gray1 to-white border border-wv-gray2 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-500 mb-2">Selected range</div>
          <div className="text-3xl font-bold text-wervice-ink">{selectedRange.label}</div>
          <div className="text-sm text-gray-500 mt-1">guests</div>
        </div>
      </div>
    </motion.form>
  );
}
