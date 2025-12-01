import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFuelStore } from '@/store/useFuelStore';
import { startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek, eachDayOfInterval, format } from 'date-fns';

interface WeeklyData {
  week: number;
  name: string;
  litres: number;
  cost: number;
  percentage: number;
}

interface DailyData {
  date: string;
  litres: number;
  cost: number;
  litresAdded: number;
}


interface ConsumptionBreakdownProps {
  currentMonth: Date;
  viewMode: 'litres' | 'cost';
}

export const ConsumptionBreakdown: React.FC<ConsumptionBreakdownProps> = ({ currentMonth, viewMode }) => {
  const { topups, preferences } = useFuelStore();
  const [activeTab, setActiveTab] = useState<'weekly' | 'daily'>('weekly');

  const weeklyData = useMemo(() => {
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

    // Calculate weekly breakdown
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
    const weeklyBreakdown: WeeklyData[] = weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart);
      
      // Find topups that fall within this week
      const weekTopups = monthTopups.filter(topup => {
        const topupDate = new Date(topup.date);
        return topupDate >= weekStart && topupDate <= weekEnd;
      });

      let weekLitres = 0;
      let weekCost = 0;
      
      // For fuel, consumption is the litres added in each topup
      weekTopups.forEach(topup => {
        weekLitres += topup.litres;
        weekCost += topup.totalCost;
      });

      return {
        week: index + 1,
        name: `Week ${index + 1}`,
        litres: Math.round(weekLitres * 100) / 100,
        cost: Math.round(weekCost * 100) / 100,
        percentage: 0 // Will be calculated below
      };
    });

    // Calculate percentages
    const total = weeklyBreakdown.reduce((sum, week) => sum + (viewMode === 'litres' ? week.litres : week.cost), 0);
    weeklyBreakdown.forEach(week => {
      week.percentage = total > 0 ? Math.round((viewMode === 'litres' ? week.litres : week.cost) / total * 100) : 0;
    });

    return weeklyBreakdown;
  }, [topups, currentMonth, viewMode]);

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
    
    // Calculate consumption for each day
    days.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayTopups = topupsByDay.get(dateKey) || [];
      
      if (dayTopups.length > 0) {
        const totalLitres = dayTopups.reduce((sum, topup) => sum + topup.litres, 0);
        const totalCost = dayTopups.reduce((sum, topup) => sum + topup.totalCost, 0);
        
        dailyBreakdown.push({
          date: format(day, 'MMM dd'),
          litres: Math.round(totalLitres * 100) / 100,
          cost: Math.round(totalCost * 100) / 100,
          litresAdded: totalLitres
        });
      } else {
        dailyBreakdown.push({
          date: format(day, 'MMM dd'),
          litres: 0,
          cost: 0,
          litresAdded: 0
        });
      }
    });

    return dailyBreakdown;
  }, [topups, currentMonth]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 shadow-lg">
          <p className="">{data.name || data.date}</p>
          <p className="text-xs text-muted-foreground">
            {viewMode === 'litres' ? `${data.litres} L` : `£${data.cost.toFixed(2)}`}
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
                      dataKey={viewMode === 'litres' ? 'litres' : 'cost'} 
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
                      dataKey={viewMode === 'litres' ? 'litres' : 'cost'} 
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
