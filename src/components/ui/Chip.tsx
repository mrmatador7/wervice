import * as React from 'react';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export default function Chip({ label, active = false, onClick, icon }: ChipProps) {
  const baseClasses = "inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-sm text-wervice-ink shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:bg-wervice-shell transition select-none";
  const activeClasses = active ? "bg-wervice-lime border-transparent" : "";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
