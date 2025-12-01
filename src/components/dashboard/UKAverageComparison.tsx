import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useElectricityStore } from '../../store/useElectricityStore';

/**
 * UKAverageComparison Component
 * 
 * Displays comparison of user's consumption and cost against UK household averages.
 * Features:
 * - Daily consumption comparison
 * - Daily cost comparison
 * - Visual progress bars showing relative comparison
 * - Tooltips with data source information
 * 
 * Uses Shadcn UI: Card, Progress, Tooltip components
 * Custom styling: Timezone-inspired design system
 */
export const UKAverageComparison: React.FC = () => {
  const { chartData, isLoading } = useElectricityStore();

  // UK average data (from Ofgem statistics)
  const ukAverageDaily = 8.5; // kWh/day
  const ukAverageCost = 2.55; // £/day

  // Calculate user averages from chart data
  const totalConsumption = chartData.reduce((sum, point) => sum + point.kwh, 0);
  const totalCost = chartData.reduce((sum, point) => sum + point.cost, 0);
  const days = chartData.length > 0 ? chartData.length : 1;
  const userAverageDaily = totalConsumption / days;
  const userAverageCost = totalCost / days;

  // Calculate efficiency ratios for progress bars
  const consumptionRatio = ukAverageDaily > 0 ? userAverageDaily / ukAverageDaily : 0;
  const costRatio = ukAverageCost > 0 ? userAverageCost / ukAverageCost : 0;

  if (isLoading && chartData.length === 0) {
    return (
      <Card className="bg-transparent border-dotted w-full" style={{ padding: 'var(--space-md)' }}>
        <CardHeader>
          <CardTitle className="text-lg font-normal uppercase tracking-wide">UK Average Comparison</CardTitle>
          <CardDescription className="text-xs uppercase tracking-normal">
            How your consumption compares to UK household averages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="bg-transparent border-dotted w-full" style={{ padding: 'var(--space-md)' }}>
        <CardHeader>
          <CardTitle className="text-lg font-normal uppercase tracking-wide">UK Average Comparison</CardTitle>
          <CardDescription className="text-xs uppercase tracking-normal">
            How your consumption compares to UK household averages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-xs uppercase tracking-normal text-muted-foreground">
              No data available for comparison
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="bg-transparent border-dotted hover:border-[var(--color-border-strong)] transition-colors duration-200 w-full" style={{ padding: 'var(--space-md)' }}>
        <CardHeader className="px-0 pt-0 pb-0">
          <CardTitle className="text-lg font-normal uppercase tracking-wide mb-2">
            UK Average Comparison
          </CardTitle>
          <CardDescription className="text-xs uppercase tracking-normal text-muted-foreground">
            How your consumption compares to UK household averages
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Consumption Comparison */}
            <div>
              <h4 className="text-xs font-normal uppercase tracking-normal mb-4 flex items-center gap-2">
                Daily Consumption
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name="help-question-mark" className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    <p>UK average data sourced from Ofgem's annual energy consumption statistics (8.5 kWh/day for average UK household)</p>
                  </TooltipContent>
                </Tooltip>
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs uppercase tracking-normal">
                  <span className="text-muted-foreground">Your Average</span>
                  <span className="font-normal tabular-nums">{userAverageDaily.toFixed(1)} kWh</span>
                </div>
                <div className="flex justify-between items-center text-xs uppercase tracking-normal">
                  <span className="text-muted-foreground">UK Average</span>
                  <span className="font-normal tabular-nums">{ukAverageDaily} kWh</span>
                </div>
                <div className="w-full">
                  <Progress 
                    value={Math.min(consumptionRatio * 50, 100)} 
                    className="h-2" 
                  />
                </div>
              </div>
            </div>

            {/* Daily Cost Comparison */}
            <div>
              <h4 className="text-xs font-normal uppercase tracking-normal mb-4 flex items-center gap-2">
                Daily Cost
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name="help-question-mark" className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    <p>UK average cost calculated using Ofgem's average unit rate (£0.30/kWh) × average consumption (8.5 kWh/day) = £2.55/day</p>
                  </TooltipContent>
                </Tooltip>
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs uppercase tracking-normal">
                  <span className="text-muted-foreground">Your Average</span>
                  <span className="font-normal tabular-nums">£{userAverageCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs uppercase tracking-normal">
                  <span className="text-muted-foreground">UK Average</span>
                  <span className="font-normal tabular-nums">£{ukAverageCost}</span>
                </div>
                <div className="w-full">
                  <Progress 
                    value={Math.min(costRatio * 50, 100)} 
                    className="h-2" 
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
