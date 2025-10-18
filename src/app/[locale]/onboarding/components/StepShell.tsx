import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StepShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onSkip?: () => void;
  isSaving?: boolean;
  showFooter?: boolean;
}

export function StepShell({
  title,
  subtitle,
  children,
  onBack,
  onSkip,
  isSaving = false,
  showFooter = true,
}: StepShellProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-wervice-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-wervice-taupe max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {children}
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="flex items-center justify-between pt-8 border-t border-wv-gray3">
          <div>
            {onBack && (
              <button
                onClick={onBack}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 text-wervice-taupe hover:text-wervice-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {onSkip && (
              <button
                onClick={onSkip}
                disabled={isSaving}
                className="px-4 py-2 text-wervice-taupe hover:text-wervice-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip for now
              </button>
            )}

            <button
              type="submit"
              form="step-form"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-wervice-lime text-wervice-ink font-semibold px-6 py-3 rounded-xl hover:bg-wv-limeDark transition-colors shadow-card hover:shadow-cardHover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-wervice-ink border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
