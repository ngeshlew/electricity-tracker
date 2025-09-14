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
    (readings: { date: Date; reading: number; isFirstReading?: boolean }[]): ChartDataPoint[] => {
      if (!Array.isArray(readings) || readings.length < 2) return [];
      const sorted = [...readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const results: ChartDataPoint[] = [];
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        if (!curr || curr.isFirstReading) continue;
        const kwh = Math.max(0, curr.reading - prev.reading);
        const cost = kwh * 0.30;
        results.push({
          date: new Date(curr.date).toISOString().split('T')[0],
          kwh,
          cost,
        });
      }
      return results;
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
