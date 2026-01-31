import { create } from 'zustand';
import { updateTaskStatus, createTask, deleteTask as deleteTaskAction } from '@/actions/tasks';

// Task type defined in '@/types' but extended here if needed or just reused
import { Task } from "@/types";

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface TaskStore {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    addTask: (task: any) => Promise<void>;
    moveTask: (id: string, newStatus: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),

    addTask: async (taskData) => {
        const result = await createTask(taskData);
        if (result.success && result.task) {
            set((state) => ({ tasks: [result.task as unknown as Task, ...state.tasks] }));
        }
    },

    moveTask: async (id, newStatus) => {
        // Optimistic update
        const previousTasks = get().tasks;
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
        }));

        const result = await updateTaskStatus(id, newStatus);
        if (!result.success) {
            set({ tasks: previousTasks });
        }
    },

    deleteTask: async (id) => {
        const previousTasks = get().tasks;
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
        }));

        const result = await deleteTaskAction(id);
        if (!result.success) {
            set({ tasks: previousTasks });
        }
    },
}));
