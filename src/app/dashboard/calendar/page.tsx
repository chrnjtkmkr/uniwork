"use client";

import React, { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    Circle,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval
} from "date-fns";
import { getFirstWorkspace } from "@/actions/workspaces";
import { getTasks } from "@/actions/tasks";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            const ws = await getFirstWorkspace();
            if (ws) {
                const result = await getTasks(ws.id);
                if (result.success) {
                    setTasks(result.tasks || []);
                }
            }
            setLoading(false);
        }
        init();
    }, []);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const getTasksForDay = (day: Date) => {
        return tasks.filter(task => task.dueDate && isSameDay(new Date(task.dueDate), day));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white flex items-center gap-3">
                        Universe <span className="text-primary italic">Timeline</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Coordinate your missions across time and space.</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-xl hover:bg-white/10 text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="px-4 text-sm font-black uppercase tracking-widest min-w-[140px] text-center">
                        {format(currentMonth, "MMMM yyyy")}
                    </div>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-xl hover:bg-white/10 text-white">
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Calendar Grid */}
                <div className="lg:col-span-3">
                    <Card className="glass border-white/5 rounded-[40px] overflow-hidden p-1 shadow-2xl">
                        <div className="grid grid-cols-7 border-b border-white/5">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {calendarDays.map((day, idx) => {
                                const dayTasks = getTasksForDay(day);
                                const isSelected = isSameDay(day, selectedDate);
                                const isCurrentMonth = isSameMonth(day, monthStart);
                                const isToday = isSameDay(day, new Date());

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "min-h-[120px] p-2 border-r border-b border-white/5 transition-all cursor-pointer group relative hover:bg-white/[0.02]",
                                            !isCurrentMonth && "opacity-20",
                                            isSelected && "bg-primary/[0.03] z-10"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={cn(
                                                "w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black transition-all",
                                                isToday ? "bg-primary text-black shadow-[0_0_15px_rgba(0,212,170,0.4)]" : "text-muted-foreground group-hover:text-white",
                                                isSelected && !isToday && "bg-white/10 text-white"
                                            )}>
                                                {format(day, "d")}
                                            </span>
                                            {dayTasks.length > 0 && (
                                                <div className="flex -space-x-1">
                                                    {dayTasks.slice(0, 3).map((t, i) => (
                                                        <div key={i} className="w-2 h-2 rounded-full border border-[#0A0A0A]" style={{ backgroundColor: t.status === 'done' ? '#00d4aa' : '#3b82f6' }} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1 overflow-hidden">
                                            {dayTasks.slice(0, 3).map(task => (
                                                <div
                                                    key={task.id}
                                                    className={cn(
                                                        "px-2 py-1 rounded-md text-[9px] font-black truncate border transition-all uppercase tracking-tighter",
                                                        task.status === 'done'
                                                            ? "bg-primary/10 border-primary/20 text-primary grayscale opacity-50"
                                                            : "bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:scale-105"
                                                    )}
                                                >
                                                    {task.title}
                                                </div>
                                            ))}
                                            {dayTasks.length > 3 && (
                                                <div className="text-[8px] font-bold text-muted-foreground pl-1">
                                                    + {dayTasks.length - 3} more
                                                </div>
                                            )}
                                        </div>

                                        {isSelected && (
                                            <div className="absolute inset-0 border-2 border-primary/20 pointer-events-none rounded-lg mx-px my-px" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Selected Date Detail */}
                <div className="space-y-6">
                    <Card className="glass border-white/5 rounded-[32px] overflow-hidden p-6 relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl -mr-12 -mt-12" />
                        <div className="space-y-1 mb-6 relative">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Schedule for</p>
                            <h3 className="text-2xl font-black italic tracking-tighter">
                                {format(selectedDate, "MMM d, yyyy")}
                            </h3>
                        </div>

                        <div className="space-y-4 relative">
                            {getTasksForDay(selectedDate).length === 0 ? (
                                <div className="py-12 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                                        <Clock className="w-6 h-6 opacity-20" />
                                    </div>
                                    <p className="text-xs text-muted-foreground font-bold italic">Zero events scheduled.</p>
                                </div>
                            ) : (
                                getTasksForDay(selectedDate).map(task => (
                                    <div key={task.id} className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-default relative overflow-hidden">
                                        {task.status === 'done' && <div className="absolute inset-0 bg-primary/5 grayscale pointer-events-none" />}
                                        <div className="flex items-start gap-3 relative">
                                            <div className={cn(
                                                "w-2 h-10 rounded-full shrink-0",
                                                task.status === 'done' ? "bg-primary" : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                            )} />
                                            <div>
                                                <p className={cn("text-sm font-black mb-1", task.status === 'done' && "line-through opacity-50")}>{task.title}</p>
                                                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    {task.dueDate ? format(new Date(task.dueDate), "hh:mm a") : "All Day"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                            <Button className="w-full h-12 bg-white/5 hover:bg-primary hover:text-black border border-white/10 rounded-xl font-black transition-all group">
                                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> New Event
                            </Button>
                        </div>
                    </Card>

                    <div className="p-6 glass border-white/5 rounded-[32px] space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Legend</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Pending Task</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(0,212,170,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Completed Task</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
