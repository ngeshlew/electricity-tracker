import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface MonthSelectorProps {
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  currentMonth,
  onMonthChange
}) => {
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    onMonthChange(newMonth);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigateMonth('prev')}
        className="h-8 w-8"
        aria-label="Previous month"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-[100px] text-center tabular-nums">
        {format(currentMonth, 'MMM yyyy')}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigateMonth('next')}
        className="h-8 w-8"
        aria-label="Next month"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
