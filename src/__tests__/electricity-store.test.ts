import { renderHook, act } from '@testing-library/react';
import { useElectricityStore } from '../store/useElectricityStore';

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123',
  },
});

describe('Electricity Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useElectricityStore.setState({
      readings: [],
      isLoading: false,
      error: null,
      isMeterPanelOpen: false,
      preferences: {
        id: 'default',
        userId: 'default-user',
        theme: 'dark',
        currency: 'GBP',
        unitRate: 0.30,
        standingCharge: 0.50,
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      timeSeriesData: [],
      chartData: [],
      pieChartData: [],
    });
  });

  it('should add a meter reading', async () => {
    const { result } = renderHook(() => useElectricityStore());

    const readingData = {
      meterId: 'test-meter',
      reading: 1000,
      date: new Date('2024-01-01'),
      type: 'MANUAL' as const,
      notes: 'Test reading',
    };

    await act(async () => {
      await result.current.addReading(readingData);
    });

    expect(result.current.readings).toHaveLength(1);
    expect(result.current.readings[0]).toMatchObject({
      meterId: 'test-meter',
      reading: 1000,
      type: 'manual',
      notes: 'Test reading',
    });
  });

  it('should calculate consumption data between readings', async () => {
    const { result } = renderHook(() => useElectricityStore());

    // Add first reading
    await act(async () => {
      await result.current.addReading({
        meterId: 'test-meter',
        reading: 1000,
        date: new Date('2024-01-01'),
        type: 'MANUAL' as const,
      });
    });

    // Add second reading
    await act(async () => {
      await result.current.addReading({
        meterId: 'test-meter',
        reading: 1050,
        date: new Date('2024-01-02'),
        type: 'MANUAL' as const,
      });
    });

    expect(result.current.chartData).toHaveLength(1);
    expect(result.current.chartData[0].kwh).toBe(50);
    expect(result.current.chartData[0].cost).toBe(15); // 50 * 0.30
  });

  it('should calculate cost correctly', () => {
    const { result } = renderHook(() => useElectricityStore());

    const cost = result.current.calculateCost(100);
    expect(cost).toBe(30); // 100 * 0.30
  });

  it('should determine trend correctly', () => {
    const { result } = renderHook(() => useElectricityStore());

    const increasingData = [
      { date: '2024-01-01', kwh: 10, cost: 3 },
      { date: '2024-01-02', kwh: 15, cost: 4.5 },
      { date: '2024-01-03', kwh: 20, cost: 6 },
    ];

    const trend = result.current.getTrend(increasingData);
    expect(trend).toBe('increasing');

    const decreasingData = [
      { date: '2024-01-01', kwh: 20, cost: 6 },
      { date: '2024-01-02', kwh: 15, cost: 4.5 },
      { date: '2024-01-03', kwh: 10, cost: 3 },
    ];

    const decreasingTrend = result.current.getTrend(decreasingData);
    expect(decreasingTrend).toBe('decreasing');
  });

  it('should toggle meter panel', () => {
    const { result } = renderHook(() => useElectricityStore());

    expect(result.current.isMeterPanelOpen).toBe(false);

    act(() => {
      result.current.toggleMeterPanel(true);
    });

    expect(result.current.isMeterPanelOpen).toBe(true);

    act(() => {
      result.current.toggleMeterPanel(false);
    });

    expect(result.current.isMeterPanelOpen).toBe(false);
  });
});
