'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSaveStep } from '@/hooks/useSaveStep';
import OnboardingShell from '@/components/onboarding/OnboardingShell';
import StepWelcome from '@/components/onboarding/StepWelcome';
import StepNames from '@/components/onboarding/StepNames';
import StepLocation from '@/components/onboarding/StepLocation';
import StepStyle from '@/components/onboarding/StepStyle';
import StepDate from '@/components/onboarding/StepDate';
import StepGuests from '@/components/onboarding/StepGuests';
import StepServices from '@/components/onboarding/StepServices';
import StepBudgetCurrency from '@/components/onboarding/StepBudgetCurrency';
import StepPreferences from '@/components/onboarding/StepPreferences';
import StepFinish from '@/components/onboarding/StepFinish';

export interface OnboardingData {
  // Step 1: Welcome (minimal data)
  welcome?: { started: boolean };

  // Step 2: Names
  user?: {
    firstName: string;
    partnerFirstName?: string;
    relationshipStage?: 'engaged' | 'soon' | 'celebration';
  };

  // Step 3: Location
  location?: {
    city: string;
    setting?: string;
  };

  // Step 4: Style
  style?: string[];

  // Step 5: Date/Timeline
  timeline?: {
    dateType: 'picked' | 'monthYear' | 'unsure';
    weddingDate?: string;
    month?: number;
    year?: number;
  };

  // Step 6: Guests
  guests?: {
    guestCount: string;
  };

  // Step 7: Services
  services?: string[];

  // Step 8: Budget & Currency
  budget?: {
    currency: string;
    budgetBand: string;
  };

  // Step 9: Preferences
  preferences?: {
    contactPreference: string;
  };
}

const STEPS = [
  'welcome',
  'names',
  'location',
  'style',
  'date',
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
  const supabase = createClientComponentClient();

  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    let isChecking = false;

    const checkAuth = async () => {
      if (isChecking) return; // Prevent multiple checks
      isChecking = true;

      try {
        console.log('🔍 Onboarding: Checking authentication...');
        const { data: { session }, error } = await supabase.auth.getSession();

        console.log('🔍 Onboarding: Auth check result:', {
          hasSession: !!session,
          userId: session?.user?.id,
          error: error?.message
        });

        if (!session) {
          console.log('❌ Onboarding: No session found, redirecting to signin');
          // Redirect to sign-in if not authenticated
          router.replace(`/${locale}/auth/signin`);
          return;
        }

        console.log('✅ Onboarding: User authenticated, proceeding');
      } catch (error) {
        console.error('💥 Onboarding: Auth check failed:', error);
        router.replace(`/${locale}/auth/signin`);
        return;
      } finally {
        setIsAuthChecking(false);
      }
    };

    // Check auth immediately since we're now using window.location.href for redirects
    checkAuth();
  }, [router, locale]);

  // Use the save hook for the current step
  const { save, skip, loading: isSaving } = useSaveStep(currentStep + 1);

  // Load existing onboarding data on mount
  useEffect(() => {
    const loadExistingData = async () => {
      // Add a delay to allow session to fully establish
      await new Promise(resolve => setTimeout(resolve, 200));

      try {
        console.log('🔍 Loading onboarding data...');
        const response = await fetch(`/${locale}/api/onboarding/load`, {
          method: 'GET',
        });

        console.log('🔍 Onboarding load response:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Onboarding data loaded:', data);
          if (data.onboardingData) {
            setOnboardingData(data.onboardingData);
            // Find the furthest completed step
            const steps = Object.keys(data.onboardingData);
            const lastStepIndex = STEPS.findIndex(step => !steps.includes(step)) - 1;
            if (lastStepIndex >= 0) {
              setCurrentStep(Math.max(0, lastStepIndex));
            }
          }
        } else if (response.status === 401) {
          console.log('❌ Onboarding API returned 401 - authentication failed, redirecting to signin');
          router.replace(`/${locale}/auth/signin`);
          return;
        } else {
          console.error('❌ Failed to load onboarding data:', response.status, response.statusText);
          // Don't redirect for other errors, just log them
        }
      } catch (error) {
        console.error('💥 Error loading onboarding data:', error);
        // Don't redirect on network errors, just log them
      }
    };

    // Only load data if we're not still checking authentication
    if (!isAuthChecking) {
      loadExistingData();
    }
  }, [locale, isAuthChecking, router]);

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
          // Redirect to account with welcome flag
          router.replace(`/${locale}/account?welcome=1`);
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
      case 'names':
        return <StepNames {...commonProps} />;
      case 'location':
        return <StepLocation {...commonProps} />;
      case 'style':
        return <StepStyle {...commonProps} />;
      case 'date':
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
