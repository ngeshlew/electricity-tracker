/**
 * Date formatting utilities for UK format
 */

export const formatDateUK = (date: Date, format: 'short' | 'long' | 'chart' | 'input' = 'short') => {
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric'
      });
    case 'long':
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    case 'chart':
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short' 
      });
    case 'input':
      return date.toISOString().split('T')[0]; // YYYY-MM-DD for input fields
    default:
      return date.toLocaleDateString('en-GB');
  }
};

export const formatTimeUK = (date: Date, format: 'short' | 'long' = 'short') => {
  switch (format) {
    case 'short':
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    case 'long':
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    default:
      return date.toLocaleTimeString('en-GB');
  }
};

export const formatDateTimeUK = (date: Date) => {
  return `${formatDateUK(date, 'long')} at ${formatTimeUK(date)}`;
};

export const getWeekStart = (date: Date): Date => {
  // Get Monday as week start (ISO 8601 standard)
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0); // Start of day
  return d;
};

export const getWeekEnd = (date: Date): Date => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999); // End of day
  return weekEnd;
};

export const getWeekNumber = (date: Date): number => {
  const weekStart = getWeekStart(date);
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((weekStart.getTime() - yearStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return weekNumber;
};

export const formatWeekRange = (date: Date): string => {
  const weekStart = getWeekStart(date);
  const weekEnd = getWeekEnd(date);
  return `${formatDateUK(weekStart, 'chart')} - ${formatDateUK(weekEnd, 'chart')}`;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

export const isSameWeek = (date1: Date, date2: Date): boolean => {
  const week1Start = getWeekStart(date1);
  const week2Start = getWeekStart(date2);
  return week1Start.getTime() === week2Start.getTime();
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() && 
         date1.getMonth() === date2.getMonth();
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { month: 'long' });
};

export const getMonthNameShort = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { month: 'short' });
};

export const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { weekday: 'long' });
};

export const getDayNameShort = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { weekday: 'short' });
};
