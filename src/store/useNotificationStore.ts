import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  persistent: boolean;
  category: 'consumption' | 'cost' | 'system' | 'reminder' | 'alert';
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  consumptionAlerts: boolean;
  costAlerts: boolean;
  systemAlerts: boolean;
  reminderAlerts: boolean;
  highUsageThreshold: number; // kWh
  highCostThreshold: number; // £
  reminderFrequency: 'daily' | 'weekly' | 'monthly';
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

interface NotificationState {
  notifications: Notification[];
  settings: NotificationSettings;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Settings actions
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  resetSettings: () => void;
  
  // Smart notifications
  checkConsumptionAlerts: (consumption: number) => void;
  checkCostAlerts: (cost: number) => void;
  generateReminders: () => void;
  
  // Utility actions
  clearError: () => void;
}

const defaultSettings: NotificationSettings = {
  email: true,
  push: true,
  inApp: true,
  consumptionAlerts: true,
  costAlerts: true,
  systemAlerts: true,
  reminderAlerts: true,
  highUsageThreshold: 50, // kWh per day
  highCostThreshold: 10, // £ per day
  reminderFrequency: 'weekly',
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00'
  }
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      settings: defaultSettings,
      unreadCount: 0,
      isLoading: false,
      error: null,

      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: Date.now().toString(),
          timestamp: new Date(),
          read: false
        };

        set((state) => {
          const newNotifications = [notification, ...state.notifications];
          return {
            notifications: newNotifications,
            unreadCount: state.unreadCount + 1
          };
        });

        // Send push notification if enabled
        if (get().settings.push && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.svg',
              tag: notification.id
            });
          }
        }
      },

      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          );
          
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notification => ({ ...notification, read: true })),
          unreadCount: 0
        }));
      },

      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          const wasUnread = notification && !notification.read;
          
          return {
            notifications: state.notifications.filter(n => n.id !== id),
            unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
          };
        });
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0
        });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },

      checkConsumptionAlerts: (consumption) => {
        const { settings, addNotification } = get();
        
        if (!settings.consumptionAlerts) return;
        
        if (consumption > settings.highUsageThreshold) {
          addNotification({
            type: 'warning',
            title: 'High Energy Usage Alert',
            message: `Your daily consumption is ${consumption.toFixed(1)} kWh, which is above your threshold of ${settings.highUsageThreshold} kWh.`,
            persistent: false,
            category: 'consumption',
            actionUrl: '/analytics',
            actionText: 'View Analytics'
          });
        }
      },

      checkCostAlerts: (cost) => {
        const { settings, addNotification } = get();
        
        if (!settings.costAlerts) return;
        
        if (cost > settings.highCostThreshold) {
          addNotification({
            type: 'warning',
            title: 'High Energy Cost Alert',
            message: `Your daily cost is £${cost.toFixed(2)}, which is above your threshold of £${settings.highCostThreshold}.`,
            persistent: false,
            category: 'cost',
            actionUrl: '/analytics',
            actionText: 'View Analytics'
          });
        }
      },

      generateReminders: () => {
        const { settings, addNotification } = get();
        
        if (!settings.reminderAlerts) return;
        
        const now = new Date();
        const lastReminder = localStorage.getItem('lastReminder');
        const lastReminderDate = lastReminder ? new Date(lastReminder) : new Date(0);
        
        let shouldRemind = false;
        
        switch (settings.reminderFrequency) {
          case 'daily':
            shouldRemind = now.getTime() - lastReminderDate.getTime() > 24 * 60 * 60 * 1000;
            break;
          case 'weekly':
            shouldRemind = now.getTime() - lastReminderDate.getTime() > 7 * 24 * 60 * 60 * 1000;
            break;
          case 'monthly':
            shouldRemind = now.getTime() - lastReminderDate.getTime() > 30 * 24 * 60 * 60 * 1000;
            break;
        }
        
        if (shouldRemind) {
          addNotification({
            type: 'info',
            title: 'Meter Reading Reminder',
            message: 'Don\'t forget to record your meter reading to keep your data up to date.',
            persistent: false,
            category: 'reminder',
            actionUrl: '/',
            actionText: 'Add Reading'
          });
          
          localStorage.setItem('lastReminder', now.toISOString());
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'electricity-tracker-notifications',
      version: 1,
      // Custom storage to handle Date objects
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state, version } = JSON.parse(str);
          // Manually revive Date objects
          state.notifications.forEach((notification: Notification) => {
            notification.timestamp = new Date(notification.timestamp);
          });
          return { state, version };
        },
        setItem: (name, newValue) => {
          const str = JSON.stringify(newValue);
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
