interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-white/60 backdrop-blur-sm border-t border-white/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Desktop: Show all step dots with line */}
          <div className="hidden md:block relative">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" style={{ zIndex: 0 }} />
            
            {/* Progress Line */}
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-wervice-lime -translate-y-1/2 transition-all duration-700 ease-out" 
              style={{ 
                width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                zIndex: 0
              }} 
            />

            {/* Steps */}
            <div className="relative flex items-center justify-between" style={{ zIndex: 1 }}>
              {Array.from({ length: totalSteps }).map((_, index) => {
                const stepNum = index + 1;
                const isComplete = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                  <div key={stepNum} className="relative flex flex-col items-center">
                    {/* Current Step Ring */}
                    {isCurrent && (
                      <div className="absolute inset-0 -m-3">
                        <div className="w-14 h-14 rounded-full border-2 border-wervice-ink bg-white flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full border-2 border-wervice-ink flex items-center justify-center">
                            <span className="text-sm font-bold text-wervice-ink">{stepNum}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step Circle */}
                    {!isCurrent && (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 bg-white border-2 ${
                          isComplete
                            ? 'border-wervice-lime'
                            : 'border-gray-300'
                        }`}
                      >
                        {isComplete ? (
                          <span className="text-wervice-ink font-bold text-base">✓</span>
                        ) : (
                          <span className="text-gray-400 text-xs">{stepNum}</span>
                        )}
                      </div>
                    )}

                    {/* Spacer for current step (since it's absolutely positioned) */}
                    {isCurrent && <div className="w-8 h-8" />}

                    {/* Step Label */}
                    <div className={`text-xs font-medium whitespace-nowrap ${
                      isCurrent ? 'text-wervice-ink mt-10' : 'mt-2 opacity-0'
                    }`}>
                      {isCurrent && `Step ${stepNum}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: Simple progress bar with percentage */}
          <div className="md:hidden">
            <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-3">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-wervice-lime transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
