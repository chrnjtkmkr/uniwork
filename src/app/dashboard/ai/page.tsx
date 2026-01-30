"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Sparkles,
    Send,
    FileText,
    CheckSquare,
    MessageSquare,
    Zap,
    Plus,
    Bot,
    Lightbulb,
    History,
    Trash2,
    Loader2,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getMessages, sendMessage } from "@/actions/chat";
import { getFirstWorkspace, getMockUser } from "@/actions/workspaces";

const suggestions = [
    { title: "Summarize this week", desc: "Get a breakdown of your team's progress", icon: FileText },
    { title: "Generate task list", desc: "Convert our chat notes into actionable tasks", icon: CheckSquare },
    { title: "Analyze friction", desc: "Find bottlenecks in current project timeline", icon: Zap },
    { title: "Draft report", desc: "Create a draft for the upcoming investor update", icon: MessageSquare },
];

export default function AIPage() {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [dbUser, setDbUser] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const channelId = "ai-assistant-v1";

    useEffect(() => {
        async function init() {
            const me = await getMockUser();
            setDbUser(me);
            const result = await getMessages(channelId);
            if (result.success) {
                setMessages(result.messages || []);
            }
            setLoading(false);
        }
        init();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async (text = query) => {
        if (!text.trim() || !dbUser) return;
        setSending(true);
        setQuery("");

        // 1. Send User Message
        const userRes = await sendMessage({
            content: text.trim(),
            userId: dbUser.id,
            channelId,
            type: "user"
        });

        if (userRes.success) {
            setMessages(prev => [...prev, userRes.message]);

            // 2. Simulate AI Analysis Delay
            setTimeout(async () => {
                // Determine simulated response based on keywords
                let aiContent = "I've analyzed your request. Based on current workspace metrics, productivity is up 12% this week. Would you like me to draft a summary?";
                if (text.toLowerCase().includes("task")) aiContent = "I see your task list is growing. There are currently 8 high-priority items that haven't been touched in 48 hours. Should I re-prioritize them?";
                if (text.toLowerCase().includes("doc")) aiContent = "I've indexed 3 new documents related to the project. Would you like a bullet-point summary of the core changes?";

                const aiRes = await sendMessage({
                    content: aiContent,
                    userId: dbUser.id, // Using the same user for simplicity in demo or a system user ID if exists
                    channelId,
                    type: "ai"
                });

                if (aiRes.success) {
                    setMessages(prev => [...prev, aiRes.message]);
                }
                setSending(false);
            }, 1500);
        } else {
            setSending(false);
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
        <div className="flex h-[calc(100vh-120px)] gap-8 animate-in fade-in duration-500">
            {/* Main AI Chat */}
            <div className="flex-1 flex flex-col glass border-white/5 rounded-[40px] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />

                {/* Header */}
                <div className="h-20 px-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[18px] bg-primary flex items-center justify-center shadow-[0_0_25px_rgba(0,212,170,0.35)]">
                            <Bot className="text-black w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black italic tracking-tighter">UniBot Assistant</h1>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Neural Engine Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <ScrollArea className="flex-1 p-8">
                    <div className="max-w-3xl mx-auto space-y-10">
                        {messages.length === 0 && (
                            <div className="py-20 text-center space-y-6">
                                <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-10 h-10 text-primary opacity-20" />
                                </div>
                                <h2 className="text-3xl font-black italic tracking-tighter text-white">How can I help you <br /><span className="text-primary italic text-4xl">Optimize</span> today?</h2>
                                <p className="text-muted-foreground font-medium max-w-sm mx-auto">I have access to all your tasks, documents, and messages to provide context-aware support.</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={msg.id || i} className={`flex gap-6 ${msg.type === 'ai' ? '' : 'flex-row-reverse'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-xl ${msg.type === 'ai' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-white'}`}>
                                    {msg.type === 'ai' ? <Bot className="w-6 h-6" /> : <div className="text-xs font-black">YOU</div>}
                                </div>
                                <div className={`space-y-4 max-w-[80%] ${msg.type === 'ai' ? '' : 'items-end flex flex-col'}`}>
                                    <div className={cn(
                                        "p-6 rounded-[32px] text-sm leading-relaxed shadow-lg transition-all",
                                        msg.type === 'ai'
                                            ? 'bg-white/[0.04] border border-white/10 text-zinc-100 hover:border-primary/20'
                                            : 'bg-primary text-black font-bold'
                                    )}>
                                        {msg.content}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 px-2">
                                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {sending && (
                            <div className="flex gap-6 animate-pulse">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Bot className="w-6 h-6 text-primary" />
                                </div>
                                <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-primary/20 rounded-[35px] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700" />
                        <div className="relative glass border-white/10 rounded-[32px] p-2.5 flex items-center gap-3 bg-black/60">
                            <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 text-muted-foreground hover:bg-white/5"><Plus className="w-6 h-6" /></Button>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                disabled={sending}
                                placeholder="Ask about tasks, docs, or growth friction..."
                                className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm font-medium text-white placeholder:text-muted-foreground/50"
                            />
                            <Button
                                onClick={() => handleSend()}
                                disabled={!query.trim() || sending}
                                className="rounded-2xl h-12 w-16 bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,212,170,0.4)] disabled:opacity-50 transition-all font-black"
                            >
                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Suggestions */}
            <div className="w-[320px] flex flex-col gap-8">
                <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-2">
                        <Lightbulb className="w-4 h-4 text-primary" /> Core Queries
                    </h3>
                    <div className="space-y-4">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(s.title)}
                                className="w-full glass border-white/5 p-6 rounded-[32px] text-left hover:border-primary/40 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-all duration-700" />
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-black transition-all shadow-lg border border-white/10">
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <h4 className="text-base font-black italic tracking-tighter mb-1">{s.title}</h4>
                                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed mb-4">{s.desc}</p>
                                <div className="flex items-center text-[10px] text-primary font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                    Execute <ArrowRight className="w-3 h-3 ml-2" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto">
                    <Card className="glass border-primary/20 bg-primary/5 shadow-none rounded-[32px] p-6 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />
                        <h4 className="font-black text-xs uppercase tracking-[0.15em] flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-primary" /> Knowledge Base
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed mb-6">
                            UniBot is currently indexing your <b>Project Universe</b> to provide precise time-allocation forecasts.
                        </p>
                        <div className="relative">
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[78%] relative">
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.1em]">Optimizing Engine</span>
                                <span className="text-[9px] font-black text-white">78% Complete</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
