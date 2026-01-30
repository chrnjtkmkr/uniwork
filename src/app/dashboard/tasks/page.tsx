"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Filter,
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    Tag,
    Loader2,
    Trash2,
    ArrowRight,
    LayoutDashboard,
    ListTodo,
    UserCircle,
    Layers,
    ChevronDown,
    Zap,
    Activity,
    BrainCircuit,
    MoreVertical
} from "lucide-react";
import { useTaskStore, Task } from "@/store/useTaskStore";
import { getTasks } from "@/actions/tasks";
import { getFirstWorkspace, getMockUser, getWorkspaceMembers } from "@/actions/workspaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const priorityColors: Record<string, string> = {
    low: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    medium: "text-zinc-400 border-zinc-400/20 bg-zinc-400/5",
    high: "text-orange-400 border-orange-400/20 bg-orange-400/5",
    urgent: "text-primary border-primary/20 bg-primary/5 animate-pulse",
};

const TaskCard = ({ task }: { task: Task }) => {
    const { moveTask, deleteTask } = useTaskStore();

    const handleNextStatus = () => {
        const statuses = ['todo', 'in-progress', 'review', 'done'];
        const nextIndex = (statuses.indexOf(task.status) + 1) % statuses.length;
        moveTask(task.id, statuses[nextIndex]);
    };

    return (
        <Card className="glass border-white/5 shadow-2xl mb-6 group hover:border-primary/20 transition-all cursor-grab active:cursor-grabbing rounded-[32px] overflow-hidden relative p-1">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-2">
                        <Badge variant="outline" className={cn("text-[9px] font-black italic tracking-widest uppercase px-3 py-1 border shadow-none w-fit", priorityColors[task.priority])}>
                            {task.priority}
                        </Badge>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic opacity-50">{task.category || "GENERAL"}</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-red-400 p-2 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <h4 className="font-black text-xl italic tracking-tighter text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                    {task.title}
                </h4>
                <p className="text-sm font-medium text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                    {task.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div className="flex -space-x-3">
                        {task.assignees && task.assignees.length > 0 ? (
                            task.assignees.map((a: any) => (
                                <Avatar key={a.id} className="w-10 h-10 border-4 border-[#0A0A0A] shadow-xl">
                                    <AvatarImage src={a.avatar || ""} />
                                    <AvatarFallback className="text-[10px] font-black italic bg-white/5 text-muted-foreground uppercase">{a.name[0]}</AvatarFallback>
                                </Avatar>
                            ))
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-muted-foreground/30">
                                <UserCircle className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black italic uppercase tracking-widest flex items-center gap-2 text-muted-foreground bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'LINK ARCHIVE'}
                        </span>
                        <Button onClick={handleNextStatus} variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/5 hover:bg-primary hover:text-black transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const KanbanColumn = ({ title, status, tasks, onAddTask }: { title: string, status: string, tasks: Task[], onAddTask: () => void }) => {
    return (
        <div className="flex flex-col min-w-[340px] flex-1">
            <div className="flex items-center justify-between mb-8 px-4">
                <div className="flex items-center gap-4">
                    <div className={cn("w-3 h-3 rounded-full animate-neon shadow-lg",
                        status === 'todo' ? 'bg-zinc-500' :
                            status === 'in-progress' ? 'bg-primary' :
                                status === 'review' ? 'bg-blue-500' : 'bg-emerald-500'
                    )} />
                    <h3 className="font-black text-xl italic tracking-tighter uppercase text-white leading-none">{title} <span className="opacity-20 ml-2 text-primary">{tasks.length}</span></h3>
                </div>
                <Button onClick={onAddTask} variant="ghost" size="icon" className="h-11 w-11 rounded-2xl hover:bg-white/5 border border-white/5 text-muted-foreground group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </Button>
            </div>

            <ScrollArea className="flex-1 bg-white/[0.02] border border-white/5 rounded-[48px] p-6 min-h-[600px] shadow-inner mb-10">
                <div className="min-h-full space-y-4">
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                    <Button
                        onClick={onAddTask}
                        variant="ghost"
                        className="w-full border-2 border-dashed border-white/5 text-muted-foreground/30 hover:border-primary/20 hover:bg-primary/5 hover:text-primary rounded-[32px] h-20 mt-6 font-black italic text-sm tracking-tighter uppercase transition-all flex items-center justify-center gap-4 group"
                    >
                        <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />
                        <span>Initialize Node</span>
                    </Button>
                </div>
            </ScrollArea>
        </div>
    );
};

export default function TasksPage() {
    const { tasks, setTasks, addTask, deleteTask } = useTaskStore();
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("kanban");
    const [workspace, setWorkspace] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);

    // New task form state
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newCategory, setNewCategory] = useState("General");
    const [newPriority, setNewPriority] = useState("medium");
    const [newAssignee, setNewAssignee] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        async function init() {
            setLoading(true);
            const ws = await getFirstWorkspace();
            const me = await getMockUser();
            if (ws) {
                setWorkspace(ws);
                setUser(me);
                const [taskRes, memberRes] = await Promise.all([
                    getTasks(ws.id),
                    getWorkspaceMembers(ws.id)
                ]);
                if (taskRes.success) {
                    setTasks(taskRes.tasks as any);
                }
                setMembers(memberRes);
            }
            setLoading(false);
        }
        init();
    }, [setTasks]);

    const handleAddTask = async () => {
        if (!newTitle || !workspace || !user) return;

        await addTask({
            title: newTitle,
            description: newDesc,
            category: newCategory,
            status: 'todo',
            priority: newPriority,
            workspaceId: workspace.id,
            creatorId: user.id,
            assigneeId: newAssignee || undefined,
            dueDate: newDueDate || undefined
        });

        setNewTitle("");
        setNewDesc("");
        setNewCategory("General");
        setNewPriority("medium");
        setNewAssignee("");
        setNewDueDate("");
        setIsDialogOpen(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Neural Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white leading-none underline decoration-primary/50 decoration-4 underline-offset-8">Neural <span className="text-primary italic animate-neon">Board</span></h1>
                    <p className="text-lg font-medium text-muted-foreground italic">Managing logic nodes and milestone synchronization.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            placeholder="Filter nodes..."
                            className="bg-white/5 border border-white/5 rounded-3xl py-4 pl-14 pr-6 text-sm italic font-bold focus:outline-none focus:border-primary/50 transition-all w-72 shadow-2xl"
                        />
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-black hover:bg-primary/90 h-16 px-10 rounded-[32px] font-black italic tracking-tighter text-xl shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all uppercase group">
                                <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform" /> Initialize Node
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass border-white/10 text-white rounded-[48px] p-12 max-w-2xl animate-in zoom-in-95 duration-500">
                            <DialogHeader>
                                <DialogTitle className="text-4xl font-black tracking-tighter uppercase italic">Create <span className="text-primary italic">Node</span></DialogTitle>
                            </DialogHeader>
                            <div className="space-y-8 pt-10">
                                <div className="space-y-4">
                                    <label className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Node Title</label>
                                    <Input
                                        placeholder="EX: CORE INFRASTRUCTURE OPS"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        className="bg-white/5 border-white/5 h-16 rounded-[24px] text-xl font-black italic px-8 focus:border-primary/50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Category</label>
                                        <Select value={newCategory} onValueChange={setNewCategory}>
                                            <SelectTrigger className="bg-white/5 border-white/5 h-16 rounded-[24px] text-sm font-black italic px-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="glass border-white/10 text-white rounded-[32px]">
                                                {['General', 'Frontend', 'Backend', 'Design', 'Marketing'].map(cat => (
                                                    <SelectItem key={cat} value={cat} className="font-black italic text-sm">{cat.toUpperCase()}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Priority</label>
                                        <Select value={newPriority} onValueChange={setNewPriority}>
                                            <SelectTrigger className="bg-white/5 border-white/5 h-16 rounded-[24px] text-sm font-black italic px-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="glass border-white/10 text-white rounded-[32px]">
                                                <SelectItem value="low" className="font-black italic text-sm">LOW</SelectItem>
                                                <SelectItem value="medium" className="font-black italic text-sm">MEDIUM</SelectItem>
                                                <SelectItem value="high" className="font-black italic text-sm">HIGH</SelectItem>
                                                <SelectItem value="urgent" className="font-black italic text-sm text-primary">URGENT</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Assign Link</label>
                                        <Select value={newAssignee} onValueChange={setNewAssignee}>
                                            <SelectTrigger className="bg-white/5 border-white/5 h-16 rounded-[24px] text-sm font-black italic px-8">
                                                <SelectValue placeholder="SELECT MEMBER" />
                                            </SelectTrigger>
                                            <SelectContent className="glass border-white/10 text-white rounded-[32px]">
                                                {members.map(member => (
                                                    <SelectItem key={member.id} value={member.id} className="font-black italic text-sm uppercase">{member.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Neural Clock</label>
                                        <Input
                                            type="datetime-local"
                                            value={newDueDate}
                                            onChange={e => setNewDueDate(e.target.value)}
                                            className="bg-white/5 border-white/5 h-16 rounded-[24px] text-sm font-black italic px-8"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Core Logic</label>
                                    <textarea
                                        placeholder="INPUT DETAILED EXECUTION PARAMETERS..."
                                        value={newDesc}
                                        onChange={e => setNewDesc(e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-[32px] p-8 text-sm font-bold italic focus:outline-none focus:border-primary/50 min-h-[150px] resize-none"
                                    />
                                </div>

                                <Button onClick={handleAddTask} className="w-full h-20 bg-primary text-black hover:bg-primary/90 rounded-[32px] font-black italic text-2xl tracking-tighter transition-all shadow-[0_0_30px_rgba(0,212,170,0.4)]">
                                    COMMENCE EXECUTION
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="kanban" className="w-full" onValueChange={setView}>
                <div className="flex items-center justify-between mb-8">
                    <TabsList className="glass border-white/10 rounded-[28px] p-2 h-16">
                        <TabsTrigger value="kanban" className="rounded-[20px] data-[state=active]:bg-primary data-[state=active]:text-black font-black italic text-[12px] tracking-[0.2em] px-10 h-full transition-all uppercase">
                            <LayoutDashboard className="w-5 h-5 mr-3" /> Board View
                        </TabsTrigger>
                        <TabsTrigger value="list" className="rounded-[20px] data-[state=active]:bg-primary data-[state=active]:text-black font-black italic text-[12px] tracking-[0.2em] px-10 h-full transition-all uppercase">
                            <ListTodo className="w-5 h-5 mr-3" /> List Stream
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="h-12 px-6 text-[12px] font-black italic tracking-widest text-muted-foreground border-2 border-white/5 rounded-2xl hover:text-white group">
                            <Filter className="w-5 h-5 mr-3 group-hover:scale-110" /> Filter Nodes
                        </Button>
                        <Button variant="ghost" className="h-12 px-6 text-[12px] font-black italic tracking-widest text-muted-foreground border-2 border-white/5 rounded-2xl hover:text-white group">
                            <Layers className="w-5 h-5 mr-3 group-hover:scale-110" /> Layered View
                        </Button>
                    </div>
                </div>

                <TabsContent value="kanban" className="pt-4">
                    <div className="flex gap-10 overflow-x-auto pb-12 scrollbar-hide">
                        <KanbanColumn
                            title="Backlog"
                            status="todo"
                            tasks={tasks.filter(t => t.status === 'todo')}
                            onAddTask={() => setIsDialogOpen(true)}
                        />
                        <KanbanColumn
                            title="On Track"
                            status="in-progress"
                            tasks={tasks.filter(t => t.status === 'in-progress')}
                            onAddTask={() => setIsDialogOpen(true)}
                        />
                        <KanbanColumn
                            title="Audit"
                            status="review"
                            tasks={tasks.filter(t => t.status === 'review')}
                            onAddTask={() => setIsDialogOpen(true)}
                        />
                        <KanbanColumn
                            title="Archived"
                            status="done"
                            tasks={tasks.filter(t => t.status === 'done')}
                            onAddTask={() => setIsDialogOpen(true)}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="list" className="pt-4">
                    <Card className="glass border-white/5 rounded-[48px] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="p-8 text-[12px] font-black italic tracking-[0.3em] text-muted-foreground uppercase">Node Identification</th>
                                        <th className="p-8 text-[12px] font-black italic tracking-[0.3em] text-muted-foreground uppercase">Status</th>
                                        <th className="p-8 text-[12px] font-black italic tracking-[0.3em] text-muted-foreground uppercase">Priority</th>
                                        <th className="p-8 text-[12px] font-black italic tracking-[0.3em] text-muted-foreground uppercase">Personnel</th>
                                        <th className="p-8"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {tasks.map(task => (
                                        <tr key={task.id} className="hover:bg-white/[0.03] transition-all group">
                                            <td className="p-8">
                                                <div className="flex items-center gap-6">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-[18px] flex items-center justify-center transition-all shadow-xl border border-white/5",
                                                        task.status === 'done' ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                                                    )}>
                                                        {task.status === 'done' ? <Zap className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                                                    </div>
                                                    <div>
                                                        <span className={cn("text-xl font-black italic tracking-tighter block", task.status === 'done' && "line-through opacity-20")}>{task.title}</span>
                                                        <span className="text-[10px] font-black italic tracking-[0.2em] text-primary uppercase mt-1 inline-block">{task.category}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <Badge className="bg-white/5 border-white/10 text-muted-foreground text-[10px] px-4 py-2 font-black italic tracking-[0.1em] uppercase rounded-xl">{task.status.replace('-', ' ')}</Badge>
                                            </td>
                                            <td className="p-8">
                                                <Badge className={cn("text-[10px] px-4 py-2 font-black italic tracking-[0.1em] uppercase rounded-xl border", priorityColors[task.priority])}>{task.priority}</Badge>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 rounded-xl border-2 border-white/10">
                                                        <AvatarImage src={task.assignees?.[0]?.avatar || ""} />
                                                        <AvatarFallback className="font-black italic text-[10px] bg-white/5">?</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-bold italic text-muted-foreground group-hover:text-white transition-colors uppercase tracking-widest">
                                                        {task.assignees?.[0]?.name || "Unassigned"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-right">
                                                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 hover:text-red-400" onClick={() => deleteTask(task.id)}>
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
