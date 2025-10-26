'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AreaRevenueProps {
  data: Array<{ month: string; revenue: number; bookings: number }>;
  showBookings?: boolean;
}

export default function AreaRevenue({ data, showBookings = false }: AreaRevenueProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'Revenue') {
      return [formatCurrency(value), name];
    }
    return [value, name];
  };

  return (
    <div className="bg-wv.card rounded-xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-wv.text">Revenue Overview</h3>
          <p className="text-sm text-wv.sub">Monthly revenue and booking trends</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm bg-wv.lime text-wv.black rounded-lg font-medium">
            Monthly
          </button>
          <button className="px-3 py-1 text-sm text-wv.sub hover:text-wv.text">
            Yearly
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D9FF0A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#D9FF0A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEDED" />
            <XAxis
              dataKey="month"
              stroke="#666666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#666666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EDEDED',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={formatTooltipValue}
              labelStyle={{ color: '#111111' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#D9FF0A"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
            {showBookings && (
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#666666"
                strokeWidth={2}
                fill="transparent"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}



