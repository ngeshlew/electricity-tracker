import React from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
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
  description,
  icon,
  trendIcon
}) => {
  
  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-2 border py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-3">
        <div className="text-muted-foreground text-xs">
          {title}
        </div>
        <div className="text-lg tabular-nums">
          {value}
        </div>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <span className="inline-flex items-center justify-center border px-1.5 py-0.5 text-xs  w-fit whitespace-nowrap shrink-0 gap-1">
            {icon}
            {changeValue}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex px-3 flex-col items-start gap-1 text-xs">
        <div className="line-clamp-1 flex gap-2 ">
          {change} {trendIcon}
        </div>
        <div className="text-muted-foreground text-xs">
          {description}
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
  const { chartData, timeSeriesData } = useElectricityStore();
  
  
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
  

  const cards = [
    {
      title: 'Total Consumption',
      value: `${totalKwh.toFixed(1)} kWh`,
      change: kwhChange >= 0 ? 'Trending up this period' : 'Down this period',
      changeValue: `${kwhChange >= 0 ? '+' : ''}${kwhChange.toFixed(1)}%`,
      description: `Consumption for the last ${timePeriod === 'daily' ? 'day' : timePeriod}`,
      icon: <TrendingUp className="h-3 w-3" />,
      trendIcon: <TrendingUp className="h-4 w-4" />
    },
    {
      title: 'Total Cost',
      value: `£${totalCost.toFixed(2)}`,
      change: costChange >= 0 ? 'Cost increasing' : 'Cost decreasing',
      changeValue: `${costChange >= 0 ? '+' : ''}${costChange.toFixed(1)}%`,
      description: `Spending for the last ${timePeriod === 'daily' ? 'day' : timePeriod}`,
      icon: costChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />,
      trendIcon: costChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
    },
    {
      title: 'Daily Average',
      value: `${averageDaily.toFixed(2)} kWh`,
      change: trend === 'increasing' ? 'Strong consumption trend' : trend === 'decreasing' ? 'Consumption decreasing' : 'Steady consumption',
      changeValue: trend === 'increasing' ? '+12.5%' : trend === 'decreasing' ? '-5.2%' : '0%',
      description: `Average daily usage`,
      icon: trend === 'increasing' ? <TrendingUp className="h-3 w-3" /> : trend === 'decreasing' ? <TrendingDown className="h-3 w-3" /> : <Activity className="h-3 w-3" />,
      trendIcon: trend === 'increasing' ? <TrendingUp className="h-4 w-4" /> : trend === 'decreasing' ? <TrendingDown className="h-4 w-4" /> : <Activity className="h-4 w-4" />
    },
    {
      title: 'Efficiency Rate',
      value: `${Math.max(0, Math.min(100, (averageDaily / 20) * 100)).toFixed(1)}%`,
      change: averageDaily > 15 ? 'Above target consumption' : averageDaily > 10 ? 'Near target consumption' : 'Below target consumption',
      changeValue: averageDaily > 15 ? '+15.2%' : averageDaily > 10 ? '+2.1%' : '-8.3%',
      description: 'Based on daily average consumption',
      icon: averageDaily > 15 ? <TrendingUp className="h-3 w-3" /> : averageDaily > 10 ? <Activity className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />,
      trendIcon: averageDaily > 15 ? <TrendingUp className="h-4 w-4" /> : averageDaily > 10 ? <Activity className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
    }
  ];

  return (
    <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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