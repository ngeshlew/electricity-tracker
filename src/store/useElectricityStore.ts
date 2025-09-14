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
  
  // Data loading
  loadMeterReadings: () => Promise<void>;
  
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

            set((state) => ({
              readings: [...state.readings, newReading].sort((a, b) => 
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
              error: error instanceof Error ? error.message : 'Failed to add reading',
            });
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
              readings: state.readings.map((reading) =>
                reading.id === id ? updatedReading : reading
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

        // Data loading actions
        loadMeterReadings: async () => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await apiService.getMeterReadings();

            if (!response.success || !response.data) {
              throw new Error(response.error?.message || 'Failed to load meter readings');
            }

            const readings: MeterReading[] = response.data.map(reading => ({
              ...reading,
              date: new Date(reading.date),
              createdAt: new Date(reading.createdAt),
              updatedAt: new Date(reading.updatedAt),
            }));

            set({
              readings: readings.sort((a, b) => 
                new Date(a.date).getTime() - new Date(b.date).getTime()
              ),
              isLoading: false,
              error: null,
            });

            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to load meter readings',
            });
          }
        },

        // Real-time updates
        setupRealtimeUpdates: () => {
          socketService.connect();

          // Listen for real-time updates
          socketService.onMeterReadingAdded((reading) => {
            const newReading: MeterReading = {
              ...reading,
              date: new Date(reading.date),
              createdAt: new Date(reading.createdAt),
              updatedAt: new Date(reading.updatedAt),
            };

            set((state) => ({
              readings: [...state.readings, newReading].sort((a, b) => 
                new Date(a.date).getTime() - new Date(b.date).getTime()
              ),
            }));

            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          });

          socketService.onMeterReadingUpdated((reading) => {
            const updatedReading: MeterReading = {
              ...reading,
              date: new Date(reading.date),
              createdAt: new Date(reading.createdAt),
              updatedAt: new Date(reading.updatedAt),
            };

            set((state) => ({
              readings: state.readings.map((r) =>
                r.id === reading.id ? updatedReading : r
              ).sort((a, b) => 
                new Date(a.date).getTime() - new Date(b.date).getTime()
              ),
            }));

            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          });

          socketService.onMeterReadingDeleted(({ id }) => {
            set((state) => ({
              readings: state.readings.filter((reading) => reading.id !== id),
            }));

            // Recalculate analytics data
            get().calculateConsumptionData();
            get().calculateTimeSeriesData('daily');
            get().calculatePieChartData();
          });
        },

        cleanupRealtimeUpdates: () => {
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
          
          for (let i = 1; i < readings.length; i++) {
            const prevReading = readings[i - 1];
            const currentReading = readings[i];
            
            // Skip consumption calculation if current reading is marked as first reading
            if (currentReading.isFirstReading) {
              continue;
            }
            
            const consumption = get().getConsumptionBetweenReadings(prevReading, currentReading);
            const cost = get().calculateCost(consumption);
            
            chartData.push({
              date: currentReading.date.toISOString().split('T')[0],
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
          const consumption = new Decimal(reading2.reading).minus(reading1.reading);
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
      }
    ),
    {
      name: 'electricity-store',
    }
  )
);
