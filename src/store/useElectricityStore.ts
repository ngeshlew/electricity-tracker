import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Decimal } from 'decimal.js';
import { apiService } from '../services/api';
import { socketService } from '../services/socketService';
import type { 
  MeterReading, 
  ChartDataPoint, 
  TimeSeriesData,
  PieChartData,
  UserPreferences 
} from '../types';

interface ElectricityState {
  // Meter readings
  readings: MeterReading[];
  isLoading: boolean;
  error: string | null;
  
  // UI state
  isMeterPanelOpen: boolean;
  
  // User preferences
  preferences: UserPreferences;
  
  // Analytics data
  timeSeriesData: TimeSeriesData[];
  chartData: ChartDataPoint[];
  pieChartData: PieChartData[];
  
  // Actions
  addReading: (reading: Omit<MeterReading, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateReading: (id: string, reading: Partial<MeterReading>) => Promise<void>;
  deleteReading: (id: string) => Promise<void>;
  toggleMeterPanel: (isOpen: boolean) => void;
  toggleFirstReading: (id: string) => Promise<void>;
  generateEstimatedReadings: () => Promise<void>;
  removeEstimatedReadings: (date: Date) => Promise<void>;
  removeEstimatedReading: (id: string) => Promise<void>;
  
  // Data loading
  loadMeterReadings: () => Promise<void>;
  clearCacheAndReload: () => Promise<void>;
  
  // Real-time updates
  setupRealtimeUpdates: () => void;
  cleanupRealtimeUpdates: () => void;
  
  // Analytics actions
  calculateConsumptionData: () => void;
  calculateTimeSeriesData: (period: 'daily' | 'weekly' | 'monthly') => void;
  calculatePieChartData: () => void;
  
  // Utility functions
  getConsumptionBetweenReadings: (reading1: MeterReading, reading2: MeterReading) => number;
  calculateCost: (kwh: number) => number;
  getTrend: (data: ChartDataPoint[]) => 'increasing' | 'decreasing' | 'stable';
}

const defaultPreferences: UserPreferences = {
  id: 'default',
  userId: 'default-user',
  theme: 'dark',
  currency: 'GBP',
  unitRate: 0.30, // £0.30 per kWh
  standingCharge: 0.50, // £0.50 per day
  notifications: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useElectricityStore = create<ElectricityState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        readings: [],
        isLoading: false,
        error: null,
        isMeterPanelOpen: false,
        preferences: defaultPreferences,
        timeSeriesData: [],
        chartData: [],
        pieChartData: [],

        // Meter reading actions
        addReading: async (readingData) => {
          set({ isLoading: true, error: null });
          
          // Check for duplicate readings
          const { readings } = get();
          const isDuplicate = readings.some(reading => 
            reading.meterId === readingData.meterId &&
            reading.date.toDateString() === readingData.date.toDateString() &&
            Math.abs(reading.reading - readingData.reading) < 0.01 // Allow 0.01 kWh tolerance
          );
          
          if (isDuplicate) {
            set({ 
              isLoading: false, 
              error: 'A reading for this meter on this date already exists. Please check the readings log or use a different date.' 
            });
            return;
          }
          
          try {
            const response = await apiService.createMeterReading({
              ...readingData,
              date: readingData.date.toISOString(),
            });

            if (!response.success || !response.data) {
              throw new Error(response.error?.message || 'Failed to create reading');
            }

            const newReading: MeterReading = {
              ...response.data,
              date: new Date(response.data.date),
              createdAt: new Date(response.data.createdAt),
              updatedAt: new Date(response.data.updatedAt),
            };

            set((state) => {
              const exists = state.readings.some(r => r.id === newReading.id);
              const nextReadings = exists
                ? state.readings.map(r => r.id === newReading.id ? newReading : r)
                : [...state.readings, newReading];
              return {
                readings: nextReadings.sort((a, b) => 
                  new Date(a.date).getTime() - new Date(b.date).getTime()
                ),
                isLoading: false,
                error: null,
              };
            });

            // Remove any estimated readings for the same date before generating new ones
            await get().removeEstimatedReadings(readingData.date);
            
            // Generate estimated readings and recalculate analytics data
            await get().generateEstimatedReadings();
          } catch (error) {
            // Fallback: Create reading locally if API fails
            console.warn('API failed, creating reading locally:', error);
            
            const newReading: MeterReading = {
              id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              ...readingData,
              date: readingData.date,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            set((state) => {
              const nextReadings = [...state.readings, newReading];
              return {
                readings: nextReadings.sort((a, b) => 
                  new Date(a.date).getTime() - new Date(b.date).getTime()
                ),
                isLoading: false,
                error: null,
              };
            });

            // Remove any estimated readings for the same date before generating new ones
            await get().removeEstimatedReadings(readingData.date);
            
            // Generate estimated readings and recalculate analytics data
            await get().generateEstimatedReadings();
          }
        },

        updateReading: async (id, readingData) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await apiService.updateMeterReading(id, {
              ...readingData,
              date: readingData.date ? readingData.date.toISOString() : undefined,
              createdAt: readingData.createdAt ? readingData.createdAt.toISOString() : undefined,
              updatedAt: readingData.updatedAt ? readingData.updatedAt.toISOString() : undefined,
            });

            if (!response.success || !response.data) {
              throw new Error(response.error?.message || 'Failed to update reading');
            }

            const updatedReading: MeterReading = {
              ...response.data,
              date: new Date(response.data.date),
              createdAt: new Date(response.data.createdAt),
              updatedAt: new Date(response.data.updatedAt),
            };

            set((state) => ({
              readings: state.readings
                .map((reading) => reading.id === id ? updatedReading : reading)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
              isLoading: false,
              error: null,
            }));

            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to update reading',
            });
          }
        },

        deleteReading: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await apiService.deleteMeterReading(id);

            if (!response.success) {
              throw new Error(response.error?.message || 'Failed to delete reading');
            }

            set((state) => ({
              readings: state.readings.filter((reading) => reading.id !== id),
              isLoading: false,
              error: null,
            }));

            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to delete reading',
            });
          }
        },

        toggleFirstReading: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            const { readings } = get();
            const reading = readings.find(r => r.id === id);
            if (!reading) throw new Error('Reading not found');

            const newIsFirstReading = !reading.isFirstReading;
            
            // If setting as first reading, unset any other first readings
            if (newIsFirstReading) {
              const otherFirstReadings = readings.filter(r => r.id !== id && r.isFirstReading);
              for (const otherReading of otherFirstReadings) {
                await apiService.updateMeterReading(otherReading.id, { isFirstReading: false });
              }
            }

            const response = await apiService.updateMeterReading(id, { isFirstReading: newIsFirstReading });

            if (!response.success || !response.data) {
              throw new Error(response.error?.message || 'Failed to update reading');
            }

            const updatedReading: MeterReading = {
              ...response.data,
              date: new Date(response.data.date),
              createdAt: new Date(response.data.createdAt),
              updatedAt: new Date(response.data.updatedAt),
            };

            set((state) => ({
              readings: state.readings.map((r) =>
                r.id === id ? updatedReading : r
              ).sort((a, b) => 
                new Date(a.date).getTime() - new Date(b.date).getTime()
              ),
              isLoading: false,
              error: null,
            }));

            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to update reading',
            });
          }
        },

        toggleMeterPanel: (isOpen) => {
          set({ isMeterPanelOpen: isOpen });
        },

        generateEstimatedReadings: async () => {
          set({ isLoading: true, error: null });
          
          try {
            const { readings } = get();
            
            // First, remove all existing estimated readings
            const manualReadings = readings.filter(r => r.type !== 'ESTIMATED');
            
            if (manualReadings.length < 2) {
              set({ isLoading: false, error: null });
              return;
            }

            // Sort manual readings by date
            const sortedManualReadings = [...manualReadings].sort((a, b) => 
              new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            const estimatedReadings: Omit<MeterReading, 'id' | 'createdAt' | 'updatedAt'>[] = [];

            // Generate estimated readings between consecutive manual readings
            for (let i = 0; i < sortedManualReadings.length - 1; i++) {
              const currentReading = sortedManualReadings[i];
              const nextReading = sortedManualReadings[i + 1];
              
              const currentDate = new Date(currentReading.date);
              const nextDate = new Date(nextReading.date);
              
              // Calculate days between readings
              const daysDiff = Math.ceil(
                (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              
              if (daysDiff <= 1) {
                continue; // No gap to fill
              }
              
              // Calculate consumption between readings
              const consumption = nextReading.reading - currentReading.reading;
              const dailyAverage = consumption / daysDiff;
              
              // Generate estimated readings for each missing day
              let currentReadingValue = currentReading.reading;
              let currentDateToFill = new Date(currentDate);
              currentDateToFill.setDate(currentDateToFill.getDate() + 1);
              
              while (currentDateToFill < nextDate) {
                currentReadingValue += dailyAverage;
                
                const estimatedReading = {
                  meterId: currentReading.meterId,
                  reading: Math.round(currentReadingValue * 100) / 100,
                  date: new Date(currentDateToFill),
                  type: 'ESTIMATED' as const,
                  notes: `Estimated reading based on consumption between ${currentDate.toLocaleDateString('en-GB')} and ${nextDate.toLocaleDateString('en-GB')}`,
                  isFirstReading: false
                };
                
                estimatedReadings.push(estimatedReading);
                
                currentDateToFill.setDate(currentDateToFill.getDate() + 1);
              }
            }

            // Add estimated readings to the store
            if (estimatedReadings.length > 0) {
               set({
                 readings: [...manualReadings, ...estimatedReadings].sort((a, b) => 
                   new Date(a.date).getTime() - new Date(b.date).getTime()
                 ) as MeterReading[],
                 isLoading: false,
                 error: null,
               });

              // Recalculate analytics data
              get().calculateConsumptionData();
              get().calculateTimeSeriesData('daily');
              get().calculatePieChartData();
            } else {
              console.log('No estimated readings to add');
              set({ 
                readings: manualReadings,
                isLoading: false, 
                error: null 
              });
              
              // Still recalculate analytics data even if no estimated readings
              get().calculateConsumptionData();
              get().calculateTimeSeriesData('daily');
              get().calculatePieChartData();
            }
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to generate estimated readings',
            });
          }
        },

        removeEstimatedReadings: async (date) => {
          set({ isLoading: true, error: null });
          
          try {
            const { readings } = get();
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);

            // Find estimated readings for the same date
            const estimatedReadingsToRemove = readings.filter(r => {
              if (r.type !== 'ESTIMATED') return false;
              const readingDate = new Date(r.date);
              readingDate.setHours(0, 0, 0, 0);
              return readingDate.getTime() === targetDate.getTime();
            });

            // Remove estimated readings from the store
            set((state) => ({
              readings: state.readings.filter(r => !estimatedReadingsToRemove.includes(r)),
              isLoading: false,
              error: null,
            }));

            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to remove estimated readings',
            });
          }
        },

        removeEstimatedReading: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            const { readings } = get();
            const readingToRemove = readings.find(r => r.id === id);
            
            if (!readingToRemove) {
              throw new Error('Reading not found');
            }
            
            if (readingToRemove.type !== 'ESTIMATED') {
              throw new Error('Can only remove estimated readings with this function');
            }

            // Remove the specific estimated reading from the store
            set((state) => ({
              readings: state.readings.filter(r => r.id !== id),
              isLoading: false,
              error: null,
            }));

            // After removing an estimated reading, regenerate all estimated readings
            // to ensure consistency and fill any gaps that might have been created
            await get().generateEstimatedReadings();
            
            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to remove estimated reading',
            });
          }
        },

        // Data loading actions
        loadMeterReadings: async () => {
          console.log('Loading meter readings...');
          set({ isLoading: true, error: null });
          
          try {
            const response = await apiService.getMeterReadings();
            console.log('API response:', response);

            if (!response.success || !response.data) {
              throw new Error(response.error?.message || 'Failed to load meter readings');
            }

            const readings: MeterReading[] = response.data.map(reading => ({
              ...reading,
              date: new Date(reading.date),
              createdAt: new Date(reading.createdAt),
              updatedAt: new Date(reading.updatedAt),
            }));

            const sortedReadings = readings.sort((a, b) => 
              new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            
            console.log('Setting readings in store:', sortedReadings.length);
            set({
              readings: sortedReadings,
              isLoading: false,
              error: null,
            });

            // Generate estimated readings and recalculate analytics data
            await get().generateEstimatedReadings();
            
            // Always recalculate analytics data after loading readings
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          } catch (error) {
            console.warn('Falling back to persisted/local readings after API load failure:', error);
            // Ensure we still compute analytics from whatever readings we have
            try {
              await get().generateEstimatedReadings();
            } catch {
              // ignore
            }
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
            set({ isLoading: false, error: error instanceof Error ? error.message : 'Failed to load meter readings' });
          }
        },

        clearCacheAndReload: async () => {
          console.log('Clearing cache and reloading data...');
          // Clear the current readings to force fresh data load
          set({ readings: [], chartData: [], timeSeriesData: [], pieChartData: [] });
          // Load fresh data from API
          await get().loadMeterReadings();
        },

        // Real-time updates
        setupRealtimeUpdates: () => {
          console.log('Setting up real-time updates...');
          try {
            socketService.connect();
          } catch (error) {
            console.warn('Socket connection failed, continuing without real-time updates:', error);
            return;
          }

          const onAdded = (reading: MeterReading) => {
            const newReading: MeterReading = {
              ...reading,
              date: new Date(reading.date),
              createdAt: new Date(reading.createdAt),
              updatedAt: new Date(reading.updatedAt),
            };

            set((state) => {
              const exists = state.readings.some(r => r.id === newReading.id);
              const nextReadings = exists
                ? state.readings.map(r => r.id === newReading.id ? newReading : r)
                : [...state.readings, newReading];
              return {
                readings: nextReadings.sort((a, b) => 
                  new Date(a.date).getTime() - new Date(b.date).getTime()
                ),
              };
            });

            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          };

          const onUpdated = (reading: MeterReading) => {
            const updatedReading: MeterReading = {
              ...reading,
              date: new Date(reading.date),
              createdAt: new Date(reading.createdAt),
              updatedAt: new Date(reading.updatedAt),
            };

            set((state) => ({
              readings: state.readings
                .map((r) => r.id === reading.id ? updatedReading : r)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            }));

            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          };

          const onDeleted = ({ id }: { id: string }) => {
            set((state) => ({
              readings: state.readings.filter((reading) => reading.id !== id),
            }));

            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          };

           socketService.onMeterReadingAdded((reading) => {
             const meterReading: MeterReading = {
               ...reading,
               date: new Date(reading.date),
               createdAt: new Date(reading.createdAt),
               updatedAt: new Date(reading.updatedAt),
             };
             onAdded(meterReading);
           });
           socketService.onMeterReadingUpdated((reading) => {
             const meterReading: MeterReading = {
               ...reading,
               date: new Date(reading.date),
               createdAt: new Date(reading.createdAt),
               updatedAt: new Date(reading.updatedAt),
             };
             onUpdated(meterReading);
           });
          socketService.onMeterReadingDeleted(onDeleted);

          (window as any).__elecHandlers = { onAdded, onUpdated, onDeleted };
        },

        cleanupRealtimeUpdates: () => {
          const handlers = (window as any).__elecHandlers;
          if (handlers) {
            socketService.offMeterReadingAdded(handlers.onAdded);
            socketService.offMeterReadingUpdated(handlers.onUpdated);
            socketService.offMeterReadingDeleted(handlers.onDeleted);
            delete (window as any).__elecHandlers;
          }
          socketService.disconnect();
        },

        // Analytics calculations
        calculateConsumptionData: () => {
          const { readings } = get();
          
          if (readings.length < 2) {
            set({ chartData: [] });
            return;
          }

          const chartData: ChartDataPoint[] = [];
          
          // Handle first reading - show 0 consumption on the first day
          const firstReading = readings[0];
          
          if (firstReading && firstReading.isFirstReading) {
            chartData.push({
              date: new Date(firstReading.date as unknown as string | Date).toISOString().split('T')[0],
              kwh: 0,
              cost: 0,
              label: '0.00 kWh',
            });
          }
          
          // Calculate consumption for all other readings
          for (let i = 1; i < readings.length; i++) {
            const prevReading = readings[i - 1];
            const currentReading = readings[i];
            
            const consumption = get().getConsumptionBetweenReadings(prevReading, currentReading);
            const cost = get().calculateCost(consumption);
            
            chartData.push({
              date: new Date(currentReading.date as unknown as string | Date).toISOString().split('T')[0],
              kwh: consumption,
              cost: cost,
              label: `${consumption.toFixed(2)} kWh`,
            });
          }

          set({ chartData });
        },

        calculateTimeSeriesData: (period) => {
          const { chartData } = get();
          
          if (chartData.length === 0) {
            set({ timeSeriesData: [] });
            return;
          }

          // Group data by period
          const groupedData = new Map<string, ChartDataPoint[]>();
          
          chartData.forEach((point) => {
            const date = new Date(point.date);
            let key: string;
            
            switch (period) {
              case 'daily': {
                key = date.toISOString().split('T')[0];
                break;
              }
              case 'weekly': {
                // Use Monday as week start (ISO 8601 standard)
                const weekStart = new Date(date);
                const day = weekStart.getDay();
                const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
                weekStart.setDate(diff);
                key = weekStart.toISOString().split('T')[0];
                break;
              }
              case 'monthly': {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
              }
            }
            
            if (!groupedData.has(key)) {
              groupedData.set(key, []);
            }
            groupedData.get(key)!.push(point);
          });

          const timeSeriesData: TimeSeriesData[] = Array.from(groupedData.entries()).map(([period, data]) => {
            const totalKwh = data.reduce((sum, point) => sum + point.kwh, 0);
            const totalCost = data.reduce((sum, point) => sum + point.cost, 0);
            const averageDaily = totalKwh / data.length;
            const trend = get().getTrend(data);

            return {
              period,
              data,
              totalKwh,
              totalCost,
              averageDaily,
              trend,
            };
          });

          set({ timeSeriesData });
        },

        calculatePieChartData: () => {
          const { timeSeriesData } = get();
          
          if (timeSeriesData.length === 0) {
            set({ pieChartData: [] });
            return;
          }

          // Calculate consumption by time of day (mock data for now)
          const pieChartData: PieChartData[] = [
            { name: 'Morning (6-12)', value: 25, color: '#8b5cf6', percentage: 25 },
            { name: 'Afternoon (12-18)', value: 30, color: '#06b6d4', percentage: 30 },
            { name: 'Evening (18-24)', value: 35, color: '#10b981', percentage: 35 },
            { name: 'Night (0-6)', value: 10, color: '#f59e0b', percentage: 10 },
          ];

          set({ pieChartData });
        },

        // Utility functions
        getConsumptionBetweenReadings: (reading1, reading2) => {
          // Skip consumption calculation if reading2 is marked as first reading
          if (reading2.isFirstReading) {
            return 0;
          }
          const r1 = new Decimal(reading1.reading);
          const r2 = new Decimal(reading2.reading);
          const consumption = r2.minus(r1);
          return consumption.toNumber();
        },

        calculateCost: (kwh) => {
          const { preferences } = get();
          const cost = new Decimal(kwh).times(preferences.unitRate);
          return cost.toNumber();
        },

        getTrend: (data) => {
          if (data.length < 2) return 'stable';
          
          const firstHalf = data.slice(0, Math.floor(data.length / 2));
          const secondHalf = data.slice(Math.floor(data.length / 2));
          
          const firstAvg = firstHalf.reduce((sum, point) => sum + point.kwh, 0) / firstHalf.length;
          const secondAvg = secondHalf.reduce((sum, point) => sum + point.kwh, 0) / secondHalf.length;
          
          const difference = secondAvg - firstAvg;
          const threshold = firstAvg * 0.05; // 5% threshold
          
          if (difference > threshold) return 'increasing';
          if (difference < -threshold) return 'decreasing';
          return 'stable';
        },
      }),
      {
        name: 'electricity-tracker-storage',
        partialize: (state) => ({
          readings: state.readings,
          preferences: state.preferences,
        }),
        // Note: we avoid mutating state during rehydration here; calculations
        // are resilient to string dates by normalizing where needed.
      }
    ),
    {
      name: 'electricity-store',
    }
  )
);
