"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    let user = null;

    try {
        user = await currentUser();
    } catch (e) {
        // Clerk is disabled or keys are invalid
    }

    // Handle Demo Mode if no Clerk user is found
    if (!user) {
        // Find or create a demo user in the DB
        try {
            const demoUser = await prisma.user.upsert({
                where: { clerkId: 'demo_user_1' },
                update: {},
                create: {
                    clerkId: 'demo_user_1',
                    email: 'demo@uniwork.com',
                    name: 'Demo Explorer',
                    avatar: 'https://github.com/shadcn.png',
                },
            });
            return demoUser;
        } catch (e) {
            console.error("Database error in demo sync:", e);
            return null;
        }
    }

    try {
        const dbUser = await prisma.user.upsert({
            where: { clerkId: user.id },
            update: {
                email: user.emailAddresses[0].emailAddress,
                name: user.fullName || user.username || "Anonymous",
                avatar: user.imageUrl,
            },
            create: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: user.fullName || user.username || "Anonymous",
                avatar: user.imageUrl,
            },
        });

        return dbUser;
    } catch (error) {
        console.error("Error syncing user:", error);
        return null;
    }
}

export async function updateUserProfile(userId: string, data: { name?: string, avatar?: string, bio?: string }) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                avatar: data.avatar,
                bio: data.bio
            }
        });
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

