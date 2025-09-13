import React from 'react';
import { 
  BoltIcon, 
  CurrencyPoundIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

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
    neutral: 'text-dark-400'
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-dark-50 mt-1">{value}</p>
          <p className={`text-sm mt-1 ${changeColor[changeType]}`}>
            {change}
          </p>
        </div>
        <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export const SummaryCards: React.FC = () => {
  // Mock data - will be replaced with real data from hooks
  const cards = [
    {
      title: 'This Month',
      value: '245 kWh',
      change: '+12% from last month',
      changeType: 'positive' as const,
      icon: <BoltIcon className="w-6 h-6 text-primary-500" />
    },
    {
      title: 'Total Cost',
      value: '£73.50',
      change: '+£8.20 from last month',
      changeType: 'positive' as const,
      icon: <CurrencyPoundIcon className="w-6 h-6 text-primary-500" />
    },
    {
      title: 'Daily Average',
      value: '8.1 kWh',
      change: '+0.3 kWh from last month',
      changeType: 'positive' as const,
      icon: <ChartBarIcon className="w-6 h-6 text-primary-500" />
    },
    {
      title: 'Trend',
      value: 'Increasing',
      change: 'Consistent growth',
      changeType: 'positive' as const,
      icon: <ArrowTrendingUpIcon className="w-6 h-6 text-primary-500" />
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
