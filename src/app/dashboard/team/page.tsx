"use client";

import React, { useState, useEffect } from "react";
import {
    UserPlus,
    Shield,
    MoreHorizontal,
    Loader2,
    Check,
    ChevronDown,
    User,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    getWorkspaceMembers,
    updateMemberRole,
    getFirstWorkspace,
    removeMemberFromWorkspace,
} from "@/actions/workspaces";
import {
    createInvitation,
    getWorkspaceInvitations
} from "@/actions/invitations";
import { getCurrentUser } from "@/actions/auth";
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
import { User as UserType, Workspace } from "@/types";

export default function TeamPage() {
    const [invitations, setInvitations] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [workspace, setWorkspace] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteRole, setInviteRole] = useState("member");
    const [newEmail, setNewEmail] = useState("");
    const [isInviting, setIsInviting] = useState(false);

    useEffect(() => {
        async function loadData() {
            const user = await getCurrentUser();
            setCurrentUser(user as any);

            const ws = await getFirstWorkspace();
            if (ws) {
                setWorkspace(ws);
                const [memberData, inviteData] = await Promise.all([
                    getWorkspaceMembers(ws.id),
                    getWorkspaceInvitations(ws.id)
                ]);
                setMembers(memberData);
                setInvitations(inviteData);
            }
            setLoading(false);
        }
        loadData();
    }, []);

    const handleInvite = async () => {
        if (!newEmail || !workspace || !currentUser) return;
        setIsInviting(true);
        const result = await createInvitation({
            workspaceId: workspace.id,
            email: newEmail,
            role: inviteRole,
            invitedById: currentUser.id
        });

        if (result.success && result.invitation) {
            setInvitations([...invitations, { ...result.invitation, invitedBy: currentUser }]);
            setNewEmail("");
            toast.success("Invitation signal dispatched.");
        } else {
            toast.error(result.error || "Failed to initiate invite sequence.");
        }
        setIsInviting(false);
    };

    const handleRoleUpdate = async (memberId: string, role: string) => {
        if (!workspace || !currentUser) return;
        const result = await updateMemberRole(currentUser.id, workspace.id, memberId, { role });
        if (result.success) {
            setMembers(members.map(m => m.id === memberId ? { ...m, role } : m));
            toast.success("Protocol updated.");
        } else {
            toast.error(result.error || "Authorization update failed.");
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!workspace || !currentUser) return;
        const result = await removeMemberFromWorkspace(currentUser.id, workspace.id, memberId);
        if (result.success) {
            setMembers(members.filter(m => m.id !== memberId));
            toast.success("Node disconnected.");
        } else {
            toast.error(result.error || "Disconnection sequence failed.");
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
        <div className="p-8 lg:p-12">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-5xl font-black italic tracking-tighter mb-1">
                        <span className="text-white">TEAM</span>{" "}
                        <span className="text-[#3B82F6]">NEXUS</span>
                    </h1>
                    <p className="text-slate-500 font-medium italic text-sm">
                        Managing personnel access and neural authorization protocols.
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-[#3B82F6] text-white px-8 py-3 rounded-full flex items-center gap-2 font-bold tracking-tighter text-sm shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 transition-all"
                        >
                            <UserPlus className="w-4 h-4" />
                            SYNC PERSONNEL
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0f0f0f] border-white/10 text-white rounded-[40px] p-12">
                        <DialogHeader>
                            <DialogTitle className="text-4xl font-black tracking-tighter uppercase italic">
                                Invite <span className="text-[#3B82F6] italic">Operator</span>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-10 pt-10">
                            <div className="space-y-4">
                                <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-500 ml-2">
                                    Authorization Role
                                </label>
                                <Select defaultValue="member" onValueChange={setInviteRole}>
                                    <SelectTrigger className="bg-white/5 border-white/5 h-16 rounded-[24px] text-lg font-bold px-8">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white rounded-[24px]">
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-500 ml-2">
                                    Neural Email Address
                                </label>
                                <Input
                                    placeholder="OPERATOR@NEURAL.LINK"
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    className="bg-white/5 border-white/5 h-16 rounded-[24px] text-xl font-black italic px-8 focus:border-[#3B82F6]/50"
                                />
                            </div>
                            <Button
                                onClick={handleInvite}
                                disabled={isInviting}
                                className="w-full h-20 bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90 rounded-[28px] font-black italic text-xl tracking-tighter transition-all uppercase"
                            >
                                {isInviting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Establish Link"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            {/* Main Card */}
            <div className="bg-[#0f0f0f] rounded-[2.5rem] border border-white/5 overflow-hidden min-h-[600px] flex flex-col">
                {/* Table Header */}
                <div className="grid grid-cols-12 px-10 py-6 border-b border-white/5 items-center bg-white/[0.01]">
                    <div className="col-span-6">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            Identity Node
                        </span>
                    </div>
                    <div className="col-span-3">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            Authorization Level
                        </span>
                    </div>
                    <div className="col-span-3">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            Tags
                        </span>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5 flex-1 overflow-y-auto">
                    {members.map((member, index) => (
                        <div
                            key={member.id}
                            className="grid grid-cols-12 px-10 py-8 items-center hover:bg-white/[0.02] transition-colors group"
                        >
                            {/* Identity Node */}
                            <div className="col-span-6 flex items-center gap-6">
                                <div className="relative">
                                    <Avatar className="w-16 h-16 rounded-2xl bg-white/5 p-1 border border-white/10 group-hover:border-[#3B82F6]/30 transition-colors">
                                        <AvatarImage src={member.avatar || ""} />
                                        <AvatarFallback className="bg-white/5 rounded-xl flex items-center justify-center">
                                            <User className="w-6 h-6 text-slate-400" />
                                        </AvatarFallback>
                                    </Avatar>
                                    {member.role === 'owner' && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#3B82F6] rounded-full border-2 border-[#0f0f0f] flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white font-bold" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className={cn(
                                            "text-2xl font-black italic",
                                            member.role === 'owner' ? "text-[#3B82F6]" : "text-white"
                                        )}>
                                            {member.name}
                                        </h3>
                                        {member.role === 'owner' && (
                                            <span className="px-2 py-0.5 bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[9px] font-bold text-[#3B82F6] rounded-full uppercase tracking-tighter">
                                                System Owner
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                                        {member.email}
                                    </p>
                                </div>
                            </div>

                            {/* Authorization Level */}
                            <div className="col-span-3">
                                <Select
                                    defaultValue={member.role}
                                    onValueChange={(val) => handleRoleUpdate(member.id, val)}
                                    disabled={member.role === 'owner'}
                                >
                                    <SelectTrigger className="inline-flex items-center gap-10 px-6 py-2 border border-white/10 rounded-full group-hover:border-[#3B82F6]/30 transition-colors bg-transparent h-auto">
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                <SelectValue />
                                            </span>
                                            <ChevronDown className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white rounded-[24px]">
                                        <SelectItem value="owner" className="font-black text-[10px] uppercase">
                                            Owner
                                        </SelectItem>
                                        <SelectItem value="admin" className="font-black text-[10px] uppercase">
                                            Admin
                                        </SelectItem>
                                        <SelectItem value="member" className="font-black text-[10px] uppercase">
                                            Member
                                        </SelectItem>
                                        <SelectItem value="editor" className="font-black text-[10px] uppercase">
                                            Editor
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tags */}
                            <div className="col-span-3 flex items-center justify-between">
                                <div className="flex gap-2">
                                    {(member.tags || (member.role === 'owner' ? 'Core,Operator' : member.role === 'admin' ? 'Support' : 'Analyst,Node'))
                                        .split(',')
                                        .map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold uppercase tracking-widest text-slate-500"
                                            >
                                                {tag.trim()}
                                            </span>
                                        ))
                                    }
                                </div>
                                {member.role !== 'owner' && (
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="text-slate-500 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Pending Invitations */}
                    {invitations.map((invite) => (
                        <div
                            key={invite.id}
                            className="grid grid-cols-12 px-10 py-8 items-center border-t border-white/5 opacity-60 hover:opacity-100 transition-all bg-[#0f0f0f]"
                        >
                            <div className="col-span-6 flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/5 border border-[#3B82F6]/10 flex items-center justify-center">
                                        <UserPlus className="w-8 h-8 text-[#3B82F6] opacity-50" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-black italic text-slate-400">
                                            Pending Invitation
                                        </h3>
                                        <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-[9px] font-bold text-yellow-500 rounded-full uppercase">
                                            Frequency Active
                                        </span>
                                    </div>
                                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                                        {invite.email}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-3">
                                <div className="inline-flex items-center gap-4 px-6 py-2 border border-white/10 rounded-full bg-white/[0.02]">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {invite.role}
                                    </span>
                                    <Shield className="w-4 h-4 text-slate-500" />
                                </div>
                            </div>
                            <div className="col-span-3 flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">
                                        Invited By: {invite.invitedBy?.name || "Neural Node"}
                                    </span>
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-700">
                                        Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <button className="text-slate-500 hover:text-white transition-colors p-2">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div >
        </div >
    );
}
