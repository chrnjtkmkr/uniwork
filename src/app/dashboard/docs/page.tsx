"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    FileText,
    Star,
    Archive,
    Trash2,
    Plus,
    Search,
    Bell,
    Cloud,
    Share2,
    Sparkles,
    Bold,
    Italic,
    List,
    X,
    Loader2,
    CheckCircle2,
    Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import {
    getDocuments,
} from "@/actions/workspaces";
import {
    createDoc,
    updateDoc,
    deleteDoc,
    getDocumentHistory,
} from "@/actions/docs";
import {
    getMockUser,
    getFirstWorkspace,
} from "@/actions/workspaces";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Custom debounce implementation to avoid external dependencies
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const NotesPage = () => {
    const [docs, setDocs] = useState<any[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [workspace, setWorkspace] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Editor state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        const init = async () => {
            const ws = await getFirstWorkspace();
            const me = await getMockUser();
            setWorkspace(ws);
            setUser(me);
            if (ws) {
                const result = await getDocuments(ws.id);
                if (result.success && result.docs) {
                    setDocs(result.docs);
                    if (result.docs.length > 0) {
                        setSelectedDoc(result.docs[0]);
                        setTitle(result.docs[0].title);
                        setContent(result.docs[0].content || "");
                    }
                }
            }
            setLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (!workspace) return;

        const supabase = createClient();
        const channel = supabase
            .channel('docs-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Document',
                    filter: `workspaceId=eq.${workspace.id}`,
                },
                () => {
                    fetchDocs();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [workspace]);

    const fetchDocs = async () => {
        if (workspace) {
            const result = await getDocuments(workspace.id);
            if (result.success && result.docs) {
                setDocs(result.docs);
            }
        }
    };

    // Debounced save function
    const debouncedSave = useCallback(
        debounce(async (docId: string, newTitle: string, newContent: string) => {
            setSaving(true);
            try {
                await updateDoc(docId, { title: newTitle, content: newContent });
                setSaving(false);
                // Update local docs list without full refresh
                setDocs(prev => prev.map(d => d.id === docId ? { ...d, title: newTitle, updatedAt: new Date() } : d));
            } catch (error) {
                toast.error("Cloud sync failed");
                setSaving(false);
            }
        }, 1000),
        []
    );

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        if (selectedDoc) {
            debouncedSave(selectedDoc.id, title, newContent);
        }
    };

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        if (selectedDoc) {
            debouncedSave(selectedDoc.id, newTitle, content);
        }
    };

    const handleCreateDoc = async () => {
        if (!workspace || !user) return;

        try {
            const result = await createDoc({
                title: "UNTITLED_NODE",
                workspaceId: workspace.id,
                authorId: user.id,
            });

            if (result.success && result.doc) {
                toast.success("Neural node created");
                setDocs(prev => [result.doc, ...prev]);
                setSelectedDoc(result.doc);
                setTitle(result.doc.title);
                setContent(result.doc.content || "");
            } else {
                toast.error("Failed to create node");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleDeleteDoc = async () => {
        if (!selectedDoc) return;
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            const result = await deleteDoc(selectedDoc.id);
            if (result.success) {
                toast.success("Document deleted");
                const remaining = docs.filter(d => d.id !== selectedDoc.id);
                setDocs(remaining);
                if (remaining.length > 0) {
                    setSelectedDoc(remaining[0]);
                    setTitle(remaining[0].title);
                    setContent(remaining[0].content || "");
                } else {
                    setSelectedDoc(null);
                    setTitle("");
                    setContent("");
                }
            } else {
                toast.error("Deletion failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filteredDocs = docs.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-[#050505] text-[#38bdf8]">
                <Loader2 className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-full overflow-hidden bg-background">
            {/* Notes List Side Panel */}
            <aside className="w-80 flex flex-col border-r border-[#151515] bg-[#0A0A0A] overflow-hidden">
                {/* Panel Header */}
                <div className="h-16 px-6 border-b border-[#151515] flex items-center justify-between bg-[#0A0A0A]/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#38bdf8] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                            <FileText className="w-5 h-5 text-black" />
                        </div>
                        <h2 className="font-bold text-sm tracking-tight uppercase text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Neural_Docs
                        </h2>
                    </div>
                    <Button
                        onClick={handleCreateDoc}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#38bdf8] text-black text-xs font-bold rounded-lg shadow-[0_0_10px_rgba(56,189,248,0.3)] hover:opacity-90"
                    >
                        <Plus className="w-4 h-4" />
                        New
                    </Button>
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-3 border-b border-[#151515]">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                            <input
                                className="w-full bg-[#121212] border border-[#1A1A1A] rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-[#38bdf8] transition-all text-white placeholder:text-slate-600 outline-none"
                                placeholder="Search neural entries..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 text-[10px]">
                        <button className="px-2 py-1 bg-[#38bdf8]/10 text-[#38bdf8] rounded font-bold uppercase">All_Nodes</button>
                        <button className="px-2 py-1 text-slate-500 hover:text-slate-300 rounded font-bold uppercase">Starred</button>
                    </div>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {filteredDocs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 opacity-20 italic">
                            <p className="text-[10px] uppercase tracking-widest text-white">No entries found</p>
                        </div>
                    ) : (
                        filteredDocs.map((doc) => (
                            <div
                                key={doc.id}
                                onClick={() => {
                                    setSelectedDoc(doc);
                                    setTitle(doc.title);
                                    setContent(doc.content || "");
                                }}
                                className={cn(
                                    "p-4 rounded-xl transition-all cursor-pointer relative group border shadow-lg",
                                    selectedDoc?.id === doc.id
                                        ? "bg-[#121212] border-[#38bdf8]/50"
                                        : "bg-transparent border-transparent hover:border-[#38bdf8]/20"
                                )}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            selectedDoc?.id === doc.id ? "bg-[#38bdf8]" : "bg-slate-700"
                                        )}></div>
                                        <h3 className={cn(
                                            "text-sm font-bold truncate",
                                            selectedDoc?.id === doc.id ? "text-white" : "text-slate-400"
                                        )}>
                                            {doc.title}
                                        </h3>
                                    </div>
                                    {selectedDoc?.id === doc.id && (
                                        <span className="text-[8px] text-[#38bdf8] font-bold bg-[#38bdf8]/10 px-1.5 py-0.5 rounded tracking-tighter">ACTIVE</span>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 italic">
                                    {doc.content || "Empty terminal data..."}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">
                                        {new Date(doc.updatedAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <Star className="w-3 h-3 text-slate-700 hover:text-yellow-500 cursor-pointer" />
                                        <Share2 className="w-3 h-3 text-slate-700 hover:text-[#38bdf8] cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Editor Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative bg-[#050505]">
                {selectedDoc ? (
                    <>
                        {/* Editor Header */}
                        <header className="h-16 px-8 border-b border-[#151515] flex items-center justify-between bg-[#0A0A0A]/30 backdrop-blur-md">
                            <div className="flex items-center gap-4 flex-1">
                                <FileText className="w-5 h-5 text-[#38bdf8]" />
                                <input
                                    className="bg-transparent border-none focus:ring-0 text-xl font-bold tracking-tight text-white uppercase italic outline-none w-full"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    value={title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="NODE_DESIGNATION"
                                />
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 shrink-0">
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-3 h-3 text-[#38bdf8] animate-spin" />
                                            <span className="text-[9px] text-[#38bdf8] font-bold uppercase tracking-widest">Syncing</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Synced</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 ml-4">
                                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-tighter italic">
                                    Last modulation: {new Date(selectedDoc.updatedAt).toLocaleTimeString()}
                                </div>
                                <div className="h-4 w-px bg-border-dark"></div>
                                <button className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-[#38bdf8]">
                                    <Bell className="w-4 h-4" />
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-[#38bdf8]">
                                    <Cloud className="w-4 h-4" />
                                </button>
                            </div>
                        </header>

                        {/* Editor Toolbar */}
                        <div className="h-14 px-6 border-b border-[#151515] flex items-center justify-between bg-[#080808]/50">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
                                    <button className="p-2 hover:bg-white/5 rounded transition-colors text-slate-400">
                                        <Bold className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-white/5 rounded transition-colors text-slate-400">
                                        <Italic className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-white/5 rounded transition-colors text-slate-400">
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleDeleteDoc}
                                    className="p-2 hover:bg-red-500/10 hover:text-red-400 text-slate-600 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <Button className="flex items-center gap-2 px-5 py-2 bg-[#38bdf8] text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                                    <Share2 className="w-4 h-4" /> Share_Node
                                </Button>
                            </div>
                        </div>

                        {/* Editor Content */}
                        <div className="flex-1 overflow-y-auto p-12 bg-black/50">
                            <div className="max-w-4xl mx-auto">
                                <textarea
                                    className="w-full min-h-[70vh] bg-transparent border-none focus:ring-0 text-slate-300 leading-relaxed font-medium outline-none resize-none placeholder:text-slate-800 placeholder:italic"
                                    placeholder="Inject neural data packets here..."
                                    value={content}
                                    onChange={(e) => handleContentChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-20 grayscale">
                        <Terminal className="w-20 h-20 text-white" />
                        <div className="text-center">
                            <p className="text-sm font-black uppercase tracking-[0.5em] text-white">No Direct Connection</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest mt-2 text-blue-500">Initiate new node to begin modulation</p>
                        </div>
                        <Button
                            onClick={handleCreateDoc}
                            className="bg-[#38bdf8] text-black font-black uppercase tracking-widest px-8"
                        >
                            Start New Session
                        </Button>
                    </div>
                )}

                {/* AI Sparkle Button */}
                <button className="absolute bottom-8 right-8 w-14 h-14 bg-[#38bdf8] text-black rounded-2xl shadow-[0_0_25px_rgba(56,189,248,0.5)] flex items-center justify-center hover:scale-110 transition-transform group overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Sparkles className="w-7 h-7 font-bold" />
                </button>
            </main>

            {/* Background Glows */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#38bdf8]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-blue-900/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
        </div>
    );
};

export default NotesPage;
