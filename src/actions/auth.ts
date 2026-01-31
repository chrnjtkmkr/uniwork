"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCurrentUser() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    return await prisma.user.findUnique({
        where: { supabaseId: user.id }
    });
}

export async function syncUser() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Handle Demo Mode if no Supabase user is found
    if (!user) {
        try {
            const demoUser = await prisma.user.upsert({
                where: { supabaseId: 'demo_user_1' },
                update: {},
                create: {
                    supabaseId: 'demo_user_1',
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
            where: { supabaseId: user.id },
            update: {
                email: user.email!,
                name: user.user_metadata.full_name || "Anonymous",
                avatar: user.user_metadata.avatar_url,
            },
            create: {
                supabaseId: user.id,
                email: user.email!,
                name: user.user_metadata.full_name || "Anonymous",
                avatar: user.user_metadata.avatar_url,
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
        revalidatePath("/dashboard/settings");
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

export async function signOut() {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    revalidatePath("/");
}
