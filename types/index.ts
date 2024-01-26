export type Role = 'ADMIN' | 'MEMBER';

export interface User {
    id: string;
    name: string;
    avatar?: string; // URL or Initials
}

export interface Member extends User {
    role: Role;
    joinedAt: string;
}

export interface Family {
    id: string;
    name: string;
    members: Member[];
    createdAt: string;
}

export type SplitType = 'EQUAL' | 'CUSTOM' | 'EXACT';

export interface Split {
    userId: string;
    amount: number;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    paidBy: string; // userId
    date: string;
    category: string;
    splits: Split[];
    familyId: string;
    createdAt: string;
}

export interface Budget {
    id: string;
    familyId: string;
    category: string;
    limit: number;
    spent: number;
    period: 'WEEKLY' | 'MONTHLY';
    createdAt: string;
}
