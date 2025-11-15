import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TariffInfo, DEFAULT_TARIFF, HISTORICAL_TARIFFS } from '../services/ukElectricityApi';

interface TariffState {
  currentTariff: TariffInfo;
  historicalTariffs: TariffInfo[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentTariff: (tariff: TariffInfo) => void;
  addHistoricalTariff: (tariff: TariffInfo) => void;
  updateTariff: (id: string, updates: Partial<TariffInfo>) => void;
  deleteTariff: (id: string) => void;
  getTariffForDate: (date: Date) => TariffInfo | null;
  calculateCostForPeriod: (startDate: Date, endDate: Date, consumption: number) => number;
  getAnnualTargets: () => { usage: number; cost: number };
  getMonthlyTargets: () => { usage: number; cost: number };
  resetToDefaults: () => void;
  validateTariffDates: (tariff: TariffInfo) => { valid: boolean; error?: string };
  checkDateOverlap: (startDate: string, endDate: string | undefined, excludeId?: string) => boolean;
  mergeTariffFromStatement: (statement: { supplier: string; periodStart: Date; periodEnd: Date; unitRate: number; standingCharge: number; accountNumber?: string; meterNumber?: string }) => void;
}

export const useTariffStore = create<TariffState>()(
  persist(
    (set, get) => ({
      currentTariff: DEFAULT_TARIFF,
      historicalTariffs: HISTORICAL_TARIFFS,
      isLoading: false,
      error: null,

      setCurrentTariff: (tariff) => {
        set((state) => {
          // Validate dates
          const validation = get().validateTariffDates(tariff);
          if (!validation.valid) {
            return { ...state, error: validation.error || 'Invalid tariff dates' };
          }

          // Check for overlaps
          if (get().checkDateOverlap(tariff.startDate, tariff.endDate)) {
            return { ...state, error: 'Tariff dates overlap with existing tariff' };
          }

          // Archive previous current tariff if it exists
          const previousCurrent = state.currentTariff;
          const updatedHistorical = previousCurrent.id !== DEFAULT_TARIFF.id
            ? [...state.historicalTariffs, previousCurrent]
            : state.historicalTariffs;

          const newState = {
            currentTariff: tariff,
            historicalTariffs: updatedHistorical,
            error: null,
          };
          
          // Trigger cost recalculation in electricity store
          try {
            const { useElectricityStore } = require('./useElectricityStore');
            useElectricityStore.getState().recalculateCosts();
          } catch (error) {
            // Ignore if electricity store not available
          }
          
          return newState;
        });
      },

      addHistoricalTariff: (tariff) => {
        set((state) => {
          // Validate dates
          const validation = get().validateTariffDates(tariff);
          if (!validation.valid) {
            return { ...state, error: validation.error || 'Invalid tariff dates' };
          }

          // Check for overlaps
          if (get().checkDateOverlap(tariff.startDate, tariff.endDate)) {
            return { ...state, error: 'Tariff dates overlap with existing tariff' };
          }

          const newState = {
            historicalTariffs: [...state.historicalTariffs, tariff],
            error: null,
          };
          
          // Trigger cost recalculation in electricity store
          try {
            const { useElectricityStore } = require('./useElectricityStore');
            useElectricityStore.getState().recalculateCosts();
          } catch (error) {
            // Ignore if electricity store not available
          }
          
          return newState;
        });
      },

      updateTariff: (id, updates) => {
        set((state) => {
          if (state.currentTariff.id === id) {
            const updatedTariff = { ...state.currentTariff, ...updates };
            const validation = get().validateTariffDates(updatedTariff);
            if (!validation.valid) {
              return { ...state, error: validation.error || 'Invalid tariff dates' };
            }

            // Check for overlaps excluding current tariff
            if (get().checkDateOverlap(updatedTariff.startDate, updatedTariff.endDate, id)) {
              return { ...state, error: 'Tariff dates overlap with existing tariff' };
            }

            return {
              currentTariff: updatedTariff,
              error: null,
            };
          }
          
          const tariffToUpdate = state.historicalTariffs.find(t => t.id === id);
          if (!tariffToUpdate) return state;

          const updatedTariff = { ...tariffToUpdate, ...updates };
          const validation = get().validateTariffDates(updatedTariff);
          if (!validation.valid) {
            return { ...state, error: validation.error || 'Invalid tariff dates' };
          }

          // Check for overlaps excluding the tariff being updated
          if (get().checkDateOverlap(updatedTariff.startDate, updatedTariff.endDate, id)) {
            return { ...state, error: 'Tariff dates overlap with existing tariff' };
          }

          const updatedHistorical = state.historicalTariffs.map(tariff =>
            tariff.id === id ? updatedTariff : tariff
          );
          
          const newState = {
            historicalTariffs: updatedHistorical,
            error: null,
          };
          
          // Trigger cost recalculation in electricity store
          try {
            const { useElectricityStore } = require('./useElectricityStore');
            useElectricityStore.getState().recalculateCosts();
          } catch (error) {
            // Ignore if electricity store not available
          }
          
          return newState;
        });
      },

      deleteTariff: (id) => {
        set((state) => ({
          historicalTariffs: state.historicalTariffs.filter(tariff => tariff.id !== id),
        }));
      },

      getTariffForDate: (date) => {
        const { currentTariff, historicalTariffs } = get();
        const allTariffs = [currentTariff, ...historicalTariffs];
        
        // Sort by start date (most recent first)
        const sortedTariffs = allTariffs.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        
        // Find the tariff that was active on the given date
        for (const tariff of sortedTariffs) {
          const startDate = new Date(tariff.startDate);
          const endDate = tariff.endDate ? new Date(tariff.endDate) : new Date();
          
          if (date >= startDate && date <= endDate) {
            return tariff;
          }
        }
        
        return null;
      },

      calculateCostForPeriod: (startDate, endDate, consumption) => {
        const tariff = get().getTariffForDate(startDate);
        if (!tariff) return 0;
        
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const standingChargeCost = (tariff.standingCharge / 100) * days; // Convert pence to pounds
        const unitCost = (tariff.unitRate / 100) * consumption; // Convert pence to pounds
        
        return standingChargeCost + unitCost;
      },

      getAnnualTargets: () => {
        const { currentTariff } = get();
        return {
          usage: currentTariff.estimatedAnnualUsage,
          cost: currentTariff.estimatedAnnualCost,
        };
      },

      getMonthlyTargets: () => {
        const { currentTariff } = get();
        return {
          usage: currentTariff.estimatedAnnualUsage / 12,
          cost: currentTariff.estimatedAnnualCost / 12,
        };
      },

      resetToDefaults: () => {
        set({
          currentTariff: DEFAULT_TARIFF,
          historicalTariffs: HISTORICAL_TARIFFS,
          isLoading: false,
          error: null,
        });
        
        // Trigger cost recalculation in electricity store
        try {
          const { useElectricityStore } = require('./useElectricityStore');
          useElectricityStore.getState().recalculateCosts();
        } catch (error) {
          // Ignore if electricity store not available
        }
      },

      validateTariffDates: (tariff) => {
        const startDate = new Date(tariff.startDate);
        const endDate = tariff.endDate ? new Date(tariff.endDate) : null;

        if (isNaN(startDate.getTime())) {
          return { valid: false, error: 'Invalid start date' };
        }

        if (endDate && isNaN(endDate.getTime())) {
          return { valid: false, error: 'Invalid end date' };
        }

        if (endDate && endDate < startDate) {
          return { valid: false, error: 'End date must be after start date' };
        }

        return { valid: true };
      },

      checkDateOverlap: (startDate, endDate, excludeId) => {
        const { currentTariff, historicalTariffs } = get();
        const newStart = new Date(startDate);
        const newEnd = endDate ? new Date(endDate) : new Date('9999-12-31');

        // Check current tariff
        if (!excludeId || currentTariff.id !== excludeId) {
          const currentStart = new Date(currentTariff.startDate);
          const currentEnd = currentTariff.endDate ? new Date(currentTariff.endDate) : new Date('9999-12-31');

          if (newStart <= currentEnd && newEnd >= currentStart) {
            return true;
          }
        }

        // Check historical tariffs
        for (const tariff of historicalTariffs) {
          if (excludeId && tariff.id === excludeId) continue;

          const tariffStart = new Date(tariff.startDate);
          const tariffEnd = tariff.endDate ? new Date(tariff.endDate) : new Date('9999-12-31');

          if (newStart <= tariffEnd && newEnd >= tariffStart) {
            return true;
          }
        }

        return false;
      },

      mergeTariffFromStatement: (statement) => {
        const { addHistoricalTariff, setCurrentTariff } = get();
        
        const tariffData: TariffInfo = {
          id: `tariff-statement-${Date.now()}`,
          provider: statement.supplier,
          tariffName: `${statement.supplier} Statement Tariff`,
          productType: 'Variable',
          unitRate: statement.unitRate,
          standingCharge: statement.standingCharge,
          startDate: statement.periodStart.toISOString().split('T')[0],
          endDate: statement.periodEnd.toISOString().split('T')[0],
          paymentMethod: 'Direct Debit',
          earlyExitFee: 0,
          accountNumber: statement.accountNumber,
          meterNumber: statement.meterNumber,
          estimatedAnnualUsage: 1180.1,
          estimatedAnnualCost: 0,
        };

        // Check if this is current or historical
        const today = new Date();
        if (new Date(statement.periodEnd) >= today) {
          setCurrentTariff(tariffData);
        } else {
          addHistoricalTariff(tariffData);
        }
      },
    }),
    {
      name: 'tariff-store',
      version: 2,
      migrate: (persistedState: any) => {
        // Recalculate estimated annual costs for existing tariffs
        const calculateAnnualCost = (unitRate: number, standingCharge: number, annualUsage: number): number => {
          const unitCost = (annualUsage * unitRate) / 100;
          const standingCost = (365 * standingCharge) / 100;
          return Math.round((unitCost + standingCost) * 100) / 100;
        };

        if (persistedState?.state) {
          const state = persistedState.state;
          
          // Recalculate current tariff
          if (state.currentTariff) {
            state.currentTariff.estimatedAnnualCost = calculateAnnualCost(
              state.currentTariff.unitRate,
              state.currentTariff.standingCharge,
              state.currentTariff.estimatedAnnualUsage || 1180.1
            );
          }

          // Recalculate historical tariffs
          if (state.historicalTariffs && Array.isArray(state.historicalTariffs)) {
            state.historicalTariffs = state.historicalTariffs.map((tariff: any) => ({
              ...tariff,
              estimatedAnnualCost: calculateAnnualCost(
                tariff.unitRate,
                tariff.standingCharge,
                tariff.estimatedAnnualUsage || 1180.1
              ),
            }));
          }
        }

        return persistedState;
      },
    }
  )
);
