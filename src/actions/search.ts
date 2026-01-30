"use server";

import { prisma } from "@/lib/prisma";

export async function globalSearch(workspaceId: string, query: string) {
    if (!query || query.length < 2) return { success: true, results: [] };

    try {
        const [tasks, docs, files] = await Promise.all([
            prisma.task.findMany({
                where: {
                    workspaceId,
                    OR: [
                        { title: { contains: query } },
                        { description: { contains: query } }
                    ]
                },
                take: 5
            }),
            prisma.document.findMany({
                where: {
                    workspaceId,
                    OR: [
                        { title: { contains: query } },
                        { content: { contains: query } }
                    ]
                },
                take: 5
            }),
            prisma.file.findMany({
                where: {
                    workspaceId,
                    name: { contains: query }
                },
                take: 5
            })
        ]);

        const results = [
            ...tasks.map(t => ({ ...t, category: 'Task', href: '/dashboard/tasks' })),
            ...docs.map(d => ({ ...d, category: 'Doc', href: '/dashboard/docs', name: d.title })),
            ...files.map(f => ({ ...f, category: 'File', href: '/dashboard/files' }))
        ];

        return { success: true, results };
    } catch (error) {
        console.error("Search error:", error);
        return { success: false, error: "Search failed" };
    }
}
