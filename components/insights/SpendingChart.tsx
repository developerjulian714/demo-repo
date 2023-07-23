"use client";

import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Budget, Expense } from '@/types';

interface SpendingChartProps {
    budgets: Budget[];
    expenses: Expense[];
}

export function SpendingChart({ budgets, expenses }: SpendingChartProps) {
    const data = useMemo(() => {
        return budgets.map(budget => {
            const spent = expenses
                .filter(e => e.category === budget.category)
                .reduce((acc, curr) => acc + curr.amount, 0);

            return {
                name: budget.category,
                spent: spent,
                limit: budget.limit,
                percent: Math.round((spent / budget.limit) * 100)
            };
        });
    }, [budgets, expenses]);

    if (budgets.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center border border-white/5 rounded-3xl bg-white/5 glass">
                <p className="text-muted-foreground italic">Add your first budget to see insights</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-stone-950/40 border border-white/5 p-6 rounded-3xl glass relative overflow-hidden group">
            <h3 className="text-lg font-bold text-white/90 mb-6 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                Spending vs Budget
            </h3>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{
                                backgroundColor: '#0c0a09',
                                border: '1px solid rgba(16,185,129,0.2)',
                                borderRadius: '16px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        />
                        <Bar
                            dataKey="spent"
                            radius={[6, 6, 0, 0]}
                            barSize={32}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.spent > entry.limit ? '#f43f5e' : '#10b981'}
                                    fillOpacity={0.8}
                                />
                            ))}
                        </Bar>
                        <Bar
                            dataKey="limit"
                            fill="rgba(255,255,255,0.05)"
                            radius={[6, 6, 0, 0]}
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
                {data.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{item.name}</p>
                        <p className={cn(
                            "text-sm font-black",
                            item.percent > 100 ? "text-rose-400" : "text-emerald-400"
                        )}>
                            {item.percent}%
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
