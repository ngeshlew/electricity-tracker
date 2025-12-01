import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/ui/icon";
import { useFuelStore } from '@/store/useFuelStore';

/**
 * AnnualProgressCards Component
 * 
 * Displays annual usage and cost progress cards with targets.
 * Features:
 * - Annual usage progress tracking
 * - Annual cost progress tracking
 * - Progress bars and percentage indicators
 * - Status indicators (On track/Over target)
 * 
 * Uses Shadcn UI: Card, Progress components
 * Custom styling: Timezone-inspired design system
 */
export const AnnualProgressCards: React.FC = () => {
  const { chartData, isLoading } = useFuelStore();
  
  // Fuel-specific annual targets (litres and cost)
  const getAnnualTargets = () => ({
    usage: 912.5, // ~2.5 L/day × 365 days
    cost: 3000 // Estimated annual fuel cost target
  });

  // Filter chart data to only include current year (January 1st to today)
  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1); // January 1st of current year
  yearStart.setHours(0, 0, 0, 0); // Start of day
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today

  const yearChartData = chartData.filter(point => {
    if (!point.date) return false;
    // chartData dates are stored as YYYY-MM-DD strings
    const pointDate = new Date(point.date + 'T00:00:00'); // Add time to avoid timezone issues
    pointDate.setHours(0, 0, 0, 0);
    return pointDate >= yearStart && pointDate <= today;
  });

  // Calculate total consumption and cost from current year's chart data only
  const totalConsumption = yearChartData.reduce((sum, point) => sum + point.litres, 0);
  const totalCost = yearChartData.reduce((sum, point) => sum + point.cost, 0);

  // Get annual targets
  const annualTargets = getAnnualTargets();
  const annualUsageTarget = annualTargets.usage; // 1180.1 kWh
  const annualCostTarget = annualTargets.cost; // £458.69

  // Calculate progress percentages
  const annualUsageProgress = annualUsageTarget > 0 
    ? (totalConsumption / annualUsageTarget) * 100 
    : 0;
  const annualCostProgress = annualCostTarget > 0 
    ? (totalCost / annualCostTarget) * 100 
    : 0;

  // Calculate daily averages for UK comparison (based on days with data in current year)
  const daysWithData = yearChartData.length > 0 ? yearChartData.length : 1;
  const userAverageDaily = totalConsumption / daysWithData;
  const userAverageCost = totalCost / daysWithData;
  
  // UK average data (fuel consumption)
  const ukAverageDaily = 2.5; // L/day (average UK fuel consumption)
  const ukAverageCost = 3.50; // £/day (estimated average fuel cost)
  
  // Calculate ratios for progress bars
  const consumptionRatio = ukAverageDaily > 0 ? userAverageDaily / ukAverageDaily : 0;
  const costRatio = ukAverageCost > 0 ? userAverageCost / ukAverageCost : 0;

  // Determine status
  const usageStatus = annualUsageProgress > 100 ? 'Over target' : 'On track';
  const costStatus = annualCostProgress > 100 ? 'Over budget' : 'On budget';

  if (isLoading && chartData.length === 0) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 w-full">
        <Card className="bg-transparent border-dotted" style={{ padding: 'var(--space-md)' }}>
          <CardHeader>
            <CardTitle className="text-lg font-normal uppercase tracking-wide">Annual Usage Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-20 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card className="bg-transparent border-dotted" style={{ padding: 'var(--space-md)' }}>
          <CardHeader>
            <CardTitle className="text-lg font-normal uppercase tracking-wide">Annual Cost Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-20 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 w-full">
      {/* Annual Usage Progress Card */}
      <Card className="bg-transparent border-dotted hover:border-[var(--color-border-strong)] transition-colors duration-200 w-full" style={{ padding: 'var(--space-md)' }}>
        <CardHeader className="px-0 pt-0 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="target" className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
              Annual Usage Progress
            </CardTitle>
          </div>
          <div className="text-2xl font-normal tabular-nums mb-2" style={{ fontSize: 'var(--text-2xl)', lineHeight: '1' }}>
            {totalConsumption.toFixed(1)} L
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-2">
          <div className="flex justify-between items-center text-xs uppercase tracking-normal">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-normal tabular-nums">{annualUsageProgress.toFixed(1)}%</span>
          </div>
          <Progress value={Math.min(annualUsageProgress, 100)} className="h-2" />
          <div className="flex justify-between items-center text-xs uppercase tracking-normal text-muted-foreground pt-2">
            <span>Target: {annualUsageTarget.toFixed(1)} L</span>
            <span className={annualUsageProgress > 100 ? 'text-[var(--color-accent-red)]' : 'text-[var(--color-success)]'}>
              {usageStatus}
            </span>
          </div>
          
          {/* Daily Consumption Comparison */}
          <div className="pt-4 mt-4 border-t border-dotted border-border">
            <div className="text-xs font-normal uppercase tracking-wider text-muted-foreground mb-3">
              Daily Consumption
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs uppercase tracking-normal">
                <span className="text-muted-foreground">Your Average</span>
                <span className="font-normal tabular-nums">{userAverageDaily.toFixed(1)} L</span>
              </div>
              <div className="flex justify-between items-center text-xs uppercase tracking-normal">
                <span className="text-muted-foreground">UK Average</span>
                <span className="font-normal tabular-nums">{ukAverageDaily} L</span>
              </div>
              <Progress 
                value={Math.min(consumptionRatio * 50, 100)} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Annual Cost Progress Card */}
      <Card className="bg-transparent border-dotted hover:border-[var(--color-border-strong)] transition-colors duration-200 w-full" style={{ padding: 'var(--space-md)' }}>
        <CardHeader className="px-0 pt-0 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="lightning-energy" className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
              Annual Cost Progress
            </CardTitle>
          </div>
          <div className="text-2xl font-normal tabular-nums mb-2" style={{ fontSize: 'var(--text-2xl)', lineHeight: '1' }}>
            £{totalCost.toFixed(2)}
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-2">
          <div className="flex justify-between items-center text-xs uppercase tracking-normal">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-normal tabular-nums">{annualCostProgress.toFixed(1)}%</span>
          </div>
          <Progress value={Math.min(annualCostProgress, 100)} className="h-2" />
          <div className="flex justify-between items-center text-xs uppercase tracking-normal text-muted-foreground pt-2">
            <span>Target: £{annualCostTarget.toFixed(2)}</span>
            <span className={annualCostProgress > 100 ? 'text-[var(--color-accent-red)]' : 'text-[var(--color-success)]'}>
              {costStatus}
            </span>
          </div>
          
          {/* Daily Cost Comparison */}
          <div className="pt-4 mt-4 border-t border-dotted border-border">
            <div className="text-xs font-normal uppercase tracking-wider text-muted-foreground mb-3">
              Daily Cost
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs uppercase tracking-normal">
                <span className="text-muted-foreground">Your Average</span>
                <span className="font-normal tabular-nums">£{userAverageCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs uppercase tracking-normal">
                <span className="text-muted-foreground">UK Average</span>
                <span className="font-normal tabular-nums">£{ukAverageCost}</span>
              </div>
              <Progress 
                value={Math.min(costRatio * 50, 100)} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

