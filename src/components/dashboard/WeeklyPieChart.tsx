import React, { useMemo, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, MoreVertical } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import { useElectricityStore } from '../../store/useElectricityStore';
import { startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek } from 'date-fns';

interface WeeklyData {
  week: number;
  name: string;
  kwh: number;
  cost: number;
  percentage: number;
  color: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--secondary))',
  'hsl(var(--muted-foreground))',
  'hsl(var(--ring))',
  'hsl(var(--foreground))',
];

interface WeeklyPieChartProps {
  currentMonth: Date;
  viewMode: 'kwh' | 'cost';
}

export const WeeklyPieChart: React.FC<WeeklyPieChartProps> = ({ currentMonth, viewMode }) => {
  const { readings, preferences } = useElectricityStore();
  const chartRef = useRef<HTMLDivElement>(null);

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
      const weekReadings = monthReadings.filter(reading => {
        const readingDate = new Date(reading.date);
        return readingDate >= weekStart && readingDate <= weekEnd;
      });

      let weekKwh = 0;
      let weekCost = 0;
      
      for (let i = 1; i < weekReadings.length; i++) {
        const consumption = weekReadings[i].reading - weekReadings[i - 1].reading;
        if (consumption > 0) {
          weekKwh += consumption;
          weekCost += consumption * preferences.unitRate;
        }
      }

      return {
        week: index + 1,
        name: `Week ${index + 1}`,
        kwh: Math.round(weekKwh * 100) / 100,
        cost: Math.round(weekCost * 100) / 100,
        percentage: 0, // Will be calculated below
        color: COLORS[index % COLORS.length]
      };
    });

    // Calculate percentages
    const total = weeklyBreakdown.reduce((sum, week) => sum + (viewMode === 'kwh' ? week.kwh : week.cost), 0);
    weeklyBreakdown.forEach(week => {
      week.percentage = total > 0 ? Math.round((viewMode === 'kwh' ? week.kwh : week.cost) / total * 100) : 0;
    });

    return weeklyBreakdown.filter(week => week.percentage > 0);
  }, [readings, currentMonth, preferences.unitRate, viewMode]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {viewMode === 'kwh' ? `${data.kwh} kWh` : `£${data.cost.toFixed(2)}`}
          </p>
          <p className="text-sm text-muted-foreground">
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
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">
              {entry.value} ({entry.payload.percentage}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  const downloadChart = async (format: 'png' | 'svg') => {
    if (!chartRef.current) return;
    try {
      const dataUrl = format === 'png' 
        ? await toPng(chartRef.current, { quality: 1.0, pixelRatio: 2 })
        : await toSvg(chartRef.current);
      const link = document.createElement('a');
      link.download = `weekly-breakdown.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  if (weeklyData.length === 0) {
    return (
      <Card className="lewis-card lewis-shadow-glow lewis-animation-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-semibold lewis-text-gradient">
            Weekly Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>No data</AlertTitle>
            <AlertDescription>Add meter readings to see weekly breakdown.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lewis-card lewis-shadow-glow lewis-animation-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold lewis-text-gradient">
            Weekly Breakdown ({viewMode === 'kwh' ? 'kWh' : 'Cost'})
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => downloadChart('png')}>
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadChart('svg')}>
                <Download className="h-4 w-4 mr-2" />
                Download SVG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={weeklyData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey={viewMode === 'kwh' ? 'kwh' : 'cost'}
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
            <div className="text-lg font-bold lewis-text-gradient">
              {weeklyData.reduce((sum, week) => sum + week.kwh, 0).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Total kWh</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold lewis-text-gradient">
              £{weeklyData.reduce((sum, week) => sum + week.cost, 0).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Cost</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
