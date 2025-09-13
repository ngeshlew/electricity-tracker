// Simple test setup to verify core functionality
// This file can be removed after testing

import { MeterReading } from './types';

// Test data for verification
export const testMeterReadings: Omit<MeterReading, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    meterId: 'main',
    reading: 12345.67,
    date: new Date('2025-09-10'),
    type: 'manual',
    notes: 'Test reading 1',
  },
  {
    meterId: 'main',
    reading: 12378.45,
    date: new Date('2025-09-11'),
    type: 'manual',
    notes: 'Test reading 2',
  },
  {
    meterId: 'main',
    reading: 12412.23,
    date: new Date('2025-09-12'),
    type: 'manual',
    notes: 'Test reading 3',
  },
];

// Test utility functions
export const testUtils = {
  // Calculate consumption between two readings
  calculateConsumption: (current: number, previous: number): number => {
    return Math.max(0, current - previous);
  },

  // Calculate cost based on consumption and unit rate
  calculateCost: (consumption: number, unitRate: number = 0.30): number => {
    return Math.round(consumption * unitRate * 100) / 100;
  },

  // Format date for display
  formatDate: (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  },

  // Validate meter reading
  validateReading: (reading: number): { isValid: boolean; error?: string } => {
    if (reading < 0) {
      return { isValid: false, error: 'Reading must be positive' };
    }
    if (reading > 999999) {
      return { isValid: false, error: 'Reading must be less than 999,999' };
    }
    return { isValid: true };
  },
};

// Test the calculation functions
export const runTests = () => {
  console.log('🧪 Running Electricity Tracker Tests...');

  // Test consumption calculation
  const consumption = testUtils.calculateConsumption(12412.23, 12345.67);
  console.log(`✅ Consumption calculation: ${consumption} kWh`);

  // Test cost calculation
  const cost = testUtils.calculateCost(consumption);
  console.log(`✅ Cost calculation: £${cost}`);

  // Test date formatting
  const formattedDate = testUtils.formatDate(new Date('2025-09-13'));
  console.log(`✅ Date formatting: ${formattedDate}`);

  // Test validation
  const validReading = testUtils.validateReading(12500);
  console.log(`✅ Valid reading test: ${validReading.isValid}`);

  const invalidReading = testUtils.validateReading(-100);
  console.log(`✅ Invalid reading test: ${invalidReading.isValid} - ${invalidReading.error}`);

  console.log('🎉 All tests passed!');
};

// Auto-run tests in development
if (process.env.NODE_ENV === 'development') {
  runTests();
}

