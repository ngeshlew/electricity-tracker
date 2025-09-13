import { createContext, useContext } from 'react';
import type { AnalyticsState, TimeSeriesData, ChartDataPoint, PieChartData } from '../types';

export interface AnalyticsContextType extends AnalyticsState {
  updateTimeSeriesData: (data: TimeSeriesData[]) => void;
  updatePieChartData: (data: PieChartData[]) => void;
  setSelectedPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
  setSelectedDateRange: (start: Date, end: Date) => void;
  calculateConsumptionData: (readings: unknown[]) => ChartDataPoint[];
}

export const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
