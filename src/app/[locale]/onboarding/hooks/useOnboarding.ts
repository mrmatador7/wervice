'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOnboarding, saveStep, completeOnboarding, type StepKey } from '../actions/onboarding.actions';
import { stepNavigation } from '../utils/classes';
import type { OnboardingData } from '../schemas/onboarding.schemas';

interface UseOnboardingReturn {
  // Data
  data: OnboardingData;
  currentStep: number;
  isLoading: boolean;
  isSaving: boolean;

  // Actions
  goToStep: (step: number) => void;
  saveCurrentStep: (stepData: any) => Promise<boolean>;
  skipCurrentStep: () => void;
  completeOnboarding: () => Promise<boolean>;

  // Computed
  currentStepData: any;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export function useOnboarding(uid: string): UseOnboardingReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get('step') || '1');

  const [data, setData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const result = await getOnboarding(uid);
        if (result.ok && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (uid) {
      loadData();
    }
  }, [uid]);

  // Navigation
  const goToStep = (step: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('step', step.toString());
    router.push(`?${params.toString()}`);
  };

  // Save current step
  const saveCurrentStep = async (stepData: any): Promise<boolean> => {
    setIsSaving(true);
    try {
      const stepKey = getStepKey(currentStep);
      const result = await saveStep(uid, stepKey, stepData);

      if (result.ok && result.data) {
        setData(result.data);

        // Auto-advance to next step (unless it's the last step)
        if (!stepNavigation.isLastStep(currentStep)) {
          goToStep(stepNavigation.getNextStep(currentStep));
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving step:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Skip current step
  const skipCurrentStep = () => {
    if (!stepNavigation.isLastStep(currentStep)) {
      goToStep(stepNavigation.getNextStep(currentStep));
    }
  };

  // Complete onboarding
  const completeOnboardingAction = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const result = await completeOnboarding(uid);
      if (result.ok) {
        router.replace('/dashboard');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Computed values
  const currentStepData = getStepData(currentStep, data);
  const isFirstStep = stepNavigation.isFirstStep(currentStep);
  const isLastStep = stepNavigation.isLastStep(currentStep);
  const canGoNext = !isLastStep;
  const canGoPrev = !isFirstStep;

  return {
    data,
    currentStep,
    isLoading,
    isSaving,
    goToStep,
    saveCurrentStep,
    skipCurrentStep,
    completeOnboarding: completeOnboardingAction,
    currentStepData,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrev,
  };
}

// Helper functions
function getStepKey(step: number): StepKey {
  const stepKeys: Record<number, StepKey> = {
    1: 'welcome',
    2: 'basicInfo',
    3: 'city',
    4: 'date',
    5: 'guests',
    6: 'budgetCurrency',
    7: 'stylePriorities',
    8: 'servicesNeeded',
    9: 'suggestions',
    10: 'summary',
  };
  return stepKeys[step] || 'welcome';
}

function getStepData(step: number, data: OnboardingData): any {
  const stepKey = getStepKey(step);
  return data[stepKey] || null;
}
