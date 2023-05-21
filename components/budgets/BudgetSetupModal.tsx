"use client";

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import { X, Check, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BudgetSetupModal({ isOpen, onClose }: BudgetSetupModalProps) {
    const { addBudget, activeFamily } = useAppContext();
    const { showToast } = useToast();
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numLimit = parseFloat(limit);
        if (!numLimit || !category || !activeFamily) return;

        addBudget({
            category,
            limit: numLimit,
            spent: 0,
            familyId: activeFamily.id,
            period: 'MONTHLY'
        });

        showToast(`${category} budget set to ₹${numLimit}! 🎯`, 'SUCCESS');
        onClose();
        setCategory('');
        setLimit('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-stone-950 border border-emerald-500/20 rounded-4xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative animate-in fade-in zoom-in-95 duration-200 glass">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors group"
                >
                    <X className="w-5 h-5 text-muted-foreground group-hover:text-white" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Set Budget</h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-emerald-500/70 uppercase tracking-widest ml-1">Limit</label>
                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-2xl transition-colors group-focus-within:text-emerald-300">₹</span>
                            <input
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-2xl h-20 pl-12 pr-6 text-3xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-emerald-500/10 transition-all placeholder:text-white/10"
                                placeholder="0"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-emerald-500/70 uppercase tracking-widest ml-1">Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl h-14 px-5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all"
                            placeholder="e.g. Shopping, Rent, Food"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 text-emerald-950 font-black h-16 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-lg"
                    >
                        <Target className="w-6 h-6 stroke-3" />
                        Create Budget
                    </button>
                </form>
            </div>
        </div>
    );
}
