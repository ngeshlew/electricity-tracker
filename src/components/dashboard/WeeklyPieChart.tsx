import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from "@/components/ui/icon";
import { useFuelStore } from '@/store/useFuelStore';
import { startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek } from 'date-fns';

interface WeeklyData {
  week: number;
  name: string;
  litres: number;
  cost: number;
  percentage: number;
  color: string;
}

const COLORS = [
  'hsl(var(--electric-purple))',
  'hsl(var(--electric-pink))',
  'hsl(var(--electric-blue))',
  'hsl(var(--electric-green))',
  'hsl(var(--electric-orange))',
  'hsl(var(--electric-red))',
];

interface WeeklyPieChartProps {
  currentMonth: Date;
  viewMode: 'litres' | 'cost';
}

export const WeeklyPieChart: React.FC<WeeklyPieChartProps> = ({ currentMonth, viewMode }) => {
  const { topups } = useFuelStore();

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
        percentage: 0, // Will be calculated below
        color: COLORS[index % COLORS.length]
      };
    });

    // Calculate percentages
    const total = weeklyBreakdown.reduce((sum, week) => sum + (viewMode === 'litres' ? week.litres : week.cost), 0);
    weeklyBreakdown.forEach(week => {
      week.percentage = total > 0 ? Math.round((viewMode === 'litres' ? week.litres : week.cost) / total * 100) : 0;
    });

    return weeklyBreakdown.filter(week => week.percentage > 0);
  }, [topups, currentMonth, viewMode]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 shadow-lg">
          <p className="">{data.name}</p>
          <p className="text-xs text-muted-foreground">
            {viewMode === 'litres' ? `${data.litres} L` : `£${data.cost.toFixed(2)}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {data.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 "
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">
              {entry.value} ({entry.payload.percentage}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (weeklyData.length === 0) {
    return (
      <Card className="lewis-card lewis-shadow-glow lewis-animation-fade-in">
        <CardHeader>
          <CardTitle className="text-base lewis-text-gradient">
            Weekly Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Icon name="pie-chart" className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No data available for this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lewis-card lewis-shadow-glow lewis-animation-fade-in">
      <CardHeader>
        <CardTitle className="text-base lewis-text-gradient">
          Weekly Breakdown ({viewMode === 'litres' ? 'Litres' : 'Cost'})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={weeklyData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey={viewMode === 'litres' ? 'litres' : 'cost'}
                stroke="hsl(var(--border))"
                strokeWidth={2}
              >
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-base lewis-text-gradient">
              {weeklyData.reduce((sum, week) => sum + week.litres, 0).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Total Litres</div>
          </div>
          <div className="text-center">
            <div className="text-base lewis-text-gradient">
              £{weeklyData.reduce((sum, week) => sum + week.cost, 0).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Total Cost</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
