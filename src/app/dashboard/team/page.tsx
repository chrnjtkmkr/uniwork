"use client";

import React, { useState, useEffect } from "react";
import {
    Users,
    UserPlus,
    Search,
    MoreHorizontal,
    Mail,
    Shield,
    BadgeCheck,
    Tag,
    Trash2,
    Edit3,
    Loader2,
    ArrowUpRight,
    Filter,
    Layers,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFirstWorkspace, getWorkspaceMembers, updateMemberRole, addMemberToWorkspace } from "@/actions/workspaces";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function TeamPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [inviteEmail, setInviteEmail] = useState("");
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    useEffect(() => {
        async function init() {
            setLoading(true);
            const ws = await getFirstWorkspace();
            if (ws) {
                setWorkspace(ws);
                const mems = await getWorkspaceMembers(ws.id);
                setMembers(mems);
            }
            setLoading(false);
        }
        init();
    }, []);

    const handleInvite = async () => {
        if (!inviteEmail || !workspace) return;
        const res = await addMemberToWorkspace(workspace.id, inviteEmail);
        if (res.success) {
            setInviteEmail("");
            setIsInviteOpen(false);
            // In demo, we just refresh local state
            const mems = await getWorkspaceMembers(workspace.id);
            setMembers(mems);
        }
    };

    const handleUpdateMember = async (userId: string, data: any) => {
        const res = await updateMemberRole(userId, data);
        if (res.success) {
            setMembers(prev => prev.map(m => m.id === userId ? { ...m, ...data } : m));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white underline decoration-primary/50 decoration-4 underline-offset-8 leading-none">Team <span className="text-primary italic">Nexus</span></h1>
                    <p className="text-muted-foreground font-medium text-lg">Manage authorized personnel and neural communication links for {workspace?.name}.</p>
                </div>
                <div className="flex items-center gap-6">
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-black hover:bg-primary/90 h-16 px-10 rounded-[28px] font-black italic tracking-tighter text-xl shadow-[0_0_30px_rgba(0,212,170,0.4)] transition-all active:scale-95 group">
                                <UserPlus className="w-7 h-7 mr-4" /> INVITE MEMBER
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass border-white/10 text-white rounded-[48px] p-12">
                            <DialogHeader>
                                <DialogTitle className="text-4xl font-black italic tracking-tighter uppercase">Invite <span className="text-primary italic">Neural Link</span></DialogTitle>
                                <p className="text-muted-foreground font-medium mt-2">Authorize a new member to access the {workspace?.name} universe.</p>
                            </DialogHeader>
                            <div className="space-y-8 pt-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Member Email</label>
                                    <Input
                                        placeholder="explorer@universe.com"
                                        type="email"
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                        className="bg-white/5 border-white/10 h-20 rounded-3xl text-2xl font-black px-8 focus:border-primary/50 transition-all"
                                    />
                                </div>
                                <Button onClick={handleInvite} className="w-full h-20 bg-primary text-black hover:bg-primary/90 rounded-[32px] font-black text-2xl shadow-[0_10px_30px_rgba(0,212,170,0.3)] group uppercase italic tracking-tighter">
                                    Send Authorization <ArrowUpRight className="w-8 h-8 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Total Members", value: members.length.toString(), icon: Users, color: "text-primary" },
                    { label: "Active Links", value: "92%", icon: Globe, color: "text-blue-400" },
                    { label: "Dept Clusters", value: "4", icon: Layers, color: "text-purple-400" },
                    { label: "Security Level", value: "Level 4", icon: Shield, color: "text-red-400" },
                ].map((stat, i) => (
                    <Card key={i} className="glass border-white/5 shadow-none rounded-[32px] overflow-hidden group hover:border-white/10 transition-all">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className={cn("p-4 rounded-2xl bg-white/5", stat.color)}>
                                    <stat.icon className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                                <p className="text-3xl font-black tracking-tighter text-white italic group-hover:text-primary transition-colors">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Members List */}
            <Card className="glass border-white/5 rounded-[48px] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none -mr-40 -mt-40" />

                <CardHeader className="p-10 border-b border-white/5 bg-white/[0.02] flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-black italic tracking-tighter uppercase">Authorized Personnel</CardTitle>
                        <CardDescription className="font-bold mt-1">Directory of all active members and their protocol roles.</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                placeholder="Search personnel..."
                                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-primary/50 transition-all w-64 focus:bg-white/10"
                            />
                        </div>
                        <Button variant="ghost" className="rounded-2xl h-11 px-6 font-black uppercase tracking-widest text-[10px] border border-white/5 hover:bg-white/5">
                            <Filter className="w-4 h-4 mr-3" /> Filter
                        </Button>
                    </div>
                </CardHeader>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="p-10 text-[11px] font-black uppercase tracking-[0.4em] text-primary">Member</th>
                                <th className="p-10 text-[11px] font-black uppercase tracking-[0.4em] text-primary">Department / Cluster</th>
                                <th className="p-10 text-[11px] font-black uppercase tracking-[0.4em] text-primary">Level / Role</th>
                                <th className="p-10 text-[11px] font-black uppercase tracking-[0.4em] text-primary">Logic Capacity</th>
                                <th className="p-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                            {members.map(member => (
                                <tr key={member.id} className="hover:bg-primary/[0.02] transition-all group border-transparent hover:border-primary/10">
                                    <td className="p-10">
                                        <div className="flex items-center gap-6">
                                            <Avatar className="h-16 w-16 rounded-[24px] border-2 border-primary/20 shadow-2xl group-hover:border-primary transition-all">
                                                <AvatarImage src={member.avatar || ""} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-black italic text-xl">{member.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-xl font-black italic tracking-tighter text-white flex items-center gap-2">
                                                    {member.name}
                                                    {member.id === workspace?.ownerId && <BadgeCheck className="w-5 h-5 text-primary" />}
                                                </p>
                                                <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-50 mt-1">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-sm font-black italic tracking-tighter text-zinc-300 uppercase">{member.position || "CORE_LOGIC"}</span>
                                            <div className="flex gap-2">
                                                {(member.tags || "core,vibe").split(',').map((tag: string) => (
                                                    <Badge key={tag} variant="outline" className="text-[8px] font-black py-0 border-white/10 text-muted-foreground uppercase">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <Select
                                            defaultValue={member.role || "member"}
                                            onValueChange={(val) => handleUpdateMember(member.id, { role: val })}
                                        >
                                            <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 font-black italic tracking-tighter px-6 w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="glass border-white/10 text-white rounded-3xl p-2">
                                                <SelectItem value="owner" className="rounded-xl font-black uppercase focus:bg-primary/20 focus:text-primary">Owner (L1)</SelectItem>
                                                <SelectItem value="admin" className="rounded-xl font-black uppercase focus:bg-primary/20 focus:text-primary">Admin (L2)</SelectItem>
                                                <SelectItem value="member" className="rounded-xl font-black uppercase focus:bg-primary/20 focus:text-primary">Member (L3)</SelectItem>
                                                <SelectItem value="viewer" className="rounded-xl font-black uppercase focus:bg-primary/20 focus:text-primary">Viewer (L4)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-10">
                                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full w-[85%] shadow-[0_0_10px_rgba(0,212,170,0.5)]" />
                                        </div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary mt-2">Optimal 85%</p>
                                    </td>
                                    <td className="p-10 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-white/10 hover:text-white">
                                                <Edit3 className="w-5 h-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-red-500/10 hover:text-red-400">
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* AI Team Insight */}
            <Card className="glass border-primary/30 bg-primary/[0.03] rounded-[48px] p-16 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] -mr-[400px] -mt-[400px] pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />
                <div className="flex flex-col lg:flex-row items-center gap-14">
                    <div className="w-32 h-32 rounded-[40px] bg-primary flex items-center justify-center text-black shadow-[0_0_40px_rgba(0,212,170,0.5)] transform group-hover:rotate-12 transition-all duration-700">
                        <Users className="w-16 h-16" />
                    </div>
                    <div className="flex-1 space-y-4 text-center lg:text-left">
                        <h3 className="text-5xl font-black italic tracking-tighter uppercase underline decoration-primary/50 decoration-4 underline-offset-8">Nexus Optimization</h3>
                        <p className="text-2xl text-muted-foreground leading-relaxed max-w-3xl font-medium italic">
                            Your team of <span className="text-white font-black">{members.length} members</span> is currently operating at <span className="text-primary font-black italic">Peak Synchronization</span>. I recommend assigning a <span className="text-white font-bold">L1 Admin</span> role to one more specialist to distribute the neural load.
                        </p>
                    </div>
                    <Button className="bg-primary text-black hover:bg-primary/90 rounded-[32px] px-16 h-24 text-2xl font-black italic tracking-tighter shadow-3xl transition-all active:scale-95 group">
                        RUN ANALYTICS <ArrowUpRight className="w-10 h-10 ml-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
