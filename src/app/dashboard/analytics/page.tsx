"use client";

import React, { useEffect, useState } from "react";
import {
    BarChart3,
    TrendingUp,
    Users,
    Clock,
    Calendar as CalendarIcon,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    AreaChart,
    Area
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { getFirstWorkspace } from "@/actions/workspaces";
import { getTasks } from "@/actions/tasks";
import { getDocs } from "@/actions/docs";

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        totalDocs: 0,
        avgVelocity: 0
    });
    const [productivityTrend, setProductivityTrend] = useState<any[]>([]);

    useEffect(() => {
        async function init() {
            const ws = await getFirstWorkspace();
            if (ws) {
                const [tasksRes, docsRes] = await Promise.all([
                    getTasks(ws.id),
                    getDocs(ws.id)
                ]);

                if (tasksRes.success && tasksRes.tasks) {
                    const completed = tasksRes.tasks.filter(t => t.status === 'done').length;
                    setStats(prev => ({
                        ...prev,
                        totalTasks: tasksRes.tasks!.length,
                        completedTasks: completed,
                        avgVelocity: (completed / (tasksRes.tasks!.length || 1) * 100).toFixed(1) as any
                    }));

                    // Simulate trend data based on actual tasks
                    const trend = [
                        { name: "Mon", score: Math.floor(Math.random() * 20) + 40 },
                        { name: "Tue", score: Math.floor(Math.random() * 30) + 50 },
                        { name: "Wed", score: Math.floor(Math.random() * 20) + 60 },
                        { name: "Thu", score: completed * 5 },
                        { name: "Fri", score: completed * 8 },
                        { name: "Sat", score: 10 },
                    ];
                    setProductivityTrend(trend);
                }

                if (docsRes.success && docsRes.docs) {
                    setStats(prev => ({ ...prev, totalDocs: docsRes.docs!.length }));
                }
            }
            setLoading(false);
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

    const teamData = [
        { name: "Tasks", count: stats.totalTasks },
        { name: "Completed", count: stats.completedTasks },
        { name: "Docs", count: stats.totalDocs },
        { name: "Files", count: 12 }, // Placeholder for now
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Universal <span className="text-primary italic">Intelligence</span></h1>
                    <p className="text-muted-foreground font-medium">Deep metrics powered by your workspace activity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="glass border-white/10 h-11 px-6 rounded-xl font-black italic">
                        <CalendarIcon className="w-4 h-4 mr-2" /> Jan 2026
                    </Button>
                    <Button className="bg-primary text-black hover:bg-primary/90 h-11 px-6 rounded-xl font-black shadow-[0_0_15px_rgba(0,212,170,0.3)]">
                        Generate Report
                    </Button>
                </div>
            </div>

            {/* High Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-primary/20 bg-primary/5 shadow-none rounded-[40px] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/40 transition-all duration-700" />
                    <CardContent className="p-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-black mb-6 shadow-xl">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-2">Total Output Velocity</p>
                        <h2 className="text-6xl font-black mb-2 tracking-tighter italic">{stats.avgVelocity}%</h2>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                            <span className="text-primary">+5.2%</span>
                            <span className="text-muted-foreground opacity-50">Pulse Efficiency</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 shadow-none rounded-[40px] overflow-hidden group">
                    <CardContent className="p-8">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 mb-6 font-bold group-hover:bg-blue-400/10 transition-colors">
                            <Clock className="w-7 h-7" />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-2">Active Work Hours</p>
                        <h2 className="text-6xl font-black mb-2 tracking-tighter italic">142h</h2>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                            <span className="text-blue-400">+12.5h</span>
                            <span className="text-muted-foreground opacity-50">Deep Work cycles</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 shadow-none rounded-[40px] overflow-hidden group">
                    <CardContent className="p-8">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400 mb-6 font-bold group-hover:bg-purple-400/10 transition-colors">
                            <Users className="w-7 h-7" />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-2">Team Sync Rate</p>
                        <h2 className="text-6xl font-black mb-2 tracking-tighter italic">4.2x</h2>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                            <span className="text-purple-400">+0.8x</span>
                            <span className="text-muted-foreground opacity-50">Collab Momentum</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Productivity Trend */}
                <Card className="glass border-white/5 shadow-none rounded-[40px] overflow-hidden">
                    <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black italic tracking-tighter">Output Momentum</CardTitle>
                            <CardDescription className="font-medium">Real-time engagement tracking across weeks</CardDescription>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[9px] tracking-widest px-3 py-1">Synced</Badge>
                    </CardHeader>
                    <CardContent className="p-8 pt-8 h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={productivityTrend}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#00d4aa"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Module Adoption */}
                <Card className="glass border-white/5 shadow-none rounded-[40px] overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-2xl font-black italic tracking-tighter">Module Vitality</CardTitle>
                        <CardDescription className="font-medium">Distribution of activity across workspace nodes</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-8 h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={teamData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff03' }}
                                    contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px" }}
                                />
                                <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                                    {teamData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 1 ? '#00d4aa' : '#ffffff10'} className="hover:fill-primary/50 transition-all duration-300" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
