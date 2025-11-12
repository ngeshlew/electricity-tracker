import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MobileNavigation } from '../../components/mobile/MobileNavigation';
import { useElectricityStore } from '../../store/useElectricityStore';

jest.mock('../../store/useElectricityStore');

const mockUseElectricityStore = useElectricityStore as jest.MockedFunction<typeof useElectricityStore>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MobileNavigation', () => {
  beforeEach(() => {
    mockUseElectricityStore.mockReturnValue({
      toggleMeterPanel: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and app name', () => {
    renderWithRouter(<MobileNavigation />);
    
    expect(screen.getByText('Electricity Tracker')).toBeInTheDocument();
  });

  it('shows Add Reading button on Dashboard page', () => {
    // Mock location to be dashboard
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
    });

    renderWithRouter(<MobileNavigation />);
    
    const addButton = screen.getByLabelText(/add meter reading/i);
    expect(addButton).toBeInTheDocument();
  });

  it('hides Add Reading button on non-Dashboard pages', () => {
    // Mock location to be settings
    Object.defineProperty(window, 'location', {
      value: { pathname: '/settings' },
      writable: true,
    });

    renderWithRouter(<MobileNavigation />);
    
    const addButton = screen.queryByLabelText(/add meter reading/i);
    expect(addButton).not.toBeInTheDocument();
  });

  it('renders bottom navigation', () => {
    renderWithRouter(<MobileNavigation />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Statements')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('has fixed positioning for header and bottom nav', () => {
    const { container } = renderWithRouter(<MobileNavigation />);
    
    const header = container.querySelector('[class*="fixed top-0"]');
    const bottomNav = container.querySelector('[class*="fixed bottom-0"]');
    
    expect(header).toBeInTheDocument();
    expect(bottomNav).toBeInTheDocument();
  });
});

