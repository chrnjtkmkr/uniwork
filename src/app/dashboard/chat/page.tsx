"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    Plus,
    Video,
    Phone,
    MoreVertical,
    Send,
    PlusCircle,
    Smile,
    Download,
    Terminal,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import {
    getChannels,
    getMessages,
    sendMessage,
    getMockUser,
    getFirstWorkspace,
    createChannel,
} from "@/actions/workspaces";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ChatPage = () => {
    const [channels, setChannels] = useState<any[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [inputText, setInputText] = useState("");
    const [user, setUser] = useState<any>(null);
    const [workspace, setWorkspace] = useState<any>(null);

    // Create channel state
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [isCreatingChannel, setIsCreatingChannel] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const init = async () => {
            const me = await getMockUser(); // We'll update this to getCurrentUser soon
            const ws = await getFirstWorkspace();
            setUser(me);
            setWorkspace(ws);
            if (ws) {
                const fetchedChannels = await getChannels(ws.id);
                setChannels(fetchedChannels);
                if (fetchedChannels.length > 0) {
                    setSelectedChannel(fetchedChannels[0]);
                }
            }
            setLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (!selectedChannel) return;

        const fetchMessages = async () => {
            const fetchedMessages = await getMessages(selectedChannel.id);
            setMessages(fetchedMessages);
        };

        fetchMessages();

        // Supabase Realtime Subscription
        const supabase = createClient();
        const channel = supabase
            .channel(`channel-${selectedChannel.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Message',
                    filter: `channelId=eq.${selectedChannel.id}`,
                },
                (payload: any) => {
                    // Fetch full message to include user details
                    getMessages(selectedChannel.id).then(setMessages);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedChannel]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || !selectedChannel || !user) return;

        setSending(true);
        const textToSend = inputText;
        setInputText(""); // Clear immediately for better UX

        // Optimistic UI update
        const tempId = Math.random().toString();
        const optimisticMessage = {
            id: tempId,
            content: textToSend,
            createdAt: new Date(),
            user: user,
            userId: user.id,
        };
        setMessages(prev => [...prev, optimisticMessage]);

        try {
            const result = await sendMessage(selectedChannel.id, user.id, textToSend);
            if (!result.success || !result.message) {
                setMessages(prev => prev.filter(m => m.id !== tempId));
                setInputText(textToSend);
                toast.error("Failed to send message");
            } else {
                // Replace optimistic message with real message (or wait for polling)
                setMessages(prev => prev.map(m => m.id === tempId ? result.message : m));
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSending(false);
        }
    };

    const handleCreateChannel = async () => {
        if (!newChannelName.trim() || !workspace) return;

        setIsCreatingChannel(true);
        try {
            const result = await createChannel(workspace.id, newChannelName);
            if (result.success && result.channel) {
                toast.success("Channel created");
                setChannels(prev => [...prev, result.channel]);
                setNewChannelName("");
                setIsCreateDialogOpen(false);
                setSelectedChannel(result.channel);
            } else {
                toast.error("Failed to create channel");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsCreatingChannel(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-black text-white">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-full overflow-hidden">
            {/* Channels Sidebar */}
            <aside className="w-80 border-r border-white/5 flex flex-col bg-[#0A0A0A]">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2
                            className="text-2xl font-black italic uppercase tracking-tight text-white"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            NEURAL <span className="text-blue-500">HUB</span>
                        </h2>
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-blue-500/20 hover:text-blue-500 transition-all text-slate-400">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                <DialogHeader>
                                    <DialogTitle className="uppercase italic">New Transmission Channel</DialogTitle>
                                    <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                        Establish a new neural endpoint for the workspace
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Input
                                        placeholder="CHANNEL_NAME_01"
                                        className="bg-black border-zinc-800"
                                        value={newChannelName}
                                        onChange={(e) => setNewChannelName(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        onClick={handleCreateChannel}
                                        disabled={isCreatingChannel}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest"
                                    >
                                        {isCreatingChannel ? <Loader2 className="w-4 h-4 animate-spin" /> : "ESTABLISH CHANNEL"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input
                            className="w-full bg-white/5 border-none rounded-xl pl-10 pr-4 py-2 text-[10px] font-bold tracking-widest placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500 focus:bg-white/10 transition-all uppercase text-white outline-none"
                            placeholder="SEARCH FREQUENCIES..."
                            type="text"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-8 pb-8">
                    {/* Active Nodes */}
                    <div>
                        <h3 className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            <span className="text-xs">⚡</span> Active Nodes
                        </h3>
                        <div className="space-y-1">
                            {channels.map((channel) => (
                                <button
                                    key={channel.id}
                                    onClick={() => setSelectedChannel(channel)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                                        selectedChannel?.id === channel.id
                                            ? "bg-blue-500/10 border border-blue-500/20"
                                            : "hover:bg-white/5"
                                    )}
                                >
                                    <span className={cn(
                                        "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]",
                                        selectedChannel?.id === channel.id ? "bg-blue-500" : "bg-zinc-600"
                                    )}></span>
                                    <span
                                        className={cn(
                                            "text-[11px] font-black tracking-widest uppercase",
                                            selectedChannel?.id === channel.id ? "text-blue-500" : "text-slate-300"
                                        )}
                                    >
                                        {channel.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            <span className="text-xs">🔗</span> Authorized Links
                        </h3>
                        <div className="space-y-1">
                            {[
                                { name: "WhatsApp", icon: "W", color: "#25D366", count: 12 },
                                { name: "Telegram", icon: "T", color: "#0088cc", count: 5 },
                            ].map((link, i) => (
                                <button
                                    key={i}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white uppercase"
                                            style={{ backgroundColor: link.color }}
                                        >
                                            {link.icon}
                                        </div>
                                        <span className="text-[11px] font-black tracking-widest uppercase text-slate-300">
                                            {link.name}
                                        </span>
                                    </div>
                                    <span className="bg-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white">
                                        {link.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <section className="flex-1 flex flex-col relative bg-black overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-900/30 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-white">{selectedChannel?.name || "SELECT_NODE"}</h4>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                                Transmission Stream: Stable
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                            <Phone className="w-5 h-5" />
                        </button>
                        <div className="w-px h-4 bg-white/10 mx-2"></div>
                        <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Sync Divider */}
                    <div className="flex items-center gap-4 py-4">
                        <div className="flex-1 h-px bg-white/5"></div>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-slate-600 uppercase">
                            Synchronization Established
                        </span>
                        <div className="flex-1 h-px bg-white/5"></div>
                    </div>

                    {/* Messages */}
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-30 italic text-white space-y-2">
                            <Terminal className="w-12 h-12 mb-4" />
                            <p className="text-xs uppercase tracking-[0.4em]">No Transmission Data Detected</p>
                            <p className="text-[10px] uppercase tracking-widest">Awaiting Initial Packet Injection</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex gap-4 max-w-2xl group",
                                    message.userId === user?.id ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    {message.user?.avatar ? (
                                        <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-xs font-bold border border-white/10 overflow-hidden">
                                            <img alt="avatar" className="w-full h-full object-cover" src={message.user.avatar} />
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20",
                                            message.userId === user?.id ? "bg-blue-600" : "bg-zinc-800"
                                        )}>
                                            {message.user?.name?.[0].toUpperCase() || "?"}
                                        </div>
                                    )}
                                </div>

                                {/* Message Content */}
                                <div className={cn("space-y-1", message.userId === user?.id ? "items-end flex flex-col" : "")}>
                                    <div className={cn("flex items-baseline gap-2", message.userId === user?.id ? "flex-row-reverse" : "")}>
                                        <span
                                            className={cn(
                                                "text-[11px] font-black uppercase tracking-widest",
                                                message.userId === user?.id ? "text-slate-400" : "text-blue-500"
                                            )}
                                        >
                                            {message.user?.name || "UNKNOWN_NODE"}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">
                                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>

                                    <div
                                        className={cn(
                                            "p-4 rounded-2xl shadow-sm leading-relaxed text-sm transition-all",
                                            message.userId === user?.id
                                                ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10"
                                                : "bg-[#18181A] border border-white/5 text-slate-300 rounded-tl-none group-hover:border-blue-500/30 font-medium"
                                        )}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 bg-zinc-900/80 backdrop-blur-xl border-t border-white/5">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                        className="max-w-4xl mx-auto flex items-end gap-4 bg-white/5 p-3 rounded-2xl border border-transparent focus-within:border-blue-500/40 focus-within:bg-white/10 transition-all shadow-2xl"
                    >
                        <button type="button" className="p-2 text-slate-400 hover:text-blue-500 transition-colors flex-shrink-0">
                            <PlusCircle className="w-5 h-5" />
                        </button>

                        <textarea
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none placeholder:text-slate-600 font-bold tracking-tight uppercase outline-none text-white h-10"
                            placeholder="TRANSMIT MESSAGE TO NEURAL HUB..."
                            rows={1}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button type="button" className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                                <Smile className="w-5 h-5" />
                            </button>
                            <button
                                type="submit"
                                disabled={sending || !inputText.trim()}
                                className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                            >
                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ChatPage;
