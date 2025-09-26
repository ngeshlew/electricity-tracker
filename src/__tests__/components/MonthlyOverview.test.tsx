// Test file for MonthlyOverview component
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthlyOverview } from '../../components/dashboard/MonthlyOverview';
import { useElectricityStore } from '../../store/useElectricityStore';

// Mock the store
jest.mock('../../store/useElectricityStore');
const mockUseElectricityStore = useElectricityStore as jest.MockedFunction<typeof useElectricityStore>;

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn((date) => date.toISOString().split('T')[0]),
  startOfMonth: jest.fn((date) => new Date(date.getFullYear(), date.getMonth(), 1)),
  endOfMonth: jest.fn((date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)),
  eachWeekOfInterval: jest.fn(() => [
    new Date('2024-01-01'),
    new Date('2024-01-08'),
    new Date('2024-01-15'),
    new Date('2024-01-22'),
    new Date('2024-01-29')
  ]),
  endOfWeek: jest.fn((date) => new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000))
}));

const mockReadings = [
  {
    id: '1',
    meterId: 'default-meter',
    reading: 1000,
    date: new Date('2024-01-01'),
    type: 'MANUAL' as const,
    notes: 'Initial reading',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    meterId: 'default-meter',
    reading: 1200,
    date: new Date('2024-01-15'),
    type: 'MANUAL' as const,
    notes: 'Mid month reading',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    meterId: 'default-meter',
    reading: 1400,
    date: new Date('2024-01-31'),
    type: 'MANUAL' as const,
    notes: 'End of month reading',
    createdAt: new Date('2024-01-31'),
    updatedAt: new Date('2024-01-31')
  }
];

const mockPreferences = {
  id: '1',
  userId: 'user-1',
  theme: 'dark' as const,
  currency: 'GBP' as const,
  unitRate: 0.25,
  standingCharge: 0.5,
  notifications: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('MonthlyOverview', () => {
  beforeEach(() => {
    mockUseElectricityStore.mockReturnValue({
      readings: mockReadings,
      preferences: mockPreferences,
      isLoading: false,
      error: null,
      isMeterPanelOpen: false,
      timeSeriesData: [],
      chartData: [],
      pieChartData: [],
      addReading: jest.fn(),
      updateReading: jest.fn(),
      deleteReading: jest.fn(),
      toggleMeterPanel: jest.fn(),
      loadMeterReadings: jest.fn(),
      setupRealtimeUpdates: jest.fn(),
      cleanupRealtimeUpdates: jest.fn(),
      calculateConsumptionData: jest.fn(),
      calculateTimeSeriesData: jest.fn(),
      calculatePieChartData: jest.fn(),
      getConsumptionBetweenReadings: jest.fn(),
      calculateCost: jest.fn(),
      getTrend: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders monthly overview with correct title', () => {
    render(<MonthlyOverview />);
    expect(screen.getByText('Monthly Overview')).toBeInTheDocument();
  });

  it('displays monthly summary statistics', () => {
    render(<MonthlyOverview />);
    
    // Should display total kWh, total cost, and daily average
    expect(screen.getByText('Total kWh')).toBeInTheDocument();
    expect(screen.getByText('Total Cost')).toBeInTheDocument();
    expect(screen.getByText('Daily Avg')).toBeInTheDocument();
  });

  it('shows weekly breakdown section', () => {
    render(<MonthlyOverview />);
    expect(screen.getByText('Weekly Breakdown')).toBeInTheDocument();
  });

  it('handles navigation between months', () => {
    render(<MonthlyOverview />);
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    
    // Test navigation
    fireEvent.click(nextButton);
    fireEvent.click(prevButton);
  });

  it('displays trend indicator', () => {
    render(<MonthlyOverview />);
    
    // Should show trend information
    const trendText = screen.getByText(/trend/i);
    expect(trendText).toBeInTheDocument();
  });

  it('handles empty readings gracefully', () => {
    mockUseElectricityStore.mockReturnValue({
      readings: [],
      preferences: mockPreferences,
      isLoading: false,
      error: null,
      isMeterPanelOpen: false,
      timeSeriesData: [],
      chartData: [],
      pieChartData: [],
      addReading: jest.fn(),
      updateReading: jest.fn(),
      deleteReading: jest.fn(),
      toggleMeterPanel: jest.fn(),
      loadMeterReadings: jest.fn(),
      setupRealtimeUpdates: jest.fn(),
      cleanupRealtimeUpdates: jest.fn(),
      calculateConsumptionData: jest.fn(),
      calculateTimeSeriesData: jest.fn(),
      calculatePieChartData: jest.fn(),
      getConsumptionBetweenReadings: jest.fn(),
      calculateCost: jest.fn(),
      getTrend: jest.fn()
    });

    render(<MonthlyOverview />);
    
    // Should still render the component structure
    expect(screen.getByText('Monthly Overview')).toBeInTheDocument();
    expect(screen.getByText('Total kWh')).toBeInTheDocument();
  });

  it('calculates consumption correctly', () => {
    render(<MonthlyOverview />);
    
    // The component should calculate consumption between readings
    // Total consumption should be 400 kWh (1400 - 1000)
    expect(screen.getByText('400')).toBeInTheDocument();
  });
});
