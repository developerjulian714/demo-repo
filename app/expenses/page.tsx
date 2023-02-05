"use client";

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { formatCurrency } from '@/lib/utils';
import { Navbar } from '@/components/layout/Navbar';
import { AddExpenseModal } from '@/components/expenses/AddExpenseModal';
import { Plus, Search, Filter } from 'lucide-react';

export default function ExpensesPage() {
    const { expenses, currentUser } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filter, setFilter] = useState('');

    const filteredExpenses = expenses.filter(e =>
        e.description.toLowerCase().includes(filter.toLowerCase()) ||
        e.category.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-foreground pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Expenses</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                    >
                        <Plus className="w-5 h-5" />
                        Add Expense
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-muted-foreground"
                    />
                </div>

                {/* Expense List */}
                <div className="space-y-3">
                    {filteredExpenses.map((expense) => (
                        <div key={expense.id} className="p-4 rounded-2xl glass border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gray-900/50 flex items-center justify-center text-2xl border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                                    🧾
                                </div>
                                <div>
                                    <h4 className="font-medium text-white group-hover:text-indigo-300 transition-colors">{expense.description}</h4>
                                    <p className="text-xs text-muted-foreground">{expense.category} • {new Date(expense.date).toLocaleDateString()} • by {expense.paidBy === currentUser?.id ? 'You' : 'Others'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-white text-lg">{formatCurrency(expense.amount)}</p>
                                {expense.paidBy === currentUser?.id ?
                                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">You paid</span> :
                                    <span className="text-xs text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full">You owe</span>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
}
