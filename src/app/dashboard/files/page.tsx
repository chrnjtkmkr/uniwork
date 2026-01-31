"use client";

import React, { useState, useEffect } from "react";
import {
    Folder,
    File as FileIcon,
    FileText,
    Image as ImageIcon,
    FileCode,
    Upload,
    Search,
    Grid,
    List,
    Cloud,
    ChevronRight,
    Download,
    Trash2,
    Share2,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getFiles, createFile, deleteFile, getStorageUsage, syncExternalFiles } from "@/actions/files";
import { getFirstWorkspace } from "@/actions/workspaces";
import { getIntegrations } from "@/actions/integrations";
import { getCurrentUser } from "@/actions/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const mockDrives = [
    { name: "Local Frequencies", status: "Primary", icon: "LF", color: "text-primary" },
    { name: "Neural Cloud", status: "Linked", icon: "NC", color: "text-blue-400" },
    { name: "S3 Node", status: "Staging", icon: "S3", color: "text-orange-500" },
];

import { File as FileAsset, Workspace } from "@/types";

export default function FilesPage() {
    const [integrations, setIntegrations] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [workspace, setWorkspace] = useState<any>(null);
    const [activeDrive, setActiveDrive] = useState("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isSyncing, setIsSyncing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [storageUsed, setStorageUsed] = useState(0);

    const fetchFiles = async (wsId: string, drive: string = "all") => {
        setLoading(true);
        const result = await getFiles(wsId, drive);
        if (result.success) {
            setFiles(result.files || []);
        }
        const storageResult = await getStorageUsage(wsId);
        if (storageResult.success) {
            setStorageUsed(storageResult.totalBytes || 0);
        }
        setLoading(false);
    };

    useEffect(() => {
        async function init() {
            const [ws, user] = await Promise.all([
                getFirstWorkspace(),
                getCurrentUser()
            ]);

            if (ws) {
                setWorkspace(ws);
                setCurrentUser(user);
                await fetchFiles(ws.id, activeDrive);
                const intRes = await getIntegrations(ws.id);
                if (intRes.success) {
                    setIntegrations(intRes.integrations || []);
                }
            }
        }
        init();
    }, [activeDrive]);

    const handleSync = async (provider: string) => {
        if (!workspace || !currentUser) return;
        setIsSyncing(true);
        const result = await syncExternalFiles(currentUser.id, workspace.id, provider);
        if (result.success) {
            toast.success(`${provider.toUpperCase()} synchronization complete.`);
            await fetchFiles(workspace.id, activeDrive);
        } else {
            toast.error(result.error || "Sync protocol interrupted.");
        }
        setIsSyncing(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !workspace) return;

        setIsUploading(true);
        try {
            const result = await createFile({
                name: file.name,
                size: file.size,
                type: file.name.split('.').pop() || 'unknown',
                source: "platform",
                workspaceId: workspace.id,
                ownerId: currentUser?.id || ""
            });

            if (result.success && result.file) {
                setFiles([result.file, ...files]);
                setStorageUsed(prev => prev + file.size);
                toast.success(`${file.name} synchronized to node.`);
            }
        } catch (error) {
            toast.error("Upload stream interrupted.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const fileToDelete = files.find(f => f.id === id);
        const result = await deleteFile(id);
        if (result.success) {
            setFiles(files.filter(f => f.id !== id));
            if (fileToDelete) setStorageUsed(prev => prev - fileToDelete.size);
            toast.success("Node purged from universe.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const limitInBytes = 10 * 1024 * 1024 * 1024; // 10GB
    const storagePercentage = Math.min((storageUsed / limitInBytes) * 100, 100);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Neural Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white underline decoration-primary/50 decoration-4 underline-offset-8">File <span className="text-primary italic animate-neon">Archive</span></h1>
                    <p className="text-xl font-medium text-muted-foreground italic">Managing binary assets across synchronized data nodes.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            placeholder="SEARCH BINARIES..."
                            className="bg-white/5 border border-white/5 rounded-[28px] py-4 pl-14 pr-8 text-sm italic font-bold focus:outline-none focus:border-primary/50 transition-all w-72 shadow-2xl"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        <Button
                            asChild
                            disabled={isUploading}
                            className="bg-primary text-black hover:bg-primary/90 h-16 px-10 rounded-[32px] font-black italic tracking-tighter text-xl shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all uppercase group cursor-pointer"
                        >
                            <label htmlFor="file-upload" className="flex items-center">
                                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6 mr-3 group-hover:-translate-y-1 transition-transform" />}
                                {isUploading ? "Streaming..." : "Upload Node"}
                            </label>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Neural Sidebar */}
                <div className="space-y-10">
                    <Card className="glass border-white/5 rounded-[48px] overflow-hidden p-10 relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
                        <h3 className="font-black text-[12px] uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-2 italic">
                            Universe Capacity
                        </h3>
                        <div className="space-y-6 relative">
                            <Progress value={storagePercentage} className="h-4 bg-white/5 rounded-full overflow-hidden" />
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest italic">
                                <span className="text-muted-foreground">Used: {formatSize(storageUsed)}</span>
                                <span className="text-primary">Limit: 10 GB</span>
                            </div>
                            <Button variant="outline" className="w-full text-xs h-12 border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-black rounded-2xl transition-all font-black uppercase italic tracking-widest">Expansion Protocol</Button>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6 px-4 italic opacity-50">Authorized Hubs</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setActiveDrive("all")}
                                className={cn(
                                    "w-full group flex items-center gap-4 p-5 rounded-[28px] transition-all text-left border",
                                    activeDrive === "all" ? "bg-white/10 border-white/10" : "hover:bg-white/5 border-transparent"
                                )}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xs text-primary shadow-lg">ALL</div>
                                <div className="flex-1">
                                    <p className="text-sm font-black italic tracking-tighter text-white">Universal Hub</p>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-50 mt-1">Aggregated View</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>

                            {integrations.filter(i => ['google', 'dropbox', 'onedrive'].includes(i.type)).map(integ => (
                                <button
                                    key={integ.id}
                                    onClick={() => setActiveDrive(integ.type)}
                                    className={cn(
                                        "w-full group flex items-center gap-4 p-5 rounded-[28px] transition-all text-left border",
                                        activeDrive === integ.type ? "bg-white/10 border-white/10" : "hover:bg-white/5 border-transparent"
                                    )}
                                >
                                    <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xs shadow-lg uppercase",
                                        integ.type === 'google' ? 'text-blue-400' : 'text-primary'
                                    )}>{integ.type.substring(0, 2)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-black italic tracking-tighter text-white uppercase">{integ.type} Drive</p>
                                            {integ.isActive && (
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-50 mt-1">
                                            {integ.isActive ? 'Linked' : 'Offline'}
                                        </p>
                                    </div>
                                    {isSyncing ? (
                                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                    ) : (
                                        <Cloud
                                            className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                            onClick={(e) => { e.stopPropagation(); handleSync(integ.type); }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full mt-4 h-14 rounded-2xl border border-dashed border-white/10 text-muted-foreground hover:text-white font-bold italic tracking-tighter uppercase text-xs"
                            onClick={() => window.location.href = '/dashboard/integrations'}
                        >
                            Connect Drive Signal
                        </Button>
                    </div>
                </div>

                {/* Data View */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-10">
                            <button className="text-primary text-sm font-black italic tracking-tighter border-b-4 border-primary pb-2 uppercase">All Nodes</button>
                            <button className="text-muted-foreground text-sm font-black italic tracking-tighter hover:text-white transition-colors pb-2 uppercase opacity-40">Recent</button>
                            <button className="text-muted-foreground text-sm font-black italic tracking-tighter hover:text-white transition-colors pb-2 uppercase opacity-40">Synced</button>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 rounded-[24px] p-2 border border-white/5 shadow-2xl">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("h-10 w-10 rounded-xl transition-all", viewMode === 'grid' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/10')}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("h-10 w-10 rounded-xl transition-all", viewMode === 'list' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/10')}
                                onClick={() => setViewMode('list')}
                            >
                                <List className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {files.length === 0 ? (
                        <div className="h-[50vh] glass rounded-[60px] flex flex-col items-center justify-center text-center p-10 border-dashed border-white/10 shadow-inner">
                            <div className="w-24 h-24 rounded-[40px] bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                                <Folder className="w-12 h-12 opacity-10" />
                            </div>
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white/50">Universe Void</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto font-medium italic mt-4 opacity-40 text-lg">Initialize a binary stream or link a neural frequency to begin asset synchronization.</p>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {files.map(file => (
                                        <Card key={file.id} className="glass border-white/5 hover:border-primary/40 transition-all group rounded-[40px] overflow-hidden cursor-default relative p-1 shadow-2xl">
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all z-20">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(file.id)}
                                                    className="h-10 w-10 rounded-xl hover:bg-red-500/20 hover:text-red-400 group-hover:scale-110 transition-transform"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <CardContent className="p-10 pt-12">
                                                <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all mb-8 shadow-2xl border border-white/5 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:hidden" />
                                                    {getFileIcon(file.type, "w-10 h-10 relative z-10")}
                                                </div>
                                                <h3 className="font-black text-2xl italic tracking-tighter truncate mb-2 pr-10 text-white group-hover:text-primary transition-colors">{file.name}</h3>
                                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 italic">
                                                    <span>{formatSize(file.size)}</span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                    <span className="flex items-center gap-1.5 uppercase"><Cloud className="w-4 h-4" /> {file.source}</span>
                                                </div>
                                            </CardContent>
                                            <div className="px-10 py-6 bg-white/[0.04] border-t border-white/5 flex items-center justify-between translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                <Button variant="ghost" size="sm" className="h-10 px-8 text-primary hover:bg-primary/10 rounded-xl font-black italic tracking-tighter text-xs uppercase transition-transform active:scale-90">
                                                    <Download className="w-4 h-4 mr-2" /> Open Node
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-white/10 rounded-xl transition-transform active:scale-90">
                                                    <Share2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="glass border-white/5 rounded-[48px] overflow-hidden shadow-2xl">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                                <th className="p-8 text-[12px] font-black italic tracking-[0.3em] text-muted-foreground uppercase">Asset Identifier</th>
                                                <th className="p-8 text-[12px] font-black italic tracking-[0.3em] text-muted-foreground uppercase">Source Hub</th>
                                                <th className="p-8 text-[12px] font-black italic tracking-[0.3em] text-muted-foreground uppercase">Capacity</th>
                                                <th className="p-8 text-[12px] font-black italic tracking-[0.3em] text-muted-foreground uppercase">Synced</th>
                                                <th className="p-8"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {files.map(file => (
                                                <tr key={file.id} className="hover:bg-white/[0.03] transition-all group">
                                                    <td className="p-8">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-12 h-12 rounded-[18px] bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shadow-xl">{getFileIcon(file.type, "w-6 h-6")}</div>
                                                            <span className="text-xl font-black italic tracking-tighter text-white group-hover:text-primary transition-colors">{file.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-8">
                                                        <Badge variant="outline" className="bg-white/5 border-primary/20 text-primary text-[10px] uppercase font-black italic tracking-widest px-4 py-2 rounded-xl">{file.drive}</Badge>
                                                    </td>
                                                    <td className="p-8 text-sm font-black italic text-muted-foreground uppercase tracking-widest opacity-60">{formatSize(file.size)}</td>
                                                    <td className="p-8 text-sm font-black italic text-muted-foreground uppercase tracking-widest opacity-40">{new Date(file.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                    <td className="p-8 text-right">
                                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:text-white transition-all shadow-xl hover:bg-white/5">
                                                                <Download className="w-5 h-5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDelete(file.id)}
                                                                className="h-12 w-12 rounded-xl text-muted-foreground hover:text-red-400 transition-all shadow-xl hover:bg-white/5"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div >
    );
}

function getFileIcon(type: string, className = "w-8 h-8") {
    switch (type.toLowerCase()) {
        case 'image': case 'png': case 'jpg': return <ImageIcon className={className} />;
        case 'pdf': return <FileText className={className} />;
        case 'archive': case 'zip': return <Folder className={className} />;
        case 'video': case 'mp4': return <FileText className={className} />;
        case 'code': case 'js': case 'json': return <FileCode className={className} />;
        case 'excel': case 'xlsx': return <FileIcon className={className} />;
        default: return <FileIcon className={className} />;
    }
}
