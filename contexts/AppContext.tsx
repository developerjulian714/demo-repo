"use client";

import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Family, Expense, Budget, Member, Role } from '@/types';
import { INITIAL_FAMILIES, INITIAL_EXPENSES, INITIAL_BUDGETS } from '@/lib/dummy-data';

interface AppContextType {
    families: Family[];
    expenses: Expense[];
    budgets: Budget[];
    currentUser: Member | null;
    activeFamily: Family | null;

    // Actions
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>, splits: Expense['splits']) => void;
    addFamily: (name: string) => void;
    addMember: (familyId: string, name: string, role: Role) => void;
    addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => void;
    switchUser: (userId: string) => void;
    setActiveFamilyId: (familyId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    // Persisted Users/Families
    const [families, setFamilies] = useLocalStorage<Family[]>('families', INITIAL_FAMILIES);
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', INITIAL_EXPENSES);
    const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', INITIAL_BUDGETS);

    // Session State (not persisted necessarily, but good for navigation)
    const [activeFamilyId, setActiveFamilyIdState] = useLocalStorage<string>('activeFamilyId', INITIAL_FAMILIES[0].id);
    const [currentUserId, setCurrentUserId] = useLocalStorage<string>('currentUserId', INITIAL_FAMILIES[0].members[0].id);

    // Derived State
    const activeFamily = families.find(f => f.id === activeFamilyId) || families[0];

    const currentUser = (() => {
        for (const f of families) {
            const m = f.members.find(u => u.id === currentUserId);
            if (m) return m;
        }
        return activeFamily.members[0] || null;
    })();

    const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>, splits: Expense['splits']) => {
        const newExpense: Expense = {
            ...expenseData,
            id: `exp_${Date.now()}`,
            createdAt: new Date().toISOString(),
            splits
        };
        setExpenses(prev => [newExpense, ...prev]);
    };

    const addFamily = (name: string) => {
        const newFamily: Family = {
            id: `fam_${Date.now()}`,
            name,
            createdAt: new Date().toISOString(),
            members: [
                {
                    id: `u_${Date.now()}`,
                    name: 'Admin',
                    role: 'ADMIN',
                    joinedAt: new Date().toISOString(),
                    avatar: 'AD'
                }
            ]
        };
        setFamilies(prev => [...prev, newFamily]);
        setActiveFamilyIdState(newFamily.id);
    };

    const addMember = (familyId: string, name: string, role: Role) => {
        setFamilies(prev => prev.map(fam => {
            if (fam.id === familyId) {
                return {
                    ...fam,
                    members: [
                        ...fam.members,
                        {
                            id: `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            name,
                            role,
                            joinedAt: new Date().toISOString(),
                            avatar: name.slice(0, 2).toUpperCase()
                        }
                    ]
                };
            }
            return fam;
        }));
    };

    const addBudget = (budgetData: Omit<Budget, 'id' | 'createdAt'>) => {
        const newBudget: Budget = {
            ...budgetData,
            id: `bud_${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setBudgets(prev => [newBudget, ...prev]);
    };

    const switchUser = (userId: string) => {
        setCurrentUserId(userId);
    };

    const setActiveFamilyId = (id: string) => {
        setActiveFamilyIdState(id);
    };

    // Prevent hydration mismatch by rendering null until mounted if needed, 
    // but useLocalStorage handles strictly client-side via useState default which is safe-ish, 
    // though typically you want a mounted check.
    const [isMounted, setIsMounted] = useState(false);
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null; // Or a loader
    }

    return (
        <AppContext.Provider
            value={{
                families,
                expenses,
                budgets,
                currentUser,
                activeFamily,
                addExpense,
                addFamily,
                addMember,
                addBudget,
                switchUser,
                setActiveFamilyId
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within a AppProvider');
    }
    return context;
}
