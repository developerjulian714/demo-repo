"use client";

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import {
    User,
    Users,
    Bell,
    Shield,
    Globe,
    Download,
    Trash2,
    ChevronRight,
    LogOut,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const { currentUser, activeFamily, families, setActiveFamilyId } = useAppContext();
    const [notifications, setNotifications] = useState(true);

    const sections = [
        {
            title: "Profile",
            icon: User,
            items: [
                { label: "Account Name", value: currentUser?.name, type: "text" },
                { label: "Family Role", value: currentUser?.role, type: "badge" },
            ]
        },
        {
            title: "Family Settings",
            icon: Users,
            items: [
                { label: "Active Family", value: activeFamily?.name, type: "select" },
                { label: "Total Members", value: `${activeFamily?.members.length} Members`, type: "text" },
            ]
        },
        {
            title: "Preferences",
            icon: Sparkles,
            items: [
                { label: "Push Notifications", value: notifications, type: "toggle" },
                { label: "Language", value: "English (IN)", type: "text" },
                { label: "Currency", value: "INR (₹)", type: "text" },
            ]
        }
    ];

    const handleReset = () => {
        if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-black text-foreground pb-12">
            <Navbar />

            <main className="container mx-auto px-4 pt-24 max-w-2xl space-y-8">
                <header className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white/90">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and app preferences.</p>
                </header>

                <div className="space-y-6">
                    {sections.map((section) => (
                        <div key={section.title} className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <section.icon className="w-4 h-4 text-emerald-500" />
                                <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-500/70">{section.title}</h2>
                            </div>

                            <div className="rounded-3xl glass border border-white/5 overflow-hidden">
                                {section.items.map((item, idx) => (
                                    <div
                                        key={item.label}
                                        className={cn(
                                            "flex items-center justify-between p-5 transition-colors",
                                            idx !== section.items.length - 1 && "border-b border-white/5"
                                        )}
                                    >
                                        <span className="text-white/80 font-medium">{item.label}</span>

                                        <div className="flex items-center gap-3">
                                            {item.type === "text" && (
                                                <span className="text-muted-foreground text-sm">{item.value}</span>
                                            )}
                                            {item.type === "badge" && (
                                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20 tracking-tighter uppercase">
                                                    {item.value}
                                                </span>
                                            )}
                                            {item.type === "toggle" && (
                                                <button
                                                    onClick={() => setNotifications(!notifications)}
                                                    className={cn(
                                                        "w-10 h-5 rounded-full relative transition-colors duration-300",
                                                        notifications ? "bg-emerald-500" : "bg-white/10"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
                                                        notifications ? "left-6" : "left-1"
                                                    )} />
                                                </button>
                                            )}
                                            {item.type === "select" && (
                                                <select
                                                    className="bg-transparent text-sm text-emerald-400 font-bold focus:outline-none cursor-pointer"
                                                    value={activeFamily?.id}
                                                    onChange={(e) => setActiveFamilyId(e.target.value)}
                                                >
                                                    {families.map(f => (
                                                        <option key={f.id} value={f.id} className="bg-stone-900 text-white">
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="rounded-3xl glass border border-white/5 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Download className="w-5 h-5 text-emerald-500" />
                                <span className="text-white/80 font-medium">Export Financial Data</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20 font-bold uppercase">PDF</span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-2 px-1 text-rose-500">
                            <Trash2 className="w-4 h-4" />
                            <h2 className="text-sm font-bold uppercase tracking-widest opacity-70">Danger Zone</h2>
                        </div>
                        <div className="rounded-3xl glass border border-rose-500/10 overflow-hidden">
                            <button
                                onClick={handleReset}
                                className="w-full flex items-center justify-between p-5 hover:bg-rose-500/5 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Trash2 className="w-5 h-5 text-rose-500" />
                                    <span className="text-rose-500 font-medium">Reset All Application Data</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-rose-500/50 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <button className="w-full py-4 rounded-3xl border border-white/5 flex items-center justify-center gap-2 text-muted-foreground hover:text-white hover:bg-white/5 transition-all mt-8 font-bold">
                        <LogOut className="w-4 h-4" />
                        Logout Session
                    </button>
                </div>
            </main>
        </div>
    );
}
