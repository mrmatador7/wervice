interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const progress = (currentStep / 10) * 100;

  return (
    <div className="w-full bg-white border-b border-wv-gray3">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between text-sm text-wervice-taupe mb-2">
            <span>Step {currentStep} of 10</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-1 bg-wv-gray3 rounded-full overflow-hidden">
            <div
              className="h-full bg-wervice-lime transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
