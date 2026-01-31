"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getIntegrations(workspaceId: string) {
    try {
        const integrations = await prisma.integration.findMany({
            where: { workspaceId }
        });
        return { success: true, integrations };
    } catch (error) {
        return { success: false, error: "Failed to fetch integrations" };
    }
}

export async function connectIntegration(workspaceId: string, type: string, config: any) {
    try {
        const integration = await prisma.integration.create({
            data: {
                workspaceId,
                type,
                config: typeof config === 'string' ? config : JSON.stringify(config),
            }
        });

        // Create a placeholder message to announce connection
        const systemChannel = await prisma.channel.findFirst({
            where: { workspaceId, name: 'general' }
        });

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { ownerId: true }
        });

        if (systemChannel && workspace) {
            await prisma.message.create({
                data: {
                    content: `[SYSTEM_NOTIFICATION] ${type} integration established. Neural bridges active.`,
                    channelId: systemChannel.id,
                    userId: workspace.ownerId,
                    type: 'external',
                    source: type,
                }
            });
        }

        revalidatePath("/dashboard/integrations");
        revalidatePath("/dashboard/chat");
        return { success: true, integration };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to connect integration" };
    }
}

export async function getUnifiedInbox(workspaceId: string) {
    try {
        // Fetch external messages from all channels in this workspace
        const messages = await prisma.message.findMany({
            where: {
                channelId: { in: (await prisma.channel.findMany({ where: { workspaceId }, select: { id: true } })).map((c: { id: string }) => c.id) },
                type: 'external'
            },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        return { success: true, messages };
    } catch (error) {
        return { success: false, messages: [] };
    }
}

export async function sendExternalMessage(channelId: string, content: string, source: string, userId: string) {
    try {
        // Log to database as external outgoing message
        const message = await prisma.message.create({
            data: {
                content,
                channelId,
                userId,
                type: 'external',
                source: source,
            }
        });
        console.log(`[EXTERNAL_OUTGOING] [${source}] ${content}`);
        return { success: true, message };
    } catch (error) {
        return { success: false, error: "Failed to transmit message" };
    }
}
