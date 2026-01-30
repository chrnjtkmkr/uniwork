"use client";

import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    CheckSquare,
    FileText,
    FolderOpen,
    MessageSquare,
    Calendar,
    BarChart3,
    Plug,
    Sparkles,
    Settings,
    Plus,
    Search,
    Bell,
    ChevronDown,
    Zap,
    LogOut,
    Loader2,
    Users
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { globalSearch } from "@/actions/search";
import { getWorkspaces, getFirstWorkspace } from "@/actions/workspaces";

// We import these but only use them if we aren't in demo mode
import { UserButton, useUser } from "@clerk/nextjs";

interface SidebarItem {
    name?: string;
    href?: string;
    icon?: any;
    divider?: boolean;
}

const sidebarItems: SidebarItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Neural Board", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Liquid Notes", href: "/dashboard/docs", icon: FileText },
    { name: "Team Nexus", href: "/dashboard/team", icon: Users },
    { name: "File Archive", href: "/dashboard/files", icon: FolderOpen },
    { name: "Neural Hub", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Chronos", href: "/dashboard/calendar", icon: Calendar },
    { divider: true },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Integrations", href: "/dashboard/integrations", icon: Plug },
    { name: "AI Assistant", href: "/dashboard/ai", icon: Sparkles },
    { divider: true },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentWorkspace, setCurrentWorkspace] = useState<any>(null);
    const [workspaces, setWorkspaces] = useState<any[]>([]);

    // Check if we are in demo mode
    const isDemoMode = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "" || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("test_");

    useEffect(() => {
        async function init() {
            const wsList = await getWorkspaces();
            setWorkspaces(wsList);
            if (wsList.length > 0) {
                setCurrentWorkspace(wsList[0]);
            } else {
                const first = await getFirstWorkspace();
                if (first) {
                    setCurrentWorkspace(first);
                    setWorkspaces([first]);
                }
            }
        }
        init();
    }, []);

    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (searchQuery.length >= 2 && currentWorkspace) {
                setIsSearching(true);
                const res = await globalSearch(currentWorkspace.id, searchQuery);
                if (res.success) {
                    setSearchResults(res.results || []);
                }
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchQuery, currentWorkspace]);

    return (
        <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 flex flex-col glass z-50">
                <Link href="/dashboard" className="p-8 flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,212,170,0.3)] transition-transform group-hover:rotate-12">
                        <Zap className="text-black w-6 h-6 fill-current" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter uppercase italic underline decoration-primary/50 decoration-2 underline-offset-4">UniWork</span>
                </Link>

                <div className="px-6 mb-8">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-full flex items-center gap-3 p-4 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-[28px] transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl -mr-8 -mt-8" />
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-xs shadow-lg">
                                    {currentWorkspace?.name?.[0] || 'W'}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-black text-[10px] uppercase tracking-widest text-primary/70">Workspace</p>
                                    <p className="truncate font-black text-sm italic tracking-tighter text-white">
                                        {currentWorkspace?.name || "Initializing..."}
                                    </p>
                                </div>
                                <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 glass border-white/10 text-white p-2 rounded-[32px] animate-in zoom-in-95 duration-200">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 px-4 pt-2">Active Universes</DropdownMenuLabel>
                            {workspaces.map(ws => (
                                <DropdownMenuItem
                                    key={ws.id}
                                    onClick={() => setCurrentWorkspace(ws)}
                                    className="focus:bg-primary/20 focus:text-primary cursor-pointer rounded-2xl h-12 px-4 mx-1 font-black italic tracking-tighter flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px]">
                                        {ws.name[0]}
                                    </div>
                                    {ws.name}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator className="bg-white/10 my-2" />
                            <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer rounded-2xl h-12 px-4 mx-1 font-black italic tracking-tighter text-primary">
                                <Plus className="w-4 h-4 mr-2" /> CREATE NEW
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
                    {sidebarItems.map((item, idx) => {
                        if (item.divider) return <div key={idx} className="h-px bg-white/5 my-6 mx-4" />;

                        const Icon = item.icon!;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href || idx}
                                href={item.href || "#"}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-[24px] text-sm font-black italic tracking-tighter transition-all group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(0,212,170,0.1)] border border-primary/20 scale-[1.02]"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                                <span className="uppercase tracking-widest text-[10px] sm:text-sm">{item.name}</span>
                                {isActive && (
                                    <div className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(0,212,170,0.8)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6">
                    <Button className="w-full bg-primary/5 text-primary border border-primary/20 hover:bg-primary hover:text-black transition-all rounded-3xl h-14 font-black italic tracking-tighter text-lg shadow-xl uppercase group">
                        <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" /> New Mission
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-black">
                {/* Subtle Background Glow */}
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/10 blur-[150px] pointer-events-none rounded-full" />

                {/* Top Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 glass z-40">
                    <div className="flex items-center gap-4 flex-1 max-w-2xl relative">
                        <div className="relative w-full group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                placeholder="Search everything... (⌘ + K)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-[28px] py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-muted-foreground/30 focus:bg-white/10 shadow-2xl"
                            />

                            {/* Search Results Dropdown */}
                            {searchQuery.length >= 2 && (
                                <div className="absolute top-full left-0 w-full mt-4 glass border-white/10 rounded-[32px] shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300 z-50 max-h-[400px] overflow-y-auto">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 px-4">Search Results</p>
                                    {isSearching ? (
                                        <div className="flex items-center justify-center py-10 opacity-50">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="py-10 text-center text-muted-foreground font-medium italic">No matches found in the universe.</div>
                                    ) : (
                                        <div className="space-y-2">
                                            {searchResults.map((result: any, i: number) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        router.push(result.href);
                                                        setSearchQuery("");
                                                    }}
                                                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all text-left group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                                                            {result.category === 'Task' ? <CheckSquare className="w-5 h-5" /> : result.category === 'Doc' ? <FileText className="w-5 h-5" /> : <FolderOpen className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-black italic tracking-tighter text-sm">{result.name || result.title}</p>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{result.category}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-white rounded-2xl hover:bg-white/5 w-12 h-12 transition-all">
                            <Bell className="w-6 h-6" />
                            <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-primary border-4 border-[#0A0A0A] shadow-[0_0_10px_rgba(0,212,170,0.5)]" />
                        </Button>

                        <div className="h-8 w-px bg-white/10" />

                        <div className="flex items-center gap-3 pl-2">
                            {isDemoMode ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-4 hover:opacity-80 transition-all p-1 rounded-2xl border border-transparent hover:border-white/10 group">
                                            <div className="hidden lg:block text-right">
                                                <p className="text-sm font-black italic tracking-tighter leading-none text-white">Demo Explorer</p>
                                                <p className="text-[10px] text-primary/70 font-black uppercase tracking-widest mt-1">Experimental Node</p>
                                            </div>
                                            <Avatar className="h-11 w-11 rounded-[18px] border-2 border-primary/20 shadow-xl group-hover:border-primary transition-colors">
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback className="bg-primary text-black font-black">EX</AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64 glass border-white/10 text-white p-2 rounded-[32px] animate-in slide-in-from-top-2 duration-300">
                                        <DropdownMenuLabel className="px-4 py-3">
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Authenticated via</p>
                                            <p className="text-sm font-black italic tracking-tighter text-primary">OFFLINE DEMO MODE</p>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-white/10" />
                                        <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="focus:bg-primary/20 focus:text-primary cursor-pointer rounded-2xl h-12 px-4 italic font-black text-sm tracking-tighter">
                                            Profile Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                // Real sign out if Clerk was active, or just go to login for demo
                                                window.location.href = "/login";
                                            }}
                                            className="focus:bg-red-500/20 focus:text-red-400 cursor-pointer rounded-2xl h-12 px-4 italic font-black text-sm tracking-tighter"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> EXIT SESSION
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <UserWrapper />
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-10 relative scrollbar-hide">
                    <div className="relative z-10 max-w-7xl mx-auto pb-20">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

// Inner component to safely use Clerk hooks only when we know the provider is there
function UserWrapper() {
    const { user } = useUser();

    return (
        <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
                <p className="text-sm font-black italic tracking-tighter leading-none">{user?.fullName || "Authenticated User"}</p>
                <p className="text-[10px] text-primary/70 font-black uppercase tracking-widest mt-1">Authorized Profile</p>
            </div>
            <UserButton
                afterSignOutUrl="/"
                appearance={{
                    elements: {
                        userButtonAvatarBox: "h-11 w-11 rounded-[18px] border-2 border-primary/20",
                        userButtonPopoverCard: "glass border border-white/10 rounded-[32px] p-2 shadow-2xl",
                        userButtonPopoverActions: "p-2",
                        userButtonPopoverActionButton: "rounded-xl font-black italic tracking-tighter hover:bg-primary/10",
                    }
                }}
            />
        </div>
    );
}
