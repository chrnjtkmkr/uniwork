"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMessages(channelId: string) {
    try {
        const messages = await prisma.message.findMany({
            where: { channelId },
            include: { user: true },
            orderBy: { createdAt: "asc" },
        });
        return { success: true, messages };
    } catch (error) {
        return { success: false, error: "Failed to fetch messages" };
    }
}

export async function sendMessage(data: {
    content: string;
    userId: string;
    channelId: string;
    type?: string;
}) {
    try {
        const message = await prisma.message.create({
            data: {
                content: data.content,
                userId: data.userId,
                channelId: data.channelId,
                type: data.type || "text",
            },
            include: { user: true },
        });
        revalidatePath("/dashboard/chat");
        return { success: true, message };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to send message" };
    }
}
