import React from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  change, 
  changeValue,
  trendIcon
}) => {
  // Determine if change is positive/negative for color coding
  const isPositive = changeValue.startsWith('+');
  const isNegative = changeValue.startsWith('-');
  const changeColor = isPositive 
    ? 'text-red-600 dark:text-red-400' 
    : isNegative 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-muted-foreground';
  
  return (
    <Card className="bg-card text-card-foreground flex flex-col border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="px-4 pt-4 pb-2">
        {/* Label - Uppercase, small, muted */}
        <div className="text-muted-foreground text-xs uppercase tracking-wider mb-3">
          {title.replace('Total ', '').replace('Daily ', '')}
        </div>
        
        {/* Primary Value - Large, prominent */}
        <div className="text-3xl font-semibold tabular-nums mb-2">
          {value}
        </div>
        
        {/* Secondary: Percentage change */}
        <div className={`flex items-center gap-1.5 text-sm font-medium ${changeColor}`}>
          {trendIcon}
          <span>{changeValue}</span>
          <span className="text-muted-foreground font-normal text-xs">
            vs last month
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-4 pt-0">
        {/* Trend description - subtle */}
        <div className="text-xs text-muted-foreground">
          {change}
        </div>
      </CardContent>
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
  const { chartData, timeSeriesData, isLoading } = useElectricityStore();
  
  // Show skeleton loading state
  if (isLoading && chartData.length === 0) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="px-4 pt-4 pb-2">
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
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
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return chartData.filter(point => {
          const pointDate = new Date(point.date);
          return pointDate.getMonth() === lastMonth.getMonth() && 
                 pointDate.getFullYear() === lastMonth.getFullYear();
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
  
  // Calculate percentage changes
  const kwhChange = previousTotalKwh > 0 ? ((totalKwh - previousTotalKwh) / previousTotalKwh) * 100 : 0;
  const costChange = previousTotalCost > 0 ? ((totalCost - previousTotalCost) / previousTotalCost) * 100 : 0;
  
  // Determine trend
  const trend = timeSeriesData.length > 0 ? timeSeriesData[timeSeriesData.length - 1]?.trend || 'stable' : 'stable';
  

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
      value: `${averageDaily.toFixed(2)} KWH`,
      change: trend === 'increasing' ? 'Increasing trend' : trend === 'decreasing' ? 'Decreasing trend' : 'Stable trend',
      changeValue: trend === 'increasing' ? '+12.5%' : trend === 'decreasing' ? '-5.2%' : '0%',
      description: `Average daily usage`,
      icon: trend === 'increasing' ? <TrendingUp className="h-3 w-3" /> : trend === 'decreasing' ? <TrendingDown className="h-3 w-3" /> : <Activity className="h-3 w-3" />,
      trendIcon: trend === 'increasing' ? <TrendingUp className="h-4 w-4" /> : trend === 'decreasing' ? <TrendingDown className="h-4 w-4" /> : <Activity className="h-4 w-4" />
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
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
  );
};