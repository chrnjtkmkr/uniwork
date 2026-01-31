import { z } from "zod";

const envSchema = z.object({
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // Database
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),

    // Integrations
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URI: z.string().url(),

    DROPBOX_APP_KEY: z.string().min(1),
    DROPBOX_APP_SECRET: z.string().min(1),
    DROPBOX_REDIRECT_URI: z.string().url(),

    ONEDRIVE_CLIENT_ID: z.string().min(1),
    ONEDRIVE_CLIENT_SECRET: z.string().min(1),
    ONEDRIVE_REDIRECT_URI: z.string().url(),

    // Email
    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_EMAIL: z.string().email(),

    // App
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
