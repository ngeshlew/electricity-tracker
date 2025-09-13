import React, { useState, useCallback } from 'react';
import type { MeterReading, MeterReadingState } from '../types';
import { MeterReadingContext, type MeterReadingContextType } from './useMeterReadingContext';

interface MeterReadingProviderProps {
  children: React.ReactNode;
}

export const MeterReadingProvider: React.FC<MeterReadingProviderProps> = ({ children }) => {
  const [state, setState] = useState<MeterReadingState>({
    readings: [],
    isLoading: false,
    error: null,
    selectedReading: null,
    isPanelOpen: false,
  });

  const addReading = useCallback(async (readingData: Omit<MeterReading, 'id' | 'createdAt' | 'updatedAt'>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Implement actual API call
      const newReading: MeterReading = {
        ...readingData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setState(prev => ({
        ...prev,
        readings: [...prev.readings, newReading],
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to add reading',
      }));
    }
  }, []);

  const updateReading = useCallback(async (id: string, readingData: Partial<MeterReading>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Implement actual API call
      setState(prev => ({
        ...prev,
        readings: prev.readings.map(reading =>
          reading.id === id
            ? { ...reading, ...readingData, updatedAt: new Date() }
            : reading
        ),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update reading',
      }));
    }
  }, []);

  const deleteReading = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Implement actual API call
      setState(prev => ({
        ...prev,
        readings: prev.readings.filter(reading => reading.id !== id),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete reading',
      }));
    }
  }, []);

  const togglePanel = useCallback((isOpen: boolean) => {
    setState(prev => ({ ...prev, isPanelOpen: isOpen }));
  }, []);

  const value: MeterReadingContextType = {
    ...state,
    addReading,
    updateReading,
    deleteReading,
    togglePanel,
  };

  return (
    <MeterReadingContext.Provider value={value}>
      {children}
    </MeterReadingContext.Provider>
  );
};
