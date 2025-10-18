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

const BUDGET_RANGES = [
  { min: 1000, max: 50000, label: 'Intimate Celebration', description: 'Cozy gathering with essentials' },
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
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-wervice-lime rounded-full flex items-center justify-center mx-auto">
          <DollarSign className="w-8 h-8 text-wervice-ink" />
        </div>
        <h3 className="text-xl font-semibold text-wervice-ink">
          What's your wedding budget?
        </h3>
        <p className="text-wervice-taupe max-w-md mx-auto">
          This helps us recommend vendors within your price range and show realistic cost estimates.
        </p>
      </div>

      {/* Currency Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-wervice-ink">
          Currency
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CURRENCIES.map((curr) => (
            <button
              key={curr.value}
              type="button"
              onClick={() => setCurrency(curr.value)}
              className={`p-3 border rounded-lg text-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wervice-lime ${
                currency === curr.value
                  ? 'bg-wervice-lime text-wervice-ink border-transparent'
                  : 'border-wv-gray3 bg-white hover:border-wervice-lime/50 text-wervice-ink'
              }`}
            >
              <div className="font-medium text-sm">{curr.symbol}</div>
              <div className="text-xs text-wervice-taupe mt-1">{curr.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Budget Input */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-wervice-ink">
          Total Budget ({currency})
        </label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
          min={1000}
          step={1000}
          className={inputStyles.base}
        />
        <div className="text-sm text-wervice-taupe">
          Current budget: {formatCurrency(budget)}
        </div>
      </div>

      {/* Budget Ranges */}
      <div className="space-y-4">
        <h4 className="font-medium text-wervice-ink">Budget Categories</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUDGET_RANGES.map((range) => {
            const isInRange = budget >= range.min && budget <= range.max;
            return (
              <div
                key={range.label}
                className={`p-4 border rounded-lg transition-all ${
                  isInRange
                    ? 'bg-wervice-lime/5 border-wervice-lime'
                    : 'border-wv-gray3 bg-white'
                }`}
              >
                <h5 className="font-medium text-wervice-ink">{range.label}</h5>
                <p className="text-sm text-wervice-taupe mt-1">{range.description}</p>
                <p className="text-xs text-wervice-taupe mt-2">
                  {formatCurrency(range.min)} - {formatCurrency(range.max)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-wervice-lime" />
          <h4 className="font-medium text-wervice-ink">Estimated Breakdown</h4>
        </div>

        <div className="bg-wv-gray1 rounded-lg p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-wervice-taupe">Venue</span>
            <span className="font-medium text-wervice-ink">{formatCurrency(breakdown.venue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-wervice-taupe">Catering</span>
            <span className="font-medium text-wervice-ink">{formatCurrency(breakdown.catering)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-wervice-taupe">Photography</span>
            <span className="font-medium text-wervice-ink">{formatCurrency(breakdown.photography)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-wervice-taupe">Décor & Flowers</span>
            <span className="font-medium text-wervice-ink">{formatCurrency(breakdown.decor)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-wervice-taupe">Other Services</span>
            <span className="font-medium text-wervice-ink">{formatCurrency(breakdown.other)}</span>
          </div>
          <div className="border-t border-wv-gray3 pt-3 mt-4">
            <div className="flex justify-between font-semibold text-wervice-ink">
              <span>Total</span>
              <span>{formatCurrency(budget)}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-wervice-taupe">
          These are rough estimates. Actual costs may vary based on your location, preferences, and vendor choices.
        </p>
      </div>
    </motion.form>
  );
}
