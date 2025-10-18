import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPIStatCardProps {
  title: string;
  value: string | number;
  delta: number;
  deltaLabel: string;
}

export default function KPIStatCard({ title, value, delta, deltaLabel }: KPIStatCardProps) {
  const isPositive = delta > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-wv.card rounded-xl p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-wv.sub mb-1">{title}</p>
          <p className="text-2xl font-bold text-wv.text">{value}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-wv.success' : delta < 0 ? 'text-wv.danger' : 'text-wv.sub'
        }`}>
          <TrendIcon size={16} />
          <span>{Math.abs(delta)}%</span>
        </div>
        <span className="text-xs text-wv.sub">{deltaLabel}</span>
      </div>
    </div>
  );
}

