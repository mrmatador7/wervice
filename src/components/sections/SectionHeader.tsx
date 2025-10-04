"use client";

import Link from "next/link";

export default function SectionHeader({
  title,
  subtitle,
  eyebrow,
  cta,
  className = "",
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  cta?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div className={`text-center mb-8 ${className}`}>
      {eyebrow ? (
        <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-2">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-gray-600 text-sm md:text-base">
          {subtitle}
        </p>
      ) : null}
      {cta ? (
        <div className="mt-4">
          <Link
            href={cta.href}
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            {cta.label} →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
