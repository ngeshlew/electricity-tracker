import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useElectricityStore } from '../../store/useElectricityStore';
import { formatDateUK, addDays } from '../../utils/dateFormatters';

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
    <Card>
      <CardHeader>
        <CardTitle>Weekly Consumption</CardTitle>
        <CardDescription>
          Your electricity usage over the past week
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <Tabs defaultValue="line" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="line">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartDataFormatted}>
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
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
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
                <Bar dataKey="consumption" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};