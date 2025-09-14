import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useElectricityStore } from '../../store/useElectricityStore';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

interface DailyData {
  date: string;
  kwh: number;
  cost: number;
  reading: number;
}

interface DailyBreakdownProps {
  currentMonth: Date;
  viewMode: 'kwh' | 'cost';
}

export const DailyBreakdown: React.FC<DailyBreakdownProps> = ({ currentMonth, viewMode }) => {
  const { readings, preferences } = useElectricityStore();

  const dailyData = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Filter readings for current month
    const monthReadings = readings.filter(reading => {
      const readingDate = new Date(reading.date);
      return readingDate >= monthStart && readingDate <= monthEnd;
    });

    if (monthReadings.length < 2) {
      return [];
    }

    // Create daily data points
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const dailyBreakdown: DailyData[] = [];

    // Calculate consumption for each day
    for (let i = 1; i < monthReadings.length; i++) {
      const prevReading = monthReadings[i - 1];
      const currentReading = monthReadings[i];
      const consumption = currentReading.reading - prevReading.reading;
      
      if (consumption > 0) {
        const readingDate = new Date(currentReading.date);
        const dayIndex = days.findIndex(day => 
          day.getDate() === readingDate.getDate() && 
          day.getMonth() === readingDate.getMonth()
        );
        
        if (dayIndex !== -1) {
          dailyBreakdown[dayIndex] = {
            date: format(readingDate, 'MMM d'),
            kwh: Math.round(consumption * 100) / 100,
            cost: Math.round(consumption * preferences.unitRate * 100) / 100,
            reading: currentReading.reading
          };
        }
      }
    }

    // Fill in missing days with zero values
    return days.map((day, index) => {
      if (dailyBreakdown[index]) {
        return dailyBreakdown[index];
      }
      return {
        date: format(day, 'MMM d'),
        kwh: 0,
        cost: 0,
        reading: 0
      };
    });
  }, [readings, currentMonth, preferences.unitRate]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {viewMode === 'kwh' ? `${data.kwh} kWh` : `£${data.cost.toFixed(2)}`}
          </p>
          {data.reading > 0 && (
            <p className="text-sm text-muted-foreground">
              Meter: {data.reading.toLocaleString()}
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
          <CardTitle className="text-lg font-semibold lewis-text-gradient">
            Daily Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
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
        <CardTitle className="text-lg font-semibold lewis-text-gradient">
          Daily Breakdown ({viewMode === 'kwh' ? 'kWh' : 'Cost'})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
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
                dataKey={viewMode === 'kwh' ? 'kwh' : 'cost'}
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{
                  fill: 'hsl(var(--primary))',
                  strokeWidth: 2,
                  stroke: 'hsl(var(--background))',
                  r: 4
                }}
                activeDot={{
                  r: 6,
                  fill: 'hsl(var(--accent))',
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
            <div className="text-lg font-bold lewis-text-gradient">
              {dailyData.reduce((sum, day) => sum + day.kwh, 0).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Total kWh</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold lewis-text-gradient">
              £{dailyData.reduce((sum, day) => sum + day.cost, 0).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Cost</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold lewis-text-gradient">
              {(dailyData.reduce((sum, day) => sum + day.kwh, 0) / dailyData.length).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Daily Avg</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
