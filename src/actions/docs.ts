"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDocs(workspaceId: string) {
    try {
        const docs = await prisma.document.findMany({
            where: { workspaceId },
            orderBy: { updatedAt: "desc" },
        });
        return { success: true, docs };
    } catch (error) {
        return { success: false, error: "Failed to fetch docs" };
    }
}

export async function updateDoc(docId: string, content: string) {
    try {
        const doc = await prisma.document.update({
            where: { id: docId },
            data: { content },
        });
        revalidatePath("/dashboard/docs");
        return { success: true, doc };
    } catch (error) {
        return { success: false, error: "Failed to update doc" };
    }
}

export async function createDoc(data: {
    title: string;
    folder?: string;
    workspaceId: string;
    authorId: string;
}) {
    try {
        const doc = await prisma.document.create({
            data: {
                title: data.title,
                folder: data.folder || "General",
                workspaceId: data.workspaceId,
                authorId: data.authorId,
                content: "# " + data.title + "\n\nStart writing...",
            },
        });
        revalidatePath("/dashboard/docs");
        return { success: true, doc };
    } catch (error) {
        return { success: false, error: "Failed to create doc" };
    }
}
