import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  title?: string;
  subtitle?: string;
  variant?: "default" | "tinted" | "elevated" | "lime" | "venues" | "catering" | "photo-video" | "accent";
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
  // Determine text colors based on background
  const isDarkBackground = variant === "photo-video" || variant === "accent";
  const titleClass = isDarkBackground ? "text-white" : "text-wervice-ink";
  const subtitleClass = isDarkBackground ? "text-white/80" : "text-wervice-taupe";

  return (
    <section className={cn(
      "py-12",
      variant === "default" && "bg-white",
      variant === "tinted" && "bg-wervice-shell/80",
      variant === "elevated" && "bg-wervice-shell/80",
      variant === "lime" && "bg-wervice-lime/5",
      variant === "venues" && "bg-[#F3F1EE]",
      variant === "catering" && "bg-[#CAC4B7]",
      variant === "photo-video" && "bg-[#787664]",
      variant === "accent" && "bg-[#D9FF0A]",
      className
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <header className="mb-6">
            <h2 className={cn("text-2xl sm:text-3xl font-bold", titleClass)}>{title}</h2>
            {subtitle && <p className={cn("mt-1 text-sm sm:text-base", subtitleClass)}>{subtitle}</p>}
          </header>
        )}
        <div className={variant === "elevated" ? "rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 sm:p-6" : ""}>
          {children}
        </div>
      </div>
    </section>
  );
}
