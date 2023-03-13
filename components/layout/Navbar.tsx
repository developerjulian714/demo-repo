"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AppContext';
import { LayoutDashboard, Receipt, Users, Settings, LogOut } from 'lucide-react';

export function Navbar() {
    const pathname = usePathname();
    const { currentUser, activeFamily } = useAppContext();

    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Expenses', href: '/expenses', icon: Receipt },
        { name: 'Family', href: '/family', icon: Users },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <span className="text-lg font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
                        SplitWise
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    isActive
                                        ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                        <p className="text-xs text-muted-foreground">{activeFamily?.name}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-linear-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg ring-2 ring-white/10">
                        <span className="text-xs text-white font-bold">
                            {currentUser?.avatar || 'U'}
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
