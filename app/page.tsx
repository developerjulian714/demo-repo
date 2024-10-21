"use client";

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/layout/Navbar';
import { BudgetSetupModal } from '@/components/budgets/BudgetSetupModal';
import { SpendingChart } from '@/components/insights/SpendingChart';
import { TrendingUp, Wallet, CreditCard, Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { expenses, budgets, currentUser } = useAppContext();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate stats
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const mySpending = expenses.reduce((acc, curr) => {
    const mySplit = curr.splits.find(s => s.userId === currentUser?.id);
    return acc + (mySplit?.amount || 0);
  }, 0);

  const totalBudget = budgets.reduce((acc, curr) => acc + curr.limit, 0);

  return (
    <div className="min-h-screen bg-black text-foreground pb-20">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white/90">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your family finances.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 glass relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <Wallet className="w-12 h-12 text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-emerald-300">Total Spent</p>
            <h3 className="text-4xl font-bold mt-2 text-white">{formatCurrency(totalSpent)}</h3>
            <p className="text-xs text-emerald-300/60 mt-4">+12.5% from last month</p>
          </div>

          <div className="p-6 rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-900/10 border border-amber-500/20 glass relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <CreditCard className="w-12 h-12 text-amber-400" />
            </div>
            <p className="text-sm font-medium text-amber-300">My Share</p>
            <h3 className="text-4xl font-bold mt-2 text-white">{formatCurrency(mySpending)}</h3>
            <p className="text-xs text-amber-300/60 mt-4 tracking-wide font-medium">YOU OWE ₹500</p>
          </div>

          <div className="p-6 rounded-3xl bg-linear-to-br from-teal-500/10 to-emerald-950/10 border border-teal-500/20 glass relative overflow-hidden group">
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="absolute top-4 right-4 p-2 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all z-10"
              title="Set Budget"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="w-12 h-12 text-teal-400" />
            </div>
            <p className="text-sm font-medium text-teal-300">Budget Limit</p>
            <h3 className="text-4xl font-bold mt-2 text-white">{formatCurrency(totalBudget)}</h3>
            <div className="w-full bg-emerald-950/50 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>

        <BudgetSetupModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} />

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
            <Link href="/expenses" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest">
              View All
            </Link>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300",
                selectedCategory === null
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/10"
              )}
            >
              All
            </button>
            {Array.from(new Set(expenses.map(e => e.category))).slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300",
                  selectedCategory === cat
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {expenses
              .filter(e => !selectedCategory || e.category === selectedCategory)
              .slice(0, 5)
              .map((expense) => (
                <div key={expense.id} className="p-4 rounded-2xl glass border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-900/50 flex items-center justify-center text-2xl border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                      🛒
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white group-hover:text-emerald-300 transition-colors">{expense.description}</h4>
                        {expense.isRecurring && (
                          <span className="flex items-center gap-1 text-[8px] font-black bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-tighter">
                            <RefreshCw className="w-2 h-2" />
                            Recurring
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white mb-0.5">{formatCurrency(expense.amount)}</p>
                    <p className="text-xs text-muted-foreground">Paid by {expense.paidBy === currentUser?.id ? 'You' : 'Others'}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
