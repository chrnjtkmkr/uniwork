"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getValidAccessToken } from "@/lib/oauth";
import { listGoogleDriveFiles } from "@/lib/storage/google";
import { listDropboxFiles } from "@/lib/storage/dropbox";

export async function getFiles(workspaceId: string, drive: string = "all") {
    try {
        const where: any = { workspaceId };
        if (drive !== "all") {
            where.source = drive;
        }

        const files = await prisma.file.findMany({
            where,
            include: { owner: true },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, files };
    } catch (error) {
        return { success: false, error: "Failed to fetch files" };
    }
}

/**
 * Synchronize external drive metadata into our DB
 */
export async function syncExternalFiles(userId: string, workspaceId: string, provider: string) {
    try {
        const token = await getValidAccessToken(userId, provider);
        if (!token) return { success: false, error: "No active neural link for this provider." };

        let externalFiles: any[] = [];
        if (provider === 'google') {
            const driveFiles = await listGoogleDriveFiles(token);
            externalFiles = driveFiles.map(f => ({
                name: f.name,
                size: Number(f.size || 0),
                type: f.mimeType,
                source: "google",
                externalFileId: f.id,
                previewUrl: f.thumbnailLink,
            }));
        } else if (provider === 'dropbox') {
            const dbxFiles = await listDropboxFiles(token);
            externalFiles = dbxFiles.map(f => ({
                name: f.name,
                size: f.size || 0,
                type: f[".tag"] === 'folder' ? 'application/vnd.google-apps.folder' : 'file', // normalize
                source: "dropbox",
                externalFileId: f.id,
            }));
        }

        // Upsert metadata
        for (const file of externalFiles) {
            await prisma.file.upsert({
                where: {
                    id: (await prisma.file.findFirst({
                        where: { workspaceId, externalFileId: file.externalFileId }
                    }))?.id || 'new'
                },
                create: {
                    ...file,
                    workspaceId,
                    ownerId: userId,
                },
                update: {
                    name: file.name,
                    size: file.size,
                    previewUrl: file.previewUrl,
                }
            });
        }

        revalidatePath("/dashboard/files");
        return { success: true };
    } catch (error) {
        console.error("Sync Error:", error);
        return { success: false, error: "Synchronization loop failed." };
    }
}

export async function createFile(data: {
    name: string;
    size: number;
    type: string;
    source?: string;
    workspaceId: string;
    ownerId: string;
    externalFileId?: string;
    previewUrl?: string;
}) {
    try {
        const file = await prisma.file.create({
            data: {
                name: data.name,
                size: data.size,
                type: data.type,
                source: data.source || "internal",
                workspaceId: data.workspaceId,
                ownerId: data.ownerId,
                externalFileId: data.externalFileId,
                previewUrl: data.previewUrl,
            },
        });
        revalidatePath("/dashboard/files");
        return { success: true, file };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to materialize file node." };
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
export async function getStorageUsage(workspaceId: string) {
    try {
        const result = await prisma.file.aggregate({
            where: { workspaceId },
            _sum: {
                size: true
            }
        });
        return { success: true, totalBytes: result._sum.size || 0 };
    } catch (error) {
        return { success: false, error: "Failed to calculate storage" };
    }
}
