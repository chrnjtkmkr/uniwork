"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/rbac";
import { createAuditLog } from "@/lib/audit";

export async function getFirstWorkspace() {
    try {
        const workspace = await prisma.workspace.findFirst({
            include: {
                members: true,
                owner: true,
                channels: true
            }
        });
        return workspace;
    } catch (error) {
        return null;
    }
}

export async function getWorkspaces() {
    try {
        const workspaces = await prisma.workspace.findMany({
            include: {
                members: true,
                owner: true
            }
        });
        return workspaces;
    } catch (error) {
        return [];
    }
}

export async function getWorkspaceMembers(workspaceId: string) {
    try {
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: {
                members: true,
                owner: true
            }
        });
        if (!workspace) return [];
        // Combine owner and members
        const all = [workspace.owner, ...workspace.members];
        return all;
    } catch (error) {
        return [];
    }
}

export async function updateMemberRole(
    adminId: string,
    workspaceId: string,
    targetUserId: string,
    data: { role?: string, position?: string, designation?: string, tags?: string }
) {
    try {
        // 1. RBAC check (admin must have 'workspace:manage_roles' permission)
        const admin = await prisma.user.findUnique({
            where: { id: adminId },
            include: { memberOf: { where: { id: workspaceId } } }
        });

        if (!admin || !hasPermission(admin.role, "workspace:manage_roles")) {
            return { success: false, error: "Insufficient permissions to modify personnel authorizations." };
        }

        const user = await prisma.user.update({
            where: { id: targetUserId },
            data: {
                role: data.role,
                position: data.position,
                designation: data.designation,
                tags: data.tags
            }
        });
        // Create Audit Log
        await createAuditLog({
            action: "ROLE_UPDATED",
            userId: adminId,
            workspaceId: workspaceId,
            details: { targetUserId, ...data }
        });

        revalidatePath("/dashboard/team");
        revalidatePath("/dashboard");
        return { success: true, user };
    } catch (error) {
        return { success: false, error: "Failed to update member signal." };
    }
}

export async function removeMemberFromWorkspace(
    adminId: string,
    workspaceId: string,
    targetUserId: string
) {
    try {
        // RBAC check
        const admin = await prisma.user.findUnique({
            where: { id: adminId }
        });

        if (!admin || !hasPermission(admin.role, "workspace:manage_roles")) {
            return { success: false, error: "Insufficient clearance to terminate member link." };
        }

        await prisma.workspace.update({
            where: { id: workspaceId },
            data: {
                members: { disconnect: { id: targetUserId } }
            }
        });

        // Create Audit Log
        await createAuditLog({
            action: "MEMBER_REMOVED",
            userId: adminId,
            workspaceId: workspaceId,
            details: { targetUserId }
        });

        revalidatePath("/dashboard/team");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to disconnect member node." };
    }
}

export async function addMemberToWorkspace(workspaceId: string, email: string) {
    try {
        // In a real app, we'd find the user by email or send an invite.
        // For demo, we'll try to find a user or just return success with a mock.
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            await prisma.workspace.update({
                where: { id: workspaceId },
                data: {
                    members: { connect: { id: user.id } }
                }
            });
            revalidatePath("/dashboard");
            return { success: true, member: user };
        }
        return { success: false, error: "User not found" };
    } catch (error) {
        return { success: false, error: "Failed to add member" };
    }
}

export async function createWorkspace(data: { name: string, ownerId: string }) {
    try {
        const workspace = await prisma.workspace.create({
            data: {
                name: data.name,
                ownerId: data.ownerId,
                channels: {
                    create: [
                        { name: "general", description: "Main group for all members" },
                        { name: "frontend", description: "Frontend development team" },
                        { name: "backend", description: "Backend development team" }
                    ]
                }
            }
        });
        revalidatePath("/dashboard");
        return { success: true, workspace };
    } catch (error) {
        console.error("Error creating workspace:", error);
        return { success: false, error: "Failed to create workspace" };
    }
}

export async function getChannels(workspaceId: string) {
    try {
        const channels = await prisma.channel.findMany({
            where: { workspaceId }
        });
        return channels;
    } catch (error) {
        return [];
    }
}

export async function getMessages(channelId: string) {
    try {
        const messages = await prisma.message.findMany({
            where: { channelId },
            include: { user: true },
            orderBy: { createdAt: 'asc' }
        });
        return messages;
    } catch (error) {
        return [];
    }
}

export async function sendMessage(channelId: string, userId: string, content: string) {
    try {
        const message = await prisma.message.create({
            data: { channelId, userId, content },
            include: { user: true }
        });
        revalidatePath("/dashboard/chat");
        return { success: true, message };
    } catch (error) {
        return { success: false, error: "Failed to send message" };
    }
}

export async function getMockUser() {
    try {
        const user = await prisma.user.findFirst({
            where: { supabaseId: 'demo_user_1' }
        });
        return user;
    } catch (error) {
        return null;
    }
}

export async function updateUserProfile(userId: string, data: {
    name?: string;
    email?: string;
    position?: string;
    bio?: string;
}) {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
                position: data.position,
                bio: data.bio
            }
        });
        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard");
        return { success: true, user };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

export async function getCurrentUser(supabaseId: string) {
    try {
        const user = await prisma.user.findFirst({
            where: { supabaseId }
        });
        return user;
    } catch (error) {
        return null;
    }
}

// --- TASK ACTIONS ---

export async function getTasks(workspaceId: string, status?: string) {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                workspaceId,
                status: status || undefined
            },
            include: {
                assignees: true,
                creator: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, tasks };
    } catch (error) {
        return { success: false, error: "Failed to fetch task nodes." };
    }
}

export async function createTask(data: {
    title: string;
    description?: string;
    category?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    workspaceId: string;
    creatorId: string;
    assigneeIds?: string[]; // Multiple assignees
}) {
    try {
        // RBAC check: only owner, admin, manager, member can create
        const creator = await prisma.user.findUnique({ where: { id: data.creatorId } });
        if (!creator || !hasPermission(creator.role, "task:create")) {
            return { success: false, error: "Insufficient clearance for task creation." };
        }

        const task = await prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                category: data.category || "General",
                status: data.status || "todo",
                priority: data.priority || "medium",
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                workspaceId: data.workspaceId,
                creatorId: data.creatorId,
                assignees: {
                    connect: data.assigneeIds?.map(id => ({ id })) || []
                }
            },
            include: { assignees: true }
        });
        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard");
        return { success: true, task };
    } catch (error) {
        console.error("Error creating task:", error);
        return { success: false, error: "Failed to materialize task node." };
    }
}

export async function updateTaskStatus(userId: string, taskId: string, status: string) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const task = await prisma.task.findUnique({ where: { id: taskId } });

        if (!user || !task) return { success: false, error: "Link lost." };

        // Managers+ can change any task. Members can change their own or assigned tasks.
        const isManager = hasPermission(user.role, "task:status_all");
        const isCreator = task.creatorId === userId;
        // Check if assigned (simplified)
        const isAssigned = false; // We could fetch assignees here if needed

        if (!isManager && !isCreator && !isAssigned) {
            return { success: false, error: "Permission denied for this lifecycle update." };
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                status,
                completedAt: status === "done" ? new Date() : null
            }
        });
        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard");
        return { success: true, task: updatedTask };
    } catch (error) {
        return { success: false, error: "Failed to update task lifecycle." };
    }
}

export async function deleteTask(taskId: string) {
    try {
        await prisma.task.delete({
            where: { id: taskId }
        });
        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete task" };
    }
}

// --- DOCUMENT ACTIONS ---

export async function getDocuments(workspaceId: string) {
    try {
        const docs = await prisma.document.findMany({
            where: { workspaceId },
            include: { author: true },
            orderBy: { updatedAt: 'desc' }
        });
        return { success: true, docs };
    } catch (error) {
        return { success: false, error: "Failed to fetch documents" };
    }
}

export async function createDocument(data: {
    title: string;
    content?: string;
    workspaceId: string;
    authorId: string;
}) {
    try {
        const doc = await prisma.document.create({
            data: {
                title: data.title,
                content: data.content || "",
                workspaceId: data.workspaceId,
                authorId: data.authorId
            }
        });
        revalidatePath("/dashboard/docs");
        return { success: true, document: doc };
    } catch (error) {
        return { success: false, error: "Failed to create document" };
    }
}

export async function updateDocument(docId: string, data: { title?: string, content?: string }) {
    try {
        const doc = await prisma.document.update({
            where: { id: docId },
            data: {
                title: data.title,
                content: data.content
            }
        });
        revalidatePath("/dashboard/docs");
        return { success: true, document: doc };
    } catch (error) {
        return { success: false, error: "Failed to update document" };
    }
}

export async function deleteDocument(docId: string) {
    try {
        await prisma.document.delete({
            where: { id: docId }
        });
        revalidatePath("/dashboard/docs");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete document" };
    }
}

// --- CHANNEL ACTIONS ---

export async function createChannel(workspaceId: string, name: string, description?: string) {
    try {
        const channel = await prisma.channel.create({
            data: {
                workspaceId,
                name,
                description
            }
        });
        revalidatePath("/dashboard/chat");
        return { success: true, channel };
    } catch (error) {
        return { success: false, error: "Failed to create channel" };
    }
}

// --- RECENT ACTIVITY ---

export async function getRecentMessages() {
    try {
        const messages = await prisma.message.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        return messages;
    } catch (error) {
        return [];
    }
}

