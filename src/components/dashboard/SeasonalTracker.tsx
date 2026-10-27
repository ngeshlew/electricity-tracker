import React, { useMemo } from 'react';
import { SeasonalComparison } from '@/components/shared/SeasonalComparison';
import { useElectricityStore } from '../../store/useElectricityStore';

/**
 * Seasonal consumption by season-year, with a year stepper and an optional
 * comparison against the previous year. The shared SeasonalComparison does
 * the work; this adapter only maps electricity readings to season points.
 */
export const SeasonalTracker: React.FC = () => {
  const { chartData, isLoading } = useElectricityStore();

  const points = useMemo(
    () => (chartData ?? []).map(point => ({ date: point.date, value: point.kwh, cost: point.cost })),
    [chartData],
  );

  return (
    <SeasonalComparison
      points={points}
      isLoading={isLoading}
      title="Seasonal consumption"
      description="Compare your electricity use season by season"
      unit="kWh"
      perDayUnit="kWh/day"
    />
  );
};
