"use client";

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { AddMemberModal } from '@/components/family/AddMemberModal';
import { Plus, Shield, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function FamilyPage() {
    const { activeFamily, currentUser, switchUser } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    if (!activeFamily) return null;

    return (
        <div className="min-h-screen bg-black text-foreground pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{activeFamily.name}</h1>
                        <p className="text-muted-foreground">Manage your family group and members.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                    >
                        <Plus className="w-5 h-5" />
                        Add Member
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeFamily.members.map((member) => (
                        <div key={member.id} className="p-6 rounded-3xl glass border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative flex items-center justify-between mb-4">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                    {member.avatar}
                                </div>
                                {member.role === 'ADMIN' ?
                                    <span className="bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-indigo-500/20">
                                        <ShieldCheck className="w-3 h-3" /> Admin
                                    </span>
                                    :
                                    <span className="bg-white/5 text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-white/10">
                                        <UserIcon className="w-3 h-3" /> Member
                                    </span>
                                }
                            </div>

                            <div className="relative">
                                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                            </div>

                            {currentUser?.id !== member.id && (
                                <button
                                    onClick={() => switchUser(member.id)}
                                    className="mt-6 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors border border-white/5"
                                >
                                    Switch to this user
                                </button>
                            )}
                            {currentUser?.id === member.id && (
                                <div className="mt-6 w-full py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium text-center border border-emerald-500/20">
                                    Current Session
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            <AddMemberModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
}
