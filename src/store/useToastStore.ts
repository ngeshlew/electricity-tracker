import { create } from 'zustand';
import { ToastNotification } from '../components/ui/toast-container';

interface ToastStore {
  toasts: ToastNotification[];
  showToast: (message: string, type?: ToastNotification['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message, type = 'default', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = {
      id,
      message,
      type,
      duration,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

