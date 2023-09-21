"use client";

import { useToast } from '@/contexts/ToastContext';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
    const { toasts, hideToast } = useToast();

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border glass min-w-[300px] shadow-2xl animate-in fade-in slide-in-from-right-10 duration-300",
                        toast.type === 'SUCCESS' && "border-emerald-500/20 bg-emerald-500/5",
                        toast.type === 'ERROR' && "border-rose-500/20 bg-rose-500/5",
                        toast.type === 'INFO' && "border-amber-500/20 bg-amber-500/5"
                    )}
                >
                    <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center",
                        toast.type === 'SUCCESS' && "text-emerald-400 bg-emerald-400/10",
                        toast.type === 'ERROR' && "text-rose-400 bg-rose-400/10",
                        toast.type === 'INFO' && "text-amber-400 bg-amber-400/10"
                    )}>
                        {toast.type === 'SUCCESS' && <CheckCircle2 className="w-6 h-6" />}
                        {toast.type === 'ERROR' && <AlertCircle className="w-6 h-6" />}
                        {toast.type === 'INFO' && <Info className="w-6 h-6" />}
                    </div>

                    <div className="flex-1">
                        <p className="text-sm font-bold text-white leading-tight">{toast.message}</p>
                    </div>

                    <button
                        onClick={() => hideToast(toast.id)}
                        className="p-1 hover:bg-white/5 rounded-lg transition-colors group"
                    >
                        <X className="w-4 h-4 text-muted-foreground group-hover:text-white" />
                    </button>
                </div>
            ))}
        </div>
    );
}
