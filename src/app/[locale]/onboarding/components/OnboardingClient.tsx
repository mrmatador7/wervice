'use client';

import { useOnboarding } from '../hooks/useOnboarding';
import { ProgressBar } from './ProgressBar';
import { StepShell } from './StepShell';
import { Stepper } from './Stepper';
import { StepWelcome } from './StepWelcome';
import { StepBasicInfo } from './StepBasicInfo';
import { StepCity } from './StepCity';
import { StepDate } from './StepDate';
import { StepGuests } from './StepGuests';
import { StepBudgetCurrency } from './StepBudgetCurrency';
import StepStylePriorities from './StepStylePriorities';
import { StepServicesNeeded } from './StepServicesNeeded';
import { StepSuggestions } from './StepSuggestions';
import { StepSummary } from './StepSummary';
import type { OnboardingData } from '../schemas/onboarding.schemas';

interface OnboardingClientProps {
  uid: string;
  initialData?: OnboardingData & { onboarded: boolean };
}

export default function OnboardingClient({ uid, initialData }: OnboardingClientProps) {
  const {
    data,
    currentStep,
    isLoading,
    isSaving,
    goToStep,
    saveCurrentStep,
    skipCurrentStep,
    completeOnboarding,
    currentStepData,
    isFirstStep,
    isLastStep,
    canGoPrev,
  } = useOnboarding(uid);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wv-gray1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-wervice-lime rounded-full flex items-center justify-center mx-auto animate-pulse">
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-wervice-taupe">Loading your personalized experience...</p>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    const stepProps = {
      data,
      currentStepData,
      onContinue: saveCurrentStep,
      onSkip: skipCurrentStep,
      isSaving,
    };

    switch (currentStep) {
      case 1:
        return <StepWelcome {...stepProps} />;
      case 2:
        return <StepBasicInfo {...stepProps} />;
      case 3:
        return <StepCity {...stepProps} />;
      case 4:
        return <StepDate {...stepProps} />;
      case 5:
        return <StepGuests {...stepProps} />;
      case 6:
        return <StepBudgetCurrency {...stepProps} />;
      case 7:
        return <StepStylePriorities {...stepProps} />;
      case 8:
        return <StepServicesNeeded {...stepProps} />;
      case 9:
        return <StepSuggestions {...stepProps} />;
      case 10:
        return <StepSummary {...stepProps} onComplete={completeOnboarding} />;
      default:
        return <StepWelcome {...stepProps} />;
    }
  };

  const handleBack = () => {
    if (canGoPrev) {
      goToStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (!isLastStep) {
      skipCurrentStep();
    }
  };

  return (
    <div className="min-h-screen bg-wv-gray1">
      <ProgressBar currentStep={currentStep} />

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
          <div className="p-8">
            <Stepper currentStep={currentStep} orientation="vertical" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Stepper */}
          <div className="lg:hidden bg-white border-b border-wv-gray3">
            <div className="px-6 py-4">
              <Stepper currentStep={currentStep} orientation="horizontal" />
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <StepShell
                title={getStepTitle(currentStep)}
                subtitle={getStepSubtitle(currentStep)}
                onBack={canGoPrev ? handleBack : undefined}
                onSkip={!isLastStep ? handleSkip : undefined}
                isSaving={isSaving}
                showFooter={!isLastStep}
              >
                {renderCurrentStep()}
              </StepShell>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getStepTitle(step: number): string {
  const titles = {
    1: 'Welcome to Wervice',
    2: 'Tell us about yourself',
    3: 'Where will your wedding be?',
    4: 'When is the big day?',
    5: 'How many guests?',
    6: 'What\'s your budget?',
    7: 'What\'s your wedding vision?',
    8: 'What services do you need?',
    9: 'Personalized suggestions',
    10: 'Ready to start planning?',
  };
  return titles[step as keyof typeof titles] || 'Welcome';
}

function getStepSubtitle(step: number): string {
  const subtitles = {
    1: 'Let\'s create your perfect wedding experience',
    2: 'Help us personalize your recommendations',
    3: 'Choose your wedding city for local vendor access',
    4: 'Select your wedding date',
    5: 'Estimate the number of guests attending',
    6: 'Set your budget to see relevant options',
    7: 'Tell us about your style preferences',
    8: 'Select the services you\'ll need',
    9: 'Discover vendors that match your vision',
    10: 'Review your preferences and get started',
  };
  return subtitles[step as keyof typeof subtitles] || '';
}
