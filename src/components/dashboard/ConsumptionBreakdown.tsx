import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useElectricityStore } from '../../store/useElectricityStore';
import { startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek, eachDayOfInterval, format } from 'date-fns';

interface WeeklyData {
  week: number;
  name: string;
  kwh: number;
  cost: number;
  percentage: number;
}

interface DailyData {
  date: string;
  kwh: number;
  cost: number;
  reading: number;
}


interface ConsumptionBreakdownProps {
  currentMonth: Date;
  viewMode: 'kwh' | 'cost';
}

export const ConsumptionBreakdown: React.FC<ConsumptionBreakdownProps> = ({ currentMonth, viewMode }) => {
  const { readings, preferences } = useElectricityStore();
  const [activeTab, setActiveTab] = useState<'weekly' | 'daily'>('weekly');

  const weeklyData = useMemo(() => {
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

    // Calculate weekly breakdown
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
    const weeklyBreakdown: WeeklyData[] = weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart);
      
      // Find readings that fall within this week
      const weekReadings = monthReadings.filter(reading => {
        const readingDate = new Date(reading.date);
        return readingDate >= weekStart && readingDate <= weekEnd;
      });

      let weekKwh = 0;
      let weekCost = 0;
      
      // Calculate consumption for this week
      if (weekReadings.length > 0) {
        // Sort readings by date
        const sortedWeekReadings = [...weekReadings].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        // Calculate consumption between consecutive readings in this week
        for (let i = 1; i < sortedWeekReadings.length; i++) {
          const consumption = sortedWeekReadings[i].reading - sortedWeekReadings[i - 1].reading;
          if (consumption > 0) {
            weekKwh += consumption;
            weekCost += consumption * preferences.unitRate;
          }
        }
        
        // If this is the first week and we have readings, we need to account for consumption
        // from the previous reading (outside this week) to the first reading in this week
        if (index === 0 && sortedWeekReadings.length > 0) {
          const firstReadingInWeek = sortedWeekReadings[0];
          const previousReading = monthReadings.find(reading => {
            const readingDate = new Date(reading.date);
            return readingDate < weekStart;
          });
          
          if (previousReading) {
            const consumption = firstReadingInWeek.reading - previousReading.reading;
            if (consumption > 0) {
              weekKwh += consumption;
              weekCost += consumption * preferences.unitRate;
            }
          }
        }
      }

      return {
        week: index + 1,
        name: `Week ${index + 1}`,
        kwh: Math.round(weekKwh * 100) / 100,
        cost: Math.round(weekCost * 100) / 100,
        percentage: 0 // Will be calculated below
      };
    });

    // Calculate percentages
    const total = weeklyBreakdown.reduce((sum, week) => sum + (viewMode === 'kwh' ? week.kwh : week.cost), 0);
    weeklyBreakdown.forEach(week => {
      week.percentage = total > 0 ? Math.round((viewMode === 'kwh' ? week.kwh : week.cost) / total * 100) : 0;
    });

    return weeklyBreakdown;
  }, [readings, currentMonth, preferences.unitRate, viewMode]);

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

    // Sort readings by date
    const sortedReadings = [...monthReadings].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate consumption for each day
    for (let i = 1; i < sortedReadings.length; i++) {
      const prevReading = sortedReadings[i - 1];
      const currentReading = sortedReadings[i];
      const consumption = currentReading.reading - prevReading.reading;
      
      if (consumption > 0) {
        const readingDate = new Date(currentReading.date);
        const dayIndex = days.findIndex(day => 
          day.getDate() === readingDate.getDate() && 
          day.getMonth() === readingDate.getMonth()
        );
        
        if (dayIndex !== -1) {
          dailyBreakdown.push({
            date: format(readingDate, 'MMM dd'),
            kwh: Math.round(consumption * 100) / 100,
            cost: Math.round(consumption * preferences.unitRate * 100) / 100,
            reading: currentReading.reading
          });
        }
      }
    }

    return dailyBreakdown;
  }, [readings, currentMonth, preferences.unitRate]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 shadow-lg">
          <p className="">{data.name || data.date}</p>
          <p className="text-xs text-muted-foreground">
            {viewMode === 'kwh' ? `${data.kwh} kWh` : `£${data.cost.toFixed(2)}`}
          </p>
          {data.percentage && (
            <p className="text-xs text-muted-foreground">
              {data.percentage}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };


  return (
    <Card className="col-span-2 bg-transparent w-full" style={{ padding: 'var(--space-md)' }}>
      <CardHeader>
        <CardTitle>Consumption Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'weekly' | 'daily')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">Weekly Breakdown</TabsTrigger>
            <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly" className="mt-6">
            {weeklyData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorWeeklyConsumption" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey={viewMode === 'kwh' ? 'kwh' : 'cost'} 
                      stroke="oklch(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorWeeklyConsumption)"
                      dot={{ fill: 'oklch(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No weekly data available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="daily" className="mt-6">
            {dailyData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey={viewMode === 'kwh' ? 'kwh' : 'cost'} 
                      stroke="oklch(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorConsumption)"
                      dot={{ fill: 'oklch(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No daily data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
