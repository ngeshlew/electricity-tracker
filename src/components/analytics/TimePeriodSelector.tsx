import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CalendarDays, Clock, Calendar, RefreshCw } from 'lucide-react';

export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface TimePeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  onRefresh?: () => void;
  className?: string;
}

const periodOptions: { value: TimePeriod; label: string; icon: React.ReactNode }[] = [
  { value: 'daily', label: 'Daily', icon: <CalendarDays className="h-4 w-4" /> },
  { value: 'weekly', label: 'Weekly', icon: <Clock className="h-4 w-4" /> },
  { value: 'monthly', label: 'Monthly', icon: <Calendar className="h-4 w-4" /> },
  { value: 'yearly', label: 'Yearly', icon: <Calendar className="h-4 w-4" /> },
];

export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  onRefresh,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <ToggleGroup type="single" value={selectedPeriod} onValueChange={(v) => v && onPeriodChange(v as TimePeriod)}>
        {periodOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value} className="flex items-center space-x-2">
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          title="Refresh data"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
