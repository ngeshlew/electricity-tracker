import React from 'react';
import { 
  Card,
  CardHeader,
} from "@/components/ui/card";
import { LoadingCard } from "@/components/ui/skeleton";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { useElectricityStore } from '../../store/useElectricityStore';

/**
 * SummaryCards Component
 * 
 * Displays key analytics metrics in a responsive card layout.
 * Features:
 * - Dynamic data based on time period and view mode
 * - Trend indicators with color coding
 * - Responsive grid layout
 * - Real-time data updates
 * 
 * Uses Shadcn UI: Card, CardContent, CardHeader, CardTitle components
 * Uses Heroicons: BoltIcon, CurrencyPoundIcon, ChartBarIcon, ArrowTrendingUpIcon
 * Custom styling: Lewis-Linear design system
 */

// Type definitions for component props
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ViewMode = 'kwh' | 'cost';

interface SummaryCardProps {
  title: string;        // Card title (e.g., "Total Consumption")
  value: string;        // Main value display (e.g., "125.5 kWh")
  change: string;       // Change indicator (e.g., "+5.2%")
  changeValue: string;  // Change percentage (e.g., "+12.5%")
  description: string;  // Description text
  icon: React.ReactNode; // Heroicon component
  trendIcon: React.ReactNode; // Trend icon
}

/**
 * SummaryCard Component
 * 
 * Individual summary card displaying a single metric.
 * Features:
 * - Icon, title, value, and change indicator
 * - Color-coded change indicators
 * - Hover animations
 * - Responsive design
 * 
 * Uses Shadcn UI: Card, CardContent, CardHeader, CardTitle
 * Custom styling: Lewis-Linear design system
 */
const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  changeValue,
  trendIcon
}) => {
  // Determine if change is positive/negative for color coding
  // Use semantic colors: red for increases (cost/consumption), muted for stable
  const isPositive = changeValue.startsWith('+');
  const isNegative = changeValue.startsWith('-');
  const changeColor = isPositive 
    ? 'text-[var(--color-accent-red)]' 
    : isNegative 
    ? 'text-[var(--color-success)]' 
    : 'text-muted-foreground';
  
  return (
    <Card className="bg-transparent text-card-foreground flex flex-col border-dashed hover:border-[var(--color-border-strong)] transition-colors duration-200 w-full" role="region" aria-label={`${title} statistics`} style={{ padding: 'var(--space-md)' }}>
      <CardHeader className="px-0 pt-0 pb-0 text-center">
        {/* Label - Uppercase, small, muted */}
        <div className="text-muted-foreground text-xs uppercase tracking-wider mb-6" aria-label={`Metric: ${title}`}>
          {title.replace('Total ', '').replace('Daily ', '')}
        </div>
        
        {/* Primary Value - Largest element (40px) */}
        <div className="text-4xl font-normal tabular-nums mb-6" style={{ fontSize: 'var(--text-3xl)', lineHeight: '1' }} aria-label={`Current value: ${value}`}>
          {value}
        </div>
        
        {/* Secondary: Percentage change (16-18px) */}
        <div className={`flex items-center justify-center gap-1.5 text-base font-normal mb-4 ${changeColor}`} aria-label={`Change: ${changeValue} compared to last month`}>
          <span aria-hidden="true">{trendIcon}</span>
          <span>{changeValue}</span>
        </div>
        
        {/* Dashed divider */}
        <div className="border-t border-dashed border-border mb-4" style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }} aria-hidden="true"></div>
        
        {/* Context label - VS LAST MONTH (11px) */}
        <div className="text-xs uppercase tracking-normal text-muted-foreground" aria-label="Comparison period">
          VS LAST MONTH
        </div>
      </CardHeader>
    </Card>
  );
};

interface SummaryCardsProps {
  currentMonth: Date;
}

/**
 * SummaryCards Component
 * 
 * Main container component that displays multiple summary cards.
 * Features:
 * - Dynamic data calculation based on time period
 * - Responsive grid layout
 * - Real-time data updates
 * - Period comparison calculations
 * 
 * Uses Shadcn UI: Card components (via SummaryCard)
 * Custom styling: Lewis-Linear design system
 */
export const SummaryCards: React.FC<SummaryCardsProps> = ({ currentMonth }) => {
  const { chartData, isLoading } = useElectricityStore();
  
  // Show skeleton loading state
  if (isLoading && chartData.length === 0) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
        {[...Array(4)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  }
  
  
  // Use monthly as default time period
  const timePeriod = 'monthly' as TimePeriod;
  
  // Calculate data based on time period
  const getCurrentPeriodData = () => {
    const now = new Date();
    
    switch (timePeriod) {
      case 'daily': {
        const today = now.toISOString().split('T')[0];
        return chartData.filter(point => point.date === today);
      }
      case 'weekly': {
        const weekStart = new Date(now);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return chartData.filter(point => {
          const pointDate = new Date(point.date);
          return pointDate >= weekStart && pointDate <= weekEnd;
        });
      }
      case 'monthly': {
        return chartData.filter(point => {
          const pointDate = new Date(point.date);
          return pointDate.getMonth() === currentMonth.getMonth() && 
                 pointDate.getFullYear() === currentMonth.getFullYear();
        });
      }
      case 'yearly': {
        return chartData.filter(point => {
          const pointDate = new Date(point.date);
          return pointDate.getFullYear() === now.getFullYear();
        });
      }
      default:
        return chartData;
    }
  };
  
  const currentPeriodData = getCurrentPeriodData();
  
  const totalKwh = currentPeriodData.reduce((sum, point) => sum + point.kwh, 0);
  const totalCost = currentPeriodData.reduce((sum, point) => sum + point.cost, 0);
  const averageDaily = currentPeriodData.length > 0 ? totalKwh / currentPeriodData.length : 0;
  
  // Calculate previous period for comparison
  const getPreviousPeriodData = () => {
    const now = new Date();
    
    switch (timePeriod) {
      case 'daily': {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return chartData.filter(point => point.date === yesterday.toISOString().split('T')[0]);
      }
      case 'weekly': {
        const lastWeekStart = new Date(now);
        const day = lastWeekStart.getDay();
        const diff = lastWeekStart.getDate() - day + (day === 0 ? -6 : 1) - 7;
        lastWeekStart.setDate(diff);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        
        return chartData.filter(point => {
          const pointDate = new Date(point.date);
          return pointDate >= lastWeekStart && pointDate <= lastWeekEnd;
        });
      }
      case 'monthly': {
        // Calculate previous month based on currentMonth prop, not current date
        const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        return chartData.filter(point => {
          const pointDate = new Date(point.date);
          return pointDate.getMonth() === previousMonth.getMonth() && 
                 pointDate.getFullYear() === previousMonth.getFullYear();
        });
      }
      case 'yearly': {
        const lastYear = new Date(now.getFullYear() - 1, 0, 1);
        return chartData.filter(point => {
          const pointDate = new Date(point.date);
          return pointDate.getFullYear() === lastYear.getFullYear();
        });
      }
      default:
        return [];
    }
  };
  
  const previousPeriodData = getPreviousPeriodData();
  const previousTotalKwh = previousPeriodData.reduce((sum, point) => sum + point.kwh, 0);
  const previousTotalCost = previousPeriodData.reduce((sum, point) => sum + point.cost, 0);
  
  // Calculate average daily for current and previous periods
  const currentPeriodDays = currentPeriodData.length > 0 ? currentPeriodData.length : 1;
  const previousPeriodDays = previousPeriodData.length > 0 ? previousPeriodData.length : 1;
  const currentAverageDaily = totalKwh / currentPeriodDays;
  const previousAverageDaily = previousTotalKwh / previousPeriodDays;
  
  // Calculate percentage changes
  const kwhChange = previousTotalKwh > 0 ? ((totalKwh - previousTotalKwh) / previousTotalKwh) * 100 : 0;
  const costChange = previousTotalCost > 0 ? ((totalCost - previousTotalCost) / previousTotalCost) * 100 : 0;
  const averageDailyChange = previousAverageDaily > 0 ? ((currentAverageDaily - previousAverageDaily) / previousAverageDaily) * 100 : 0;
  
  // Determine trend based on actual change
  const getTrendFromChange = (change: number): 'increasing' | 'decreasing' | 'stable' => {
    if (Math.abs(change) < 0.1) return 'stable';
    return change > 0 ? 'increasing' : 'decreasing';
  };
  
  const averageTrend = getTrendFromChange(averageDailyChange);

  // Calculate average consumption for insights
  const allTimeAverage = chartData.length > 0 
    ? chartData.reduce((sum, point) => sum + point.kwh, 0) / chartData.length 
    : 0;
  const comparisonToAverage = allTimeAverage > 0 
    ? ((currentAverageDaily - allTimeAverage) / allTimeAverage) * 100 
    : 0;

  // Determine trend icons based on change direction
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const cards = [
    {
      title: 'Consumption',
      value: `${totalKwh.toFixed(1)} KWH`,
      change: kwhChange >= 0 ? 'Higher than last month' : 'Lower than last month',
      changeValue: `${kwhChange >= 0 ? '+' : ''}${kwhChange.toFixed(1)}%`,
      description: `Consumption for the last ${timePeriod === 'daily' ? 'day' : timePeriod}`,
      icon: <TrendingUp className="h-3 w-3" />,
      trendIcon: getTrendIcon(kwhChange)
    },
    {
      title: 'Cost',
      value: `£${totalCost.toFixed(2)}`,
      change: costChange >= 0 ? 'Higher than last month' : 'Lower than last month',
      changeValue: `${costChange >= 0 ? '+' : ''}${costChange.toFixed(1)}%`,
      description: `Spending for the last ${timePeriod === 'daily' ? 'day' : timePeriod}`,
      icon: costChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />,
      trendIcon: getTrendIcon(costChange)
    },
    {
      title: 'Daily Average',
      value: `${currentAverageDaily.toFixed(2)} KWH`,
      change: averageTrend === 'increasing' ? 'Higher than last month' : averageTrend === 'decreasing' ? 'Lower than last month' : 'Same as last month',
      changeValue: `${averageDailyChange >= 0 ? '+' : ''}${averageDailyChange.toFixed(1)}%`,
      description: `Average daily usage`,
      icon: averageTrend === 'increasing' ? <TrendingUp className="h-3 w-3" /> : averageTrend === 'decreasing' ? <TrendingDown className="h-3 w-3" /> : <Activity className="h-3 w-3" />,
      trendIcon: getTrendIcon(averageDailyChange)
    },
    {
      title: 'Efficiency',
      value: `${Math.max(0, Math.min(100, (averageDaily / 20) * 100)).toFixed(1)}%`,
      change: averageDaily > 15 ? 'Above target' : averageDaily > 10 ? 'Near target' : 'Below target',
      changeValue: averageDaily > 15 ? '+15.2%' : averageDaily > 10 ? '+2.1%' : '-8.3%',
      description: 'Based on daily average consumption',
      icon: averageDaily > 15 ? <TrendingUp className="h-3 w-3" /> : averageDaily > 10 ? <Activity className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />,
      trendIcon: averageDaily > 15 ? <TrendingUp className="h-4 w-4" /> : averageDaily > 10 ? <Activity className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-4 w-full">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
        {cards.map((card, index) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            changeValue={card.changeValue}
            description={card.description}
            icon={card.icon}
            trendIcon={card.trendIcon}
          />
        ))}
      </div>
      
      {/* Insights Section */}
      {allTimeAverage > 0 && Math.abs(comparisonToAverage) > 1 && (
        <div className="text-center py-3 px-4 border-t border-dashed border-border">
          <p className="text-xs uppercase tracking-normal text-muted-foreground font-mono">
            {comparisonToAverage < 0 
              ? `YOU'RE USING ${Math.abs(comparisonToAverage).toFixed(0)}% LESS THAN AVERAGE`
              : `YOU'RE USING ${comparisonToAverage.toFixed(0)}% MORE THAN AVERAGE`
            }
          </p>
        </div>
      )}
    </div>
  );
};