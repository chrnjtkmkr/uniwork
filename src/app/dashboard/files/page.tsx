"use client";

import React, { useState, useEffect } from "react";
import {
    Folder,
    File,
    FileText,
    Image as ImageIcon,
    FileCode,
    Upload,
    Plus,
    Search,
    Grid,
    List,
    MoreHorizontal,
    Cloud,
    ChevronRight,
    HardDrive,
    Clock,
    Download,
    Trash2,
    Share2,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getFiles, createFile, deleteFile } from "@/actions/files";
import { getFirstWorkspace } from "@/actions/workspaces";
import { toast } from "sonner"; // Assuming sonner is available or will be

const mockDrives = [
    { name: "Local Files", status: "Primary", icon: "LF", color: "text-primary" },
    { name: "Google Drive", status: "Connected", icon: "GD", color: "text-blue-400" },
    { name: "Dropbox", status: "Connected", icon: "DB", color: "text-blue-500" },
    { name: "Amazon S3", status: "Demo Mode", icon: "S3", color: "text-orange-500" },
];

export default function FilesPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        async function init() {
            const ws = await getFirstWorkspace();
            if (ws) {
                setWorkspace(ws);
                const result = await getFiles(ws.id);
                if (result.success) {
                    setFiles(result.files || []);
                }
            }
            setLoading(false);
        }
        init();
    }, []);

    const handleSimulateUpload = async () => {
        if (!workspace) return;
        setIsUploading(true);

        // Random file simulation
        const names = ["Marketing_Deck_v2.pdf", "Main_Logo.png", "Financials_Draft.xlsx", "Meeting_Notes.docx"];
        const types = ["pdf", "image", "excel", "doc"];
        const randIdx = Math.floor(Math.random() * names.length);

        const result = await createFile({
            name: names[randIdx],
            size: Math.floor(Math.random() * 5000000) + 100000,
            type: types[randIdx],
            drive: "Local",
            workspaceId: workspace.id
        });

        if (result.success) {
            setFiles([result.file, ...files]);
        }
        setIsUploading(false);
    };

    const handleDelete = async (id: string) => {
        const result = await deleteFile(id);
        if (result.success) {
            setFiles(files.filter(f => f.id !== id));
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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">File <span className="text-primary italic">Hub</span></h1>
                    <p className="text-muted-foreground font-medium">Manage assets across your connected universes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <input
                            placeholder="Search assets..."
                            className="bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 w-64 transition-all"
                        />
                    </div>
                    <Button
                        onClick={handleSimulateUpload}
                        disabled={isUploading}
                        className="bg-primary text-black hover:bg-primary/90 h-11 px-6 rounded-xl font-black shadow-[0_0_15px_rgba(0,212,170,0.3)] transition-all active:scale-95"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                        {isUploading ? "Uploading..." : "Upload File"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar */}
                <div className="space-y-6">
                    <Card className="glass border-white/5 rounded-[32px] overflow-hidden p-6 relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl -mr-12 -mt-12" />
                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                            Storage Usage
                        </h3>
                        <div className="space-y-4 relative">
                            <Progress value={20} className="h-2 bg-white/5" />
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-muted-foreground">Used: 2.1 GB</span>
                                <span className="text-primary">Limit: 10 GB</span>
                            </div>
                            <Button variant="outline" className="w-full text-xs h-10 border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-black rounded-xl transition-all font-black">Upgrade Storage</Button>
                        </div>
                    </Card>

                    <div className="space-y-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 px-2">Connected Drives</h3>
                        <div className="space-y-2">
                            {mockDrives.map(drive => (
                                <button key={drive.name} className="w-full group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left border border-white/5 group relative overflow-hidden">
                                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs ${drive.color} group-hover:bg-white/10 transition-colors shadow-lg`}>{drive.icon}</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black">{drive.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter opacity-70">{drive.status}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main View */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <button className="text-primary text-sm font-black italic tracking-tighter border-b-2 border-primary pb-1">All Assets</button>
                            <button className="text-muted-foreground text-sm font-bold hover:text-white transition-colors pb-1">Recent</button>
                            <button className="text-muted-foreground text-sm font-bold hover:text-white transition-colors pb-1">Shared</button>
                        </div>
                        <div className="flex items-center gap-1 bg-white/5 rounded-2xl p-1.5 border border-white/5">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 rounded-xl ${viewMode === 'grid' ? 'bg-primary text-black' : 'text-muted-foreground hover:bg-white/5'}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 rounded-xl ${viewMode === 'list' ? 'bg-primary text-black' : 'text-muted-foreground hover:bg-white/5'}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {files.length === 0 ? (
                        <div className="h-[40vh] glass rounded-[40px] flex flex-col items-center justify-center text-center p-8 border-dashed border-white/10">
                            <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center mb-6">
                                <Folder className="w-10 h-10 opacity-20" />
                            </div>
                            <h3 className="text-2xl font-black italic tracking-tighter mb-2">No files here yet</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto font-medium">Upload your first asset or connect a cloud drive to get started.</p>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {files.map(file => (
                                        <Card key={file.id} className="glass border-white/5 hover:border-primary/40 transition-all group rounded-[32px] overflow-hidden cursor-default relative">
                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(file.id)}
                                                    className="h-9 w-9 rounded-xl hover:bg-red-500/20 hover:text-red-400"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <CardContent className="p-8">
                                                <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-6 shadow-xl border border-white/5">
                                                    {getFileIcon(file.type)}
                                                </div>
                                                <h3 className="font-black text-lg truncate mb-1 pr-8">{file.name}</h3>
                                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                                    <span>{formatSize(file.size)}</span>
                                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                                    <span className="flex items-center gap-1"><Cloud className="w-3 h-3" /> {file.drive}</span>
                                                </div>
                                            </CardContent>
                                            <div className="px-8 py-5 bg-white/[0.03] border-t border-white/5 flex items-center justify-between translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                <Button variant="ghost" size="sm" className="h-9 px-4 text-primary hover:bg-primary/10 rounded-xl font-black text-xs">
                                                    <Download className="w-4 h-4 mr-2" /> OPEN
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-white/10 rounded-xl">
                                                    <Share2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="glass border-white/5 rounded-[32px] overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Name</th>
                                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Location</th>
                                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Size</th>
                                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Created</th>
                                                <th className="p-6"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {files.map(file => (
                                                <tr key={file.id} className="hover:bg-white/[0.03] transition-colors group">
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">{getFileIcon(file.type, "w-5 h-5")}</div>
                                                            <span className="text-sm font-black">{file.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <Badge variant="outline" className="bg-white/5 border-white/5 text-[10px] uppercase font-bold text-muted-foreground">{file.drive}</Badge>
                                                    </td>
                                                    <td className="p-6 text-sm font-medium text-muted-foreground">{formatSize(file.size)}</td>
                                                    <td className="p-6 text-sm font-medium text-muted-foreground">{new Date(file.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-white transition-colors">
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDelete(file.id)}
                                                                className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-400 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
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
        </div>
    );
}

function getFileIcon(type: string, className = "w-8 h-8") {
    switch (type.toLowerCase()) {
        case 'image': case 'png': case 'jpg': return <ImageIcon className={className} />;
        case 'pdf': return <FileText className={className} />;
        case 'archive': case 'zip': return <Folder className={className} />;
        case 'video': case 'mp4': return <FileText className={className} />;
        case 'code': case 'js': case 'json': return <FileCode className={className} />;
        case 'excel': case 'xlsx': return <File className={className} />;
        default: return <File className={className} />;
    }
}
