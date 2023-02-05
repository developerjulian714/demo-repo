"use client";

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role } from '@/types';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
    const { addExpense, activeFamily, currentUser } = useAppContext();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-stone-900 border border-white/10 rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Add Expense</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold text-xl">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-white/20"
                                placeholder="0"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="What was this for?"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Split</label>
                        <div className="flex bg-white/5 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setSplitType('EQUAL')}
                                className={cn(
                                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                                    splitType === 'EQUAL' ? "bg-indigo-600 text-white shadow-lg" : "text-muted-foreground hover:text-white"
                                )}
                            >
                                Equally
                            </button>
                            <button
                                type="button"
                                onClick={() => setSplitType('CUSTOM')}
                                className={cn(
                                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                                    splitType === 'CUSTOM' ? "bg-indigo-600 text-white shadow-lg" : "text-muted-foreground hover:text-white"
                                )}
                            >
                                Custom
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Check className="w-5 h-5" />
                        Save Expense
                    </button>
                </form>
            </div>
        </div>
    );
}
