import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

interface Toast {
  id: number;
  title: string;
  detail?: string;
  actionLabel?: string;
  actionTo?: string;
}

type ToastInput = Omit<Toast, 'id'>;

interface ToastContextType {
  showToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION_MS = 3200;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const dismiss = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  const showToast = useCallback((input: ToastInput) => {
    window.clearTimeout(timerRef.current);
    setToast({ ...input, id: Date.now() });
    timerRef.current = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4"
      >
        {toast && (
          <div
            key={toast.id}
            role="status"
            data-testid="toast"
            className="toast-enter pointer-events-auto flex items-center gap-3 rounded-full bg-nav backdrop-blur-xl backdrop-saturate-150 border border-line shadow-[0_8px_30px_rgba(0,0,0,0.12)] pl-2.5 pr-4 py-2 text-[14px] max-w-full"
          >
            <span className="w-6 h-6 shrink-0 rounded-full bg-success text-white inline-flex items-center justify-center">
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
            </span>

            <span className="min-w-0 truncate text-ink">
              {toast.title}
              {toast.detail && <span className="text-ink-2">{' '}{toast.detail}</span>}
            </span>

            {toast.actionTo && toast.actionLabel && (
              <Link
                to={toast.actionTo}
                onClick={dismiss}
                data-testid="toast-action"
                className="link shrink-0 whitespace-nowrap"
              >
                {toast.actionLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
