'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DonutBookingsByCategoryProps {
  data: Array<{ category: string; count: number; percentage: number }>;
}

const COLORS = ['#D9FF0A', '#BEE600', '#9CB300', '#7A8000', '#586D00', '#355A00'];

export default function DonutBookingsByCategory({ data }: DonutBookingsByCategoryProps) {
  return (
    <div className="bg-wv.card rounded-xl p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-wv.text">Bookings by Category</h3>
        <p className="text-sm text-wv.sub">Service category distribution</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EDEDED',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value, name, props) => [
                `${value} bookings (${props.payload.percentage}%)`,
                props.payload.category
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: '#111111', fontSize: '12px' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}





