import { buildDailyConsumptionSeries } from './consumptionSeries';
import type { MeterReading } from '@/types';

const mockCostCalculator = (kwh: number) => Number((kwh * 0.3).toFixed(2));

describe('buildDailyConsumptionSeries', () => {
  const baseReadings: MeterReading[] = [
    {
      id: '1',
      meterId: 'A',
      reading: 14297.6,
      date: new Date('2025-10-25'),
      type: 'ESTIMATED',
      isFirstReading: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      meterId: 'A',
      reading: 14300.2,
      date: new Date('2025-10-26'),
      type: 'ESTIMATED',
      isFirstReading: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('calculates consumption deltas based on reading history', () => {
    const series = buildDailyConsumptionSeries(baseReadings, mockCostCalculator, {
      fillMissingDays: false,
    });

    expect(series).toHaveLength(1);
    expect(series[0].date).toBe('2025-10-26');
    expect(series[0].consumption).toBeCloseTo(2.6);
  });

  it('fills missing days with zero consumption when requested', () => {
    const readings: MeterReading[] = [
      {
        id: '1',
        meterId: 'A',
        reading: 100,
        date: new Date('2025-10-01'),
        type: 'MANUAL',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        meterId: 'A',
        reading: 110,
        date: new Date('2025-10-04'),
        type: 'MANUAL',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const series = buildDailyConsumptionSeries(readings, mockCostCalculator);
    expect(series).toHaveLength(3); // 2nd and 3rd Oct inserted, plus 4th with consumption
    expect(series[0].date).toBe('2025-10-02');
    expect(series[0].consumption).toBe(0);
    expect(series[2].consumption).toBe(10);
  });

  it('prefers manual readings when estimated exists on same day', () => {
    const readings: MeterReading[] = [
      {
        id: 'manual-0',
        meterId: 'A',
        reading: 14157,
        date: new Date('2025-09-15T20:00:00Z'),
        type: 'MANUAL',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'est-1',
        meterId: 'A',
        reading: 14159,
        date: new Date('2025-09-16T08:00:00-05:00'),
        type: 'ESTIMATED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'manual-1',
        meterId: 'A',
        reading: 14161,
        date: new Date('2025-09-16T20:00:00-05:00'),
        type: 'MANUAL',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'manual-2',
        meterId: 'A',
        reading: 14165,
        date: new Date('2025-09-17'),
        type: 'MANUAL',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const series = buildDailyConsumptionSeries(readings, mockCostCalculator, {
      fillMissingDays: false,
    });

    expect(series).toHaveLength(2);
    expect(series[0].date).toBe('2025-09-16');
    expect(series[0].consumption).toBeCloseTo(4);
  });
});


