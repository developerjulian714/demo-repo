"use client";

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import { X, UserPlus, Shield, User } from 'lucide-react';
import { Role } from '@/types';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
    const { addMember, activeFamily } = useAppContext();
    const { showToast } = useToast();
    const [name, setName] = useState('');
    const [role, setRole] = useState<Role>('MEMBER');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !activeFamily) return;

        addMember(activeFamily.id, name, role);
        showToast(`Welcome ${name} to the family! 👋`, 'SUCCESS');
        onClose();
        setName('');
        setRole('MEMBER');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-md bg-stone-950 border border-emerald-500/20 rounded-4xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative animate-in fade-in zoom-in-95 duration-200 glass">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors group"
                >
                    <X className="w-5 h-5 text-muted-foreground group-hover:text-white" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Add Family Member</h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-emerald-500/70 uppercase tracking-widest ml-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl h-14 px-5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all placeholder:text-white/10"
                            placeholder="Enter name"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-emerald-500/70 uppercase tracking-widest ml-1">Role</label>
                        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                            <button
                                type="button"
                                onClick={() => setRole('MEMBER')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === 'MEMBER'
                                    ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]'
                                    : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                            >
                                Member
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('ADMIN')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === 'ADMIN'
                                    ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]'
                                    : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 text-emerald-950 font-black h-16 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-lg"
                    >
                        <UserPlus className="w-6 h-6 stroke-3" />
                        Add Member
                    </button>
                </form>
            </div>
        </div>
    );
}
