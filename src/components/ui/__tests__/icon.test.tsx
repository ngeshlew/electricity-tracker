import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from '../icon';

describe('Icon component', () => {
  test('renders known hero icon', () => {
    render(<Icon name="arrow-up" data-testid="icon" />);
    const node = screen.getByTestId('icon');
    expect(node).toBeInTheDocument();
  });

  test('renders known svg fallback icon', () => {
    render(<Icon name="lightning-energy" data-testid="svg-icon" />);
    const node = screen.getByTestId('svg-icon');
    expect(node).toBeInTheDocument();
  });

  test('unknown icon renders nothing in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const { container } = render(<Icon name="__does-not-exist__" />);
    expect(container.firstChild).toBeNull();
    process.env.NODE_ENV = originalEnv;
  });
});
import React from 'react';
import { render } from '@testing-library/react';
import { Icon } from '../icon';

describe('Icon Component', () => {
  it('renders an icon when a valid name is provided', () => {
    const { container } = render(React.createElement(Icon, { name: 'arrow-up' }));
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('24');
    expect(svg?.getAttribute('height')).toBe('24');
  });

  it('applies custom size prop', () => {
    const { container } = render(React.createElement(Icon, { name: 'arrow-down', size: 32 }));
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });

  it('applies custom className', () => {
    const { container } = render(React.createElement(Icon, { name: 'activity-graph', className: 'custom-class' }));
    const svg = container.querySelector('svg');
    expect(svg?.className).toContain('custom-class');
  });

  it('renders fallback placeholder for invalid icon name', () => {
    const { container } = render(React.createElement(Icon, { name: 'invalid-icon-name' as any }));
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    // Should render a placeholder rect
    const rect = svg?.querySelector('rect');
    expect(rect).toBeTruthy();
  });

  it('handles bolt alias for lightning-energy', () => {
    const { container } = render(React.createElement(Icon, { name: 'bolt' }));
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('applies inline styles', () => {
    const { container } = render(
      React.createElement(Icon, { name: 'target', style: { color: 'red' } })
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('style')).toContain('color: red');
  });

  it('renders commonly used icons', () => {
    const icons = [
      'arrow-up',
      'arrow-down',
      'activity-graph',
      'target',
      'home-house',
      'search',
      'filter',
      'download',
    ];

    icons.forEach(iconName => {
      const { container, unmount } = render(React.createElement(Icon, { name: iconName as any }));
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
      unmount();
    });
  });
});

