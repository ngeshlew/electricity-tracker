import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from "@/components/ui/icon";
import { useFuelStore } from '@/store/useFuelStore';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

interface DailyData {
  date: string;
  litres: number;
  cost: number;
  litresAdded: number;
}

interface DailyBreakdownProps {
  currentMonth: Date;
  viewMode: 'litres' | 'cost';
}

export const DailyBreakdown: React.FC<DailyBreakdownProps> = ({ currentMonth, viewMode }) => {
  const { topups } = useFuelStore();

  const dailyData = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Filter topups for current month
    const monthTopups = topups.filter(topup => {
      const topupDate = new Date(topup.date);
      return topupDate >= monthStart && topupDate <= monthEnd && !topup.isFirstTopup;
    });

    if (monthTopups.length === 0) {
      return [];
    }

    // Create daily data points
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const dailyBreakdown: DailyData[] = [];

    // Group topups by day
    const topupsByDay = new Map<string, typeof monthTopups>();
    monthTopups.forEach(topup => {
      const dateKey = format(new Date(topup.date), 'yyyy-MM-dd');
      if (!topupsByDay.has(dateKey)) {
        topupsByDay.set(dateKey, []);
      }
      topupsByDay.get(dateKey)!.push(topup);
    });

    // Filter out future dates and calculate daily values
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    return days
      .filter(day => day <= today) // Only include days up to today
      .map((day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayTopups = topupsByDay.get(dateKey) || [];
        
        if (dayTopups.length > 0) {
          const totalLitres = dayTopups.reduce((sum, topup) => sum + topup.litres, 0);
          const totalCost = dayTopups.reduce((sum, topup) => sum + topup.totalCost, 0);
          return {
            date: format(day, 'MMM d'),
            litres: Math.round(totalLitres * 100) / 100,
            cost: Math.round(totalCost * 100) / 100,
            litresAdded: totalLitres
          };
        }
        return {
          date: format(day, 'MMM d'),
          litres: 0,
          cost: 0,
          litresAdded: 0
        };
      });
  }, [topups, currentMonth]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border  p-3 shadow-lg">
          <p className="">{label}</p>
          <p className="text-xs text-muted-foreground">
            {viewMode === 'litres' ? `${data.litres} L` : `£${data.cost.toFixed(2)}`}
          </p>
          {data.reading > 0 && (
            <p className="text-xs text-muted-foreground">
              Litres: {data.litresAdded.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={4}
          textAnchor="end"
          fill="hsl(var(--muted-foreground))"
          fontSize={12}
        >
          {viewMode === 'kwh' ? `${payload.value} kWh` : `£${payload.value}`}
        </text>
      </g>
    );
  };

  if (dailyData.length === 0) {
    return (
      <Card className="lewis-card lewis-shadow-glow lewis-animation-fade-in">
        <CardHeader>
          <CardTitle className="text-base lewis-text-gradient">
            Daily Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Icon name="arrow-up" className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No data available for this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...dailyData.map(d => viewMode === 'kwh' ? d.kwh : d.cost));
  const yAxisDomain = [0, Math.ceil(maxValue * 1.1)];

  return (
    <Card className="lewis-card lewis-shadow-glow lewis-animation-fade-in">
      <CardHeader>
        <CardTitle className="text-base lewis-text-gradient">
          Daily Breakdown ({viewMode === 'kwh' ? 'kWh' : 'Cost'})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
              />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={yAxisDomain}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={<CustomYAxisTick />}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={viewMode === 'litres' ? 'litres' : 'cost'}
                stroke="hsl(var(--electric-purple))"
                strokeWidth={3}
                dot={{
                  fill: 'hsl(var(--electric-purple))',
                  strokeWidth: 2,
                  stroke: 'hsl(var(--background))',
                  r: 4
                }}
                activeDot={{
                  r: 6,
                  fill: 'hsl(var(--electric-pink))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-base lewis-text-gradient">
              {dailyData.reduce((sum, day) => sum + day.kwh, 0).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Total kWh</div>
          </div>
          <div className="text-center">
            <div className="text-base lewis-text-gradient">
              £{dailyData.reduce((sum, day) => sum + day.cost, 0).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Total Cost</div>
          </div>
          <div className="text-center">
            <div className="text-base lewis-text-gradient">
              {(dailyData.reduce((sum, day) => sum + day.kwh, 0) / dailyData.length).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Daily Avg</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
