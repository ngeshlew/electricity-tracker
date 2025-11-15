import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface TimePeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  onRefresh?: () => void;
  className?: string;
}

const periodOptions: { value: TimePeriod; label: string; icon: React.ReactNode }[] = [
  { value: 'daily', label: 'Daily', icon: <Icon name="calendar-date-appointment" className="h-4 w-4" /> },
  { value: 'weekly', label: 'Weekly', icon: <Icon name="clock-time" className="h-4 w-4" /> },
  { value: 'monthly', label: 'Monthly', icon: <Icon name="calendar-month-date" className="h-4 w-4" /> },
  { value: 'yearly', label: 'Yearly', icon: <Icon name="calendar-month-date" className="h-4 w-4" /> },
];

export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  onRefresh,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1 bg-muted/20  p-1">
        {periodOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedPeriod === option.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPeriodChange(option.value)}
            className={`flex items-center space-x-2 transition-all duration-200 ${
              selectedPeriod === option.value 
                ? 'lewis-button-primary shadow-md' 
                : 'lewis-card-hover text-muted-foreground hover:text-foreground'
            }`}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </Button>
        ))}
      </div>
      
      {onRefresh && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          className="lewis-card-hover"
          title="Refresh data"
        >
          <Icon name="clock-refresh-time-arrow" className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
