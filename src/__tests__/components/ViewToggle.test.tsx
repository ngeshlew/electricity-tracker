// Test file for ViewToggle component
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewToggle } from '../../components/dashboard/ViewToggle';

describe('ViewToggle', () => {
  const mockOnViewModeChange = jest.fn();

  beforeEach(() => {
    mockOnViewModeChange.mockClear();
  });

  it('renders both toggle buttons', () => {
    render(
      <ViewToggle
        viewMode="kwh"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    expect(screen.getByText('kWh')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  it('shows correct active state for kWh mode', () => {
    render(
      <ViewToggle
        viewMode="kwh"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    const kwhButton = screen.getByText('kWh').closest('button');
    const costButton = screen.getByText('Cost').closest('button');

    expect(kwhButton).toHaveClass('lewis-button-primary');
    expect(costButton).toHaveClass('lewis-card-hover');
  });

  it('shows correct active state for Cost mode', () => {
    render(
      <ViewToggle
        viewMode="cost"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    const kwhButton = screen.getByText('kWh').closest('button');
    const costButton = screen.getByText('Cost').closest('button');

    expect(costButton).toHaveClass('lewis-button-primary');
    expect(kwhButton).toHaveClass('lewis-card-hover');
  });

  it('calls onViewModeChange when kWh button is clicked', () => {
    render(
      <ViewToggle
        viewMode="cost"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    const kwhButton = screen.getByText('kWh');
    fireEvent.click(kwhButton);

    expect(mockOnViewModeChange).toHaveBeenCalledWith('kwh');
  });

  it('calls onViewModeChange when Cost button is clicked', () => {
    render(
      <ViewToggle
        viewMode="kwh"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    const costButton = screen.getByText('Cost');
    fireEvent.click(costButton);

    expect(mockOnViewModeChange).toHaveBeenCalledWith('cost');
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(
      <ViewToggle
        viewMode="kwh"
        onViewModeChange={mockOnViewModeChange}
        className={customClass}
      />
    );

    const container = screen.getByText('kWh').closest('div')?.parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('renders icons correctly', () => {
    render(
      <ViewToggle
        viewMode="kwh"
        onViewModeChange={mockOnViewModeChange}
      />
    );

    // Check that icons are present (they should be in the buttons)
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    
    // Each button should contain an icon
    buttons.forEach(button => {
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });
});
