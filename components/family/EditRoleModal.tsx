"use client";

import { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import { X, Shield, User, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Member, Role } from '@/types';

interface EditRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: Member | null;
}

export function EditRoleModal({ isOpen, onClose, member }: EditRoleModalProps) {
    const { families, setFamilies } = useAppContext() as any; // Using any for quick action access if needed
    const { showToast } = useToast();
    const [role, setRole] = useState<Role>('MEMBER');

    useEffect(() => {
        if (member) {
            setRole(member.role);
        }
    }, [member]);

    if (!isOpen || !member) return null;

    const handleSave = () => {
        // Implementation: Find family, find member, update role
        if (typeof setFamilies === 'function') {
            setFamilies((prev: any) => prev.map((fam: any) => ({
                ...fam,
                members: fam.members.map((m: any) =>
                    m.id === member.id ? { ...m, role } : m
                )
            })));
            showToast(`${member.name}'s role updated to ${role}! 🛡️`, 'SUCCESS');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="w-full max-w-sm bg-stone-950 border border-emerald-500/20 rounded-4xl p-8 glass relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors group"
                >
                    <X className="w-5 h-5 text-muted-foreground group-hover:text-white" />
                </button>

                <h2 className="text-xl font-bold text-white mb-6">Edit Permissions</h2>

                <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-lg font-bold text-white">
                        {member.avatar}
                    </div>
                    <div>
                        <p className="text-white font-bold">{member.name}</p>
                        <p className="text-xs text-muted-foreground">Current: {member.role}</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <button
                        onClick={() => setRole('ADMIN')}
                        className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                            role === 'ADMIN'
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                                : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/10"
                        )}
                    >
                        <Shield className="w-5 h-5" />
                        <div className="text-left">
                            <p className="font-bold">Admin</p>
                            <p className="text-[10px] opacity-70">Can manage members & budgets</p>
                        </div>
                        {role === 'ADMIN' && <Check className="w-5 h-5 ml-auto" />}
                    </button>

                    <button
                        onClick={() => setRole('MEMBER')}
                        className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                            role === 'MEMBER'
                                ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                                : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/10"
                        )}
                    >
                        <User className="w-5 h-5" />
                        <div className="text-left">
                            <p className="font-bold">Member</p>
                            <p className="text-[10px] opacity-70">Can only add & view expenses</p>
                        </div>
                        {role === 'MEMBER' && <Check className="w-5 h-5 ml-auto" />}
                    </button>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-14 rounded-2xl transition-all shadow-lg shadow-emerald-600/20"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
