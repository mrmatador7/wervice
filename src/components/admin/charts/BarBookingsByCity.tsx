'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarBookingsByCityProps {
  data: Array<{ city: string; count: number }>;
}

export default function BarBookingsByCity({ data }: BarBookingsByCityProps) {
  return (
    <div className="bg-wv.card rounded-xl p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-wv.text">Bookings by City</h3>
        <p className="text-sm text-wv.sub">Distribution across Moroccan cities</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEDED" />
            <XAxis
              dataKey="city"
              stroke="#666666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#666666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EDEDED',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => [value, 'Bookings']}
              labelStyle={{ color: '#111111' }}
            />
            <Bar
              dataKey="count"
              fill="#D9FF0A"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}





