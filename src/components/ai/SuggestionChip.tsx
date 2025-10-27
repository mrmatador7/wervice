'use client';

interface SuggestionChipProps {
  text: string;
  onClick: () => void;
}

export default function SuggestionChip({ text, onClick }: SuggestionChipProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#D9FF0A] rounded-xl text-sm text-gray-700 transition-all duration-200 hover:shadow-md"
    >
      {text}
    </button>
  );
}

