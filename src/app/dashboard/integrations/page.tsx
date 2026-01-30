"use client";

import React, { useState } from "react";
import {
    Cloud,
    MessageSquare,
    Send,
    PhoneCall,
    Github,
    Slack,
    Zap,
    Plug,
    Plus,
    Search,
    CheckCircle2,
    ExternalLink,
    ShieldCheck,
    AlertCircle,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const initialIntegrations = [
    {
        id: "gdrive",
        name: "Google Drive",
        description: "Sync documents and spreadsheets automatically across universes.",
        category: "Cloud Storage",
        status: "connected",
        icon: "GD",
        color: "bg-blue-500/10 text-blue-500"
    },
    {
        id: "dropbox",
        name: "Dropbox",
        description: "Access your cloud assets directly within the UniWork timeline.",
        category: "Cloud Storage",
        status: "connected",
        icon: "DB",
        color: "bg-blue-600/10 text-blue-600"
    },
    {
        id: "slack",
        name: "Slack",
        description: "Pulse task updates to your team communication nodes.",
        category: "Communication",
        status: "disconnected",
        icon: "SL",
        color: "bg-purple-500/10 text-purple-500"
    },
    {
        id: "telegram",
        name: "Telegram Bot",
        description: "Receive neural notifications and chat via encrypted bot.",
        category: "Messaging",
        status: "connected",
        icon: "TG",
        color: "bg-sky-500/10 text-sky-500"
    },
    {
        id: "whatsapp",
        name: "WhatsApp",
        description: "Get hyper-summaries and urgent project alerts via WhatsApp.",
        category: "Messaging",
        status: "disconnected",
        icon: "WA",
        color: "bg-green-500/10 text-green-500"
    },
    {
        id: "github",
        name: "GitHub",
        description: "Link commits to neural tasks and track cosmic code changes.",
        category: "Development",
        status: "connected",
        icon: "GH",
        color: "bg-zinc-700/10 text-white"
    },
];

export default function IntegrationsPage() {
    const [filter, setFilter] = useState("All");
    const [apps, setApps] = useState(initialIntegrations);
    const [connectingId, setConnectingId] = useState<string | null>(null);

    const toggleConnection = (id: string) => {
        setConnectingId(id);
        setTimeout(() => {
            setApps(prev => prev.map(app =>
                app.id === id
                    ? { ...app, status: app.status === 'connected' ? 'disconnected' : 'connected' }
                    : app
            ));
            setConnectingId(null);
        }, 800);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">System <span className="text-primary italic">Nodes</span></h1>
                    <p className="text-muted-foreground font-medium">Power up your workspace by connecting to external data streams.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="glass border-white/10 h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-primary transition-all">
                        <ShieldCheck className="w-4 h-4 mr-2 text-primary" /> Security Keys
                    </Button>
                    <Button className="bg-primary text-black hover:bg-primary/90 h-12 px-6 rounded-2xl font-black shadow-[0_0_20px_rgba(0,212,170,0.3)]">
                        <Plus className="w-4 h-4 mr-2" /> Custom Link
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {['All', 'Cloud Storage', 'Messaging', 'Communication', 'Development'].map(cat => (
                    <Button
                        key={cat}
                        variant={filter === cat ? 'default' : 'ghost'}
                        className={cn(
                            "rounded-2xl h-11 px-8 font-black uppercase tracking-[0.1em] text-[10px] transition-all",
                            filter === cat ? 'bg-primary text-black shadow-lg' : 'text-muted-foreground hover:bg-white/5 hover:text-white border border-white/5'
                        )}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {apps.filter(i => filter === 'All' || i.category === filter).map(item => (
                    <Card key={item.id} className="glass border-white/5 shadow-none hover:border-primary/40 transition-all rounded-[40px] overflow-hidden group relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-700" />

                        <CardHeader className="p-8 pb-0">
                            <div className="flex items-start justify-between mb-6">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl transition-transform group-hover:scale-110", item.color)}>
                                    {item.icon}
                                </div>
                                {item.status === 'connected' ? (
                                    <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1 font-black uppercase tracking-widest text-[9px]">
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Synced
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="border-white/10 text-muted-foreground bg-white/5 px-3 py-1 font-black uppercase tracking-widest text-[9px]">
                                        Offline
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-2xl font-black italic tracking-tighter mb-2">{item.name}</CardTitle>
                            <CardDescription className="text-sm font-medium leading-relaxed min-h-[48px]">{item.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="p-8 pt-6">
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                                    <Plug className="w-3.5 h-3.5 mr-1" /> {item.category}
                                </div>
                                <Button
                                    disabled={connectingId === item.id}
                                    onClick={() => toggleConnection(item.id)}
                                    className={cn(
                                        "rounded-2xl h-11 px-6 font-black uppercase tracking-widest text-[10px] transition-all",
                                        item.status === 'connected'
                                            ? 'bg-white/5 text-red-400 hover:bg-red-400/20 shadow-none'
                                            : 'bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,212,170,0.25)]'
                                    )}
                                >
                                    {connectingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : item.status === 'connected' ? 'Disconnect' : 'Sync Hub'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Custom Webhook Card */}
                <Card className="glass border-dashed border-white/20 shadow-none hover:border-primary/50 transition-all rounded-[40px] flex flex-col items-center justify-center p-10 text-center group bg-primary/[0.02]">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all duration-500 mb-6 border border-white/5 shadow-2xl">
                        <Zap className="w-10 h-10 group-hover:animate-pulse" />
                    </div>
                    <h3 className="font-black text-2xl italic tracking-tighter mb-3">Custom Webhook</h3>
                    <p className="text-xs font-medium text-muted-foreground mb-8 max-w-[200px]">Link anything to the universe via UniWork Neural REST API.</p>
                    <Button variant="outline" className="rounded-2xl border-white/10 glass px-8 h-11 font-black uppercase tracking-widest text-[10px]">
                        Review API Docs <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                </Card>
            </div>

            {/* Automation Banner */}
            <Card className="glass bg-primary/5 border-primary/20 rounded-[40px] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-primary/20" />
                <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
                    <div className="w-24 h-24 rounded-[32px] bg-primary flex items-center justify-center shrink-0 shadow-[0_0_40px_rgba(0,212,170,0.4)] group-hover:scale-110 transition-transform">
                        <Zap className="w-12 h-12 text-black fill-current" />
                    </div>
                    <div className="flex-1 space-y-3 text-center lg:text-left">
                        <h3 className="text-3xl font-black italic tracking-tighter">Neural Automation Builder</h3>
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                            Create autonomous workflows. Example: <span className="text-primary font-black">&quot;When Task Finished → File Hub Sync → Slack Alert&quot;</span>.
                        </p>
                    </div>
                    <Button size="lg" className="bg-primary text-black hover:bg-primary/90 h-16 rounded-[24px] px-12 font-black text-lg shadow-[0_4px_30px_rgba(0,212,170,0.4)] transition-all hover:scale-[1.05] active:scale-95 whitespace-nowrap">
                        Open Flow Studio
                    </Button>
                </div>
            </Card>
        </div>
    );
}
