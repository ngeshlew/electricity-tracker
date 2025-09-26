import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useElectricityStore } from '../../store/useElectricityStore';
import { startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';
import { formatDateUK, getWeekStart, getWeekEnd, getWeekNumber } from '../../utils/dateFormatters';

interface WeeklyData {
  week: number;
  startDate: Date;
  endDate: Date;
  kwh: number;
  cost: number;
  days: number;
}

interface MonthlyOverviewProps {
  currentMonth: Date;
}

export const MonthlyOverview: React.FC<MonthlyOverviewProps> = ({ currentMonth }) => {
  const { readings, preferences } = useElectricityStore();

  const monthlyData = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Filter readings for current month
    const monthReadings = readings.filter(reading => {
      const readingDate = new Date(reading.date);
      return readingDate >= monthStart && readingDate <= monthEnd;
    });

    // If fewer than 2 readings in the month, attempt to include the last reading before the month
    // to compute a delta for the first in-month reading.
    let workingReadings = monthReadings;
    if (workingReadings.length < 2) {
      const priorReadings = readings
        .filter(r => new Date(r.date) < monthStart)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const lastBeforeMonth = priorReadings[0];
      if (lastBeforeMonth && workingReadings.length === 1) {
        workingReadings = [lastBeforeMonth, ...workingReadings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
    }

    if (workingReadings.length < 2) {
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
    
    for (let i = 1; i < workingReadings.length; i++) {
      const consumption = workingReadings[i].reading - workingReadings[i - 1].reading;
      if (consumption > 0) {
        totalKwh += consumption;
        totalCost += consumption * preferences.unitRate;
      }
    }

    // Calculate weekly breakdown using Monday as week start
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
    const weeklyBreakdown: WeeklyData[] = weeks.map((weekStart) => {
      // Use our custom week calculation for Monday start
      const actualWeekStart = getWeekStart(weekStart);
      const actualWeekEnd = getWeekEnd(weekStart);
      
      // Get all readings that fall within this week (including boundary dates)
      const weekReadings = workingReadings.filter(reading => {
        const readingDate = new Date(reading.date);
        return readingDate >= actualWeekStart && readingDate <= actualWeekEnd;
      });

      let weekKwh = 0;
      let weekCost = 0;
      
      // Sort readings by date to ensure proper order
      const sortedWeekReadings = weekReadings.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Calculate consumption within this week
      for (let i = 1; i < sortedWeekReadings.length; i++) {
        const currentReading = sortedWeekReadings[i];
        const previousReading = sortedWeekReadings[i - 1];
        
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
      
      // If no readings in this week, try to find consumption from readings that span this week
      if (sortedWeekReadings.length === 0) {
        // Find the last reading before or on the start of this week
        const previousReadings = workingReadings.filter(reading => {
          const readingDate = new Date(reading.date);
          return readingDate <= actualWeekStart;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Find the first reading after or on the end of this week
        const nextReadings = workingReadings.filter(reading => {
          const readingDate = new Date(reading.date);
          return readingDate >= actualWeekEnd;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        if (previousReadings.length > 0 && nextReadings.length > 0) {
          const lastReadingBeforeWeek = previousReadings[0];
          const firstReadingAfterWeek = nextReadings[0];
          
          // Only calculate if neither is a first reading
          if (!lastReadingBeforeWeek.isFirstReading && !firstReadingAfterWeek.isFirstReading) {
            const consumption = firstReadingAfterWeek.reading - lastReadingBeforeWeek.reading;
            if (consumption > 0) {
              // Calculate the portion of consumption that belongs to this week
              const totalDays = Math.ceil((new Date(firstReadingAfterWeek.date).getTime() - new Date(lastReadingBeforeWeek.date).getTime()) / (1000 * 60 * 60 * 24));
              const weekDays = 7;
              const weekPortion = Math.min(weekDays / totalDays, 1);
              
              weekKwh = consumption * weekPortion;
              weekCost = weekKwh * preferences.unitRate;
            }
          }
        }
      } else if (sortedWeekReadings.length === 1) {
        // If there's only one reading in the week, we need to find the previous reading to calculate consumption
        const currentReading = sortedWeekReadings[0];
        
        // Find the last reading before this week
        const previousReadings = workingReadings.filter(reading => {
          const readingDate = new Date(reading.date);
          return readingDate < actualWeekStart;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (previousReadings.length > 0) {
          const lastReadingBeforeWeek = previousReadings[0];
          
          // Only calculate if current reading is not a first reading
          if (!currentReading.isFirstReading) {
            const consumption = currentReading.reading - lastReadingBeforeWeek.reading;
            if (consumption > 0) {
              // Calculate the portion of consumption that belongs to this week
              const totalDays = Math.ceil((new Date(currentReading.date).getTime() - new Date(lastReadingBeforeWeek.date).getTime()) / (1000 * 60 * 60 * 24));
              const weekDays = Math.min(7, totalDays);
              const weekPortion = weekDays / totalDays;
              
              weekKwh = consumption * weekPortion;
              weekCost = weekKwh * preferences.unitRate;
            }
          }
        }
      }

      const weekData = {
        week: getWeekNumber(actualWeekStart),
        startDate: actualWeekStart,
        endDate: actualWeekEnd,
        kwh: Math.round(weekKwh * 100) / 100,
        cost: Math.round(weekCost * 100) / 100,
        days: Math.min(7, Math.ceil((actualWeekEnd.getTime() - actualWeekStart.getTime()) / (1000 * 60 * 60 * 24)))
      };


      return weekData;
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
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">
              Monthly Overview
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Monthly electricity consumption summary including estimated readings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Monthly Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3  bg-muted/30">
            <div className="text-xl  text-primary">
              {monthlyData.totalKwh}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total kWh</div>
          </div>
          <div className="text-center p-3  bg-muted/30">
            <div className="text-xl  text-primary">
              £{monthlyData.totalCost.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Cost</div>
          </div>
          <div className="text-center p-3  bg-muted/30">
            <div className="text-xl  text-primary">
              {monthlyData.averageDaily}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Daily Avg</div>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-xl">{getTrendIcon(monthlyData.trend)}</span>
          <span className={`text-xs  ${getTrendColor(monthlyData.trend)}`}>
            {monthlyData.trend.charAt(0).toUpperCase() + monthlyData.trend.slice(1)} trend
          </span>
        </div>

        {/* Weekly Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs  text-muted-foreground">Weekly Breakdown</h4>
          <div className="space-y-2">
            {monthlyData.weeklyBreakdown.map((week) => (
              <div
                key={week.week}
                className="flex items-center justify-between p-3  bg-muted/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8  bg-primary/20 flex items-center justify-center text-xs ">
                    {week.week}
                  </div>
                  <div>
                    <div className="text-xs ">
                      Week {week.week}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateUK(week.startDate, 'chart')} - {formatDateUK(week.endDate, 'chart')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs ">
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
    </TooltipProvider>
  );
};
