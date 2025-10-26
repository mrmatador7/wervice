'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp } from 'lucide-react';
import { inputStyles } from '../utils/classes';
import type { OnboardingData, Currency } from '../schemas/onboarding.schemas';

interface StepBudgetCurrencyProps {
  data: OnboardingData;
  currentStepData: any;
  onContinue: (data: any) => Promise<boolean>;
  onSkip: () => void;
  isSaving: boolean;
}

const CURRENCIES: Array<{ value: Currency; label: string; symbol: string }> = [
  { value: 'MAD', label: 'Moroccan Dirham', symbol: 'MAD' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'USD', label: 'US Dollar', symbol: '$' },
];

// Exchange rates to MAD (Moroccan Dirham)
const EXCHANGE_RATES: Record<Currency, number> = {
  'MAD': 1,
  'USD': 10,  // 1 USD ≈ 10 MAD
  'EUR': 10,  // 1 EUR ≈ 10 MAD (same as USD)
};

// Budget ranges in MAD
const BUDGET_RANGES = [
  { min: 10000, max: 50000, label: 'Intimate Celebration', description: 'Cozy gathering with essentials' },
  { min: 50000, max: 150000, label: 'Standard Wedding', description: 'Complete wedding with all services' },
  { min: 150000, max: 300000, label: 'Luxury Affair', description: 'High-end experience with premium services' },
  { min: 300000, max: 1000000, label: 'Grand Celebration', description: 'Extravagant wedding with all luxuries' },
];

export function StepBudgetCurrency({ data, currentStepData, onContinue, isSaving }: StepBudgetCurrencyProps) {
  const [budget, setBudget] = useState(currentStepData?.budget || 100000);
  const [currency, setCurrency] = useState<Currency>(currentStepData?.currency || 'MAD');

  const handleContinue = async () => {
    await onContinue({ budget, currency });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBudgetBreakdown = () => {
    const breakdown = {
      venue: Math.round(budget * 0.3),
      catering: Math.round(budget * 0.25),
      photography: Math.round(budget * 0.15),
      decor: Math.round(budget * 0.15),
      other: Math.round(budget * 0.15),
    };
    return breakdown;
  };

  const breakdown = getBudgetBreakdown();

  // Convert budget to MAD for comparison
  const budgetInMAD = budget * EXCHANGE_RATES[currency];

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
        <DollarSign className="w-8 h-8 text-wervice-ink" />
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-wervice-ink">
          What's your wedding budget?
        </h3>
        <p className="text-gray-500">
          This helps us recommend vendors within your price range
        </p>
      </div>

      {/* Currency Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Currency
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CURRENCIES.map((curr) => (
            <button
              key={curr.value}
              type="button"
              onClick={() => setCurrency(curr.value)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${
                currency === curr.value
                  ? 'bg-gradient-to-br from-orange-50 to-white border-orange-500 shadow-md'
                  : 'border-gray-200 bg-white hover:border-orange-200'
              }`}
            >
              <div className="font-bold text-base">{curr.symbol}</div>
              <div className="text-xs text-gray-500 mt-1">{curr.value}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Budget Input */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Total Budget
        </label>
        <div className="relative">
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
            min={1000}
            step={1000}
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-wervice-lime focus:border-transparent transition-all outline-none text-base bg-white"
            placeholder="Enter amount"
          />
        </div>
        <div className="text-sm font-medium text-wervice-ink">
          {formatCurrency(budget)}
        </div>
      </div>

      {/* Budget Categories */}
      <div className="bg-gradient-to-r from-wv-gray1 to-white border border-wv-gray2 rounded-xl p-5 space-y-3">
        <h4 className="font-semibold text-gray-700 text-sm mb-1">Budget Category</h4>
        <p className="text-xs text-gray-500 mb-3">Based on typical Moroccan wedding costs</p>
        {BUDGET_RANGES.map((range) => {
          const isInRange = budgetInMAD >= range.min && budgetInMAD <= range.max;
          return (
            <div
              key={range.label}
              className={`p-3 rounded-lg border transition-all ${
                isInRange
                  ? 'bg-gradient-to-r from-orange-50 to-white border-2 border-orange-400 shadow-sm'
                  : 'border-gray-200 bg-white/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h5 className={`font-medium text-sm ${isInRange ? 'text-orange-600' : 'text-wervice-ink'}`}>
                    {range.label}
                  </h5>
                  <p className="text-xs text-gray-500 mt-0.5">{range.description}</p>
                </div>
                {isInRange && (
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.form>
  );
}
