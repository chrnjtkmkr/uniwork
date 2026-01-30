"use client";

import React, { useState, useEffect } from "react";
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
    Zap,
    Activity,
    ChevronRight,
    Search,
    BrainCircuit,
    ZapOff
} from "lucide-react";
import { getFirstWorkspace, getWorkspaceMembers } from "@/actions/workspaces";
import { getTasks, updateTaskStatus } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const [workspace, setWorkspace] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                const ws = await getFirstWorkspace();
                if (ws) {
                    setWorkspace(ws);
                    const [taskRes, memberRes] = await Promise.all([
                        getTasks(ws.id),
                        getWorkspaceMembers(ws.id)
                    ]);
                    if (taskRes.success) {
                        setTasks(taskRes.tasks || []);
                    }
                    setMembers(memberRes);
                }
            } catch (error) {
                console.error("Dashboard init error:", error);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    const pendingTasks = tasks.filter(t => t.status !== 'done').slice(0, 5);
    const completedTasks = tasks.filter(t => t.status === 'done').slice(0, 3);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Neural Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white underline decoration-primary/50 decoration-4 underline-offset-8 leading-none">Command <span className="text-primary italic animate-neon">Center</span></h1>
                    <p className="text-muted-foreground font-medium text-lg">Neural synchronization active for {workspace?.name}. System status: OPTIMAL.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex -space-x-4">
                        {members.slice(0, 5).map(member => (
                            <Avatar key={member.id} className="w-14 h-14 border-4 border-[#0A0A0A] shadow-2xl transition-transform hover:-translate-y-2">
                                <AvatarImage src={member.avatar || ""} />
                                <AvatarFallback className="bg-primary text-black font-black italic">{member.name[0]}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    <Button className="h-16 px-10 bg-primary text-black hover:bg-primary/90 rounded-[32px] font-black italic tracking-tighter text-xl shadow-[0_0_30px_rgba(0,212,170,0.4)] transition-all active:scale-95 group">
                        <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" /> SYNC DATA
                    </Button>
                </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Active Nodes", value: tasks.length.toString(), icon: Activity, color: "text-primary", trend: "+12%" },
                    { label: "Neural Links", value: members.length.toString(), icon: BrainCircuit, color: "text-blue-400", trend: "+2" },
                    { label: "Sync Velocity", value: "94.2%", icon: Zap, color: "text-purple-400", trend: "0.5%" },
                    { label: "Storage Load", value: "2.1 GB", icon: FileText, color: "text-orange-400", trend: "Normal" },
                ].map((stat, i) => (
                    <Card key={i} className="glass border-white/5 hover:border-primary/30 transition-all group overflow-hidden rounded-[40px] relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                        <CardContent className="p-8 pt-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className={cn("p-4 rounded-[20px] bg-white/5 shadow-inner", stat.color)}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <Badge className="bg-white/5 border-white/5 text-[10px] font-black italic tracking-widest text-primary uppercase">{stat.trend}</Badge>
                            </div>
                            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">{stat.label}</p>
                            <h3 className="text-4xl font-black tracking-tighter italic text-white leading-none">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Pending Logic Nodes */}
                <Card className="lg:col-span-2 glass border-white/5 rounded-[48px] overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/50 via-blue-500/50 to-primary/50" />
                    <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-4xl font-black tracking-tighter uppercase italic text-white flex items-center gap-4">
                                Pending <span className="text-primary italic">Nodes</span>
                            </CardTitle>
                            <CardDescription className="text-lg font-medium mt-2">Critical path analysis of uncompleted synchronization steps.</CardDescription>
                        </div>
                        <Button variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-white/5">
                            <MoreHorizontal className="w-6 h-6" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-10 pt-4">
                        <ScrollArea className="h-[450px] pr-6">
                            <div className="space-y-6">
                                {pendingTasks.map(task => (
                                    <div key={task.id} className="group flex items-center gap-8 p-6 rounded-[32px] hover:bg-white/5 border border-transparent hover:border-white/5 transition-all relative overflow-hidden">
                                        <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl border border-white/5">
                                            <div className={cn(
                                                "w-4 h-4 rounded-full animate-pulse",
                                                task.priority === 'urgent' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                                                    task.priority === 'high' ? 'bg-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-primary shadow-[0_0_15px_rgba(0,212,170,0.5)]'
                                            )} />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="text-[10px] font-black italic tracking-widest border-primary/20 text-primary uppercase px-3">{task.category}</Badge>
                                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Active Link</span>
                                            </div>
                                            <h4 className="text-2xl font-black tracking-tighter text-white italic group-hover:text-primary transition-colors">{task.title}</h4>
                                            <p className="text-muted-foreground font-medium text-sm line-clamp-1">{task.description}</p>
                                        </div>
                                        <Button
                                            onClick={async () => {
                                                await updateTaskStatus(task.id, 'done');
                                                setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'done' } : t));
                                            }}
                                            className="h-14 w-14 rounded-[20px] bg-white/5 hover:bg-primary hover:text-black transition-all group"
                                        >
                                            <CheckCircle2 className="w-6 h-6" />
                                        </Button>
                                    </div>
                                ))}
                                {pendingTasks.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center py-20 opacity-30">
                                        <ZapOff className="w-16 h-16 mb-4" />
                                        <p className="font-black italic tracking-tighter uppercase text-xl">All nodes synchronized.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Team Previews & Activity */}
                <div className="space-y-10">
                    <Card className="glass border-white/5 rounded-[48px] overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform cursor-pointer">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-2xl font-black tracking-tighter uppercase italic text-white">Verified <span className="text-primary italic">Links</span></CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="space-y-6">
                                {members.slice(0, 4).map(member => (
                                    <div key={member.id} className="flex items-center gap-4 group">
                                        <div className="relative">
                                            <Avatar className="h-12 w-12 rounded-xl border-2 border-white/10 group-hover:border-primary transition-colors">
                                                <AvatarImage src={member.avatar || ""} />
                                                <AvatarFallback className="bg-white/5 text-[10px] font-black italic uppercase tracking-widest">?</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-[#0A0A0A] animate-pulse" />
                                        </div>
                                        <div>
                                            <p className="font-black italic tracking-tighter text-sm text-white group-hover:text-primary transition-colors">{member.name}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 italic">{member.position || "Operator"}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-white/5 rounded-[48px] overflow-hidden shadow-2xl relative p-10 bg-gradient-to-br from-primary/10 to-transparent flex flex-col items-center text-center group">
                        <div className="w-20 h-20 rounded-[32px] bg-primary/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,212,170,0.3)] group-hover:scale-110 transition-transform">
                            <Zap className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">Initialize <span className="text-primary">Burst</span></h3>
                        <p className="text-muted-foreground text-sm font-medium mb-8">Execute local synchronization audit across all active universes.</p>
                        <Button className="w-full h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black italic tracking-tighter uppercase border border-white/5">Commence Audit</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
