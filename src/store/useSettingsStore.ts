import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GeneralSettings {
  userName: string;
  userEmail: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
}

export interface DisplaySettings {
  theme: 'light' | 'dark' | 'system';
  chartType: 'line' | 'area' | 'bar';
  defaultView: 'dashboard' | 'analytics' | 'statements';
  showTooltips: boolean;
  showDebugInfo: boolean;
  compactMode: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  lowConsumptionAlert: boolean;
  highConsumptionAlert: boolean;
  monthlyReport: boolean;
  weeklyReport: boolean;
  alertThreshold: number; // kWh
}

export interface DataManagementSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  dataRetention: '1year' | '2years' | '5years' | 'forever';
  exportFormat: 'csv' | 'json' | 'excel';
  enableAnalytics: boolean;
  enableRealTimeUpdates: boolean;
}

export interface AppSettings {
  general: GeneralSettings;
  display: DisplaySettings;
  notifications: NotificationSettings;
  dataManagement: DataManagementSettings;
}

const defaultSettings: AppSettings = {
  general: {
    userName: 'User',
    userEmail: 'user@example.com',
    timezone: 'Europe/London',
    dateFormat: 'DD/MM/YYYY',
    currency: 'GBP',
    language: 'en'
  },
  display: {
    theme: 'system',
    chartType: 'area',
    defaultView: 'dashboard',
    showTooltips: true,
    showDebugInfo: false,
    compactMode: false
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    lowConsumptionAlert: true,
    highConsumptionAlert: true,
    monthlyReport: true,
    weeklyReport: false,
    alertThreshold: 10
  },
  dataManagement: {
    autoBackup: true,
    backupFrequency: 'weekly',
    dataRetention: '2years',
    exportFormat: 'csv',
    enableAnalytics: true,
    enableRealTimeUpdates: true
  }
};

interface SettingsStore {
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateGeneralSettings: (settings: Partial<GeneralSettings>) => void;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updateDataManagementSettings: (settings: Partial<DataManagementSettings>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  loadSettings: () => void;
  saveSettings: () => Promise<void>;
  exportSettings: () => void;
  importSettings: (settings: AppSettings) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,
      error: null,

      updateGeneralSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            general: { ...state.settings.general, ...newSettings }
          }
        }));
      },

      updateDisplaySettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            display: { ...state.settings.display, ...newSettings }
          }
        }));
      },

      updateNotificationSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, ...newSettings }
          }
        }));
      },

      updateDataManagementSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            dataManagement: { ...state.settings.dataManagement, ...newSettings }
          }
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },

      loadSettings: () => {
        set({ isLoading: true, error: null });
        try {
          const savedSettings = localStorage.getItem('electricity-tracker-settings');
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            set({ settings: { ...defaultSettings, ...parsedSettings }, isLoading: false });
          } else {
            set({ settings: defaultSettings, isLoading: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load settings',
            isLoading: false 
          });
        }
      },

      saveSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          const { settings } = get();
          localStorage.setItem('electricity-tracker-settings', JSON.stringify(settings));
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to save settings',
            isLoading: false 
          });
        }
      },

      exportSettings: () => {
        const { settings } = get();
        const data = {
          settings,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `electricity-tracker-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },

      importSettings: (importedSettings: AppSettings) => {
        set({ settings: { ...defaultSettings, ...importedSettings } });
      }
    }),
    {
      name: 'electricity-tracker-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
