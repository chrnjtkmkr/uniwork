"use client";

import React, { useState, useEffect } from "react";
import {
    Users,
    UserPlus,
    Shield,
    Mail,
    MoreHorizontal,
    Search,
    Filter,
    ArrowUpRight,
    MapPin,
    Globe,
    Zap,
    Loader2,
    Trash2,
    ChevronDown,
    Activity,
    BrainCircuit,
    Cpu,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    getWorkspaceMembers,
    addMemberToWorkspace,
    updateMemberRole,
    getFirstWorkspace
} from "@/actions/workspaces";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TeamPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [newEmail, setNewEmail] = useState("");
    const [isInviting, setIsInviting] = useState(false);

    useEffect(() => {
        async function loadData() {
            const ws = await getFirstWorkspace();
            if (ws) {
                setWorkspace(ws);
                const data = await getWorkspaceMembers(ws.id);
                setMembers(data);
            }
            setLoading(false);
        }
        loadData();
    }, []);

    const handleInvite = async () => {
        if (!newEmail || !workspace) return;
        setIsInviting(true);
        const result = await addMemberToWorkspace(workspace.id, newEmail);
        if (result.success) {
            setMembers([...members, result.member]);
            setNewEmail("");
            toast.success("Personnel sync successful.");
        } else {
            toast.error("Failed to establish neural link.");
        }
        setIsInviting(false);
    };

    const handleRoleUpdate = async (memberId: string, role: string) => {
        const result = await updateMemberRole(memberId, role);
        if (result.success) {
            setMembers(members.map(m => m.id === memberId ? { ...m, role } : m));
            toast.success("Protocol updated.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-700 pb-20">
            {/* Neural Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white underline decoration-primary/50 decoration-4 underline-offset-8">Team <span className="text-primary italic animate-neon">Nexus</span></h1>
                    <p className="text-xl font-medium text-muted-foreground italic">Managing personnel access and neural authorization protocols.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-black hover:bg-primary/90 h-16 px-10 rounded-[32px] font-black italic tracking-tighter text-xl shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all uppercase group">
                            <UserPlus className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" /> Sync Personnel
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass border-white/10 text-white rounded-[40px] p-12 animate-in zoom-in-95 duration-500">
                        <DialogHeader>
                            <DialogTitle className="text-4xl font-black tracking-tighter uppercase italic">Invite <span className="text-primary italic">Operator</span></DialogTitle>
                        </DialogHeader>
                        <div className="space-y-10 pt-10">
                            <div className="space-y-4">
                                <label className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Neural Email Address</label>
                                <Input
                                    placeholder="OPERATOR@NEURAL.LINK"
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    className="bg-white/5 border-white/5 h-16 rounded-[24px] text-xl font-black italic px-8 focus:border-primary/50"
                                />
                            </div>
                            <Button onClick={handleInvite} disabled={isInviting} className="w-full h-20 bg-primary text-black hover:bg-primary/90 rounded-[28px] font-black italic text-xl tracking-tighter transition-all uppercase">
                                {isInviting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Establish Link"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Personnel Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { label: "Active Nodes", value: members.length, icon: BrainCircuit, color: "text-primary" },
                    { label: "Admin Priority", value: members.filter(m => m.role === 'admin' || m.role === 'owner').length, icon: Shield, color: "text-blue-400" },
                    { label: "Auth Flow", value: "98.9%", icon: Activity, color: "text-purple-400" },
                ].map((stat, i) => (
                    <Card key={i} className="glass border-white/5 rounded-[40px] overflow-hidden relative p-8 group hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                        <div className="flex items-center gap-6">
                            <div className={cn("p-4 rounded-[20px] bg-white/5", stat.color)}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1 italic opacity-50">{stat.label}</p>
                                <h3 className="text-4xl font-black italic tracking-tighter text-white">{stat.value}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Personnel Directory */}
            <Card className="glass border-white/5 rounded-[56px] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-10 text-[12px] font-black italic tracking-[0.3em] text-muted-foreground uppercase">Identity Node</th>
                                <th className="p-10 text-[12px] font-black italic tracking-[0.3em] text-muted-foreground uppercase">Authorization Level</th>
                                <th className="p-10 text-[12px] font-black italic tracking-[0.3em] text-muted-foreground uppercase">Tags</th>
                                <th className="p-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {members.map(member => (
                                <tr key={member.id} className="hover:bg-white/[0.03] transition-all group">
                                    <td className="p-10">
                                        <div className="flex items-center gap-8">
                                            <div className="relative">
                                                <Avatar className="h-16 w-16 rounded-[24px] border-4 border-white/10 group-hover:border-primary transition-colors">
                                                    <AvatarImage src={member.avatar || ""} />
                                                    <AvatarFallback className="bg-white/5 text-[10px] font-black italic uppercase">?</AvatarFallback>
                                                </Avatar>
                                                {member.role === 'owner' && (
                                                    <div className="absolute -top-2 -right-2 bg-primary text-black p-1 rounded-lg">
                                                        <Shield className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl font-black italic tracking-tighter text-white group-hover:text-primary transition-colors">{member.name}</span>
                                                    {member.role === 'owner' && <Badge className="bg-primary/20 text-primary border-none font-black italic text-[8px] uppercase tracking-widest px-2">System Owner</Badge>}
                                                </div>
                                                <p className="text-[12px] font-black italic text-muted-foreground opacity-50 uppercase tracking-widest">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-10">
                                        <Select
                                            defaultValue={member.role}
                                            onValueChange={(val) => handleRoleUpdate(member.id, val)}
                                            disabled={member.role === 'owner'}
                                        >
                                            <SelectTrigger className="bg-white/5 border-white/5 h-12 rounded-2xl text-[10px] font-black italic uppercase tracking-widest w-40 px-6">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="glass border-white/10 text-white rounded-[24px]">
                                                <SelectItem value="owner" className="font-black italic text-[10px] uppercase">Owner</SelectItem>
                                                <SelectItem value="admin" className="font-black italic text-[10px] uppercase">Admin</SelectItem>
                                                <SelectItem value="member" className="font-black italic text-[10px] uppercase">Member</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-10">
                                        <div className="flex flex-wrap gap-3">
                                            {(member.tags || "CORE,OPERATOR").split(',').map((tag: string) => (
                                                <Badge key={tag} className="bg-white/5 hover:bg-white/10 text-muted-foreground text-[8px] font-black italic tracking-widest uppercase py-1 border-white/5">{tag}</Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-10 text-right">
                                        <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10">
                                            <MoreHorizontal className="w-6 h-6 text-muted-foreground" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
