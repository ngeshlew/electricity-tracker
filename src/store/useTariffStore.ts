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
}

export const useTariffStore = create<TariffState>()(
  persist(
    (set, get) => ({
      currentTariff: DEFAULT_TARIFF,
      historicalTariffs: HISTORICAL_TARIFFS,
      isLoading: false,
      error: null,

      setCurrentTariff: (tariff) => {
        set((state) => ({
          currentTariff: tariff,
          historicalTariffs: [...state.historicalTariffs, state.currentTariff],
        }));
      },

      addHistoricalTariff: (tariff) => {
        set((state) => ({
          historicalTariffs: [...state.historicalTariffs, tariff],
        }));
      },

      updateTariff: (id, updates) => {
        set((state) => {
          if (state.currentTariff.id === id) {
            return {
              currentTariff: { ...state.currentTariff, ...updates },
            };
          }
          
          const updatedHistorical = state.historicalTariffs.map(tariff =>
            tariff.id === id ? { ...tariff, ...updates } : tariff
          );
          
          return {
            historicalTariffs: updatedHistorical,
          };
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
      },
    }),
    {
      name: 'tariff-store',
      version: 1,
    }
  )
);
