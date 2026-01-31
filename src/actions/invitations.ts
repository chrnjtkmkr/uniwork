"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { hasPermission } from "@/lib/rbac";
import { Resend } from "resend";
import { createAuditLog } from "@/lib/audit";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

/**
 * Create a new workspace invitation
 */
export async function createInvitation(data: {
    workspaceId: string;
    email: string;
    role: string;
    invitedById: string;
}) {
    try {
        // 1. RBAC check (invitedBy must have 'workspace:invite' permission)
        const inviter = await prisma.user.findUnique({
            where: { id: data.invitedById },
            include: { memberOf: { where: { id: data.workspaceId } } }
        });

        if (!inviter || !hasPermission(inviter.role, "workspace:invite")) {
            return { success: false, error: "Insufficient permissions to invite members." };
        }

        // 2. Check if user is already a member
        const existingMember = await prisma.workspace.findFirst({
            where: {
                id: data.workspaceId,
                members: { some: { email: data.email } }
            }
        });

        if (existingMember) {
            return { success: false, error: "User is already a member of this workspace." };
        }

        // 3. Generate secure token and expiry (7 days)
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // 4. Create invitation record
        const invitation = await prisma.invitation.create({
            data: {
                workspaceId: data.workspaceId,
                email: data.email,
                role: data.role,
                token,
                invitedById: data.invitedById,
                expiresAt,
            }
        });

        // 5. Send email via Resend
        try {
            await resend.emails.send({
                from: env.RESEND_FROM_EMAIL,
                to: data.email,
                subject: `Invitation to join ${inviter.memberOf[0]?.name || "UniWork Workspace"}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #0f172a; color: white; border-radius: 12px;">
                        <h1 style="color: #3b82f6;">UniWork Neural Link</h1>
                        <p>You have been invited to join <strong>${inviter.memberOf[0]?.name || "a workspace"}</strong> as a <strong>${data.role}</strong>.</p>
                        <div style="margin: 30px 0;">
                            <a href="${env.NEXT_PUBLIC_APP_URL}/invite/${token}" 
                               style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                               Accept Invitation
                            </a>
                        </div>
                        <p style="color: #94a3b8; font-size: 12px;">This link expires in 7 days.</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Failed to send invitation email:", emailError);
            // We proceed anyway as the record is created, but log it
        }

        // 6. Create Audit Log
        await createAuditLog({
            action: "INVITE_SENT",
            userId: data.invitedById,
            workspaceId: data.workspaceId,
            details: { invitedEmail: data.email, role: data.role }
        });

        revalidatePath("/dashboard/team");
        return { success: true, invitation };
    } catch (error) {
        console.error("Error creating invitation:", error);
        return { success: false, error: "Failed to generate invitation signal." };
    }
}

/**
 * Accept an invitation
 */
export async function acceptInvitation(token: string, userId: string) {
    try {
        const invitation = await prisma.invitation.findUnique({
            where: { token },
            include: { workspace: true }
        });

        if (!invitation || invitation.status !== 'pending') {
            return { success: false, error: "Invalid or expired invitation loop." };
        }

        if (new Date() > invitation.expiresAt) {
            await prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: 'expired' }
            });
            return { success: false, error: "Invitation frequency has decayed." };
        }

        // Add user to workspace
        await prisma.workspace.update({
            where: { id: invitation.workspaceId },
            data: {
                members: { connect: { id: userId } }
            }
        });

        // Update invitation status
        await prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: 'accepted' }
        });

        // Create Audit Log
        await createAuditLog({
            action: "INVITE_ACCEPTED",
            userId,
            workspaceId: invitation.workspaceId,
            details: { invitationId: invitation.id }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/team");

        return { success: true, workspaceId: invitation.workspaceId };
    } catch (error) {
        console.error("Error accepting invitation:", error);
        return { success: false, error: "Failed to synchronize with workspace." };
    }
}

/**
 * Get invitations for a workspace
 */
export async function getWorkspaceInvitations(workspaceId: string) {
    try {
        return await prisma.invitation.findMany({
            where: { workspaceId, status: 'pending' },
            include: { invitedBy: true }
        });
    } catch (error) {
        return [];
    }
}
