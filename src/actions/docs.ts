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

export async function updateDoc(docId: string, data: { title?: string, content?: string }) {
    try {
        const doc = await prisma.document.update({
            where: { id: docId },
            data: {
                title: data.title,
                content: data.content,
            },
        });

        if (data.content !== undefined) {
            await prisma.history.create({
                data: {
                    documentId: docId,
                    content: data.content,
                }
            });
        }

        revalidatePath("/dashboard/docs");
        return { success: true, doc };
    } catch (error) {
        return { success: false, error: "Failed to update doc" };
    }
}

export async function deleteDoc(docId: string) {
    try {
        await prisma.document.delete({
            where: { id: docId }
        });
        revalidatePath("/dashboard/docs");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete doc" };
    }
}

export async function getDocumentHistory(documentId: string) {
    try {
        const history = await prisma.history.findMany({
            where: { documentId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        return { success: true, history };
    } catch (error) {
        return { success: false, error: "Failed to fetch history" };
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
