import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  title?: string;
  subtitle?: string;
  variant?: "default" | "tinted" | "elevated" | "lime";
  children: ReactNode;
  className?: string;
}

export default function Section({
  title,
  subtitle,
  variant = "default",
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn(
      "py-20",
      variant === "default" && "bg-white",
      variant === "tinted" && "bg-wervice-shell/80",
      variant === "elevated" && "bg-wervice-shell/80",
      variant === "lime" && "bg-wervice-lime/5",
      className
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <header className="mb-6">
            <h2 className="text-wervice-ink text-2xl sm:text-3xl font-bold">{title}</h2>
            {subtitle && <p className="mt-1 text-wervice-taupe text-sm sm:text-base">{subtitle}</p>}
          </header>
        )}
        <div className={variant === "elevated" ? "rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 sm:p-6" : ""}>
          {children}
        </div>
      </div>
    </section>
  );
}
