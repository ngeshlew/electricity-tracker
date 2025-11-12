import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useElectricityStore } from '../../store/useElectricityStore';
import { formatDateUK, addDays } from '../../utils/dateFormatters';

export const ConsumptionChart: React.FC = () => {
  const { chartData, isLoading } = useElectricityStore();
  
  // Show skeleton loading state
  if (isLoading && chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">Weekly Consumption</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartSkeleton className="h-[350px]" />
        </CardContent>
      </Card>
    );
  }
  
  // Fill missing dates to prevent chart gaps
  // Only fills gaps where no chart data point exists (not for dates with readings)
  const fillMissingDates = (data: typeof chartData) => {
    // Handle edge cases: empty or single data point
    if (data.length === 0) return [];
    if (data.length === 1) {
      return [{
        date: data[0].date,
        consumption: data[0].kwh,
        cost: data[0].cost,
      }];
    }
    
    const filledData: Array<{ date: string; consumption: number; cost: number }> = [];
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Validate data points have valid dates
    const invalidDataPoints = sortedData.filter(point => !point.date || isNaN(new Date(point.date).getTime()));
    if (invalidDataPoints.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn('Found chart data points with invalid dates:', invalidDataPoints);
    }
    
    // Create a Set of existing dates for quick lookup
    // This prevents overwriting dates that already have chart data points
    const existingDates = new Set(sortedData.map(point => point.date));
    
    for (let i = 0; i < sortedData.length; i++) {
      const current = sortedData[i];
      const next = sortedData[i + 1];
      
      // Validate current data point
      if (!current || !current.date) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Skipping invalid data point:', current);
        }
        continue;
      }
      
      // Add the current data point
      filledData.push({
        date: current.date,
        consumption: current.kwh || 0,
        cost: current.cost || 0,
      });
      
      // Fill gaps between current and next reading
      // Only fill dates that don't already have chart data points
      if (next && next.date) {
        const currentDate = new Date(current.date);
        const nextDate = new Date(next.date);
        
        // Validate dates are valid
        if (isNaN(currentDate.getTime()) || isNaN(nextDate.getTime())) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Skipping gap fill due to invalid dates:', { current, next });
          }
          continue;
        }
        
        const daysDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Only fill gaps if daysDiff is positive and greater than 1
        // Negative daysDiff indicates data is not properly sorted (shouldn't happen after sorting)
        if (daysDiff > 1) {
          // Add zero consumption days for gaps > 1 day
          // But skip dates that already have chart data points (from estimated readings, etc.)
          for (let day = 1; day < daysDiff; day++) {
            const gapDate = addDays(currentDate, day);
            const gapDateString = gapDate.toISOString().split('T')[0];
            
            // Only fill if this date doesn't already have a chart data point
            // This prevents overwriting estimated readings with zeros
            if (!existingDates.has(gapDateString)) {
              filledData.push({
                date: gapDateString,
                consumption: 0,
                cost: 0,
              });
            }
          }
        } else if (daysDiff < 0 && process.env.NODE_ENV === 'development') {
          // Warn if dates are out of order (shouldn't happen after sorting)
          console.warn('Dates out of order in chart data:', { current: current.date, next: next.date });
        }
      }
    }
    
    // Sort filled data by date to ensure proper order
    return filledData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  // Transform chart data for Recharts with filled gaps
  const chartDataFormatted = fillMissingDates(chartData);

  // Determine time period context for subtitle
  const getTimePeriodContext = () => {
    if (chartDataFormatted.length === 0) return 'NO DATA';
    const firstDate = new Date(chartDataFormatted[0].date);
    const lastDate = new Date(chartDataFormatted[chartDataFormatted.length - 1].date);
    const daysDiff = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) return 'LAST 7 DAYS';
    if (daysDiff <= 30) return 'LAST 30 DAYS';
    return `${formatDateUK(firstDate, 'short')} - ${formatDateUK(lastDate, 'short')}`;
  };

  return (
    <Card role="region" aria-label="Consumption chart" className="bg-transparent" style={{ padding: 'var(--space-3xl) var(--space-2xl)' }}>
      <CardHeader className="text-center mb-12" style={{ marginBottom: 'var(--space-3xl)' }}>
        <CardTitle className="text-lg font-semibold uppercase tracking-wide mb-2">Weekly Consumption</CardTitle>
        <p className="text-xs uppercase tracking-normal text-muted-foreground" aria-label={`Time period: ${getTimePeriodContext()}`}>
          {getTimePeriodContext()}
        </p>
      </CardHeader>
      <CardContent className="pl-2 mt-8" style={{ marginTop: 'var(--space-2xl)' }}>
        <ResponsiveContainer width="100%" height={350} aria-label="Electricity consumption over time">
          <AreaChart data={chartDataFormatted} aria-label="Consumption chart">
            <CartesianGrid strokeDasharray="4 4" stroke="oklch(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => formatDateUK(new Date(value), 'chart')}
              stroke="oklch(var(--muted-foreground))"
              tick={{ 
                fill: 'oklch(var(--muted-foreground))', 
                fontSize: 11,
                fontFamily: 'var(--font-mono)'
              }}
            />
            <YAxis 
              stroke="oklch(var(--muted-foreground))"
              tick={{ 
                fill: 'oklch(var(--muted-foreground))', 
                fontSize: 11,
                fontFamily: 'var(--font-mono)'
              }}
              label={{ 
                value: 'kWh', 
                angle: -90, 
                position: 'insideLeft', 
                fill: 'oklch(var(--muted-foreground))',
                style: { fontFamily: 'var(--font-mono)', fontSize: 11 }
              }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Consumption']}
              labelFormatter={(value) => formatDateUK(new Date(value), 'long')}
              contentStyle={{ 
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                padding: '8px 12px'
              }}
              labelStyle={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="consumption" 
              stroke="oklch(var(--foreground))" 
              fill="none"
              strokeWidth={2}
              dot={{ fill: "oklch(var(--foreground))", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};