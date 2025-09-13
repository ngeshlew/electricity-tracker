import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-simple';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useElectricityStore } from '../../store/useElectricityStore';

export const ConsumptionChart: React.FC = () => {
  const { chartData } = useElectricityStore();
  
  // Transform chart data for Recharts
  const chartDataFormatted = chartData.map(point => ({
    date: point.date,
    consumption: point.kwh,
    cost: point.cost,
  }));

  return (
    <Card className="lewis-card lewis-card-hover lewis-animation-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold lewis-text-gradient">
          Daily Consumption Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartDataFormatted}>
              <defs>
                <linearGradient id="lewisGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--electric-purple))" />
                  <stop offset="100%" stopColor="hsl(var(--electric-pink))" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-xs fill-muted-foreground"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  color: 'hsl(var(--foreground))',
                  boxShadow: '0 10px 25px -5px hsl(var(--primary) / 0.2)',
                }}
                formatter={(value: number, name: string) => [
                  `${value} ${name === 'consumption' ? 'kWh' : '£'}`,
                  name === 'consumption' ? 'Consumption' : 'Cost'
                ]}
                labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
              />
              <Line 
                type="monotone" 
                dataKey="consumption" 
                stroke="url(#lewisGradient)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--electric-purple))', strokeWidth: 2, r: 5, stroke: 'hsl(var(--background))' }}
                activeDot={{ r: 8, stroke: 'hsl(var(--electric-pink))', strokeWidth: 3, fill: 'hsl(var(--background))' }}
                className="lewis-chart-line"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};