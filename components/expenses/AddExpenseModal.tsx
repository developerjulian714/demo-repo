"use client";

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import { suggestCategory } from '@/lib/ai-service';
import { X, Check, Receipt, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role } from '@/types';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
    const { addExpense, activeFamily, currentUser } = useAppContext();
    const { showToast } = useToast();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Groceries');
    const [splitType, setSplitType] = useState<'EQUAL' | 'CUSTOM'>('EQUAL');
    const [splits, setSplits] = useState<{ [userId: string]: string }>({});
    const [isSparkling, setIsSparkling] = useState(false);
    const [isRecurring, setIsRecurring] = useState(false);

    if (!isOpen) return null;

    const members = activeFamily?.members || [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!numAmount || !description) return;

        let finalSplits = [];

        if (splitType === 'EQUAL') {
            const share = numAmount / members.length;
            finalSplits = members.map(m => ({ userId: m.id, amount: share }));
        } else {
            // Logic for custom splits
            // For simplicity in this demo, just defaulting to equal or what was entered
            finalSplits = members.map(m => ({
                userId: m.id,
                amount: parseFloat(splits[m.id] || '0')
            }));
        }

        addExpense({
            amount: numAmount,
            description,
            category,
            paidBy: currentUser?.id || '',
            date: new Date().toISOString(),
            familyId: activeFamily?.id || '',
            splits: finalSplits,
            isRecurring
        }, finalSplits);

        showToast('Expense added successfully! 🧾', 'SUCCESS');
        onClose();
        setAmount('');
        setDescription('');
        setIsRecurring(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="w-full max-w-md bg-stone-950 border border-emerald-500/20 rounded-4xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative animate-in fade-in zoom-in-95 duration-200 glass">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors group"
                >
                    <X className="w-5 h-5 text-muted-foreground group-hover:text-white" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Add Expense</h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-emerald-500/70 uppercase tracking-widest ml-1">Amount</label>
                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-2xl transition-colors group-focus-within:text-emerald-300">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-2xl h-20 pl-12 pr-6 text-3xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-emerald-500/10 transition-all placeholder:text-white/10"
                                placeholder="0"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-xs font-semibold text-emerald-500/70 uppercase tracking-widest">Category</label>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!description) {
                                        showToast('Please enter a description first! ✍️', 'INFO');
                                        return;
                                    }
                                    const suggested = suggestCategory(description);
                                    setCategory(suggested);
                                    setIsSparkling(true);
                                    setTimeout(() => setIsSparkling(false), 500);
                                    showToast(`AI suggests: ${suggested} 🧠`, 'INFO');
                                }}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-all active:scale-95"
                            >
                                <Sparkles className="w-3 h-3" />
                                AI Categorize
                            </button>
                        </div>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={cn(
                                "w-full bg-white/5 border border-white/5 rounded-2xl h-14 px-5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all",
                                isSparkling && "animate-sparkle border-amber-500/50"
                            )}
                            placeholder="What category is this?"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-emerald-500/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <span className="flex-1">Recurring Expense?</span>
                            <span className={cn(
                                "text-[9px] px-1.5 py-0.5 rounded-full",
                                isRecurring ? "bg-amber-500/20 text-amber-500" : "bg-white/5 text-muted-foreground"
                            )}>
                                {isRecurring ? 'YES' : 'NO'}
                            </span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsRecurring(!isRecurring)}
                            className={cn(
                                "w-full flex items-center justify-between px-5 h-14 rounded-2xl border transition-all duration-300",
                                isRecurring
                                    ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                                    : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/10"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <RefreshCw className={cn("w-5 h-5", isRecurring && "animate-spin-slow")} />
                                <span className="font-bold">Monthly Auto-split</span>
                            </div>
                            <div className={cn(
                                "w-10 h-5 rounded-full relative transition-colors duration-300",
                                isRecurring ? "bg-amber-500" : "bg-white/10"
                            )}>
                                <div className={cn(
                                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
                                    isRecurring ? "right-1" : "left-1"
                                )} />
                            </div>
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 text-emerald-950 font-black h-16 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-lg"
                    >
                        <Check className="w-6 h-6 stroke-3" />
                        Save Expense
                    </button>
                </form>
            </div>
        </div>
    );
}
