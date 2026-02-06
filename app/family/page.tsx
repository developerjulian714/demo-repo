"use client";

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { AddMemberModal } from '@/components/family/AddMemberModal';
import { EditRoleModal } from '@/components/family/EditRoleModal';
import { Plus, Shield, ShieldCheck, User as UserIcon, Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { Member } from '@/types';

export default function FamilyPage() {
    const { activeFamily, currentUser, switchUser, families, setFamilies } = useAppContext() as any;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

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
                    {currentUser?.role === 'ADMIN' && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95"
                        >
                            <Plus className="w-5 h-5 stroke-3" />
                            Add Member
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeFamily.members.map((member: Member) => (
                        <div key={member.id} className="p-6 rounded-3xl glass border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative flex items-center justify-between mb-4">
                                <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-xl font-bold text-white shadow-lg border border-white/5">
                                    {member.avatar}
                                </div>
                                {member.role === 'ADMIN' ?
                                    <span className="bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 border border-emerald-500/20 uppercase tracking-tighter">
                                        <ShieldCheck className="w-3 h-3" /> Admin
                                    </span>
                                    :
                                    <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 border border-amber-500/20 uppercase tracking-tighter">
                                        <UserIcon className="w-3 h-3" /> Member
                                    </span>
                                }
                                {currentUser?.role === 'ADMIN' && currentUser.id !== member.id && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedMember(member);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all border border-white/5"
                                            title="Edit Role"
                                        >
                                            <SettingsIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm(`Remove ${member.name} from family?`)) {
                                                    setFamilies((prev: any) => prev.map((fam: any) => ({
                                                        ...fam,
                                                        members: fam.members.filter((m: any) => m.id !== member.id)
                                                    })));
                                                }
                                            }}
                                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 transition-all border border-white/5"
                                            title="Remove Member"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
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
            <EditRoleModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedMember(null);
                }}
                member={selectedMember}
            />
        </div>
    );
}
