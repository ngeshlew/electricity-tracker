import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useElectricityStore } from '../../store/useElectricityStore';
import { formatDateUK } from '../../utils/dateFormatters';
import { buildDailyConsumptionSeries } from '../../utils/consumptionSeries';

export const ConsumptionChart: React.FC = () => {
  const { readings, isLoading, calculateReadingCost } = useElectricityStore();
  
  const dailySeries = useMemo(() => {
    return buildDailyConsumptionSeries(readings, calculateReadingCost);
  }, [readings, calculateReadingCost]);
  
  // Show skeleton loading state
  if (isLoading && dailySeries.length === 0) {
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
  
  const chartDataFormatted = dailySeries;

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 shadow-lg">
          <p className="">{formatDateUK(new Date(data.date), 'long')}</p>
          <p className="text-xs text-muted-foreground">
            {data.consumption.toFixed(2)} kWh
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card role="region" aria-label="Consumption chart" className="bg-transparent w-full" style={{ padding: 'var(--space-md) var(--space-md)' }}>
      <CardHeader className="text-center mb-6" style={{ marginBottom: 'var(--space-xl)' }}>
        <CardTitle className="text-lg font-normal uppercase tracking-wide mb-2">Weekly Consumption</CardTitle>
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
            <Tooltip content={<CustomTooltip />} />
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
