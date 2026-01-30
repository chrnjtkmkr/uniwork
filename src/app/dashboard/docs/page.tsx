"use client";

import React, { useState, useEffect } from "react";
import {
    FileText,
    Folder,
    Plus,
    Search,
    Clock,
    ChevronRight,
    History,
    Share2,
    Edit3,
    Eye,
    Loader2,
    Save,
    Sparkles as SparklesIcon,
    ArrowRight,
    StickyNote,
    UploadCloud,
    Download,
    MoreVertical,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { getDocs, updateDoc, createDoc } from "@/actions/docs";
import { getFirstWorkspace, getMockUser } from "@/actions/workspaces";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function NotesPage() {
    const [docs, setDocs] = useState<any[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Create doc state
    const [newTitle, setNewTitle] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [workspace, setWorkspace] = useState<any>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function init() {
            const ws = await getFirstWorkspace();
            const me = await getMockUser();
            if (ws) {
                setWorkspace(ws);
                setUser(me);
                const result = await getDocs(ws.id);
                if (result.success) {
                    setDocs(result.docs || []);
                    if (result.docs && result.docs.length > 0) {
                        setSelectedDoc(result.docs[0]);
                        setContent(result.docs[0].content || "");
                    }
                }
            }
            setLoading(false);
        }
        init();
    }, []);

    const handleDocSelect = (doc: any) => {
        setSelectedDoc(doc);
        setContent(doc.content || "");
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!selectedDoc) return;
        setSaving(true);
        const result = await updateDoc(selectedDoc.id, content);
        if (result.success) {
            setDocs(prev => prev.map(d => d.id === selectedDoc.id ? result.doc : d));
            setSelectedDoc(result.doc);
        }
        setSaving(false);
        setIsEditing(false);
    };

    const handleCreateDoc = async () => {
        if (!newTitle || !workspace || !user) return;
        setLoading(true);
        const result = await createDoc({
            title: newTitle,
            workspaceId: workspace.id,
            authorId: user.id
        });
        if (result.success && result.doc) {
            setDocs([result.doc, ...docs]);
            setSelectedDoc(result.doc);
            setContent(result.doc.content || "");
            setIsCreateOpen(false);
            setNewTitle("");
        }
        setLoading(false);
    };

    const handleAIAssist = async () => {
        if (!selectedDoc) return;
        setIsGenerating(true);
        setIsEditing(true);

        const aiPrompt = `### [NEURAL_EXPANSION_PROTOCOL_ACTIVE] Searching logic nodes...`;
        setContent(prev => prev + "\n\n" + aiPrompt);

        setTimeout(() => {
            const generatedText = `\n\n### Strategic Node Expansion (AI)\n\n**Logic Parameters**:\n- **Scale**: Horizontal mapping of communication clusters.\n- **Depth**: Deep-logic validation across all active links.\n- **Throughput**: Optimized data streaming for millisecond synchronization.\n\n*Drafted via Neural Sync Protocol v4.2.*`;
            setContent(prev => prev.replace(aiPrompt, "") + generatedText);
            setIsGenerating(false);
        }, 2000);
    };

    if (loading && docs.length === 0) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-200px)] gap-12 animate-in fade-in slide-in-from-right-12 duration-700">
            {/* Neural Sidebar */}
            <div className="w-[400px] flex flex-col gap-10">
                <div className="flex items-center justify-between px-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white underline decoration-primary/50 decoration-4 underline-offset-8">Liquid <span className="text-primary italic animate-neon">Notes</span></h1>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-16 h-16 rounded-[24px] bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all">
                                <Plus className="w-8 h-8 font-black" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass border-white/10 text-white rounded-[40px] p-12 max-w-lg animate-in zoom-in-95 duration-500">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic">New <span className="text-primary italic">Node</span></DialogTitle>
                            </DialogHeader>
                            <div className="space-y-10 pt-10">
                                <div className="space-y-4">
                                    <label className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Stream Title</label>
                                    <Input
                                        placeholder="EX: CORE LOGIC DRAFT"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        className="bg-white/5 border-white/5 h-16 rounded-[24px] text-xl font-black italic px-8 focus:border-primary/50"
                                    />
                                </div>
                                <Button onClick={handleCreateDoc} className="w-full h-20 bg-primary text-black hover:bg-primary/90 rounded-[28px] font-black italic text-xl tracking-tighter transition-all uppercase">
                                    Initialize Stream <ArrowRight className="w-6 h-6 ml-4" />
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="relative group px-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        placeholder="SEARCH DATA CLUSTERS..."
                        className="bg-white/5 border border-white/5 rounded-[28px] py-5 pl-16 pr-8 text-sm italic font-bold w-full focus:outline-none focus:border-primary/50 transition-all shadow-xl placeholder:opacity-30"
                    />
                </div>

                <ScrollArea className="flex-1 bg-white/[0.02] border border-white/10 rounded-[48px] p-6 shadow-inner">
                    <div className="space-y-10">
                        <div>
                            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 px-4 italic opacity-50">Active Streams</p>
                            <div className="space-y-4">
                                {docs.map(doc => (
                                    <button
                                        key={doc.id}
                                        onClick={() => handleDocSelect(doc)}
                                        className={cn(
                                            "w-full flex flex-col gap-4 p-8 rounded-[32px] text-left transition-all relative group overflow-hidden border",
                                            selectedDoc?.id === doc.id
                                                ? 'bg-primary/10 border-primary/30 shadow-[inset_0_0_20px_rgba(0,212,170,0.1)]'
                                                : 'hover:bg-white/5 border-transparent'
                                        )}
                                    >
                                        {selectedDoc?.id === doc.id && <div className="absolute left-0 top-0 w-2 h-full bg-primary shadow-[0_0_15px_rgba(0,212,170,1)]" />}
                                        <div className="flex items-center gap-4">
                                            <StickyNote className={cn("w-6 h-6", selectedDoc?.id === doc.id ? 'text-primary' : 'text-muted-foreground')} />
                                            <span className={cn("text-xl font-black italic tracking-tighter truncate", selectedDoc?.id === doc.id ? 'text-white' : 'text-muted-foreground group-hover:text-white')}>
                                                {doc.title}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pl-10">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 italic">
                                                {new Date(doc.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </p>
                                            <div className="flex gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Neural Editor */}
            <div className="flex-1 glass border-white/5 rounded-[60px] flex flex-col overflow-hidden relative shadow-2xl">
                {selectedDoc ? (
                    <>
                        <div className="h-28 border-b border-white/5 flex items-center justify-between px-12 bg-white/[0.02]">
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center border border-white/5">
                                    <StickyNote className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">{selectedDoc.title}</h2>
                                    <p className="text-[12px] font-black uppercase tracking-[0.3em] text-primary animate-pulse italic">Neural Sync Active</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {isEditing ? (
                                    <Button
                                        size="lg"
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-primary text-black hover:bg-primary/90 rounded-2xl px-10 font-black italic text-sm tracking-tighter uppercase"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3" />}
                                        Commit
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => setIsEditing(true)}
                                        className="rounded-2xl bg-white/5 border-primary/20 text-primary hover:bg-primary hover:text-black px-10 font-black italic text-sm tracking-tighter uppercase transition-transform active:scale-95"
                                    >
                                        <Edit3 className="w-5 h-5 mr-3" /> Modify
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl hover:bg-white/5 border border-white/5">
                                    <Share2 className="w-6 h-6 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-20">
                            <div className="max-w-5xl mx-auto">
                                {isEditing ? (
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full h-[700px] bg-transparent border-none focus:ring-0 text-2xl font-black italic tracking-tighter leading-relaxed resize-none text-white placeholder:opacity-10 selection:bg-primary/30"
                                        spellCheck={false}
                                        placeholder="INPUT LOGIC DATA..."
                                    />
                                ) : (
                                    <div className="markdown-content prose prose-invert prose-primary max-w-none text-xl font-bold italic tracking-tight leading-relaxed text-muted-foreground selection:bg-primary/20">
                                        <ReactMarkdown>{content}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-24 text-center">
                        <Zap className="w-24 h-24 opacity-5 mb-10 animate-pulse" />
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white/50">Node Idle</h2>
                        <p className="max-w-md mx-auto text-lg italic mt-4 opacity-40">Initialize a logic stream or select an active data cluster to commence synchronization.</p>
                    </div>
                )}

                {selectedDoc && !isGenerating && (
                    <Button
                        onClick={handleAIAssist}
                        className="absolute bottom-12 right-12 w-20 h-20 rounded-[32px] bg-primary text-black shadow-[0_0_30px_rgba(0,212,170,0.5)] hover:scale-110 active:scale-90 transition-all z-20 group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 slide-in-from-left" />
                        {isGenerating ? <Loader2 className="w-10 h-10 animate-spin" /> : <SparklesIcon className="w-10 h-10" />}
                    </Button>
                )}
            </div>
        </div>
    );
}
