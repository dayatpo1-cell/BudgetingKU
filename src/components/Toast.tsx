import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const bgConfig = {
          success: 'bg-emerald-900/90 border-emerald-500/40 text-emerald-100',
          error: 'bg-rose-900/90 border-rose-500/40 text-rose-100',
          warning: 'bg-amber-900/90 border-amber-500/40 text-amber-100',
          info: 'bg-indigo-900/90 border-indigo-500/40 text-indigo-100',
        }[toast.type];

        const Icon = {
          success: CheckCircle2,
          error: AlertCircle,
          warning: AlertTriangle,
          info: Info,
        }[toast.type];

        const iconColor = {
          success: 'text-emerald-400',
          error: 'text-rose-400',
          warning: 'text-amber-400',
          info: 'text-indigo-400',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl backdrop-blur-md border transition-all transform animate-in slide-in-from-top-2 duration-200 ${bgConfig}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              {toast.title && <p className="text-xs font-bold leading-tight mb-0.5">{toast.title}</p>}
              <p className="text-xs opacity-90 leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-white/60 hover:text-white p-1 -mr-1 -mt-1 rounded-lg transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
