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

  describe('calculateConsumptionData with estimated readings', () => {
    it('should include estimated readings in chart data', () => {
      const { result } = renderHook(() => useElectricityStore());

      // Set up readings with estimated reading in between
      act(() => {
        useElectricityStore.setState({
          readings: [
            {
              id: '1',
              meterId: 'test-meter',
              reading: 1000,
              date: new Date('2024-10-24'),
              type: 'MANUAL',
              isFirstReading: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '2',
              meterId: 'test-meter',
              reading: 1002.6, // Estimated reading for Oct 26
              date: new Date('2024-10-26'),
              type: 'ESTIMATED',
              isFirstReading: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '3',
              meterId: 'test-meter',
              reading: 1005.6,
              date: new Date('2024-10-27'),
              type: 'MANUAL',
              isFirstReading: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        });
      });

      act(() => {
        result.current.calculateConsumptionData();
      });

      const chartData = result.current.chartData;
      
      // Should have chart data points for both Oct 26 (estimated) and Oct 27
      expect(chartData.length).toBeGreaterThanOrEqual(2);
      
      // Find Oct 26 data point
      const oct26Data = chartData.find(point => point.date === '2024-10-26');
      expect(oct26Data).toBeDefined();
      expect(oct26Data?.kwh).toBeCloseTo(2.6, 1); // 1002.6 - 1000 = 2.6
      expect(oct26Data?.cost).toBeCloseTo(0.78, 2); // 2.6 * 0.30 = 0.78
      
      // Find Oct 27 data point
      const oct27Data = chartData.find(point => point.date === '2024-10-27');
      expect(oct27Data).toBeDefined();
      expect(oct27Data?.kwh).toBeCloseTo(3.0, 1); // 1005.6 - 1002.6 = 3.0
    });

    it('should handle single reading edge case', () => {
      const { result } = renderHook(() => useElectricityStore());

      act(() => {
        useElectricityStore.setState({
          readings: [
            {
              id: '1',
              meterId: 'test-meter',
              reading: 1000,
              date: new Date('2024-10-24'),
              type: 'MANUAL',
              isFirstReading: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        });
      });

      act(() => {
        result.current.calculateConsumptionData();
      });

      const chartData = result.current.chartData;
      expect(chartData).toHaveLength(1);
      expect(chartData[0].kwh).toBe(0);
      expect(chartData[0].date).toBe('2024-10-24');
    });

    it('should handle no readings edge case', () => {
      const { result } = renderHook(() => useElectricityStore());

      act(() => {
        useElectricityStore.setState({
          readings: [],
        });
      });

      act(() => {
        result.current.calculateConsumptionData();
      });

      expect(result.current.chartData).toHaveLength(0);
    });

    it('should handle negative consumption (meter reset scenario)', () => {
      const { result } = renderHook(() => useElectricityStore());

      act(() => {
        useElectricityStore.setState({
          readings: [
            {
              id: '1',
              meterId: 'test-meter',
              reading: 1000,
              date: new Date('2024-10-24'),
              type: 'MANUAL',
              isFirstReading: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '2',
              meterId: 'test-meter',
              reading: 500, // Lower reading (meter reset)
              date: new Date('2024-10-26'),
              type: 'MANUAL',
              isFirstReading: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        });
      });

      act(() => {
        result.current.calculateConsumptionData();
      });

      const chartData = result.current.chartData;
      const oct26Data = chartData.find(point => point.date === '2024-10-26');
      
      // Should clamp negative consumption to 0
      expect(oct26Data?.kwh).toBe(0);
    });

    it('should sort readings chronologically before calculating', () => {
      const { result } = renderHook(() => useElectricityStore());

      // Add readings out of order
      act(() => {
        useElectricityStore.setState({
          readings: [
            {
              id: '3',
              meterId: 'test-meter',
              reading: 1005,
              date: new Date('2024-10-27'),
              type: 'MANUAL',
              isFirstReading: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '1',
              meterId: 'test-meter',
              reading: 1000,
              date: new Date('2024-10-24'),
              type: 'MANUAL',
              isFirstReading: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '2',
              meterId: 'test-meter',
              reading: 1002.6,
              date: new Date('2024-10-26'),
              type: 'ESTIMATED',
              isFirstReading: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        });
      });

      act(() => {
        result.current.calculateConsumptionData();
      });

      const chartData = result.current.chartData;
      
      // Should be sorted chronologically
      expect(chartData[0].date).toBe('2024-10-26');
      expect(chartData[1].date).toBe('2024-10-27');
      
      // Consumption should be calculated correctly despite out-of-order input
      expect(chartData[0].kwh).toBeCloseTo(2.6, 1);
      expect(chartData[1].kwh).toBeCloseTo(2.4, 1); // 1005 - 1002.6 = 2.4
    });
  });
});
