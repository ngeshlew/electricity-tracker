import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-simple';
import { Button } from '@/components/ui/button-simple';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useElectricityStore } from '../../store/useElectricityStore';
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek } from 'date-fns';
import { formatDateUK, getWeekStart, getWeekEnd, getWeekNumber } from '../../utils/dateFormatters';

interface WeeklyData {
  week: number;
  startDate: Date;
  endDate: Date;
  kwh: number;
  cost: number;
  days: number;
}

export const MonthlyOverview: React.FC = () => {
  const { readings, preferences } = useElectricityStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthlyData = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Filter readings for current month
    const monthReadings = readings.filter(reading => {
      const readingDate = new Date(reading.date);
      return readingDate >= monthStart && readingDate <= monthEnd;
    });

    if (monthReadings.length < 2) {
      return {
        totalKwh: 0,
        totalCost: 0,
        averageDaily: 0,
        weeklyBreakdown: [],
        trend: 'stable' as const
      };
    }

    // Calculate total consumption for the month
    let totalKwh = 0;
    let totalCost = 0;
    
    for (let i = 1; i < monthReadings.length; i++) {
      const consumption = monthReadings[i].reading - monthReadings[i - 1].reading;
      if (consumption > 0) {
        totalKwh += consumption;
        totalCost += consumption * preferences.unitRate;
      }
    }

    // Calculate weekly breakdown using Monday as week start
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
    const weeklyBreakdown: WeeklyData[] = weeks.map((weekStart, index) => {
      // Use our custom week calculation for Monday start
      const actualWeekStart = getWeekStart(weekStart);
      const actualWeekEnd = getWeekEnd(weekStart);
      const weekReadings = monthReadings.filter(reading => {
        const readingDate = new Date(reading.date);
        return readingDate >= actualWeekStart && readingDate <= actualWeekEnd;
      });

      let weekKwh = 0;
      let weekCost = 0;
      
      for (let i = 1; i < weekReadings.length; i++) {
        const currentReading = weekReadings[i];
        const previousReading = weekReadings[i - 1];
        
        // Skip consumption calculation if current reading is marked as first reading
        if (currentReading.isFirstReading) {
          continue;
        }
        
        const consumption = currentReading.reading - previousReading.reading;
        if (consumption > 0) {
          weekKwh += consumption;
          weekCost += consumption * preferences.unitRate;
        }
      }

      return {
        week: getWeekNumber(actualWeekStart),
        startDate: actualWeekStart,
        endDate: actualWeekEnd,
        kwh: Math.round(weekKwh * 100) / 100,
        cost: Math.round(weekCost * 100) / 100,
        days: Math.min(7, Math.ceil((actualWeekEnd.getTime() - actualWeekStart.getTime()) / (1000 * 60 * 60 * 24)))
      };
    });

    // Calculate trend
    const firstHalf = weeklyBreakdown.slice(0, Math.floor(weeklyBreakdown.length / 2));
    const secondHalf = weeklyBreakdown.slice(Math.floor(weeklyBreakdown.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, week) => sum + week.kwh, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, week) => sum + week.kwh, 0) / secondHalf.length;
    
    const difference = secondHalfAvg - firstHalfAvg;
    const threshold = firstHalfAvg * 0.05;
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (difference > threshold) trend = 'increasing';
    else if (difference < -threshold) trend = 'decreasing';

    return {
      totalKwh: Math.round(totalKwh * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      averageDaily: Math.round((totalKwh / monthEnd.getDate()) * 100) / 100,
      weeklyBreakdown,
      trend
    };
  }, [readings, currentMonth, preferences.unitRate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '📈';
      case 'decreasing':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-electric-red';
      case 'decreasing':
        return 'text-electric-green';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="lewis-card lewis-shadow-glow lewis-animation-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold lewis-text-gradient">
          Monthly Overview
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 lewis-card-hover"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {format(currentMonth, 'MMM yyyy')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 lewis-card-hover"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Monthly Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold lewis-text-gradient">
              {monthlyData.totalKwh}
            </div>
            <div className="text-sm text-muted-foreground">Total kWh</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold lewis-text-gradient">
              £{monthlyData.totalCost.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold lewis-text-gradient">
              {monthlyData.averageDaily}
            </div>
            <div className="text-sm text-muted-foreground">Daily Avg</div>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">{getTrendIcon(monthlyData.trend)}</span>
          <span className={`text-sm font-medium ${getTrendColor(monthlyData.trend)}`}>
            {monthlyData.trend.charAt(0).toUpperCase() + monthlyData.trend.slice(1)} trend
          </span>
        </div>

        {/* Weekly Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Weekly Breakdown</h4>
          <div className="space-y-2">
            {monthlyData.weeklyBreakdown.map((week) => (
              <div
                key={week.week}
                className="flex items-center justify-between p-3 rounded-lg lewis-card-hover bg-muted/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-electric-purple/20 flex items-center justify-center text-sm font-medium">
                    {week.week}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      Week {week.week}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateUK(week.startDate, 'chart')} - {formatDateUK(week.endDate, 'chart')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {week.kwh} kWh
                  </div>
                  <div className="text-xs text-muted-foreground">
                    £{week.cost.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
