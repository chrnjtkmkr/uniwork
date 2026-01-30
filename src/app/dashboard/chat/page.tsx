"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Hash,
    Lock,
    Volume2,
    Users,
    Search,
    AtSign,
    MoreVertical,
    Send,
    Smile,
    Paperclip,
    Zap,
    ChevronDown,
    Plus,
    Loader2,
    BrainCircuit,
    Cpu,
    Target,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getFirstWorkspace, getMockUser, getChannels, getMessages, sendMessage } from "@/actions/workspaces";
import { cn } from "@/lib/utils";

export default function ChatPage() {
    const [channels, setChannels] = useState<any[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [workspace, setWorkspace] = useState<any>(null);
    const [user, setUser] = useState<any>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function init() {
            const ws = await getFirstWorkspace();
            const me = await getMockUser();
            if (ws) {
                setWorkspace(ws);
                setUser(me);
                const chanList = await getChannels(ws.id);
                setChannels(chanList);
                if (chanList.length > 0) {
                    setSelectedChannel(chanList[0]);
                }
            }
            setLoading(false);
        }
        init();
    }, []);

    useEffect(() => {
        async function loadMessages() {
            if (selectedChannel) {
                const msgs = await getMessages(selectedChannel.id);
                setMessages(msgs);
                setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            }
        }
        loadMessages();
    }, [selectedChannel]);

    const handleSendMessage = async () => {
        if (!input.trim() || !selectedChannel || !user) return;
        setSending(true);
        const result = await sendMessage(selectedChannel.id, user.id, input);
        if (result.success) {
            setMessages([...messages, result.message]);
            setInput("");
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
        setSending(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-200px)] gap-10 animate-in fade-in slide-in-from-left-12 duration-700">
            {/* Neural Hub Sidebar */}
            <div className="w-[360px] flex flex-col gap-10 bg-white/[0.02] border border-white/5 rounded-[48px] p-8 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16" />

                <div className="flex items-center justify-between relative z-10">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white underline decoration-primary/50 decoration-4 underline-offset-4">Neural <span className="text-primary italic animate-neon">Hub</span></h1>
                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-white/5 border border-white/5">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                    </Button>
                </div>

                <div className="relative group z-10">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        placeholder="SEARCH FREQUENCIES..."
                        className="bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-[10px] italic font-black w-full focus:outline-none focus:border-primary/50 transition-all uppercase tracking-widest"
                    />
                </div>

                <ScrollArea className="flex-1 -mx-2 px-2 z-10">
                    <div className="space-y-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 px-4 italic opacity-50 flex items-center gap-2">
                                <BrainCircuit className="w-3 h-3 text-primary" /> Active Nodes
                            </p>
                            <div className="space-y-2">
                                {channels.map(channel => (
                                    <button
                                        key={channel.id}
                                        onClick={() => setSelectedChannel(channel)}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all relative group overflow-hidden border",
                                            selectedChannel?.id === channel.id
                                                ? 'bg-primary/10 border-primary/20 shadow-[inset_0_0_20px_rgba(0,212,170,0.1)]'
                                                : 'hover:bg-white/5 border-transparent'
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center font-black",
                                            selectedChannel?.id === channel.id ? 'bg-primary text-black' : 'bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-white'
                                        )}>
                                            <Hash className="w-5 h-5" />
                                        </div>
                                        <span className={cn("flex-1 text-sm font-black italic tracking-tighter uppercase", selectedChannel?.id === channel.id ? 'text-white' : 'text-muted-foreground group-hover:text-white')}>
                                            {channel.name}
                                        </span>
                                        {selectedChannel?.id === channel.id && (
                                            <div className="absolute right-0 w-1 h-6 bg-primary rounded-l-full shadow-[0_0_10px_rgba(0,212,170,1)]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 px-4 italic opacity-50 flex items-center gap-2">
                                <Users className="w-3 h-3 text-blue-400" /> Authorized Links
                            </p>
                            <div className="space-y-4 px-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                                        <span className="text-[10px] font-black italic tracking-widest uppercase">Operator NODE_{i}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Terminal */}
            <div className="flex-1 glass border-white/5 rounded-[60px] flex flex-col overflow-hidden relative shadow-2xl">
                {selectedChannel ? (
                    <>
                        <div className="h-28 border-b border-white/5 flex items-center justify-between px-12 bg-white/[0.02]">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center border border-white/5">
                                    <Hash className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">{selectedChannel.name}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(0,212,170,1)]" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Live Transmission</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl hover:bg-white/5 border border-white/5">
                                    <Search className="w-6 h-6 text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl hover:bg-white/5 border border-white/5">
                                    <MoreVertical className="w-6 h-6 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-10">
                            <div className="space-y-10 max-w-4xl mx-auto">
                                <div className="text-center py-10 opacity-30">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Encryption Layer Established</p>
                                    <div className="h-px w-20 bg-white/10 mx-auto mt-4" />
                                </div>

                                {messages.map((msg, i) => (
                                    <div key={i} className={cn("flex items-start gap-6 group", msg.userId === user?.id ? "flex-row-reverse" : "flex-row")}>
                                        <Avatar className="h-12 w-12 rounded-xl border-2 border-white/10 group-hover:border-primary transition-colors">
                                            <AvatarImage src={msg.user?.avatar || ""} />
                                            <AvatarFallback className="bg-white/10 text-xs font-black italic">?</AvatarFallback>
                                        </Avatar>
                                        <div className={cn("space-y-2 max-w-[70%]", msg.userId === user?.id ? "text-right" : "text-left")}>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">{msg.user?.name}</span>
                                                <span className="text-[8px] font-bold text-muted-foreground opacity-50">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={cn(
                                                "p-6 rounded-[28px] text-sm font-medium leading-relaxed shadow-xl",
                                                msg.userId === user?.id
                                                    ? "bg-primary text-black rounded-tr-none"
                                                    : "bg-white/5 border border-white/5 text-white rounded-tl-none"
                                            )}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        <div className="p-10 bg-black/40 border-t border-white/5 backdrop-blur-xl">
                            <div className="max-w-4xl mx-auto relative group">
                                <div className="absolute inset-y-0 left-6 flex items-center gap-4 text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <AtSign className="w-5 h-5" />
                                    <Paperclip className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                                </div>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="TRANSMIT DATA TO HUB..."
                                    className="w-full bg-white/5 border border-white/10 rounded-[32px] py-6 pl-24 pr-24 text-sm font-black italic tracking-tighter focus:outline-none focus:border-primary/50 transition-all shadow-2xl placeholder:opacity-20"
                                />
                                <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white/5 text-muted-foreground">
                                        <Smile className="w-6 h-6" />
                                    </Button>
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!input.trim() || sending}
                                        className="h-12 w-12 rounded-2xl bg-primary text-black shadow-[0_0_15px_rgba(0,212,170,0.4)] hover:scale-110 active:scale-95 transition-all"
                                    >
                                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-24 text-center">
                        <div className="w-24 h-24 rounded-[40px] bg-white/5 flex items-center justify-center mb-10 border border-white/5">
                            <Hash className="w-12 h-12 text-primary/20" />
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter text-white/50 uppercase">No Frequency Selected</h2>
                        <p className="max-w-md mx-auto italic mt-4 opacity-40">Please select an active channel to begin transmission across the neural hub.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
