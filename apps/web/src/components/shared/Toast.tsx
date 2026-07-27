'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl max-w-sm',
          type === 'success'
            ? 'bg-emerald-50/95 border-emerald-200 dark:bg-emerald-950/95 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            : 'bg-red-50/95 border-red-200 dark:bg-red-950/95 dark:border-red-800 text-red-800 dark:text-red-200'
        )}
      >
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
        )}
        <p className="text-sm font-medium pr-2 leading-tight">{message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-current transition-colors ml-auto flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Toast;
