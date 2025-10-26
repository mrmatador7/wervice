import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface StepShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onSkip?: () => void;
  isSaving?: boolean;
  showFooter?: boolean;
  buttonText?: string;
}

export function StepShell({
  title,
  subtitle,
  children,
  onBack,
  onSkip,
  isSaving = false,
  showFooter = true,
  buttonText = 'Continue',
}: StepShellProps) {
  return (
    <div className="space-y-10">
      {/* Header - Hidden as it's shown in parent now */}
      <div className="text-center space-y-3 hidden">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-wervice-lime" />
          <h1 className="text-2xl lg:text-3xl font-bold text-wervice-ink">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-base text-wervice-taupe max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Subtitle shown at top */}
      {subtitle && (
        <div className="text-center -mt-2">
          <p className="text-base text-wervice-taupe max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">
        {children}
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-8 mt-8 border-t border-wv-gray2">
          {/* Back Button */}
          <div className="order-2 sm:order-1">
            {onBack && (
              <button
                onClick={onBack}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-wervice-taupe hover:text-wervice-ink hover:bg-wv-gray1 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Continue & Skip Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 order-1 sm:order-2">
            {onSkip && (
              <button
                onClick={onSkip}
                disabled={isSaving}
                className="px-5 py-2.5 text-wervice-taupe hover:text-wervice-ink hover:bg-wv-gray1 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-center"
              >
                Skip for now
              </button>
            )}

            <button
              type="submit"
              form="step-form"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-wervice-lime via-lime-400 to-yellow-300 text-wervice-ink font-bold px-8 py-3.5 rounded-xl hover:shadow-lg transition-all shadow-md shadow-wervice-lime/30 hover:shadow-xl hover:shadow-wervice-lime/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg min-w-[160px]"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-wervice-ink border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{buttonText}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
