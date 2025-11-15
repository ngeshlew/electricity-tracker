import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from "@/components/ui/icon";
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
        className="h-8 w-8 sm:h-9 sm:w-9"
        aria-label="Previous month"
      >
        <Icon name="arrow-chevron-left" className="h-4 w-4" />
      </Button>
      <span className="text-sm font-normal min-w-[90px] sm:min-w-[100px] text-center tabular-nums">
        {format(currentMonth, 'MMM yyyy')}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigateMonth('next')}
        className="h-8 w-8 sm:h-9 sm:w-9"
        aria-label="Next month"
      >
        <Icon name="arrow-chevron-right" className="h-4 w-4" />
      </Button>
    </div>
  );
};
