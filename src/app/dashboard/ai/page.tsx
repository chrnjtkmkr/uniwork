"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Sparkles,
    Send,
    Loader2,
    MessageSquare,
    Zap,
    Cpu,
    Target,
    Activity,
    BrainCircuit,
    ChevronRight,
    Search,
    UserCircle,
    Bot,
    Terminal,
    Eye,
    ZapOff,
    Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateAIResponse } from "@/actions/ai";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import ReactMarkdown from 'react-markdown';

export default function AIAssistantPage() {
    const [messages, setMessages] = useState<any[]>([
        { role: 'assistant', content: "### [NEURAL_INIT_PROTOCOL_ACTIVE]\n\nSearching for authorized frequencies... Link established.\n\nI am **UNIBOT-4.2**, your neural synchronization partner. All logic nodes are currently operating at 98.4% efficiency. How shall we expand the universe today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        const res = await generateAIResponse(input);

        if (res.success) {
            setMessages(prev => [...prev, { role: 'assistant', content: res.message }]);
        } else {
            setMessages(prev => [...prev, { role: 'assistant', content: "### [CONNECTION_ERROR_NODE_FAILED]\n\nFrequency lost during transmission. Please initialize neural burst manually." }]);
        }
        setLoading(false);
    };

    return (
        <div className="flex h-[calc(100vh-200px)] gap-12 animate-in fade-in slide-in-from-bottom-12 duration-700">
            {/* Neural Sidebar */}
            <div className="w-[420px] flex flex-col gap-10">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white flex items-center gap-6 underline decoration-primary/50 decoration-4 underline-offset-8">
                        Uni<span className="text-primary italic animate-neon">Bot</span>
                    </h1>
                    <p className="text-xl font-medium text-muted-foreground italic flex items-center gap-3">
                        <BrainCircuit className="w-6 h-6 text-primary" /> Core Neural Assistant
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {[
                        { label: "Mission Planner", icon: Target, desc: "Map logic for next 14 cycles" },
                        { label: "Binary Audit", icon: Cpu, desc: "Architecture deep-scan" },
                        { label: "Sync Velocity", icon: Activity, desc: "Analyze personnel throughput" },
                        { label: "Neural Drift", icon: BrainCircuit, desc: "Experimental logic expansion" },
                    ].map((tool, i) => (
                        <button key={i} className="flex items-center gap-6 p-8 rounded-[36px] bg-white/[0.02] border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-14 h-14 rounded-[20px] bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:text-black transition-all shadow-xl">
                                <tool.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[12px] font-black italic text-primary uppercase tracking-[0.3em] mb-1">{tool.label}</p>
                                <p className="text-sm text-muted-foreground font-bold italic opacity-60 group-hover:opacity-100 transition-opacity">{tool.desc}</p>
                            </div>
                            <ChevronRight className="w-6 h-6 ml-auto text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all" />
                        </button>
                    ))}
                </div>

                <Card className="glass border-white/5 shadow-2xl mt-auto p-10 rounded-[48px] border-dashed relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-[14px] bg-primary/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-[12px] font-black uppercase tracking-[0.3em] text-white italic">Neural Capacity</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-bold italic opacity-60 group-hover:opacity-100 transition-opacity relative z-10">
                        UniBot is currently operating on **4.2 NEURAL PROTOCOLS**. For maximum predictive accuracy, verify all active data links before transmission.
                    </p>
                </Card>
            </div>

            {/* Neural Terminal */}
            <div className="flex-1 glass border-white/5 rounded-[64px] flex flex-col overflow-hidden relative shadow-2xl">
                <div className="h-28 border-b border-white/5 flex items-center justify-between px-12 bg-white/[0.02] relative z-20">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-4 h-4 rounded-full bg-primary animate-ping absolute inset-0" />
                            <div className="w-4 h-4 rounded-full bg-primary relative shadow-[0_0_15px_rgba(0,212,170,1)]" />
                        </div>
                        <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white italic">Frequencies Synchronized</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/5 shadow-inner">
                            <Fingerprint className="w-5 h-5 text-primary" />
                            <span className="text-[10px] font-black italic uppercase tracking-[0.2em] text-muted-foreground">AUTH_L4</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[10px] font-black italic tracking-widest text-muted-foreground hover:text-red-400 transition-all uppercase px-8 border border-white/5 rounded-full h-12">Purge Session</Button>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-16 relative z-10">
                    <div className="space-y-16 max-w-5xl mx-auto">
                        {messages.map((msg, i) => (
                            <div key={i} className={cn("flex items-start gap-10 animate-in fade-in slide-in-from-bottom-8 duration-500", msg.role === 'assistant' ? "flex-row" : "flex-row-reverse")}>
                                <div className={cn(
                                    "w-16 h-16 rounded-[24px] flex items-center justify-center border transition-all shadow-2xl",
                                    msg.role === 'assistant'
                                        ? "bg-white/5 border-primary/20 text-primary shadow-[0_0_20px_rgba(0,212,170,0.1)]"
                                        : "bg-primary border-primary text-black"
                                )}>
                                    {msg.role === 'assistant' ? <Bot className="w-10 h-10" /> : <UserCircle className="w-10 h-10" />}
                                </div>
                                <div className={cn("space-y-4 max-w-[80%]", msg.role === 'user' ? "text-right" : "")}>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic opacity-50">{msg.role === 'assistant' ? 'UniBot Transmission' : 'Operator Authority'}</p>
                                    <div className={cn(
                                        "p-10 rounded-[48px] text-xl font-bold italic tracking-tighter leading-relaxed shadow-2xl border",
                                        msg.role === 'assistant'
                                            ? "bg-white/[0.03] border-white/5 text-muted-foreground selection:bg-primary/20"
                                            : "bg-primary text-black rounded-tr-none border-primary/20"
                                    )}>
                                        <div className="markdown-content prose prose-invert prose-primary max-w-none prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter prose-hr:border-white/5">
                                            <ReactMarkdown>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input Protocol */}
                <div className="p-16 bg-black/40 border-t border-white/5 backdrop-blur-2xl relative z-20">
                    <div className="max-w-5xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-8 flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Terminal className="w-8 h-8" />
                        </div>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="INITIALIZE NEURAL COMMAND..."
                            className="w-full bg-white/5 border border-white/10 rounded-[40px] py-10 pl-24 pr-24 text-2xl font-black italic tracking-tighter focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all shadow-2xl placeholder:opacity-10 selection:bg-primary/30"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 bg-primary hover:bg-primary/90 text-black rounded-[30px] shadow-[0_0_30px_rgba(0,212,170,0.5)] transition-all flex items-center justify-center hover:scale-110 active:scale-90"
                        >
                            {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Send className="w-10 h-10" />}
                        </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground/30 text-center uppercase tracking-[0.5em] mt-8 font-black italic">Experimental transmission Node | Neural synchronization active</p>
                </div>
            </div>
        </div>
    );
}

