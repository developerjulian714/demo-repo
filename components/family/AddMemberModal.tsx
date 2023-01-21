"use client";

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { X, Check, UserPlus } from 'lucide-react';
import { Role } from '@/types';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
    const { addMember, activeFamily } = useAppContext();
    const [name, setName] = useState('');
    const [role, setRole] = useState<Role>('MEMBER');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !activeFamily) return;

        addMember(activeFamily.id, name, role);
        onClose();
        setName('');
        setRole('MEMBER');
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

                <h2 className="text-2xl font-bold text-white mb-6">Add Family Member</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-muted-foreground"
                            placeholder="Enter name"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                        <div className="flex bg-white/5 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setRole('MEMBER')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'MEMBER' ? 'bg-indigo-600 text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                            >
                                Member
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('ADMIN')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'ADMIN' ? 'bg-indigo-600 text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add Member
                    </button>
                </form>
            </div>
        </div>
    );
}
