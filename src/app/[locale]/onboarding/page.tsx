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
        console.log('🔍 Loading onboarding data...');

        // Auth guard ensures we have a session, get the user ID
        console.log('🔍 Onboarding: About to check session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        console.log('🔍 Onboarding: Session check for profile load:', {
          timestamp: new Date().toISOString(),
          hasSession: !!session,
          userId: userId,
          email: session?.user?.email,
          emailConfirmed: session?.user?.email_confirmed_at,
          sessionAccessToken: session?.access_token ? 'present' : 'missing',
          sessionRefreshToken: session?.refresh_token ? 'present' : 'missing',
          sessionError: sessionError?.message
        });

        if (!userId) {
          console.error('❌ Auth guard should have prevented this - no user ID available');
          return;
        }

        // Load onboarding data directly from Supabase
        console.log('🔍 Onboarding: Loading profile for user:', userId);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_data, onboarded')
          .eq('id', userId)
          .single();

        console.log('🔍 Onboarding: Profile query result:', {
          hasData: !!profile,
          error: error?.message,
          errorCode: error?.code
        });

        if (error && error.code === 'PGRST116') {
          // Profile doesn't exist yet, that's fine - start with empty data
          console.log('ℹ️ No profile found, starting with empty onboarding data');
          setOnboardingData({});
        } else if (error) {
          console.error('❌ Error loading profile:', error);
          // Don't redirect for database errors, just log them
        } else {
          console.log('✅ Onboarding data loaded:', profile);
          if (profile?.onboarding_data) {
            setOnboardingData(profile.onboarding_data);
            // Find the furthest completed step
            const steps = Object.keys(profile.onboarding_data);
            const lastStepIndex = STEPS.findIndex(step => !steps.includes(step)) - 1;
            if (lastStepIndex >= 0) {
              setCurrentStep(Math.max(0, lastStepIndex));
            }
          }
        }
      } catch (error) {
        console.error('💥 Error loading onboarding data:', error);
        // Don't redirect on unexpected errors, just log them
      }
    };

    // Only load data if we're not still checking authentication
    if (!isAuthChecking) {
      loadExistingData();
    }
  }, [locale, isAuthChecking, router, supabase]);

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
