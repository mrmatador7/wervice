import { Check, Circle } from 'lucide-react';
import { cn } from '../utils/classes';

interface StepperProps {
  currentStep: number;
  orientation: 'vertical' | 'horizontal';
}

const STEPS = [
  { id: 1, label: 'Welcome', description: 'Get started' },
  { id: 2, label: 'Basic Info', description: 'About you' },
  { id: 3, label: 'Wedding City', description: 'Location' },
  { id: 4, label: 'Wedding Date', description: 'Date & time' },
  { id: 5, label: 'Guest Count', description: 'Attendees' },
  { id: 6, label: 'Budget & Currency', description: 'Financial planning' },
  { id: 7, label: 'Style & Priorities', description: 'Your vision' },
  { id: 8, label: 'Services Needed', description: 'Requirements' },
  { id: 9, label: 'Personalized Suggestions', description: 'Recommendations' },
  { id: 10, label: 'Summary & Finish', description: 'Complete setup' },
];

export function Stepper({ currentStep, orientation }: StepperProps) {
  if (orientation === 'horizontal') {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-wervice-taupe">
            Step {currentStep} of {STEPS.length}
          </span>
          <div className="w-16 h-1 bg-wv-gray3 rounded-full overflow-hidden">
            <div
              className="h-full bg-wervice-lime transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <span className="text-sm font-medium text-wervice-ink">
          {STEPS[currentStep - 1]?.label}
        </span>
      </div>
    );
  }

  // Vertical stepper for desktop
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-wervice-ink mb-2">
          Plan Your Wedding
        </h2>
        <p className="text-wervice-taupe">
          We'll guide you through creating your perfect celebration
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-wervice-taupe">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-wervice-taupe">
            {Math.round((currentStep / STEPS.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-wv-gray3 rounded-full overflow-hidden">
          <div
            className="h-full bg-wervice-lime transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl transition-all duration-200',
                isCurrent
                  ? 'bg-wervice-lime/10 border border-wervice-lime shadow-soft'
                  : isCompleted
                  ? 'bg-wervice-lime/5 border border-wervice-lime/30'
                  : 'bg-white border border-wv-gray3'
              )}
            >
              {/* Step Indicator */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                  isCurrent
                    ? 'bg-wervice-lime text-wervice-ink'
                    : isCompleted
                    ? 'bg-wervice-lime text-wervice-ink'
                    : 'bg-wv-gray3 text-wervice-taupe'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  <Circle className="w-3 h-3 fill-current" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    'font-medium transition-colors',
                    isCurrent
                      ? 'text-wervice-ink'
                      : isCompleted
                      ? 'text-wervice-ink'
                      : 'text-wervice-taupe'
                  )}
                >
                  {step.label}
                </h3>
                {isCurrent && (
                  <p className="text-sm text-wervice-taupe mt-1">
                    In progress
                  </p>
                )}
                {!isCurrent && (
                  <p className="text-sm text-wervice-taupe mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
