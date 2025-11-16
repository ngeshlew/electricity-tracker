import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/dashboard/Header';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { MemoryRouter } from 'react-router-dom';

describe('Help integration', () => {
  test('Header renders Help button and Keyboard Shortcuts button', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Help and user guide/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Keyboard shortcuts/i)).toBeInTheDocument();
  });

  test('Mobile header renders Help button and no floating Help from UserGuide', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <MobileNavigation />
      </MemoryRouter>
    );
    // Help in mobile header
    expect(screen.getByLabelText(/Help and user guide/i)).toBeInTheDocument();
    // No floating Help button (aria-label Open User Guide)
    expect(screen.queryByTitle(/Open User Guide/i)).not.toBeInTheDocument();
  });
});


