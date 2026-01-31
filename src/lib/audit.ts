import { prisma } from "@/lib/prisma";

export type AuditAction =
    | "INVITE_SENT"
    | "INVITE_ACCEPTED"
    | "MEMBER_REMOVED"
    | "ROLE_UPDATED"
    | "FILE_UPLOADED"
    | "FILE_DELETED"
    | "TASK_CREATED"
    | "LOGIN_SUCCESS";

export async function createAuditLog(data: {
    action: AuditAction;
    userId?: string;
    workspaceId?: string;
    details?: any;
    ipAddress?: string;
}) {
    try {
        return await prisma.auditLog.create({
            data: {
                action: data.action,
                userId: data.userId,
                workspaceId: data.workspaceId,
                details: data.details ? JSON.stringify(data.details) : null,
                ipAddress: data.ipAddress,
            },
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
        // We don't want to throw error and break the main flow if audit logging fails,
        // but in some high-security environments, you might want it to.
    }
}
