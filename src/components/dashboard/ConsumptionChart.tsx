import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useElectricityStore } from '../../store/useElectricityStore';
import { formatDateUK, addDays } from '../../utils/dateFormatters';

export const ConsumptionChart: React.FC = () => {
  const { chartData } = useElectricityStore();
  
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Consumption</CardTitle>
        <CardDescription>
          Your electricity usage over the past week
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <Tabs defaultValue="area" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="area">Area Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="area">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartDataFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => formatDateUK(new Date(value), 'chart')}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value} ${name === 'consumption' ? 'kWh' : '£'}`,
                    name === 'consumption' ? 'Consumption' : 'Cost'
                  ]}
                  labelFormatter={(value) => `Date: ${formatDateUK(new Date(value), 'long')}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="oklch(var(--primary))" 
                  fill="oklch(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="bar">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartDataFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => formatDateUK(new Date(value), 'chart')}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value} ${name === 'consumption' ? 'kWh' : '£'}`,
                    name === 'consumption' ? 'Consumption' : 'Cost'
                  ]}
                  labelFormatter={(value) => `Date: ${formatDateUK(new Date(value), 'long')}`}
                />
                <Bar dataKey="consumption" fill="oklch(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};