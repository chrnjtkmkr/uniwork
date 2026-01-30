"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function updateMemberRole(userId: string, data: { role?: string, position?: string, designation?: string, tags?: string }) {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                role: data.role,
                position: data.position,
                designation: data.designation,
                tags: data.tags
            }
        });
        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard");
        return { success: true, user };
    } catch (error) {
        return { success: false, error: "Failed to update member" };
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
        }
        revalidatePath("/dashboard");
        return { success: true };
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
        const user = await prisma.user.findUnique({
            where: { clerkId: 'demo_user_1' }
        });
        return user;
    } catch (error) {
        return null;
    }
}
