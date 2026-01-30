"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Hash,
    Search,
    Plus,
    MoreVertical,
    Send,
    Paperclip,
    Smile,
    AtSign,
    Phone,
    Video,
    Info,
    Circle,
    Loader2,
    Users,
    Globe,
    MessageCircle,
    Send as TelegramIcon,
    Flame,
    LayoutGrid,
    ChevronRight,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getMessages, sendMessage } from "@/actions/chat";
import { getMockUser, getFirstWorkspace } from "@/actions/workspaces";
import { cn } from "@/lib/utils";

// External App Integrations
const externalApps = [
    { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "text-green-500", bg: "bg-green-500/10", unread: 12 },
    { id: "telegram", name: "Telegram", icon: TelegramIcon, color: "text-blue-400", bg: "bg-blue-400/10", unread: 5 },
    { id: "discord", name: "Discord", icon: Hash, color: "text-indigo-400", bg: "bg-indigo-400/10", unread: 0 },
];

export default function ChatPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [channels, setChannels] = useState<any[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<any>(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [dbUser, setDbUser] = useState<any>(null);

    useEffect(() => {
        async function init() {
            const [me, ws] = await Promise.all([getMockUser(), getFirstWorkspace()]) as [any, any];
            setDbUser(me);
            if (ws?.channels) {
                setChannels(ws.channels);
                setSelectedChannel(ws.channels[0]);
            }
            setLoading(false);
        }
        init();
    }, []);

    useEffect(() => {
        if (!selectedChannel) return;

        async function fetchMessages() {
            const result = await getMessages(selectedChannel.id);
            if (result.success) {
                setMessages(result.messages || []);
            }
        }
        fetchMessages();

        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [selectedChannel?.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!content.trim() || !dbUser || !selectedChannel) return;
        setSending(true);
        const result = await sendMessage({
            content: content.trim(),
            userId: dbUser.id,
            channelId: selectedChannel.id
        });
        if (result.success) {
            setMessages([...messages, result.message]);
            setContent("");
        }
        setSending(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-160px)] border border-white/5 rounded-[48px] overflow-hidden glass shadow-2xl animate-in fade-in duration-700">
            {/* Unified Sidebar */}
            <aside className="w-80 border-r border-white/5 flex flex-col bg-white/[0.01]">
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">Neural Hub</h2>
                        <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            placeholder="Find conversations..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 focus:bg-white/10"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-10">
                        {/* Workspace Groups */}
                        <div>
                            <div className="flex items-center justify-between px-2 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Workspace Nodes</span>
                                <Badge className="bg-primary/20 text-primary text-[8px] font-black px-2">{channels.length}</Badge>
                            </div>
                            <div className="space-y-1.5">
                                {channels.map(channel => (
                                    <button
                                        key={channel.id}
                                        onClick={() => setSelectedChannel(channel)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm transition-all group relative overflow-hidden",
                                            selectedChannel?.id === channel.id
                                                ? 'bg-primary/10 text-primary border border-primary/20 scale-[1.02] shadow-lg'
                                                : 'text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent'
                                        )}
                                    >
                                        <div className="flex items-center gap-3 relative z-10">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                                selectedChannel?.id === channel.id ? 'bg-primary text-black' : 'bg-white/5 text-muted-foreground'
                                            )}>
                                                <Hash className="w-4 h-4" />
                                            </div>
                                            <span className="font-black italic tracking-tighter">{channel.name}</span>
                                        </div>
                                        {selectedChannel?.id === channel.id && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* External Messaging Area */}
                        <div>
                            <div className="flex items-center justify-between px-2 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">Authorized External Apps</span>
                                <Globe className="w-3.5 h-3.5 text-muted-foreground opacity-30" />
                            </div>
                            <div className="space-y-1.5 px-1">
                                {externalApps.map(app => (
                                    <button
                                        key={app.id}
                                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group overflow-hidden relative"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", app.bg, app.color)}>
                                                <app.icon className="w-5 h-5 fill-current opacity-20" />
                                                <app.icon className="w-5 h-5 absolute" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black italic tracking-tighter text-white">{app.name}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Sync Active</p>
                                            </div>
                                        </div>
                                        {app.unread > 0 && (
                                            <Badge className={cn("rounded-lg h-5 px-1.5 font-black text-[10px]", app.bg, app.color)}>
                                                {app.unread}
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Team Logic Directs */}
                        <div>
                            <div className="flex items-center justify-between px-2 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">Direct Logic Links</span>
                                <Users className="w-3.5 h-3.5 text-muted-foreground opacity-30" />
                            </div>
                            <div className="space-y-2 px-1">
                                <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className="w-10 h-10 rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors">
                                                <AvatarFallback className="bg-primary/10 text-primary font-black italic">UI</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#0A0A0A] flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-black italic tracking-tighter text-sm">UniBot Intelligence</p>
                                            <p className="text-[10px] font-medium text-primary uppercase tracking-[0.2em] animate-pulse">Computing...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </aside>

            {/* Neural Chat Window */}
            <div className="flex-1 flex flex-col bg-black/20 relative">
                <div className="h-24 px-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xl">
                            <Hash className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="font-black italic tracking-tighter text-2xl uppercase group-hover:text-primary transition-colors">#{selectedChannel?.name || 'Node'}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{selectedChannel?.description || "Workspace Communication Protocol"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Phone className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Video className="w-5 h-5" /></Button>
                        <div className="h-6 w-px bg-white/10 mx-2" />
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all"><Info className="w-5 h-5" /></Button>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-10">
                    <div className="space-y-10 max-w-5xl mx-auto">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                                <div className="w-24 h-24 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 relative">
                                    <div className="absolute inset-0 bg-primary/5 blur-2xl animate-pulse rounded-full" />
                                    <Hash className="w-12 h-12 text-primary/30 relative z-10" />
                                </div>
                                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-3">Initiate <span className="text-primary italic">Dialogue</span></h3>
                                <p className="text-muted-foreground font-medium max-w-xs leading-relaxed">System ready for secure data transmission in #{selectedChannel?.name}.</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={msg.id} className={cn(
                                "flex gap-6 group transition-all duration-500 animate-in fade-in slide-in-from-bottom-4",
                                msg.userId === dbUser?.id ? "flex-row-reverse" : "flex-row"
                            )}>
                                <Avatar className="w-12 h-12 rounded-2xl border-2 border-white/5 shadow-2xl shrink-0 group-hover:border-primary/50 transition-colors">
                                    <AvatarImage src={msg.user.avatar} />
                                    <AvatarFallback className="font-black italic bg-primary/10 text-primary">{msg.user.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className={cn("space-y-2 flex-1 max-w-[70%]", msg.userId === dbUser?.id ? "text-right" : "text-left")}>
                                    <div className={cn("flex items-center gap-3 mb-1", msg.userId === dbUser?.id ? "flex-row-reverse" : "flex-row")}>
                                        <span className="font-black italic tracking-tighter text-sm group-hover:text-primary transition-colors">{msg.user.name}</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className={cn(
                                        "p-6 rounded-[28px] text-base font-medium leading-relaxed shadow-xl border transition-all",
                                        msg.userId === dbUser?.id
                                            ? 'bg-primary/20 border-primary/30 text-white rounded-tr-none hover:bg-primary/25'
                                            : 'bg-white/5 border-white/5 text-zinc-300 rounded-tl-none hover:bg-white/[0.07] hover:border-white/10'
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Secure Input Area */}
                <div className="p-10">
                    <div className="max-w-5xl mx-auto relative group">
                        <div className="absolute -inset-2 bg-primary/20 rounded-[40px] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700" />
                        <div className="relative glass border border-white/10 rounded-[36px] p-2.5 flex items-end gap-3 focus-within:border-primary/50 transition-all bg-black/60 shadow-2xl">
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"><Plus className="w-6 h-6" /></Button>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder={`Broadcast to #${selectedChannel?.name || 'node'}...`}
                                className="flex-1 bg-transparent border-none focus:ring-0 py-4 px-3 text-lg font-medium italic tracking-tight placeholder:text-muted-foreground/30 resize-none max-h-32 min-h-[56px] text-white/90"
                                rows={1}
                            />
                            <div className="flex items-center gap-2 mb-1 mr-1">
                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-muted-foreground hover:bg-white/10 transition-all"><Smile className="w-5 h-5" /></Button>
                                <Button
                                    onClick={handleSend}
                                    disabled={!content.trim() || sending}
                                    className="h-12 px-8 bg-primary text-black hover:bg-primary/90 rounded-2xl font-black italic tracking-tighter text-lg shadow-[0_0_20px_rgba(0,212,170,0.4)] transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : "DEPLOY"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
