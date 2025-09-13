import { createContext, useContext } from 'react';
import type { MeterReading, MeterReadingState } from '../types';

export interface MeterReadingContextType extends MeterReadingState {
  addReading: (reading: Omit<MeterReading, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateReading: (id: string, reading: Partial<MeterReading>) => Promise<void>;
  deleteReading: (id: string) => Promise<void>;
  togglePanel: (isOpen: boolean) => void;
}

export const MeterReadingContext = createContext<MeterReadingContextType | undefined>(undefined);

export const useMeterReading = () => {
  const context = useContext(MeterReadingContext);
  if (!context) {
    throw new Error('useMeterReading must be used within a MeterReadingProvider');
  }
  return context;
};
