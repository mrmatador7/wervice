'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Minus, Plus } from 'lucide-react';
import { inputStyles } from '../utils/classes';
import type { OnboardingData } from '../schemas/onboarding.schemas';

interface StepGuestsProps {
  data: OnboardingData;
  currentStepData: any;
  onContinue: (data: any) => Promise<boolean>;
  onSkip: () => void;
  isSaving: boolean;
}

export function StepGuests({ data, currentStepData, onContinue, isSaving }: StepGuestsProps) {
  const [guestCount, setGuestCount] = useState(currentStepData?.count || 50);

  const handleContinue = async () => {
    await onContinue({ count: guestCount });
  };

  const increment = () => {
    if (guestCount < 800) {
      setGuestCount((prev: number) => prev + 10);
    }
  };

  const decrement = () => {
    if (guestCount > 20) {
      setGuestCount((prev: number) => Math.max(20, prev - 10));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 20 && value <= 800) {
      setGuestCount(value);
    }
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
      {/* Guest Counter */}
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-wervice-lime rounded-full flex items-center justify-center mx-auto">
          <Users className="w-8 h-8 text-wervice-ink" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-wervice-ink">
            How many guests are you expecting?
          </h3>
          <p className="text-wervice-taupe max-w-md mx-auto">
            This helps us recommend venues and caterers that can accommodate your group size.
          </p>
        </div>

        {/* Counter Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={decrement}
            disabled={guestCount <= 20}
            className="w-12 h-12 bg-wv-gray2 hover:bg-wv-gray3 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
          >
            <Minus className="w-5 h-5 text-wervice-taupe" />
          </button>

          <div className="text-center">
            <div className="text-4xl font-bold text-wervice-ink mb-2">
              {guestCount}
            </div>
            <div className="text-sm text-wervice-taupe">guests</div>
          </div>

          <button
            type="button"
            onClick={increment}
            disabled={guestCount >= 800}
            className="w-12 h-12 bg-wv-gray2 hover:bg-wv-gray3 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5 text-wervice-taupe" />
          </button>
        </div>

        {/* Manual Input */}
        <div className="max-w-xs mx-auto">
          <label className="text-sm font-medium text-wervice-ink block mb-2">
            Or enter exact number
          </label>
          <input
            type="number"
            value={guestCount}
            onChange={handleInputChange}
            min={20}
            max={800}
            className={inputStyles.base}
          />
        </div>

        {/* Size Categories */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-sm">
          <div className={`p-3 rounded-lg border transition-colors ${
            guestCount <= 100
              ? 'bg-wervice-lime/10 border-wervice-lime text-wervice-ink'
              : 'border-wv-gray3 text-wervice-taupe'
          }`}>
            <div className="font-medium">Intimate</div>
            <div className="text-xs">20-100 guests</div>
          </div>
          <div className={`p-3 rounded-lg border transition-colors ${
            guestCount > 100 && guestCount <= 300
              ? 'bg-wervice-lime/10 border-wervice-lime text-wervice-ink'
              : 'border-wv-gray3 text-wervice-taupe'
          }`}>
            <div className="font-medium">Medium</div>
            <div className="text-xs">100-300 guests</div>
          </div>
          <div className={`p-3 rounded-lg border transition-colors ${
            guestCount > 300
              ? 'bg-wervice-lime/10 border-wervice-lime text-wervice-ink'
              : 'border-wv-gray3 text-wervice-taupe'
          }`}>
            <div className="font-medium">Large</div>
            <div className="text-xs">300+ guests</div>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
