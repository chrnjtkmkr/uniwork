"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTasks(workspaceId: string) {
    try {
        const tasks = await prisma.task.findMany({
            where: { workspaceId },
            include: {
                assignees: true,
                creator: true
            },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, tasks };
    } catch (error) {
        return { success: false, error: "Failed to fetch tasks" };
    }
}

export async function createTask(data: {
    title: string;
    description?: string;
    category?: string;
    status: string;
    priority: string;
    dueDate?: Date | string;
    workspaceId: string;
    creatorId: string;
    assigneeId?: string;
}) {
    try {
        const task = await prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                category: data.category || "General",
                status: data.status,
                priority: data.priority,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                workspaceId: data.workspaceId,
                creatorId: data.creatorId,
                assignees: data.assigneeId ? {
                    connect: { id: data.assigneeId }
                } : undefined
            },
            include: {
                assignees: true
            }
        });
        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard");
        return { success: true, task };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create task" };
    }
}

export async function updateTaskStatus(taskId: string, status: string) {
    try {
        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                status,
                completedAt: status === "done" ? new Date() : null
            },
        });
        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard");
        return { success: true, task };
    } catch (error) {
        return { success: false, error: "Failed to update task" };
    }
}

export async function deleteTask(taskId: string) {
    try {
        await prisma.task.delete({
            where: { id: taskId },
        });
        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete task" };
    }
}
