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
    Download
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

        // Simulated AI Content Generation
        const aiPrompt = `Generating collaborative notes...`;
        setContent(prev => prev + "\n\n" + aiPrompt);

        setTimeout(() => {
            const generatedText = `\n\n### Team Brainstorm Expansion\n\n**Strategic Pillars**:\n- **Efficiency Node**: Minimize overhead in neural transmissions.\n- **Vision Alignment**: Synchronize the roadmap with current market vibes.\n- **Scalability**: Prepare the core architecture for 10x cosmic growth.\n\n*This note was expanded by UniBot AI to include team collaborative frameworks.*`;
            setContent(prev => prev.replace(aiPrompt, "") + generatedText);
            setIsGenerating(false);
        }, 1500);
    };

    if (loading && docs.length === 0) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-160px)] gap-12 animate-in fade-in duration-700">
            {/* Notes Sidebar */}
            <div className="w-[380px] flex flex-col gap-8">
                <div className="flex items-center justify-between px-4">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white underline decoration-primary/50 decoration-4 underline-offset-8">Liquid <span className="text-primary italic">Notes</span></h1>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-14 h-14 rounded-2xl bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,212,170,0.4)] transition-all active:scale-95 text-xl font-black">
                                <Plus className="w-8 h-8 stroke-[3px]" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass border-white/10 text-white rounded-[48px] p-12">
                            <DialogHeader>
                                <DialogTitle className="text-4xl font-black italic tracking-tighter uppercase">Initiate <span className="text-primary italic">Logic Note</span></DialogTitle>
                                <p className="text-muted-foreground font-medium mt-2">Start a collaborative stream of consciousness for the team.</p>
                            </DialogHeader>
                            <div className="space-y-8 pt-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Note Title</label>
                                    <Input
                                        placeholder="e.g. Sprint Brainstorming"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        className="bg-white/5 border-white/10 h-20 rounded-3xl text-2xl font-black px-8 focus:border-primary/50 transition-all"
                                    />
                                </div>
                                <Button onClick={handleCreateDoc} className="w-full h-20 bg-primary text-black hover:bg-primary/90 rounded-[32px] font-black text-2xl shadow-[0_10px_30px_rgba(0,212,170,0.3)] group uppercase italic tracking-tighter">
                                    Create Node <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="relative group px-1">
                    <div className="absolute -inset-1 bg-primary/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-700" />
                    <div className="relative bg-white/5 border border-white/10 rounded-[28px] flex items-center gap-4 px-6 py-5 shadow-2xl">
                        <Search className="w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            placeholder="Scan nodes..."
                            className="bg-transparent border-none focus:ring-0 text-base font-bold w-full placeholder:text-muted-foreground/30 focus:placeholder:text-primary/30"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 bg-white/[0.01] border border-white/5 rounded-[48px] p-6 shadow-inner">
                    <div className="space-y-10 p-2">
                        <div>
                            <div className="flex items-center justify-between mb-6 px-3">
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Folders</p>
                                <Plus className="w-4 h-4 text-primary opacity-30 cursor-pointer hover:opacity-100" />
                            </div>
                            <div className="space-y-2">
                                {['Brainstorming', 'Strategy', 'Client Sync', 'Internal Logic'].map(folder => (
                                    <button key={folder} className="w-full flex items-center gap-5 px-5 py-4 text-base font-black italic tracking-tighter text-muted-foreground hover:text-white transition-all group rounded-2xl border border-transparent hover:bg-white/5 hover:border-white/10">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                                            <Folder className="w-5 h-5" />
                                        </div>
                                        <span>{folder}</span>
                                        <ChevronRight className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-6 px-3">
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Data Streams</p>
                                <Badge className="bg-primary/20 text-primary rounded-lg border border-primary/20">{docs.length}</Badge>
                            </div>
                            <div className="space-y-3">
                                {docs.map(doc => (
                                    <button
                                        key={doc.id}
                                        onClick={() => handleDocSelect(doc)}
                                        className={cn(
                                            "w-full flex flex-col gap-3 p-6 rounded-[32px] text-left transition-all relative overflow-hidden group border",
                                            selectedDoc?.id === doc.id
                                                ? 'bg-primary/10 border-primary/30 shadow-xl'
                                                : 'hover:bg-white/5 border-transparent'
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                selectedDoc?.id === doc.id ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,212,170,0.5)]' : 'bg-white/5 text-muted-foreground'
                                            )}>
                                                <StickyNote className="w-5 h-5" />
                                            </div>
                                            <span className={cn("text-lg font-black italic tracking-tighter truncate", selectedDoc?.id === doc.id ? 'text-primary' : 'text-zinc-200')}>
                                                {doc.title}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pl-14">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                                                Synced {new Date(doc.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </p>
                                            <div className="flex -space-x-2">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="w-6 h-6 rounded-lg bg-white/10 border-2 border-[#0A0A0A] flex items-center justify-center text-[8px] font-black text-primary">T</div>
                                                ))}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <Button variant="ghost" className="h-20 rounded-[32px] border border-dashed border-white/10 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30 font-black italic tracking-tighter text-lg uppercase transition-all">
                    <UploadCloud className="w-6 h-6 mr-4" /> Import Note Archive
                </Button>
            </div>

            {/* Note Editor */}
            <div className="flex-1 glass border border-white/5 rounded-[64px] flex flex-col overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] pointer-events-none" />

                {selectedDoc ? (
                    <>
                        <div className="h-28 border-b border-white/5 flex items-center justify-between px-16 bg-white/[0.01] backdrop-blur-xl">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xl group">
                                    <StickyNote className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">{selectedDoc.title}</h2>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,212,170,0.8)]" />
                                        <p className="text-[11px] uppercase font-black tracking-[0.3em] text-muted-foreground opacity-60">Collaborative Logic Stream Active</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {isEditing ? (
                                    <Button
                                        size="lg"
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="h-16 bg-primary text-black hover:bg-primary/90 rounded-2xl px-12 font-black italic tracking-tighter text-xl shadow-[0_0_20px_rgba(0,212,170,0.4)] transition-all active:scale-95"
                                    >
                                        {saving ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Save className="w-6 h-6 mr-3" />}
                                        SYNC NOTE
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        onClick={() => setIsEditing(true)}
                                        className="h-16 rounded-2xl hover:bg-white/5 border border-white/10 px-10 font-black italic tracking-tighter text-lg text-muted-foreground hover:text-white transition-all transform hover:scale-105 group"
                                    >
                                        <Edit3 className="w-6 h-6 mr-3 text-primary/70 group-hover:text-primary transition-colors" /> MODIFY
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="w-16 h-16 rounded-2xl hover:bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-all">
                                    <Download className="w-7 h-7" />
                                </Button>
                                <Button variant="ghost" size="icon" className="w-16 h-16 rounded-2xl hover:bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-all">
                                    <Share2 className="w-7 h-7" />
                                </Button>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-20">
                            <div className="max-w-5xl mx-auto pb-40">
                                {isEditing ? (
                                    <div className="relative">
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="w-full h-[800px] bg-transparent border-none focus:ring-0 text-2xl leading-[1.8] resize-none font-medium text-white/90 selection:bg-primary/30 placeholder:italic"
                                            spellCheck={false}
                                            placeholder="Write your cosmic logic here..."
                                        />
                                        {isGenerating && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-[64px] animate-in fade-in zoom-in duration-500">
                                                <div className="flex items-center gap-6 bg-[#0A0A0A] border border-primary/40 px-12 py-6 rounded-[32px] shadow-[0_0_50px_rgba(0,212,170,0.3)]">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
                                                        <SparklesIcon className="w-10 h-10 text-primary animate-spin relative z-10" />
                                                    </div>
                                                    <span className="font-black italic tracking-tighter text-2xl text-primary uppercase">Computing Team Insights...</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="markdown-content prose prose-invert prose-emerald prose-xl max-w-none font-medium leading-[2] animate-in fade-in slide-in-from-bottom-10 duration-1000">
                                        <ReactMarkdown>{content}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-24 text-center">
                        <div className="w-40 h-40 rounded-[64px] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-10 shadow-inner group">
                            <StickyNote className="w-16 h-16 opacity-10 group-hover:scale-110 group-hover:opacity-30 transition-all duration-700" />
                        </div>
                        <h2 className="text-5xl font-black italic tracking-tighter text-zinc-800 mb-6 uppercase">Node Selection Required</h2>
                        <p className="max-w-md mx-auto text-lg font-medium opacity-30 leading-relaxed italic">The collaborative neural network is awaiting your command. Select a logic stream or create a new node from the sidebar.</p>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-12 h-16 px-10 bg-white/5 text-white border border-white/10 hover:bg-primary hover:text-black rounded-2xl font-black italic tracking-tighter transition-all"
                        >
                            INITIATE FIRST NODE
                        </Button>
                    </div>
                )}

                {/* Unified AI Assistant floating button */}
                {selectedDoc && !isGenerating && (
                    <Button
                        onClick={handleAIAssist}
                        className="absolute bottom-16 right-16 w-24 h-24 rounded-[40px] bg-primary text-black shadow-[0_10px_60px_rgba(0,212,170,0.5)] border-none hover:scale-110 active:scale-95 transition-all z-20 group"
                    >
                        <SparklesIcon className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                    </Button>
                )}
            </div>
        </div>
    );
}
