import { Family, Expense, Budget } from '@/types';

export const INITIAL_FAMILIES: Family[] = [
    {
        id: 'fam_1',
        name: "The Sharma's",
        createdAt: new Date().toISOString(),
        members: [
            {
                id: 'u_1',
                name: 'Rahul Sharma',
                role: 'ADMIN',
                joinedAt: new Date().toISOString(),
                avatar: 'RS',
            },
            {
                id: 'u_2',
                name: 'Priya Sharma',
                role: 'MEMBER',
                joinedAt: new Date().toISOString(),
                avatar: 'PS',
            },
            {
                id: 'u_3',
                name: 'Amit Sharma',
                role: 'MEMBER',
                joinedAt: new Date().toISOString(),
                avatar: 'AS',
            },
        ],
    },
];

export const INITIAL_EXPENSES: Expense[] = [
    {
        id: 'exp_1',
        description: 'Groceries from BigBasket',
        amount: 1540,
        paidBy: 'u_1',
        date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        category: 'Groceries',
        familyId: 'fam_1',
        createdAt: new Date().toISOString(),
        splits: [
            { userId: 'u_1', amount: 513 },
            { userId: 'u_2', amount: 513 },
            { userId: 'u_3', amount: 514 },
        ],
    },
    {
        id: 'exp_2',
        description: 'Electricity Bill',
        amount: 3200,
        paidBy: 'u_2',
        date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        category: 'Utilities',
        familyId: 'fam_1',
        createdAt: new Date().toISOString(),
        splits: [
            { userId: 'u_1', amount: 1066 },
            { userId: 'u_2', amount: 1067 },
            { userId: 'u_3', amount: 1067 },
        ],
    },
    {
        id: 'exp_3',
        description: 'Weekend Pizza Party',
        amount: 1800,
        paidBy: 'u_3',
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        category: 'Eating Out',
        familyId: 'fam_1',
        createdAt: new Date().toISOString(),
        splits: [
            { userId: 'u_1', amount: 600 },
            { userId: 'u_2', amount: 600 },
            { userId: 'u_3', amount: 600 },
        ],
    },
];

export const INITIAL_BUDGETS: Budget[] = [
    {
        id: 'bud_1',
        familyId: 'fam_1',
        category: 'Groceries',
        limit: 15000,
        spent: 1540,
        period: 'MONTHLY',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'bud_2',
        familyId: 'fam_1',
        category: 'Eating Out',
        limit: 5000,
        spent: 1800,
        period: 'MONTHLY',
        createdAt: new Date().toISOString(),
    },
];
