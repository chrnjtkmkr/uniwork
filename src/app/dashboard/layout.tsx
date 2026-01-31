"use client";

import React from "react";
import {
    LayoutDashboard,
    CheckSquare,
    MessageSquare,
    Users,
    Settings,
    Rocket,
    FileText,
    FolderOpen,
    Calendar as CalendarIcon,
    BarChart3,
    Bot
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const sidebarItems: SidebarItem[] = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Messages", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Notes", href: "/dashboard/docs", icon: FileText },
    { name: "Files", href: "/dashboard/files", icon: FolderOpen },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "AI Assistant", href: "/dashboard/ai", icon: Bot },
    { name: "Team Hub", href: "/dashboard/team", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-20 lg:w-64 border-r border-[#1A1A1A] flex flex-col items-center lg:items-stretch py-8 transition-all duration-300">
                {/* Logo */}
                <div className="px-8 mb-12 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <span className="hidden lg:block font-bold text-lg tracking-tight">UniWork</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-white/5 text-white"
                                        : "text-zinc-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive && "text-[#3B82F6]")} />
                                <span className="hidden lg:block text-sm font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Storage Indicator */}
                <div className="px-6 mt-auto">
                    <div className="p-4 bg-zinc-900/40 border border-[#1A1A1A] rounded-2xl hidden lg:block">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Storage</p>
                            <span className="text-[10px] text-zinc-400">65%</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-800 rounded-full mb-2">
                            <div className="h-full bg-[#3B82F6] w-[65%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black">
                {children}
            </main>
        </div>
    );
}
