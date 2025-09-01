import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Toast {
  id: string;
  title?: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// Simple toast store (in a real app, you might use Zustand or similar)
const createToastStore = (): ToastStore => {
  let toasts: Toast[] = [];
  const listeners: (() => void)[] = [];

  const notify = () => listeners.forEach(listener => listener());

  return {
    get toasts() {
      return toasts;
    },
    addToast: (toast) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { ...toast, id };
      toasts = [...toasts, newToast];
      notify();

      // Auto remove after duration
      if (toast.duration !== 0) {
        setTimeout(() => {
          toasts = toasts.filter(t => t.id !== id);
          notify();
        }, toast.duration || 5000);
      }
    },
    removeToast: (id) => {
      toasts = toasts.filter(t => t.id !== id);
      notify();
    },
  };
};

const toastStore = createToastStore();

export const toast = {
  success: (description: string, title?: string) =>
    toastStore.addToast({ type: 'success', description, title }),
  error: (description: string, title?: string) =>
    toastStore.addToast({ type: 'error', description, title }),
  warning: (description: string, title?: string) =>
    toastStore.addToast({ type: 'warning', description, title }),
  info: (description: string, title?: string) =>
    toastStore.addToast({ type: 'info', description, title }),
};

const ToastComponent = ({ toast: t, onRemove }: { toast: Toast; onRemove: () => void }) => {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg',
        typeStyles[t.type],
        'animate-slide-up'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            {t.title && (
              <p className="text-sm font-medium">{t.title}</p>
            )}
            <p className={cn('text-sm', t.title && 'mt-1')}>
              {t.description}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="ml-4 inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Toaster = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = () => setToasts([...toastStore.toasts]);
    
    // Listen for changes
    const interval = setInterval(() => {
      setToasts([...toastStore.toasts]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6">
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((t) => (
          <ToastComponent
            key={t.id}
            toast={t}
            onRemove={() => toastStore.removeToast(t.id)}
          />
        ))}
      </div>
    </div>
  );
};
