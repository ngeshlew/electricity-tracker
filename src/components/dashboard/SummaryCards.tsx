import React from 'react';
import { 
  BoltIcon, 
  CurrencyPoundIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-simple';
import { useElectricityStore } from '../../store/useElectricityStore';

interface SummaryCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

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

export const SummaryCards: React.FC = () => {
  const { chartData, timeSeriesData } = useElectricityStore();
  
  // Calculate current month data
  const currentMonth = new Date();
  const currentMonthData = chartData.filter(point => {
    const pointDate = new Date(point.date);
    return pointDate.getMonth() === currentMonth.getMonth() && 
           pointDate.getFullYear() === currentMonth.getFullYear();
  });
  
  const totalKwh = currentMonthData.reduce((sum, point) => sum + point.kwh, 0);
  const totalCost = currentMonthData.reduce((sum, point) => sum + point.cost, 0);
  const dailyAverage = currentMonthData.length > 0 ? totalKwh / currentMonthData.length : 0;
  
  // Calculate previous month for comparison
  const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const previousMonthData = chartData.filter(point => {
    const pointDate = new Date(point.date);
    return pointDate.getMonth() === previousMonth.getMonth() && 
           pointDate.getFullYear() === previousMonth.getFullYear();
  });
  
  const previousTotalKwh = previousMonthData.reduce((sum, point) => sum + point.kwh, 0);
  const previousTotalCost = previousMonthData.reduce((sum, point) => sum + point.cost, 0);
  
  // Calculate percentage changes
  const kwhChange = previousTotalKwh > 0 ? ((totalKwh - previousTotalKwh) / previousTotalKwh) * 100 : 0;
  const costChange = previousTotalCost > 0 ? ((totalCost - previousTotalCost) / previousTotalCost) * 100 : 0;
  
  // Determine trend
  const trend = timeSeriesData.length > 0 ? timeSeriesData[timeSeriesData.length - 1]?.trend || 'stable' : 'stable';
  
  const cards = [
    {
      title: 'This Month',
      value: `${totalKwh.toFixed(1)} kWh`,
      change: `${kwhChange >= 0 ? '+' : ''}${kwhChange.toFixed(1)}% from last month`,
      changeType: kwhChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: <BoltIcon className="w-4 h-4 text-primary" />
    },
    {
      title: 'Total Cost',
      value: `£${totalCost.toFixed(2)}`,
      change: `${costChange >= 0 ? '+' : ''}£${(totalCost - previousTotalCost).toFixed(2)} from last month`,
      changeType: costChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: <CurrencyPoundIcon className="w-4 h-4 text-primary" />
    },
    {
      title: 'Daily Average',
      value: `${dailyAverage.toFixed(1)} kWh`,
      change: `${dailyAverage > 0 ? '+' : ''}${dailyAverage.toFixed(1)} kWh average`,
      changeType: 'neutral' as const,
      icon: <ChartBarIcon className="w-4 h-4 text-primary" />
    },
    {
      title: 'Trend',
      value: trend.charAt(0).toUpperCase() + trend.slice(1),
      change: trend === 'increasing' ? 'Consistent growth' : trend === 'decreasing' ? 'Decreasing usage' : 'Stable usage',
      changeType: trend === 'increasing' ? 'positive' as const : trend === 'decreasing' ? 'negative' as const : 'neutral' as const,
      icon: <ArrowTrendingUpIcon className="w-4 h-4 text-primary" />
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