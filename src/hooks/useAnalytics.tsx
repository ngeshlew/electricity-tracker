import React, { useState, useCallback } from 'react';
import type {
  AnalyticsState,
  TimeSeriesData,
  ChartDataPoint,
  PieChartData,
} from '../types';
import {
  AnalyticsContext,
  type AnalyticsContextType,
} from './useAnalyticsContext';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<AnalyticsState>({
    timeSeriesData: [],
    pieChartData: [],
    selectedPeriod: 'daily',
    selectedDateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date(),
    },
  });

  const updateTimeSeriesData = useCallback((data: TimeSeriesData[]) => {
    setState(prev => ({ ...prev, timeSeriesData: data }));
  }, []);

  const updatePieChartData = useCallback((data: PieChartData[]) => {
    setState(prev => ({ ...prev, pieChartData: data }));
  }, []);

  const setSelectedPeriod = useCallback(
    (period: 'daily' | 'weekly' | 'monthly') => {
      setState(prev => ({ ...prev, selectedPeriod: period }));
    },
    []
  );

  const setSelectedDateRange = useCallback((start: Date, end: Date) => {
    setState(prev => ({ ...prev, selectedDateRange: { start, end } }));
  }, []);

  const calculateConsumptionData = useCallback(
    (readings: unknown[]): ChartDataPoint[] => {
      // TODO: Implement actual calculation logic
      // This is a placeholder implementation
      return readings.map(reading => {
        const readingData = reading as { date: Date; reading: number };
        return {
          date: readingData.date.toISOString().split('T')[0],
          kwh: readingData.reading,
          cost: readingData.reading * 0.3, // Mock calculation
        };
      });
    },
    []
  );

  const value: AnalyticsContextType = {
    ...state,
    updateTimeSeriesData,
    updatePieChartData,
    setSelectedPeriod,
    setSelectedDateRange,
    calculateConsumptionData,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
