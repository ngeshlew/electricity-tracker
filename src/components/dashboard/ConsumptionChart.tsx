import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useElectricityStore } from '../../store/useElectricityStore';
import { formatDateUK, addDays, isSameDay } from '../../utils/dateFormatters';

export const ConsumptionChart: React.FC = () => {
  const { chartData } = useElectricityStore();
  
  // Fill missing dates to prevent chart gaps
  const fillMissingDates = (data: typeof chartData) => {
    if (data.length < 2) return data;
    
    const filledData = [];
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = 0; i < sortedData.length; i++) {
      const current = sortedData[i];
      const next = sortedData[i + 1];
      
      filledData.push({
        date: current.date,
        consumption: current.kwh,
        cost: current.cost,
      });
      
      // Fill gaps between current and next reading
      if (next) {
        const currentDate = new Date(current.date);
        const nextDate = new Date(next.date);
        const daysDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Add zero consumption days for gaps > 1 day
        for (let day = 1; day < daysDiff; day++) {
          const gapDate = addDays(currentDate, day);
          filledData.push({
            date: gapDate.toISOString().split('T')[0],
            consumption: 0,
            cost: 0,
          });
        }
      }
    }
    
    return filledData;
  };
  
  // Transform chart data for Recharts with filled gaps
  const chartDataFormatted = fillMissingDates(chartData);

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
                tickFormatter={(value) => formatDateUK(new Date(value), 'chart')}
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
                labelFormatter={(value) => `Date: ${formatDateUK(new Date(value), 'long')}`}
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