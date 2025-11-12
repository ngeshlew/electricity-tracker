import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MobileDashboard } from '../../components/mobile/MobileDashboard';
import { useElectricityStore } from '../../store/useElectricityStore';
import { useTariffStore } from '../../store/useTariffStore';

// Mock the stores
jest.mock('../../store/useElectricityStore');
jest.mock('../../store/useTariffStore');

const mockUseElectricityStore = useElectricityStore as jest.MockedFunction<typeof useElectricityStore>;
const mockUseTariffStore = useTariffStore as jest.MockedFunction<typeof useTariffStore>;

describe('MobileDashboard', () => {
  beforeEach(() => {
    mockUseTariffStore.mockReturnValue({
      getMonthlyTargets: jest.fn().mockReturnValue({ usage: 1000, cost: 100 }),
      currentTariff: { unitRate: 30, standingCharge: 50 },
    } as any);

    mockUseElectricityStore.mockReturnValue({
      readings: [],
      chartData: [],
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    mockUseElectricityStore.mockReturnValue({
      readings: [],
      chartData: [],
      isLoading: true,
      error: null,
    } as any);

    render(<MobileDashboard />);
    
    // Check for loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state correctly', () => {
    mockUseElectricityStore.mockReturnValue({
      readings: [],
      chartData: [],
      isLoading: false,
      error: 'Failed to load data',
    } as any);

    render(<MobileDashboard />);
    
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('renders period selector buttons', () => {
    render(<MobileDashboard />);
    
    expect(screen.getByText('7d')).toBeInTheDocument();
    expect(screen.getByText('30d')).toBeInTheDocument();
    expect(screen.getByText('90d')).toBeInTheDocument();
  });

  it('renders analytics cards when data is available', () => {
    mockUseElectricityStore.mockReturnValue({
      readings: [
        { id: '1', reading: 1000, consumption: 10, cost: 3, date: new Date().toISOString(), type: 'MANUAL' },
        { id: '2', reading: 1010, consumption: 10, cost: 3, date: new Date().toISOString(), type: 'MANUAL' },
      ],
      chartData: [
        { date: new Date().toISOString(), kwh: 10, cost: 3, consumption: 10 },
      ],
      isLoading: false,
      error: null,
    } as any);

    render(<MobileDashboard />);
    
    // Check for metric cards
    expect(screen.getByText(/total usage/i)).toBeInTheDocument();
    expect(screen.getByText(/total cost/i)).toBeInTheDocument();
  });

  it('has proper spacing for mobile navigation', () => {
    const { container } = render(<MobileDashboard />);
    const mainDiv = container.firstChild as HTMLElement;
    
    expect(mainDiv).toHaveClass('pt-14', 'pb-20');
  });

  it('period selector is sticky', () => {
    const { container } = render(<MobileDashboard />);
    const periodSelector = container.querySelector('[class*="sticky"]');
    
    expect(periodSelector).toBeInTheDocument();
    expect(periodSelector).toHaveClass('top-14');
  });
});

