"use client";

import React, { useEffect, useState } from "react";
import {
    TrendingUp,
    CheckCircle2,
    Clock,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Calendar as CalendarIcon,
    MessageSquare,
    FileText,
    Loader2,
    Sparkles,
    UserPlus,
    Tag,
    Briefcase
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTasks, updateTaskStatus } from "@/actions/tasks";
import { getFirstWorkspace, getWorkspaceMembers } from "@/actions/workspaces";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [workspace, setWorkspace] = useState<any>(null);

    useEffect(() => {
        async function init() {
            const ws = await getFirstWorkspace();
            if (ws) {
                setWorkspace(ws);
                const [taskRes, memberRes] = await Promise.all([
                    getTasks(ws.id),
                    getWorkspaceMembers(ws.id)
                ]);

                if (taskRes.success) setTasks(taskRes.tasks || []);
                setMembers(memberRes || []);
            }
            setLoading(false);
        }
        init();
    }, []);

    const handleCompleteTask = async (taskId: string) => {
        const res = await updateTaskStatus(taskId, "done");
        if (res.success) {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "done" } : t));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    const completedTasks = tasks.filter(t => t.status === "done");
    const pendingTasks = tasks.filter(t => t.status !== "done");
    const upcomingDeadlines = tasks
        .filter(t => t.dueDate && t.status !== "done")
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white underline decoration-primary/50 decoration-4 underline-offset-8">Universe <span className="text-primary italic">Pulse</span></h1>
                    <p className="text-muted-foreground font-medium mt-4">Real-time command center for <span className="text-white font-bold">{workspace?.name || "Workspace"}</span>.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="glass border-white/10 h-14 px-6 rounded-2xl font-black italic tracking-tighter">
                        <CalendarIcon className="w-5 h-5 mr-3 text-primary" /> SYNC_NODES
                    </Button>
                    <Button className="bg-primary text-black hover:bg-primary/90 h-14 px-8 rounded-2xl font-black italic tracking-tighter text-lg shadow-[0_0_20px_rgba(0,212,170,0.3)]">
                        DEPLOY NEW
                    </Button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Pending Tasks Section (Replaced Total Tasks) */}
                <Card className="glass border-white/5 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[500px]">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                        <div>
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Pending Tasks List</CardTitle>
                            <CardDescription className="font-bold italic mt-1">{pendingTasks.length} Active Nodes</CardDescription>
                        </div>
                        <Badge className="bg-primary/20 text-primary border-primary/30 h-8 px-4 font-black">ACTIVE</Badge>
                    </CardHeader>
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">
                            {pendingTasks.map(task => (
                                <div key={task.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                        <div className="flex-1">
                                            <p className="font-black italic tracking-tighter text-sm group-hover:text-primary transition-colors">{task.title}</p>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-50">{task.category}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleCompleteTask(task.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="w-10 h-10 rounded-xl hover:bg-primary hover:text-black"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Completed Tasks Section (Crossed-out style) */}
                <Card className="glass border-white/5 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[500px]">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6 text-zinc-500">
                        <div>
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Completed Tasks Box</CardTitle>
                            <CardDescription className="italic mt-1">{completedTasks.length} Synced Nodes</CardDescription>
                        </div>
                        <Badge className="bg-white/5 text-zinc-500 border-white/10 h-8 px-4 font-black">ARCHIVED</Badge>
                    </CardHeader>
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4 opacity-50 grayscale">
                            {completedTasks.map(task => (
                                <div key={task.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                        <span className="font-black italic tracking-tighter text-sm line-through decoration-primary decoration-2">{task.title}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-black border-white/10">DONE</Badge>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Active Chats / Unread Messages (Replaced Workload) */}
                <Card className="glass border-white/5 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[500px]">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                        <div>
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Active Conversations</CardTitle>
                            <CardDescription className="font-bold italic mt-1">Unread Logic Streams</CardDescription>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                    </CardHeader>
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">
                            {[
                                { name: "Frontend Team", msg: "Deployment logic updated.", time: "2m ago", unread: 3 },
                                { name: "Backend Node", msg: "Database push successful.", time: "15m ago", unread: 0 },
                                { name: "CEO / Owner", msg: "Review the roadmap nodes.", time: "1h ago", unread: 1 },
                                { name: "WhatsApp Sync", msg: "Client feedback received.", icon: MessageSquare, time: "3h ago", unread: 5 }
                            ].map((chat, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-[28px] hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black italic text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                            {chat.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-black italic tracking-tighter text-sm">{chat.name}</p>
                                            <p className="text-[11px] text-muted-foreground truncate w-32 font-medium">{chat.msg}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="text-[9px] font-black text-muted-foreground opacity-50 uppercase tracking-widest">{chat.time}</p>
                                        {chat.unread > 0 && (
                                            <div className="w-5 h-5 rounded-lg bg-primary text-black flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_rgba(0,212,170,0.4)]">
                                                {chat.unread}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Upcoming Deadlines (Replaced Productivity Score) */}
                <Card className="glass border-white/5 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[450px]">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                        <div>
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Upcoming Deadlines</CardTitle>
                            <CardDescription className="font-bold italic mt-1">Urgent Neural Delivery</CardDescription>
                        </div>
                        <CalendarIcon className="w-6 h-6 text-primary/50" />
                    </CardHeader>
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">
                            {upcomingDeadlines.length === 0 ? (
                                <div className="h-full flex items-center justify-center py-20 opacity-30 italic font-medium">No urgent nodes detected.</div>
                            ) : (
                                upcomingDeadlines.map(task => (
                                    <div key={task.id} className="p-6 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-between group hover:border-red-500/50 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform",
                                                task.priority === 'urgent' ? 'bg-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-primary/20 text-primary'
                                            )}>
                                                <Clock className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-black italic tracking-tighter text-lg">{task.title}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary">{task.priority}</Badge>
                                                    <span className="text-[11px] font-black font-mono text-muted-foreground uppercase">{new Date(task.dueDate!).toLocaleDateString()} @ {new Date(task.dueDate!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-8 h-8 text-white/10 group-hover:text-red-500 transition-colors" />
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Team Management (Replaced Team Activity) */}
                <Card className="glass border-white/5 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[450px]">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                        <div>
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Team Management</CardTitle>
                            <CardDescription className="font-bold italic mt-1">Authorized Neural Links</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-primary/10 hover:text-primary">
                            <UserPlus className="w-6 h-6" />
                        </Button>
                    </CardHeader>
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">
                            {members.map(member => (
                                <div key={member.id} className="p-5 rounded-[28px] bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-5">
                                        <Avatar className="w-14 h-14 rounded-2xl border-2 border-primary/20 group-hover:border-primary transition-colors">
                                            <AvatarImage src={member.avatar || ""} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-black italic">{member.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-black italic tracking-tighter text-base flex items-center gap-2">
                                                {member.name}
                                                <Badge className="bg-primary/10 text-primary text-[8px] font-black h-4 uppercase">{member.role}</Badge>
                                            </h4>
                                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">{member.position || "Neural Explorer"}</p>
                                            <div className="flex gap-2 mt-2">
                                                {(member.tags || "core,vibe").split(',').map((tag: string) => (
                                                    <Badge key={tag} variant="outline" className="text-[8px] font-black py-0 border-white/10 text-muted-foreground uppercase">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            </div>

            {/* AI Action Banner */}
            <Card className="glass border-primary/30 bg-primary/[0.03] rounded-[48px] p-12 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] -mr-[300px] -mt-[300px] pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />
                <div className="flex flex-col lg:flex-row items-center gap-10">
                    <div className="w-24 h-24 rounded-[32px] bg-primary flex items-center justify-center text-black shadow-[0_0_40px_rgba(0,212,170,0.5)] transform group-hover:rotate-12 transition-all duration-500">
                        <Sparkles className="w-12 h-12 fill-current" />
                    </div>
                    <div className="flex-1 space-y-4 text-center lg:text-left">
                        <h3 className="text-4xl font-black italic tracking-tighter uppercase underline decoration-primary/50 decoration-4 underline-offset-8">Neural Optimizer</h3>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium italic">
                            System monitoring complete. You have <span className="text-white font-black">{pendingTasks.length} pending tasks</span> and <span className="text-red-500 font-black">{upcomingDeadlines.length} urgent deadlines</span>. I recommend prioritizing the <span className="text-primary font-black">"{upcomingDeadlines[0]?.title || 'Backlog'}"</span> node.
                        </p>
                    </div>
                    <Button className="bg-primary text-black hover:bg-primary/90 rounded-[32px] px-14 h-20 text-2xl font-black italic tracking-tighter shadow-2xl transition-all active:scale-95 group">
                        RUN PROTOCOL <ArrowUpRight className="w-8 h-8 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
