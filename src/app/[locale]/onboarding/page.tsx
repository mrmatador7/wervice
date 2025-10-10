'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSaveStep } from '@/hooks/useSaveStep';
import OnboardingShell from './components/OnboardingShell';
import StepWelcome from './components/StepWelcome';
import StepNames from './components/StepNames';
import StepLocation from './components/StepLocation';
import StepStyle from './components/StepStyle';
import StepDate from './components/StepDate';
import StepGuests from './components/StepGuests';
import StepServices from './components/StepServices';
import StepBudgetCurrency from './components/StepBudgetCurrency';
import StepPreferences from './components/StepPreferences';
import StepFinish from './components/StepFinish';

export interface OnboardingData {
  // Step 1: Welcome
  welcome?: { started: boolean };

  // Step 2: Names + Stage
  user?: {
    firstName: string;
    partnerFirstName?: string;
    phone?: string;
    relationshipStage?: 'engaged' | 'soon' | 'celebration';
  };

  // Step 3: Location
  location?: {
    city: string;
    setting?: 'luxury' | 'outdoor' | 'beachfront' | 'traditional' | 'private';
  };

  // Step 4: Style
  style?: string[];

  // Step 5: Date
  timeline?: {
    dateType: 'picked' | 'monthYear' | 'unsure';
    weddingDate?: string;
    month?: number;
    year?: number;
  };

  // Step 6: Guests
  guests?: {
    guestCount: '0-50' | '51-100' | '101-200' | '200+' | 'unsure';
  };

  // Step 7: Services
  services?: string[];

  // Step 8: Budget + Currency
  budget?: {
    currency: 'MAD' | 'EUR' | 'USD';
    budgetBand: string;
    budgetMinMAD?: number;
    budgetMaxMAD?: number;
  };

  // Step 9: Preferences
  preferences?: {
    contactPreference: 'vendors_can_contact' | 'browse_quietly' | 'helping_friend';
  };

  // Step 10: Finish
  finish?: { completed: boolean };
}

const STEPS = [
  'welcome',
  'user',      // names + stage
  'location',
  'style',
  'timeline',  // date
  'guests',
  'services',
  'budget',
  'preferences',
  'finish'
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { locale } = useParams() as { locale: string };
  const t = useTranslations('onboarding');

  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Authentication is now handled by the auth guard
  useEffect(() => {
    console.log('✅ Onboarding: Page loaded, auth guard will handle authentication');
    setIsAuthChecking(false);
  }, []);

  // Use the save hook for the current step
  const { save, skip, loading: isSaving } = useSaveStep(currentStep + 1);

  // Load existing onboarding data on mount
  useEffect(() => {
    const loadExistingData = async () => {
      // Add a delay to allow session to fully establish
      await new Promise(resolve => setTimeout(resolve, 200));

      try {
        console.log('🔍 Loading onboarding data via API...');

        // Call the API to load onboarding data
        const response = await fetch('/api/onboarding/load', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to load onboarding data');
        }

        const { onboardingData, onboarded } = await response.json();

        console.log('✅ Onboarding data loaded via API:', { onboardingData, onboarded });

        if (onboardingData) {
          setOnboardingData(onboardingData);
          // Find the furthest completed step
          const steps = Object.keys(onboardingData);
          const lastStepIndex = STEPS.findIndex(step => !steps.includes(step)) - 1;
          if (lastStepIndex >= 0) {
            setCurrentStep(Math.max(0, lastStepIndex));
          }
        } else {
          // No onboarding data yet, start with empty data
          console.log('ℹ️ No onboarding data found, starting fresh');
          setOnboardingData({});
        }
      } catch (error) {
        console.error('💥 Error loading onboarding data via API:', error);
        // Don't redirect on unexpected errors, just log them
      }
    };

    // Only load data if we're not still checking authentication
    if (!isAuthChecking) {
      loadExistingData();
    }
  }, [locale, isAuthChecking]);

  const handleStepSave = async (step: string, data: any, shouldSkip: boolean = false) => {
    const success = shouldSkip ? await skip() : await save(data);

    if (success) {
      // Update local state
      setOnboardingData(prev => ({
        ...prev,
        [step]: data
      }));

      if (step === 'finish') {
        // Complete onboarding - save with markComplete flag
        const completeSuccess = await save(data, { complete: true });
        if (completeSuccess) {
          // Redirect to home - auth guard will handle proper routing
          router.replace(`/${locale}`);
        }
      } else {
        // Move to next step
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
      }
    }
  };


  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const renderCurrentStep = () => {
    const step = STEPS[currentStep];
    const commonProps = {
      data: onboardingData,
      onSave: handleStepSave,
      onBack: handleBack,
      isSaving,
    };

    switch (step) {
      case 'welcome':
        return <StepWelcome {...commonProps} />;
      case 'user':
        return <StepNames {...commonProps} />;
      case 'location':
        return <StepLocation {...commonProps} />;
      case 'style':
        return <StepStyle {...commonProps} />;
      case 'timeline':
        return <StepDate {...commonProps} />;
      case 'guests':
        return <StepGuests {...commonProps} />;
      case 'services':
        return <StepServices {...commonProps} />;
      case 'budget':
        return <StepBudgetCurrency {...commonProps} />;
      case 'preferences':
        return <StepPreferences {...commonProps} />;
      case 'finish':
        return <StepFinish {...commonProps} />;
      default:
        return <StepWelcome {...commonProps} />;
    }
  };

  // Show loading while checking authentication
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#F6F5F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-[#787664]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingShell
      currentStep={currentStep}
      totalSteps={STEPS.length}
      onBack={currentStep > 0 ? handleBack : undefined}
    >
      {renderCurrentStep()}
    </OnboardingShell>
  );
}
