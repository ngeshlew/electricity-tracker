import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ChartDataPoint {
  date: string;
  kwh: number;
  cost: number;
}

interface ConsumptionChartProps {
  data?: ChartDataPoint[];
}

export const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ 
  data = [] 
}) => {
  // Mock data - will be replaced with real data from hooks
  const mockData: ChartDataPoint[] = [
    { date: '2024-01-01', kwh: 8.2, cost: 2.46 },
    { date: '2024-01-02', kwh: 7.8, cost: 2.34 },
    { date: '2024-01-03', kwh: 9.1, cost: 2.73 },
    { date: '2024-01-04', kwh: 8.5, cost: 2.55 },
    { date: '2024-01-05', kwh: 7.9, cost: 2.37 },
    { date: '2024-01-06', kwh: 8.3, cost: 2.49 },
    { date: '2024-01-07', kwh: 8.7, cost: 2.61 },
  ];

  const chartData = data.length > 0 ? data : mockData;

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-dark-50 mb-2">
          Consumption Overview
        </h2>
        <p className="text-dark-400">
          Daily electricity consumption and costs for the current week
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-GB', { 
                month: 'short', 
                day: 'numeric' 
              })}
            />
            <YAxis 
              yAxisId="kwh"
              orientation="left"
              stroke="#94a3b8"
              fontSize={12}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="cost"
              orientation="right"
              stroke="#94a3b8"
              fontSize={12}
              label={{ value: '£', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              formatter={(value: number, name: string) => [
                name === 'kwh' ? `${value} kWh` : `£${value.toFixed(2)}`,
                name === 'kwh' ? 'Consumption' : 'Cost'
              ]}
            />
            <Legend />
            <Line
              yAxisId="kwh"
              type="monotone"
              dataKey="kwh"
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#a855f7', strokeWidth: 2 }}
              name="Consumption (kWh)"
            />
            <Line
              yAxisId="cost"
              type="monotone"
              dataKey="cost"
              stroke="#ec4899"
              strokeWidth={2}
              dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ec4899', strokeWidth: 2 }}
              name="Cost (£)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
