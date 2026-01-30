"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    Tag,
    Loader2,
    Trash2,
    ArrowRight,
    GripVertical,
    ChevronDown,
    LayoutDashboard,
    ListTodo,
    UserCircle,
    Layers
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
    low: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    medium: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    high: "bg-orange-400/10 text-orange-400 border-orange-400/20",
    urgent: "bg-red-400/10 text-red-400 border-red-400/20 font-black shadow-[0_0_10px_rgba(248,113,113,0.3)]",
};

const TaskCard = ({ task }: { task: Task }) => {
    const { moveTask, deleteTask } = useTaskStore();

    const handleNextStatus = () => {
        const statuses = ['todo', 'in-progress', 'review', 'done'];
        const nextIndex = (statuses.indexOf(task.status) + 1) % statuses.length;
        moveTask(task.id, statuses[nextIndex]);
    };

    return (
        <Card className="glass border-white/5 shadow-none mb-6 group hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing overflow-hidden rounded-[32px] relative bg-white/[0.01]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-5">
                    <div className="flex flex-col gap-1.5">
                        <Badge variant="outline" className={cn("text-[8px] uppercase font-black tracking-widest px-3 py-1 border shadow-sm w-fit", priorityColors[task.priority])}>
                            {task.priority}
                        </Badge>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{task.category || "General"}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all scale-90">
                        <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-red-400 p-2 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={handleNextStatus} className="text-muted-foreground hover:text-primary p-2 transition-colors">
                            <Plus className="w-5 h-5 rotate-45" />
                        </button>
                    </div>
                </div>

                <h4 className="font-black italic tracking-tighter text-lg mb-3 group-hover:text-primary transition-all duration-300">
                    {task.title}
                </h4>
                <p className="text-xs font-medium text-muted-foreground line-clamp-3 mb-8 leading-relaxed opacity-60">
                    {task.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2">
                        {task.assignees && task.assignees.length > 0 ? (
                            task.assignees.map((a: any) => (
                                <Avatar key={a.id} className="w-10 h-10 border-[3px] border-[#0A0A0A] shadow-xl rounded-xl">
                                    <AvatarImage src={a.avatar || ""} />
                                    <AvatarFallback className="text-[10px] font-black bg-primary/20 text-primary uppercase">{a.name[0]}</AvatarFallback>
                                </Avatar>
                            ))
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-white/5 border-[3px] border-[#0A0A0A] flex items-center justify-center text-muted-foreground">
                                <UserCircle className="w-5 h-5 opacity-30" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-muted-foreground group-hover:border-primary/40 transition-all">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'NO_DEADLINE'}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const KanbanColumn = ({ title, status, tasks, onAddTask }: { title: string, status: string, tasks: Task[], onAddTask: () => void }) => {
    return (
        <div className="flex flex-col min-w-[360px] flex-1">
            <div className="flex items-center justify-between mb-8 px-6">
                <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,212,170,0.5)]" />
                    <h3 className="font-black text-sm uppercase tracking-[0.3em] text-white italic">{title}</h3>
                    <Badge className="bg-white/5 border border-white/10 text-primary rounded-xl h-7 px-3 font-black text-[11px] shadow-lg">{tasks.length}</Badge>
                </div>
                <Button onClick={onAddTask} variant="ghost" size="icon" className="h-11 w-11 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
                    <Plus className="w-6 h-6" />
                </Button>
            </div>

            <ScrollArea className="flex-1 bg-white/[0.02] rounded-[48px] p-6 border border-white/5 min-h-[600px] backdrop-blur-md shadow-2xl">
                <div className="min-h-full">
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                    <Button
                        onClick={onAddTask}
                        variant="ghost"
                        className="w-full border-2 border-dashed border-white/10 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary rounded-[32px] h-24 mt-2 font-black italic tracking-tighter uppercase transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                        <span className="text-[11px] tracking-[0.3em]">Deploy Task node</span>
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
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white underline decoration-primary/50 decoration-4 underline-offset-8 leading-none">Neural <span className="text-primary italic">Board</span></h1>
                    <p className="text-muted-foreground font-medium text-lg">Autonomous workflow management with real-time cosmic sync protocols.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            placeholder="Filter timeline nodes..."
                            className="bg-white/5 border border-white/10 rounded-[28px] py-4 pl-14 pr-8 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all w-80 focus:bg-white/10"
                        />
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-black hover:bg-primary/90 h-16 px-10 rounded-[28px] font-black italic tracking-tighter text-xl shadow-[0_0_30px_rgba(0,212,170,0.4)] transition-all active:scale-95 group">
                                <Plus className="w-7 h-7 mr-4 group-hover:rotate-90 transition-transform" /> INITIATE TASK
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glass border-white/10 text-white rounded-[48px] p-12 max-w-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-32 -mt-32" />
                            <DialogHeader>
                                <DialogTitle className="text-4xl font-black italic tracking-tighter uppercase mb-2">Initiate <span className="text-primary italic">Task Node</span></DialogTitle>
                                <p className="text-muted-foreground font-medium">Define metadata for the universal execution network.</p>
                            </DialogHeader>
                            <div className="space-y-8 pt-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Task Identification</label>
                                    <Input
                                        placeholder="What needs execution?"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        className="bg-white/5 border-white/10 h-16 rounded-2xl text-xl font-black px-6 focus:border-primary/50 transition-all shadow-inner"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Logic Category</label>
                                        <Select value={newCategory} onValueChange={setNewCategory}>
                                            <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14 font-black italic tracking-tighter px-6">
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent className="glass border-white/10 text-white rounded-3xl p-2">
                                                {['General', 'Frontend', 'Backend', 'Design', 'Marketing', 'Core'].map(cat => (
                                                    <SelectItem key={cat} value={cat} className="rounded-xl font-black italic tracking-tighter uppercase focus:bg-primary/20 focus:text-primary">{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Priority Level</label>
                                        <Select value={newPriority} onValueChange={setNewPriority}>
                                            <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14 font-black italic tracking-tighter px-6">
                                                <SelectValue placeholder="Priority" />
                                            </SelectTrigger>
                                            <SelectContent className="glass border-white/10 text-white rounded-3xl p-2">
                                                <SelectItem value="low" className="rounded-xl font-black uppercase focus:bg-blue-500/10 focus:text-blue-400">Low</SelectItem>
                                                <SelectItem value="medium" className="rounded-xl font-black uppercase focus:bg-yellow-500/10 focus:text-yellow-400">Medium</SelectItem>
                                                <SelectItem value="high" className="rounded-xl font-black uppercase focus:bg-orange-500/10 focus:text-orange-400">High</SelectItem>
                                                <SelectItem value="urgent" className="rounded-xl font-black uppercase focus:bg-red-500/10 focus:text-red-400">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Assign Responsible</label>
                                        <Select value={newAssignee} onValueChange={setNewAssignee}>
                                            <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14 font-black italic tracking-tighter px-6">
                                                <SelectValue placeholder="Tag Member" />
                                            </SelectTrigger>
                                            <SelectContent className="glass border-white/10 text-white rounded-3xl p-2">
                                                {members.map(member => (
                                                    <SelectItem key={member.id} value={member.id} className="rounded-xl font-black italic tracking-tighter uppercase focus:bg-primary/20 focus:text-primary">
                                                        {member.name} ({member.position || 'Core'})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Deadline Node</label>
                                        <Input
                                            type="datetime-local"
                                            value={newDueDate}
                                            onChange={e => setNewDueDate(e.target.value)}
                                            className="bg-white/5 border-white/10 h-14 rounded-2xl font-bold px-6 text-white focus:border-primary/50 transition-all custom-calendar-picker"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Logic Stream (Description)</label>
                                    <textarea
                                        placeholder="Define the execution parameters..."
                                        value={newDesc}
                                        onChange={e => setNewDesc(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-[32px] p-8 text-lg font-medium focus:outline-none focus:border-primary/50 min-h-[160px] resize-none shadow-inner"
                                    />
                                </div>

                                <Button onClick={handleAddTask} className="w-full h-20 bg-primary text-black hover:bg-primary/90 rounded-[32px] font-black text-2xl shadow-[0_10px_40px_rgba(0,212,170,0.3)] mt-6 uppercase italic tracking-tighter group">
                                    DEPLOY TO UNIVERSE <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="kanban" className="w-full" onValueChange={setView}>
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <TabsList className="bg-white/[0.03] border border-white/10 rounded-[28px] p-2 h-16">
                        <TabsTrigger value="kanban" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase italic tracking-tighter px-12 h-full transition-all text-sm group">
                            <LayoutDashboard className="w-5 h-5 mr-3 group-data-[state=active]:rotate-12 transition-transform" /> Board
                        </TabsTrigger>
                        <TabsTrigger value="list" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase italic tracking-tighter px-12 h-full transition-all text-sm group">
                            <ListTodo className="w-5 h-5 mr-3 group-data-[state=active]:scale-110 transition-transform" /> Stream
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px] border border-white/5 hover:bg-white/5">
                            <Filter className="w-4 h-4 mr-3" /> Filter Logic
                        </Button>
                        <Button variant="ghost" className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px] border border-white/5 hover:bg-white/5">
                            <Layers className="w-4 h-4 mr-3" /> Group By
                        </Button>
                    </div>
                </div>

                <TabsContent value="kanban" className="pt-12">
                    <div className="flex gap-12 overflow-x-auto pb-12 scrollbar-hide">
                        <KanbanColumn
                            title="Backlog Node"
                            status="todo"
                            tasks={tasks.filter(t => t.status === 'todo')}
                            onAddTask={() => setIsDialogOpen(true)}
                        />
                        <KanbanColumn
                            title="Active Pulse"
                            status="in-progress"
                            tasks={tasks.filter(t => t.status === 'in-progress')}
                            onAddTask={() => setIsDialogOpen(true)}
                        />
                        <KanbanColumn
                            title="Neural Review"
                            status="review"
                            tasks={tasks.filter(t => t.status === 'review')}
                            onAddTask={() => setIsDialogOpen(true)}
                        />
                        <KanbanColumn
                            title="Completed"
                            status="done"
                            tasks={tasks.filter(t => t.status === 'done')}
                            onAddTask={() => setIsDialogOpen(true)}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="list" className="pt-12">
                    <Card className="glass border-white/5 rounded-[48px] overflow-hidden shadow-2xl relative">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none -mr-40 -mt-40" />
                        <div className="overflow-x-auto relative z-10">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.4em] text-primary">Node Identification</th>
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.4em] text-primary">Execution Status</th>
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.4em] text-primary">Priority Level</th>
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.4em] text-primary">Assigned Member</th>
                                        <th className="p-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-medium">
                                    {tasks.map(task => (
                                        <tr key={task.id} className="hover:bg-primary/[0.02] transition-all group border-transparent hover:border-primary/10">
                                            <td className="p-10">
                                                <div className="flex items-center gap-6">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl border",
                                                        task.status === 'done' ? "bg-primary text-black border-primary/50 shadow-[0_0_20px_rgba(0,212,170,0.5)]" : "bg-white/5 text-muted-foreground border-white/5"
                                                    )}>
                                                        {task.status === 'done' ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                                                    </div>
                                                    <div>
                                                        <span className={cn("text-xl font-black italic tracking-tighter truncate block", task.status === 'done' && "line-through opacity-20")}>{task.title}</span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-white/5 px-2.5 py-1 rounded-lg mt-1 inline-block border border-white/5">{task.category}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-10">
                                                <Badge className="bg-white/5 border border-white/10 text-white capitalize text-[10px] px-5 py-2 font-black uppercase tracking-[0.2em] rounded-2xl group-hover:border-primary/30 transition-all">{task.status.replace('-', ' ')}</Badge>
                                            </td>
                                            <td className="p-10">
                                                <Badge className={cn("text-[10px] px-5 py-2 font-black uppercase tracking-[0.2em] rounded-2xl shadow-sm", priorityColors[task.priority])}>{task.priority}</Badge>
                                            </td>
                                            <td className="p-10">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10 rounded-xl border border-white/10">
                                                        <AvatarImage src={task.assignees?.[0]?.avatar || ""} />
                                                        <AvatarFallback className="font-black italic text-[10px] bg-primary/20 text-primary">{task.assignees?.[0]?.name?.[0] || '?'}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-black italic tracking-tighter text-muted-foreground group-hover:text-white transition-colors">
                                                        {task.assignees?.[0]?.name || "Unassigned"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-10 text-right">
                                                <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-400" onClick={() => deleteTask(task.id)}>
                                                    <Trash2 className="w-7 h-7" />
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
