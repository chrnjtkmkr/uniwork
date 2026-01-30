"use client";

import React, { useState, useEffect } from "react";
import {
    Settings,
    User,
    Shield,
    Bell,
    Globe,
    Zap,
    Key,
    Save,
    Trash2,
    Check,
    Loader2,
    Mail,
    Smartphone,
    CreditCard,
    Lock,
    Eye,
    ChevronRight,
    Palette,
    Activity,
    BrainCircuit,
    Cpu,
    Target,
    ZapOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMockUser } from "@/actions/workspaces";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function init() {
            const me = await getMockUser();
            setUser(me);
            setLoading(false);
        }
        init();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-700 pb-20">
            {/* Neural Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-white/5 pb-16">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white underline decoration-primary/50 decoration-4 underline-offset-8">Core <span className="text-primary italic animate-neon">Params</span></h1>
                    <p className="text-xl font-medium text-muted-foreground italic">Managing authorization clusters and identity frequencies.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-primary text-black hover:bg-primary/90 h-16 px-12 rounded-[32px] font-black italic tracking-tighter text-xl shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all uppercase group">
                    {saving ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Save className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />}
                    Commit Protocols
                </Button>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <div className="flex flex-col md:flex-row gap-16">
                    <TabsList className="flex md:flex-col bg-transparent w-full md:w-80 h-auto gap-4 p-0">
                        {[
                            { value: "profile", label: "Identity Node", icon: User },
                            { value: "account", label: "Auth Flow", icon: Shield },
                            { value: "notifications", label: "Sync Alerts", icon: Bell },
                            { value: "billing", label: "Expansion Plan", icon: CreditCard },
                            { value: "security", label: "Vault Access", icon: Lock },
                        ].map(tab => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="justify-start gap-6 h-16 px-8 rounded-[28px] font-black italic text-sm uppercase tracking-widest text-muted-foreground data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all border border-transparent data-[state=active]:border-primary/20 shadow-2xl relative group overflow-hidden"
                            >
                                <div className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(0,212,170,1)] opacity-0 data-[state=active]:group-data-[state=active]:opacity-100" />
                                <tab.icon className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="flex-1">
                        <TabsContent value="profile" className="mt-0 space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                            <Card className="glass border-white/5 rounded-[56px] overflow-hidden shadow-2xl relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                                <CardHeader className="p-12 border-b border-white/5 bg-white/[0.02]">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                                        <CardTitle className="text-xl font-black italic tracking-[0.3em] uppercase text-white">Public Frequency</CardTitle>
                                    </div>
                                    <CardDescription className="text-muted-foreground font-bold italic opacity-60">Identity data synchronized across the neural universe.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-12 space-y-12">
                                    <div className="flex flex-col md:flex-row gap-12 items-start">
                                        <div className="relative group/avatar">
                                            <Avatar className="h-40 w-40 rounded-[48px] border-4 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover/avatar:border-primary transition-all">
                                                <AvatarImage src={user?.avatar || ""} />
                                                <AvatarFallback className="bg-white/5 text-muted-foreground font-black italic text-5xl uppercase tracking-tighter">{user?.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <button className="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl bg-primary text-black flex items-center justify-center border-8 border-background shadow-2xl hover:scale-110 active:scale-90 transition-all">
                                                <Palette className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <div className="flex-1 space-y-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-4">
                                                    <label className="text-[12px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-4 italic opacity-50">Authorized Name</label>
                                                    <Input defaultValue={user?.name} className="bg-white/5 border-white/5 h-16 rounded-[24px] text-xl font-black italic px-8 focus:border-primary/50 transition-all shadow-xl" />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[12px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-4 italic opacity-50">Neural Designation</label>
                                                    <Input defaultValue={user?.position || "Core Operator"} className="bg-white/5 border-white/5 h-16 rounded-[24px] text-xl font-black italic px-8 focus:border-primary/50 transition-all shadow-xl" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[12px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-4 italic opacity-50">Operational Bio</label>
                                                <textarea
                                                    className="w-full bg-white/5 border border-white/5 rounded-[40px] p-8 text-xl font-bold italic focus:outline-none focus:border-primary/50 min-h-[180px] resize-none text-white shadow-xl placeholder:opacity-10"
                                                    placeholder="Focusing on decentralized synchronization and neural logic architecture..."
                                                    defaultValue={user?.bio}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass border-white/5 rounded-[48px] overflow-hidden shadow-2xl border-dashed p-12 flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:text-black transition-all shadow-xl">
                                        <Key className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">Cryptographic Keys</h3>
                                        <p className="text-sm font-bold text-muted-foreground italic opacity-60">Manage your neural auth tokens and access shards.</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all translate-x-4 group-hover:translate-x-0" />
                            </Card>
                        </TabsContent>

                        <TabsContent value="account" className="mt-0 animate-in fade-in slide-in-from-right-8 duration-500">
                            <Card className="glass border-white/5 rounded-[56px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-12 border-b border-white/5 bg-white/[0.02]">
                                    <CardTitle className="text-xl font-black italic tracking-[0.3em] uppercase text-white">Security Clusters</CardTitle>
                                    <CardDescription className="text-muted-foreground font-bold italic opacity-60">Primary identity and authorized access endpoints.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-12 space-y-8">
                                    <div className="flex items-center justify-between p-8 rounded-[36px] bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                                        <div className="flex items-center gap-8">
                                            <div className="w-14 h-14 rounded-[20px] bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary/10 transition-all shadow-xl">
                                                <Mail className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black italic tracking-tighter text-white">{user?.email}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse italic mt-1">VERIFIED PRIMARY NODE</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="h-12 px-8 rounded-2xl border border-white/5 font-black italic text-xs tracking-widest uppercase text-muted-foreground hover:text-white transition-all">Relink Node</Button>
                                    </div>

                                    <div className="flex items-center justify-between p-8 rounded-[36px] bg-transparent border border-transparent opacity-40 hover:opacity-100 transition-opacity group">
                                        <div className="flex items-center gap-8">
                                            <div className="w-14 h-14 rounded-[20px] bg-white/5 flex items-center justify-center border border-white/5">
                                                <Smartphone className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black italic tracking-tighter text-white/50">Mobile Frequency: Linkless</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic mt-1">SFA AUTHORIZATION REQUIRED</p>
                                            </div>
                                        </div>
                                        <Button className="h-12 px-10 bg-white/5 border border-white/5 text-white hover:bg-white/10 rounded-2xl font-black italic text-xs tracking-widest uppercase transition-all">Initialize</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </div>
            </Tabs>

            {/* Danger Cluster */}
            <div className="p-16 bg-red-500/5 border border-red-500/10 rounded-[64px] flex flex-col md:flex-row items-center gap-16 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-24 h-24 rounded-[32px] bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <ZapOff className="w-10 h-10 text-red-500" />
                </div>
                <div className="flex-1 space-y-4">
                    <h3 className="text-4xl font-black italic tracking-tighter text-red-400 uppercase">Commence Erase</h3>
                    <p className="text-lg text-muted-foreground/60 font-bold italic max-w-2xl leading-relaxed">
                        Immediately de-authorize identity from all universe clusters. Neural link destruction is permanent and data synchronization will cease across all active nodes.
                    </p>
                </div>
                <Button className="h-16 px-12 bg-transparent border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-[28px] font-black italic text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl relative z-10">
                    Execute Purge
                </Button>
            </div>
        </div>
    );
}
