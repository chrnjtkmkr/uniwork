"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFiles(workspaceId: string) {
    try {
        const files = await prisma.file.findMany({
            where: { workspaceId },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, files };
    } catch (error) {
        return { success: false, error: "Failed to fetch files" };
    }
}

export async function createFile(data: {
    name: string;
    size: number;
    type: string;
    drive: string;
    workspaceId: string;
}) {
    try {
        const file = await prisma.file.create({
            data: {
                name: data.name,
                size: data.size,
                type: data.type,
                drive: data.drive,
                workspaceId: data.workspaceId,
            },
        });
        revalidatePath("/dashboard/files");
        return { success: true, file };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create file" };
    }
}

export async function deleteFile(fileId: string) {
    try {
        await prisma.file.delete({
            where: { id: fileId },
        });
        revalidatePath("/dashboard/files");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete file" };
    }
}
