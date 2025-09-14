import React from 'react';
import { Bolt, PoundSterling, BarChart2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useElectricityStore } from '../../store/useElectricityStore';
import { formatDateUK } from '../../utils/dateFormatters';

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
  changeType: 'positive' | 'negative' | 'neutral'; // Color coding for change
  icon: React.ReactNode; // Heroicon component
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
  changeType, 
  icon 
}) => {
  const changeColor = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-muted-foreground'
  };

  return (
    <Card className="lewis-card lewis-card-hover lewis-animation-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="w-10 h-10 lewis-gradient-primary rounded-lg flex items-center justify-center lewis-shadow-glow">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground lewis-text-gradient">{value}</div>
        <p className={`text-sm font-medium ${changeColor[changeType]} mt-2`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
};

interface SummaryCardsProps {
  timePeriod: TimePeriod; // Current selected time period
  viewMode: ViewMode;     // Current view mode (kWh or cost)
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
export const SummaryCards: React.FC<SummaryCardsProps> = ({ timePeriod, viewMode }) => {
  const { chartData, timeSeriesData } = useElectricityStore();
  
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
          return pointDate.getMonth() === now.getMonth() && 
                 pointDate.getFullYear() === now.getFullYear();
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
  
  const getPeriodTitle = () => {
    switch (timePeriod) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      default: return 'Current Period';
    }
  };

  const getPreviousPeriodTitle = () => {
    switch (timePeriod) {
      case 'daily': return 'yesterday';
      case 'weekly': return 'last week';
      case 'monthly': return 'last month';
      case 'yearly': return 'last year';
      default: return 'previous period';
    }
  };

  const cards = [
    {
      title: viewMode === 'kwh' ? getPeriodTitle() : 'Total Cost',
      value: viewMode === 'kwh' ? `${totalKwh.toFixed(1)} kWh` : `£${totalCost.toFixed(2)}`,
      change: viewMode === 'kwh' 
        ? `${kwhChange >= 0 ? '+' : ''}${kwhChange.toFixed(1)}% from ${getPreviousPeriodTitle()}`
        : `${costChange >= 0 ? '+' : ''}£${(totalCost - previousTotalCost).toFixed(2)} from ${getPreviousPeriodTitle()}`,
      changeType: viewMode === 'kwh' 
        ? (kwhChange >= 0 ? 'positive' as const : 'negative' as const)
        : (costChange >= 0 ? 'positive' as const : 'negative' as const),
      icon: viewMode === 'kwh' 
        ? <Bolt className="w-4 h-4 text-primary" />
        : <PoundSterling className="w-4 h-4 text-primary" />
    },
    {
      title: viewMode === 'kwh' ? 'Total Cost' : getPeriodTitle(),
      value: viewMode === 'kwh' ? `£${totalCost.toFixed(2)}` : `${totalKwh.toFixed(1)} kWh`,
      change: viewMode === 'kwh'
        ? `${costChange >= 0 ? '+' : ''}£${(totalCost - previousTotalCost).toFixed(2)} from ${getPreviousPeriodTitle()}`
        : `${kwhChange >= 0 ? '+' : ''}${kwhChange.toFixed(1)}% from ${getPreviousPeriodTitle()}`,
      changeType: viewMode === 'kwh'
        ? (costChange >= 0 ? 'positive' as const : 'negative' as const)
        : (kwhChange >= 0 ? 'positive' as const : 'negative' as const),
      icon: viewMode === 'kwh'
        ? <PoundSterling className="w-4 h-4 text-primary" />
        : <Bolt className="w-4 h-4 text-primary" />
    },
    {
      title: 'Daily Average',
      value: `${averageDaily.toFixed(2)} kWh`,
      change: trend === 'increasing' ? '↗️ Increasing' : trend === 'decreasing' ? '↘️ Decreasing' : '→ Stable',
      changeType: trend === 'increasing' ? 'positive' as const : trend === 'decreasing' ? 'negative' as const : 'neutral' as const,
      icon: <BarChart2 className="w-4 h-4 text-primary" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <SummaryCard
          key={index}
          title={card.title}
          value={card.value}
          change={card.change}
          changeType={card.changeType}
          icon={card.icon}
        />
      ))}
    </div>
  );
};