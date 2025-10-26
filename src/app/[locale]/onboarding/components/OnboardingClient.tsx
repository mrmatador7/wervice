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
import Image from 'next/image';
import Link from 'next/link';

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
      <div className="min-h-screen bg-gradient-to-br from-wervice-shell to-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-wervice-lime/20 rounded-full flex items-center justify-center mx-auto">
              <div className="w-16 h-16 bg-wervice-lime rounded-full flex items-center justify-center animate-pulse">
                <span className="text-3xl">💐</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-wervice-ink mb-2">Setting up your experience...</h3>
            <p className="text-wervice-taupe">This will only take a moment</p>
          </div>
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
        return <StepSummary {...stepProps} onComplete={async () => {
          await completeOnboarding();
          // Redirect to homepage after completion
          const locale = window.location.pathname.split('/')[1];
          window.location.href = `/${locale}`;
          return true;
        }} />;
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
    <div className="min-h-screen bg-white">
      {/* Header with Logo & Progress */}
      <header className="relative sticky top-0 z-50 border-b border-gray-200 overflow-hidden">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-wervice-lime via-lime-300 to-yellow-200">
          {/* Animated Blobs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-wervice-lime rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-lime-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Content */}
        <div className="relative backdrop-blur-sm bg-white/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/wervice-logo-black.png"
                  alt="Wervice"
                  width={120}
                  height={36}
                  className="h-9 w-auto"
                />
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-wervice-ink font-medium">
                  <span className="font-semibold">Step {currentStep}</span>
                  <span>/</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-wv-gray2 overflow-hidden">
          {/* Step Indicator */}
          <div className="bg-gradient-to-r from-wervice-lime/10 to-transparent px-6 lg:px-8 py-4 border-b border-wv-gray2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-wervice-lime rounded-full flex items-center justify-center text-wervice-ink font-bold">
                {currentStep}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-wervice-taupe uppercase tracking-wide font-medium">
                  {getStepCategory(currentStep)}
                </p>
                <h2 className="text-lg font-semibold text-wervice-ink truncate">
                  {getStepTitle(currentStep)}
                </h2>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6 lg:p-10">
            <StepShell
              title={getStepTitle(currentStep)}
              subtitle={getStepSubtitle(currentStep)}
              onBack={canGoPrev ? handleBack : undefined}
              onSkip={!isLastStep ? handleSkip : undefined}
              isSaving={isSaving}
              showFooter={true}
              buttonText={isLastStep ? 'Explore' : 'Continue'}
            >
              {renderCurrentStep()}
            </StepShell>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-wervice-taupe">
            Need help? {' '}
            <a href="/contact" className="text-wervice-ink hover:underline font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

// Helper functions
function getStepCategory(step: number): string {
  const categories = {
    1: 'Getting Started',
    2: 'Personal Info',
    3: 'Location',
    4: 'Timeline',
    5: 'Guest List',
    6: 'Budget',
    7: 'Style & Vision',
    8: 'Services',
    9: 'Recommendations',
    10: 'Finalize',
  };
  return categories[step as keyof typeof categories] || 'Step';
}

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
    1: 'Let\'s create your perfect wedding experience in just a few steps',
    2: 'Help us personalize your journey and recommendations',
    3: 'Choose your wedding city to discover local vendors',
    4: 'Pick your date so we can check vendor availability',
    5: 'This helps us recommend the perfect venue size',
    6: 'We\'ll show you options that fit your budget',
    7: 'Share your vision so we can match you with the right style',
    8: 'Let us know what you need help with',
    9: 'Discover vendors hand-picked for you',
    10: 'Review everything and begin your wedding journey',
  };
  return subtitles[step as keyof typeof subtitles] || '';
}
