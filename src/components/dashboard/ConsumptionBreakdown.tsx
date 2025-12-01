import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useElectricityStore } from '@/store/useElectricityStore';
import { startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import type { ChartDataPoint } from '@/types';

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
}

interface ConsumptionBreakdownProps {
  currentMonth: Date;
  viewMode: 'kwh' | 'cost';
}

export const ConsumptionBreakdown: React.FC<ConsumptionBreakdownProps> = ({ currentMonth, viewMode }) => {
  const { chartData } = useElectricityStore();
  const [activeTab, setActiveTab] = useState<'weekly' | 'daily'>('weekly');

  const weeklyData = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Filter chart data for current month
    const monthPoints = chartData.filter((point: ChartDataPoint) => {
      const pointDate = new Date(point.date);
      return pointDate >= monthStart && pointDate <= monthEnd;
    });

    if (monthPoints.length === 0) {
      return [];
    }

    // Calculate weekly breakdown
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
    const weeklyBreakdown: WeeklyData[] = weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart);
      
      // Find points that fall within this week
      const weekPoints = monthPoints.filter((point: ChartDataPoint) => {
        const pointDate = new Date(point.date);
        return pointDate >= weekStart && pointDate <= weekEnd;
      });

      let weekKwh = 0;
      let weekCost = 0;
      
      weekPoints.forEach((point: ChartDataPoint) => {
        weekKwh += point.kwh;
        weekCost += point.cost;
      });

      return {
        week: index + 1,
        name: `Week ${index + 1}`,
        kwh: Math.round(weekKwh * 100) / 100,
        cost: Math.round(weekCost * 100) / 100,
        percentage: 0 // Will be calculated below
      };
    });

    // Calculate percentages
    const total = weeklyBreakdown.reduce((sum: number, week: WeeklyData) => sum + (viewMode === 'kwh' ? week.kwh : week.cost), 0);
    weeklyBreakdown.forEach((week: WeeklyData) => {
      week.percentage = total > 0 ? Math.round((viewMode === 'kwh' ? week.kwh : week.cost) / total * 100) : 0;
    });

    return weeklyBreakdown;
  }, [chartData, currentMonth, viewMode]);

  const dailyData = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Filter chart data for current month
    const monthPoints = chartData.filter((point: ChartDataPoint) => {
      const pointDate = new Date(point.date);
      return pointDate >= monthStart && pointDate <= monthEnd;
    });

    if (monthPoints.length === 0) {
      return [];
    }

    // Create daily data points
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const dailyBreakdown: DailyData[] = [];

    // Group points by day
    const pointsByDay = new Map<string, ChartDataPoint[]>();
    monthPoints.forEach((point: ChartDataPoint) => {
      const dateKey = format(new Date(point.date), 'yyyy-MM-dd');
      if (!pointsByDay.has(dateKey)) {
        pointsByDay.set(dateKey, []);
      }
      pointsByDay.get(dateKey)!.push(point);
    });
    
    // Calculate consumption for each day
    days.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayPoints = pointsByDay.get(dateKey) || [];
      
      if (dayPoints.length > 0) {
        const totalKwh = dayPoints.reduce((sum: number, point: ChartDataPoint) => sum + point.kwh, 0);
        const totalCost = dayPoints.reduce((sum: number, point: ChartDataPoint) => sum + point.cost, 0);
        
        dailyBreakdown.push({
          date: format(day, 'MMM dd'),
          kwh: Math.round(totalKwh * 100) / 100,
          cost: Math.round(totalCost * 100) / 100
        });
      } else {
        dailyBreakdown.push({
          date: format(day, 'MMM dd'),
          kwh: 0,
          cost: 0
        });
      }
    });

    return dailyBreakdown;
  }, [chartData, currentMonth]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 shadow-lg">
          <p className="">{data.name || data.date}</p>
          <p className="text-xs text-muted-foreground">
            {viewMode === 'kwh' ? `${(data.kwh ?? 0).toFixed(2)} kWh` : `£${(data.cost ?? 0).toFixed(2)}`}
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
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as 'weekly' | 'daily')}
    >
      <Card
        className="border border-dotted text-card-foreground bg-transparent w-full"
        style={{ padding: 'var(--space-md)' }}
      >
        <CardHeader className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <div className="text-base uppercase tracking-wide">
              Consumption Breakdown
            </div>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <TabsContent value="weekly" className="mt-4">
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
              <div className="text-center py-8 text-sm text-muted-foreground">
                No data for this month
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="daily" className="mt-4">
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
              <div className="text-center py-8 text-sm text-muted-foreground">
                No data for this month
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};
