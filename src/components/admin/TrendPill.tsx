import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendPillProps {
  value: number;
  label?: string;
}

export default function TrendPill({ value, label }: TrendPillProps) {
  const isPositive = value > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      isPositive ? 'bg-green-100 text-green-700' : value < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
    }`}>
      <TrendIcon size={12} />
      <span>{Math.abs(value)}%</span>
      {label && <span className="ml-1">{label}</span>}
    </div>
  );
}

