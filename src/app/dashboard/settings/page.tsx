"use client";

import React, { useState } from "react";
import {
    User,
    Settings,
    Bell,
    Shield,
    Globe,
    Zap,
    CreditCard,
    Users,
    Key,
    ChevronRight,
    LogOut,
    AppWindow,
    Smartphone,
    Check,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const settingGroups = [
    {
        title: "Account",
        items: [
            { id: "profile", name: "Universe Profile", icon: User, desc: "Neural ID and cosmic avatar" },
            { id: "security", name: "Firewall Security", icon: Shield, desc: "Neural encryption settings" },
            { id: "plan", name: "Energy Plan", icon: CreditCard, desc: "Manage your Pro license", badge: "Pro" },
        ]
    },
    {
        title: "Workspace",
        items: [
            { id: "general", name: "Core Protocols", icon: Settings, desc: "Workspace name and logo" },
            { id: "members", name: "Crew Members", icon: Users, desc: "Manage roles and access" },
            { id: "apps", name: "Linked Nodes", icon: AppWindow, desc: "API tunnels and nodes" },
        ]
    },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [username, setUsername] = useState("Demo Explorer");

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white text-center">System <span className="text-primary italic">Control</span></h1>
                <p className="text-muted-foreground font-medium text-center">Fine-tune your personal and workspace parameters.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Navigation Sidebar */}
                <div className="space-y-8">
                    {settingGroups.map((group, i) => (
                        <div key={i} className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4 opacity-50">{group.title}</h3>
                            <div className="space-y-1.5">
                                {group.items.map((item, j) => (
                                    <button
                                        key={j}
                                        onClick={() => setActiveTab(item.id)}
                                        className={cn(
                                            "w-full group flex items-center gap-4 p-4 rounded-[24px] transition-all text-left border border-transparent shadow-sm hover:scale-[1.02] active:scale-95",
                                            activeTab === item.id
                                                ? "bg-primary/10 border-primary/20 text-white"
                                                : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                            activeTab === item.id ? "bg-primary text-black" : "bg-white/5 text-muted-foreground group-hover:text-primary"
                                        )}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-black italic tracking-tighter">{item.name}</p>
                                                {item.badge && <Badge className="bg-primary/20 text-primary border-primary/20 text-[8px] h-3.5 px-1 font-black">{item.badge}</Badge>}
                                            </div>
                                            <p className="text-[10px] font-medium opacity-60 leading-tight">{item.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="pt-6 border-t border-white/5">
                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-400 hover:bg-red-400/10 rounded-[24px] h-14 px-6 font-black italic tracking-tighter">
                            <LogOut className="w-5 h-5 mr-4" /> ABORT SESSION
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-10">
                    {/* Header Banner */}
                    <Card className="glass border-white/5 shadow-2xl rounded-[40px] overflow-hidden relative group">
                        <div className="h-40 bg-gradient-to-br from-primary/30 to-purple-600/20 relative">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                        </div>
                        <CardContent className="p-10 -mt-16 relative">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
                                <div className="flex items-end gap-8">
                                    <div className="relative group/avatar">
                                        <Avatar className="w-32 h-32 rounded-[32px] border-[6px] border-[#0A0A0A] shadow-2xl transition-transform group-hover/avatar:scale-105">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback className="text-3xl bg-primary text-black font-black">DE</AvatarFallback>
                                        </Avatar>
                                        <button className="absolute bottom-2 right-2 w-8 h-8 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg border-2 border-[#0A0A0A] hover:scale-110 transition-transform">
                                            <Smartphone className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="pb-2">
                                        <h2 className="text-4xl font-black italic tracking-tighter text-white">{username}</h2>
                                        <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Explorer-class Node
                                        </p>
                                    </div>
                                </div>
                                <Button onClick={handleSave} className="bg-primary text-black hover:bg-primary/90 rounded-[20px] px-8 h-12 font-black italic tracking-tighter shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all active:scale-95">
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Save Systems"}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Display Name</label>
                                    <Input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 font-bold text-base focus:border-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Neural Link (Email)</label>
                                    <Input defaultValue="explorer@uniwork.io" className="bg-white/5 border-white/10 rounded-2xl h-14 px-6 font-bold text-base opacity-50 cursor-not-allowed" disabled />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Cybernetic Bio</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-base font-medium focus:outline-none focus:border-primary/50 min-h-[140px] resize-none transition-all"
                                        defaultValue="Pioneering the next frontier of productivity. Mastering neural workflows and cosmic collaboration protocols at UniWork."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preferences Card */}
                    <Card className="glass border-white/5 shadow-2xl rounded-[40px] overflow-hidden p-10 space-y-10 group">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />

                        <div>
                            <CardTitle className="text-2xl font-black italic tracking-tighter mb-2">Neural Preferences</CardTitle>
                            <CardDescription className="font-medium">Modify how the universe reacts to your presence.</CardDescription>
                        </div>

                        <div className="space-y-8 relative">
                            {[
                                { title: "Dark Energy Core", desc: "Override system lights with deep charcoal void", active: true },
                                { title: "Neural Prediction", desc: "Enable AI insight generation across all workspace nodes", active: true },
                                { title: "Cosmic Stealth", desc: "Mask your presence from public explorations", active: false },
                                { title: "Haptic Feedback", desc: "Pulse the UI during high-velocity completions", active: true },
                            ].map((pref, i) => (
                                <div key={i} className="flex items-center justify-between group/item">
                                    <div className="space-y-1">
                                        <p className="font-black italic tracking-tighter text-lg transition-colors group-hover/item:text-primary">{pref.title}</p>
                                        <p className="text-xs font-medium text-muted-foreground max-w-sm">{pref.desc}</p>
                                    </div>
                                    <Switch checked={pref.active} className="scale-125 data-[state=checked]:bg-primary" />
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/5 flex gap-6">
                            <Button onClick={handleSave} className="bg-primary text-black hover:bg-primary/90 px-10 h-14 rounded-[24px] font-black italic tracking-tighter shadow-[0_0_20px_rgba(0,212,170,0.3)]">
                                {isSaving ? "SYNCING..." : "COMMIT CHANGES"}
                            </Button>
                            <Button variant="ghost" className="px-8 h-14 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-white/5 border border-white/5">Rollback</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
