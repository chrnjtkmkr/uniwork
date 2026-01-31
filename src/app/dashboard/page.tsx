"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Bell,
    Check,
    Plus,
    UserPlus,
    Loader2,
    ArrowRight,
    MessageSquare,
    LayoutDashboard,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    getTasks,
    getRecentMessages,
    getWorkspaceMembers,
    getFirstWorkspace,
    updateTaskStatus,
    getMockUser
} from "@/actions/workspaces";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [recentMessages, setRecentMessages] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [workspace, setWorkspace] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            const ws = await getFirstWorkspace();
            const me = await getMockUser();
            setWorkspace(ws);
            setUser(me);

            if (ws) {
                const [fetchedTasks, fetchedMessages, fetchedMembers] = await Promise.all([
                    getTasks(ws.id, "todo"),
                    getRecentMessages(),
                    getWorkspaceMembers(ws.id)
                ]);
                if (fetchedTasks.success && fetchedTasks.tasks) {
                    setTasks(fetchedTasks.tasks);
                }
                setRecentMessages(fetchedMessages);
                setMembers(fetchedMembers);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    const handleToggleTask = async (taskId: string) => {
        if (!user) return;
        const result = await updateTaskStatus(user.id, taskId, "done");
        if (result.success) {
            toast.success("Task completed!");
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } else {
            toast.error("Failed to update task");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-black">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-10 py-10">
            {/* Header */}
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">Advanced Team Hub</h1>
                    <p className="text-sm text-zinc-500 mt-1 uppercase tracking-widest text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-2 animate-pulse"></span>
                        Real-time productivity stream active
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    {/* Search */}
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                        <input
                            className="bg-zinc-900/30 border border-[#1A1A1A] rounded-xl pl-10 pr-4 py-2.5 text-xs w-72 focus:ring-1 focus:ring-[#3B82F6] focus:bg-zinc-900 transition-all text-white placeholder:text-zinc-600 outline-none uppercase font-bold tracking-tighter"
                            placeholder="Search team or projects..."
                            type="text"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#1A1A1A] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#3B82F6] rounded-full"></span>
                        </button>

                        {/* User Avatar */}
                        {user?.avatar ? (
                            <img
                                alt="User"
                                className="w-10 h-10 rounded-xl object-cover border border-blue-500/20"
                                src={user.avatar}
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                                {user?.name?.[0] || "U"}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Left Column - 8/12 */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* Pending Tasks List */}
                    <section className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 relative overflow-hidden group/card shadow-2xl">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Operational Log</h2>
                                <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-0.5 rounded border border-blue-500/20 font-bold">
                                    {tasks.length} ACTIVE NODES
                                </span>
                            </div>
                            <Link href="/dashboard/tasks">
                                <button className="text-[10px] text-[#3B82F6] font-black hover:underline tracking-widest uppercase flex items-center gap-1">
                                    VIEW ALL <ArrowRight className="w-3 h-3 text-blue-500" />
                                </button>
                            </Link>
                        </div>

                        {tasks.length === 0 ? (
                            <div className="p-12 text-center border-2 border-dashed border-zinc-900 rounded-2xl">
                                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">System Clear: All nodes resolved</p>
                            </div>
                        ) : (
                            <div className="space-y-4 relative z-10">
                                {tasks.slice(0, 4).map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-5 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:border-blue-500/30 transition-all group/item shadow-sm hover:shadow-blue-500/5">
                                        <div className="flex items-center gap-4">
                                            <div
                                                onClick={() => handleToggleTask(task.id)}
                                                className="w-5 h-5 rounded border border-zinc-800 flex items-center justify-center hover:border-emerald-500 transition-all cursor-pointer bg-black/50"
                                            >
                                                <Check className="w-3.5 h-3.5 text-transparent group-hover/item:text-emerald-500" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-zinc-100 uppercase tracking-tight italic block">{task.title}</span>
                                                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1 block">{task.category || "GENERAL"}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge className={cn(
                                                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5",
                                                task.priority === "urgent" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                                            )}>
                                                {task.priority || "MEDIUM"}
                                            </Badge>
                                            <span className="text-[10px] text-zinc-600 font-bold tabular-nums">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "--/--"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full group-hover/card:bg-blue-500/10 transition-colors"></div>
                    </section>

                    {/* Active Chats */}
                    <section className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Communication Frequency</h2>
                            <Link href="/dashboard/chat">
                                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest hover:text-blue-500 cursor-pointer transition-colors">3 Transmission Loops Incoming</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recentMessages.length === 0 ? (
                                <div className="col-span-2 py-4 italic text-zinc-700 text-[10px] uppercase font-bold text-center">No recent transmissions</div>
                            ) : (
                                recentMessages.map((msg) => (
                                    <div key={msg.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.04] hover:border-blue-500/20 transition-all cursor-pointer group">
                                        <div className="relative">
                                            {msg.user?.avatar ? (
                                                <img
                                                    alt={msg.user.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-zinc-800"
                                                    src={msg.user.avatar}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-white border border-zinc-700 font-bold">
                                                    {msg.user?.name?.[0] || "?"}
                                                </div>
                                            )}
                                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-tight">{msg.user?.name || "REDACTED"}</h4>
                                                <span className="text-[8px] text-zinc-700 font-bold tabular-nums italic">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-zinc-500 truncate italic font-medium">"{msg.content}"</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Team Management */}
                    <section className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Crew Manifest</h2>
                                <p className="text-[9px] text-zinc-600 mt-1 uppercase font-bold tracking-widest italic">Authorization level: COMMAND_O1</p>
                            </div>
                            <Link href="/dashboard/team">
                                <Button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                                    <UserPlus className="w-4 h-4" />
                                    ADD MEMBER
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {members.slice(0, 4).map((member) => (
                                <div key={member.id} className="p-5 rounded-xl border border-[#1A1A1A] bg-white/[0.01] hover:border-blue-500/40 transition-all flex items-center gap-5 group">
                                    {member.avatar ? (
                                        <img
                                            alt={member.name}
                                            className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all border border-zinc-800"
                                            src={member.avatar}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-white border border-zinc-700 font-bold">
                                            {member.name?.[0] || "?"}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-zinc-100 uppercase italic leading-none">{member.name}</h4>
                                            <span className={cn(
                                                "text-[7px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest",
                                                member.role === "owner" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                                            )}>
                                                {member.role || "MEMBER"}
                                            </span>
                                        </div>
                                        <p className="text-[9px] text-zinc-500 mb-2 font-bold uppercase tracking-tight italic opacity-60">{member.position || "CONSULTANT"}</p>
                                        <div className="flex gap-1.5">
                                            {(member.tags?.split(',') || ["CORE", "ENGINE"]).map((tag: string, i: number) => (
                                                <span key={i} className="text-[7px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-full font-black uppercase tracking-[0.1em]">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column - 4/12 */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 shadow-xl">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-2">IO_LOAD</span>
                            <div className="text-2xl font-black text-white italic leading-none">88%</div>
                        </div>
                        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 shadow-xl border-l-[#3B82F6]">
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-2">NODES</span>
                            <div className="text-2xl font-black text-white italic leading-none">{tasks.length}</div>
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <section className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 shadow-2xl relative">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Temporal Deadlines</h2>

                        <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[1px] before:bg-zinc-900">
                            {tasks.filter(t => t.dueDate).slice(0, 3).map((task, i) => (
                                <div key={task.id} className="relative pl-10">
                                    <span className={cn(
                                        "absolute left-0 top-1.5 w-6 h-6 rounded-full bg-black border-2 flex items-center justify-center z-10",
                                        i === 0 ? "border-red-500" : "border-blue-600"
                                    )}>
                                        <span className={cn(
                                            "w-2 h-2 rounded-full",
                                            i === 0 ? "bg-red-500" : "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                                        )}></span>
                                    </span>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-[11px] font-black text-white uppercase tracking-tight italic">{task.title}</h4>
                                            {i === 0 && <span className="text-[7px] font-black text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded tracking-tighter">IMMINENT</span>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-zinc-700" />
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">
                                                {new Date(task.dueDate).toLocaleDateString()} • {i === 0 ? "2H remaining" : "T-Minus 24H"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Completed Tasks Widget - Placeholder with styling */}
                    <section className="bg-[#0A0A0A] border border-[#1A1A1A] border-dashed rounded-2xl p-8 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">History_Log</h2>
                            <Check className="w-5 h-5 text-emerald-500/80" />
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-3 opacity-40 grayscale group">
                                    <Check className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-tight italic line-through decoration-zinc-800">Operational node resolved</p>
                                        <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">Protocol 77-A Successful</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center pt-6 border-t border-zinc-900">
                            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">End of current stream</span>
                        </div>
                    </section>
                </div>
            </div>

            {/* Background Atmosphere */}
            <div className="fixed -top-20 -right-20 w-[600px] h-[600px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none -z-10"></div>
            <div className="fixed -bottom-20 -left-20 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        </div>
    );
}
