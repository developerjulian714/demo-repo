"use client";

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import { X, Receipt } from 'lucide-react';
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
            splits: finalSplits
        }, finalSplits);

        onClose();
        setAmount('');
        setDescription('');
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
                        <label className="text-xs font-semibold text-emerald-500/70 uppercase tracking-widest ml-1">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl h-14 px-5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all"
                            placeholder="What was this for?"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-emerald-500/70 uppercase tracking-widest ml-1">Split Type</label>
                        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                            <button
                                type="button"
                                onClick={() => setSplitType('EQUAL')}
                                className={cn(
                                    "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300",
                                    splitType === 'EQUAL'
                                        ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                Equally
                            </button>
                            <button
                                type="button"
                                onClick={() => setSplitType('CUSTOM')}
                                className={cn(
                                    "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300",
                                    splitType === 'CUSTOM'
                                        ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                Custom
                            </button>
                        </div>
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
