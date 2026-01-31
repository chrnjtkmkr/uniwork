"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Plus,
    Grid3x3,
    List,
    SlidersHorizontal,
    Share2,
    Link2,
    MoreHorizontal,
    Calendar,
    User,
    CheckCircle2,
    Loader2,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase";
import {
    getTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    getWorkspaceMembers,
    getFirstWorkspace,
} from "@/actions/workspaces";
import { getCurrentUser } from "@/actions/auth";
import { toast } from "sonner";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const TasksPage = () => {
    const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Create task state
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "medium",
        category: "General",
        status: "todo",
        dueDate: "",
        assigneeIds: [] as string[],
    });

    const categories = ["Frontend Engineering", "Architecture", "Design System", "QA Testing", "Infrastructure", "General"];
    const priorities = ["low", "medium", "high", "urgent"];
    const statuses = [
        { id: "todo", title: "Backlog", color: "slate" },
        { id: "in-progress", title: "In Progress", color: "blue" },
        { id: "review", title: "In Review", color: "indigo" },
        { id: "done", title: "Completed", color: "green" },
    ];

    useEffect(() => {
        const init = async () => {
            const [ws, me] = await Promise.all([
                getFirstWorkspace(),
                getCurrentUser()
            ]);

            setWorkspace(ws);
            setUser(me);
            if (ws) {
                const [tasksRes, membersRes] = await Promise.all([
                    getTasks(ws.id),
                    getWorkspaceMembers(ws.id)
                ]);
                if (tasksRes.success) setTasks(tasksRes.tasks || []);
                setMembers(membersRes || []);
            }
            setLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (!workspace) return;

        const supabase = createClient();
        const channel = supabase
            .channel('tasks-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Task',
                    filter: `workspaceId=eq.${workspace.id}`,
                },
                () => {
                    fetchTasks();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [workspace]);

    const fetchTasks = async () => {
        if (workspace) {
            const result = await getTasks(workspace.id);
            if (result.success && result.tasks) {
                setTasks(result.tasks);
            }
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.title || !workspace || !user) {
            toast.error("Please provide a title");
            return;
        }

        setIsCreating(true);
        try {
            const result = await createTask({
                ...newTask,
                workspaceId: workspace.id,
                creatorId: user.id,
            });

            if (result.success) {
                toast.success("Task created successfully");
                setIsCreateDialogOpen(false);
                setNewTask({
                    title: "",
                    description: "",
                    priority: "medium",
                    category: "General",
                    status: "todo",
                    dueDate: "",
                    assigneeIds: [],
                });
                fetchTasks();
            } else {
                toast.error(result.error || "Failed to create task");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsCreating(false);
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        // Optimistic UI update
        const previousTasks = [...tasks];
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

        if (!user) return;
        const result = await updateTaskStatus(user.id, taskId, newStatus);
        if (result.success) {
            toast.success(`Task moved to ${newStatus}`);
        } else {
            setTasks(previousTasks);
            toast.error("Failed to move task");
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        const result = await deleteTask(taskId);
        if (result.success) {
            toast.success("Task deleted");
            fetchTasks();
        } else {
            toast.error("Failed to delete task");
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "urgent":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            case "high":
                return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "medium":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "low":
                return "bg-slate-500/10 text-slate-400 border-slate-500/20";
            default:
                return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    const getColumnColor = (color: string) => {
        switch (color) {
            case "blue":
                return "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]";
            case "indigo":
                return "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]";
            case "green":
                return "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]";
            default:
                return "bg-slate-500 shadow-[0_0_8px_rgba(148,163,184,0.4)]";
        }
    };

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-background">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background relative">
            {/* Header */}
            <header className="p-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tighter uppercase text-white leading-none">
                        TASK <span className="text-blue-500">MANAGEMENT</span> HUB
                    </h1>
                    <p className="text-slate-400 text-sm font-medium mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        High-fidelity operational control system
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all outline-none text-white placeholder:text-slate-600"
                            placeholder="Search tasks, categories..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-600/20 border border-blue-400/20">
                                <Plus className="w-5 h-5" />
                                INITIALIZE TASK
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold uppercase tracking-tight italic">New Task Parameters</DialogTitle>
                                <DialogDescription className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">
                                    Configure new operational node for the workspace
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Task Designation</label>
                                    <Input
                                        placeholder="e.g., Optimize Database Pipelines"
                                        className="bg-black/50 border-zinc-800 text-white"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Priority Level</label>
                                        <Select
                                            value={newTask.priority}
                                            onValueChange={(v) => setNewTask({ ...newTask, priority: v })}
                                        >
                                            <SelectTrigger className="bg-black/50 border-zinc-800">
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                {priorities.map(p => (
                                                    <SelectItem key={p} value={p} className="uppercase text-[10px] font-bold tracking-widest">{p}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Classification</label>
                                        <Select
                                            value={newTask.category}
                                            onValueChange={(v) => setNewTask({ ...newTask, category: v })}
                                        >
                                            <SelectTrigger className="bg-black/50 border-zinc-800">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                {categories.map(c => (
                                                    <SelectItem key={c} value={c} className="text-[10px] font-bold">{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Node Description</label>
                                    <textarea
                                        className="w-full min-h-[100px] bg-black/50 border border-zinc-800 rounded-md p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Technical specifications for this node..."
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Assign Personnel</label>
                                    <div className="flex flex-wrap gap-2 p-2 bg-black/50 border border-zinc-800 rounded-md min-h-[40px]">
                                        {members.map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => {
                                                    const ids = newTask.assigneeIds.includes(m.id)
                                                        ? newTask.assigneeIds.filter(id => id !== m.id)
                                                        : [...newTask.assigneeIds, m.id];
                                                    setNewTask({ ...newTask, assigneeIds: ids });
                                                }}
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all border",
                                                    newTask.assigneeIds.includes(m.id)
                                                        ? "bg-blue-600 border-blue-400 text-white"
                                                        : "bg-white/5 border-white/5 text-slate-500 hover:border-white/20"
                                                )}
                                            >
                                                {m.name || m.email.split('@')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Deadline Offset (YYYY-MM-DD)</label>
                                    <Input
                                        type="date"
                                        className="bg-black/50 border-zinc-800 text-white"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] h-12"
                                    onClick={handleCreateTask}
                                    disabled={isCreating}
                                >
                                    {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : "EXECUTE INITIALIZATION"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* Toolbar */}
            <div className="px-8 py-2 flex flex-wrap items-center justify-between gap-4 z-10">
                <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setViewMode("kanban")}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                            viewMode === "kanban" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-white"
                        )}
                    >
                        <Grid3x3 className="w-4 h-4" />
                        Kanban View
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                            viewMode === "list" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-white"
                        )}
                    >
                        <List className="w-4 h-4" />
                        List View
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                        <Share2 className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-grow overflow-x-auto p-8 pt-6 z-10">
                <div className="flex gap-6 h-full min-w-max pb-4">
                    {statuses.map((status) => (
                        <div key={status.id} className="w-80 flex flex-col">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4 px-1">
                                <div className="flex items-center gap-2.5">
                                    <span className={`w-2.5 h-2.5 rounded-full ${getColumnColor(status.color)}`}></span>
                                    <h3 className="font-extrabold text-sm tracking-widest uppercase text-white">{status.title}</h3>
                                    <span className="bg-white/5 text-[10px] px-2 py-0.5 rounded-md border border-white/5 font-bold text-slate-400">
                                        {filteredTasks.filter(t => t.status === status.id).length}
                                    </span>
                                </div>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-slate-500 hover:text-blue-400">
                                    <Plus className="w-5 h-5" onClick={() => {
                                        setNewTask({ ...newTask, status: status.id });
                                        setIsCreateDialogOpen(true);
                                    }} />
                                </button>
                            </div>

                            {/* Tasks */}
                            <div className="flex flex-col gap-4 overflow-y-auto pr-2 flex-grow">
                                {filteredTasks
                                    .filter(t => t.status === status.id)
                                    .map((task) => (
                                        <div
                                            key={task.id}
                                            className={cn(
                                                "p-5 rounded-2xl group transition-all duration-300 relative shadow-xl bg-[#121214]/80 backdrop-blur-sm border border-white/[0.08] hover:border-blue-500/50",
                                                task.status === "done" && "opacity-60"
                                            )}
                                        >
                                            {/* Priority and Actions */}
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={cn("text-[10px] px-2.5 py-1 rounded-lg font-bold border uppercase tracking-wider", getPriorityStyle(task.priority))}>
                                                    {task.priority || "MEDIUM"}
                                                </span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-slate-500 transition-colors">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="mb-4">
                                                <span className="text-[9px] uppercase font-black tracking-[0.25em] text-blue-500/80 block mb-1">
                                                    {task.category || "GENERAL"}
                                                </span>
                                                <h4 className={cn(
                                                    "text-base font-bold text-white leading-tight transition-colors group-hover:text-blue-400",
                                                    task.status === "done" && "line-through decoration-slate-600"
                                                )}>
                                                    {task.title}
                                                </h4>
                                                {task.description && (
                                                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-2">{task.description}</p>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-bold uppercase tracking-tight">
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "flex items-center gap-1.5 px-2 py-1 rounded border cursor-pointer transition-all",
                                                        task.status === "done" ? "bg-blue-500/10 border-blue-500/20" : "bg-white/5 border-white/10 hover:border-blue-500/30"
                                                    )}
                                                        onClick={() => handleStatusChange(task.id, task.status === "done" ? "todo" : "done")}
                                                    >
                                                        <Checkbox checked={task.status === "done"} className="w-3.5 h-3.5" />
                                                        <span className={cn(
                                                            "text-[9px] font-bold uppercase tracking-widest",
                                                            task.status === "done" ? "text-blue-500" : "text-zinc-500"
                                                        )}>
                                                            {task.status === "done" ? "Done" : "Mark Done"}
                                                        </span>
                                                    </div>
                                                    <div className="flex -space-x-2">
                                                        {task.assignees?.map((assignee: any) => (
                                                            <div key={assignee.id} className="relative group/avatar">
                                                                {assignee.avatar ? (
                                                                    <img
                                                                        alt={assignee.name}
                                                                        className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0f0f0f]"
                                                                        src={assignee.avatar}
                                                                    />
                                                                ) : (
                                                                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center ring-2 ring-[#0f0f0f]">
                                                                        <User className="w-3 h-3 text-slate-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {(!task.assignees || task.assignees.length === 0) && (
                                                            <div className="w-7 h-7 rounded-full bg-slate-800/50 flex items-center justify-center border border-dashed border-white/10">
                                                                <User className="w-3 h-3 text-slate-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                {/* Add Task Button */}
                                {status.id !== "done" && (
                                    <button
                                        onClick={() => {
                                            setNewTask({ ...newTask, status: status.id });
                                            setIsCreateDialogOpen(true);
                                        }}
                                        className="border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-blue-500/40 hover:bg-blue-500/5 transition-all"
                                    >
                                        <Plus className="w-6 h-6 text-slate-600 group-hover:text-blue-500 transition-colors" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-blue-500 transition-colors">
                                            Create Task Node
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Glows */}
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-[20%] -left-[5%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
    );
};

export default TasksPage;
