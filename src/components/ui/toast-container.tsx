import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import { cn } from '@/lib/utils';

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
}

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[2000] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastNotification;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const typeStyles = {
    default: 'bg-foreground text-background',
    success: 'bg-[var(--color-success)] text-white',
    error: 'bg-[var(--color-error)] text-white',
    warning: 'bg-[var(--color-warning)] text-white',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto animate-in slide-in-from-bottom-4 fade-in-0',
        'rounded-full px-6 py-3 shadow-lg',
        'font-mono text-sm uppercase tracking-normal',
        typeStyles[toast.type || 'default']
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span>{toast.message}</span>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-2 hover:opacity-70 transition-opacity"
          aria-label="Close toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
