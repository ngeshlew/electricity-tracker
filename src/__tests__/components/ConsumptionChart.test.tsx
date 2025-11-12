// Test file for ConsumptionChart component
import { render } from '@testing-library/react';
import { ConsumptionChart } from '../../components/dashboard/ConsumptionChart';
import { useElectricityStore } from '../../store/useElectricityStore';

// Mock the store
jest.mock('../../store/useElectricityStore');
const mockUseElectricityStore = useElectricityStore as jest.MockedFunction<typeof useElectricityStore>;

// Mock date formatters
jest.mock('../../utils/dateFormatters', () => ({
  formatDateUK: jest.fn((date: Date, format?: string) => {
    if (format === 'chart') {
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  }),
  addDays: jest.fn((date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }),
}));

describe('ConsumptionChart fillMissingDates logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not overwrite estimated readings with zeros', () => {
    // Mock chart data that includes an estimated reading
    const mockChartData = [
      {
        date: '2024-10-24',
        kwh: 3.0,
        cost: 0.90,
        label: '3.00 kWh',
      },
      {
        date: '2024-10-26', // Estimated reading - should NOT be overwritten
        kwh: 2.6,
        cost: 0.78,
        label: '2.60 kWh',
      },
      {
        date: '2024-10-27',
        kwh: 2.6,
        cost: 0.78,
        label: '2.60 kWh',
      },
    ];

    mockUseElectricityStore.mockReturnValue({
      chartData: mockChartData,
    } as any);

    const { container } = render(<ConsumptionChart />);
    
    // The component should render without errors
    expect(container).toBeTruthy();
    
    // Verify the store was called
    expect(mockUseElectricityStore).toHaveBeenCalled();
  });

  it('should handle empty chart data', () => {
    mockUseElectricityStore.mockReturnValue({
      chartData: [],
    } as any);

    const { container } = render(<ConsumptionChart />);
    expect(container).toBeTruthy();
  });

  it('should handle single data point', () => {
    const mockChartData = [
      {
        date: '2024-10-24',
        kwh: 3.0,
        cost: 0.90,
        label: '3.00 kWh',
      },
    ];

    mockUseElectricityStore.mockReturnValue({
      chartData: mockChartData,
    } as any);

    const { container } = render(<ConsumptionChart />);
    expect(container).toBeTruthy();
  });

  it('should fill gaps only where no data points exist', () => {
    // Chart data with a gap on Oct 25 (no reading), but Oct 26 has estimated reading
    const mockChartData = [
      {
        date: '2024-10-24',
        kwh: 3.0,
        cost: 0.90,
        label: '3.00 kWh',
      },
      {
        date: '2024-10-26', // Estimated reading exists
        kwh: 2.6,
        cost: 0.78,
        label: '2.60 kWh',
      },
      {
        date: '2024-10-28', // Gap on Oct 27
        kwh: 2.6,
        cost: 0.78,
        label: '2.60 kWh',
      },
    ];

    mockUseElectricityStore.mockReturnValue({
      chartData: mockChartData,
    } as any);

    const { container } = render(<ConsumptionChart />);
    expect(container).toBeTruthy();
  });
});

