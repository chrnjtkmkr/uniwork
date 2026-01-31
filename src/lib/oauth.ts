import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export interface OAuthCredentials {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

export const OAUTH_CONFIG: Record<string, OAuthCredentials> = {
    google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        redirectUri: env.GOOGLE_REDIRECT_URI,
    },
    dropbox: {
        clientId: env.DROPBOX_APP_KEY,
        clientSecret: env.DROPBOX_APP_SECRET,
        redirectUri: env.DROPBOX_REDIRECT_URI,
    },
    onedrive: {
        clientId: env.ONEDRIVE_CLIENT_ID,
        clientSecret: env.ONEDRIVE_CLIENT_SECRET,
        redirectUri: env.ONEDRIVE_REDIRECT_URI,
    }
};

/**
 * Save or update an external account with new tokens
 */
export async function saveExternalAccount(data: {
    userId: string;
    provider: string;
    providerId: string;
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}) {
    const expiresAt = data.expiresIn ? new Date(Date.now() + data.expiresIn * 1000) : null;

    return await prisma.externalAccount.upsert({
        where: {
            // We'll need a unique constraint on (userId, provider) or similar
            // For now, we'll try to find by providerId + provider
            id: (await prisma.externalAccount.findFirst({
                where: { userId: data.userId, provider: data.provider }
            }))?.id || 'new',
        },
        create: {
            userId: data.userId,
            provider: data.provider,
            providerId: data.providerId,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt,
        },
        update: {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt,
        }
    });
}

/**
 * Retrieve a valid access token, refreshing if necessary
 */
export async function getValidAccessToken(userId: string, provider: string) {
    const account = await prisma.externalAccount.findFirst({
        where: { userId, provider }
    });

    if (!account) return null;

    // Check if expired (with 30s buffer)
    if (account.expiresAt && account.expiresAt.getTime() < Date.now() + 30000) {
        if (!account.refreshToken) return null;

        // Perform refresh based on provider
        const newTokens = await refreshProviderToken(provider, account.refreshToken);
        if (newTokens) {
            await saveExternalAccount({
                userId,
                provider,
                providerId: account.providerId,
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken || account.refreshToken,
                expiresIn: newTokens.expiresIn,
            });
            return newTokens.accessToken;
        }
    }

    return account.accessToken;
}

/**
 * Provider-specific refresh logic
 */
async function refreshProviderToken(provider: string, refreshToken: string) {
    const config = OAUTH_CONFIG[provider];
    if (!config) return null;

    try {
        let url = "";
        let body = new URLSearchParams();

        if (provider === 'google') {
            url = "https://oauth2.googleapis.com/token";
            body.append("client_id", config.clientId);
            body.append("client_secret", config.clientSecret);
            body.append("refresh_token", refreshToken);
            body.append("grant_type", "refresh_token");
        } else if (provider === 'dropbox') {
            url = "https://api.dropbox.com/oauth2/token";
            body.append("client_id", config.clientId);
            body.append("client_secret", config.clientSecret);
            body.append("refresh_token", refreshToken);
            body.append("grant_type", "refresh_token");
        } else if (provider === 'onedrive') {
            url = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
            body.append("client_id", config.clientId);
            body.append("client_secret", config.clientSecret);
            body.append("refresh_token", refreshToken);
            body.append("grant_type", "refresh_token");
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error_description || data.error);

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token, // Some providers return a new refresh token
            expiresIn: data.expires_in
        };
    } catch (error) {
        console.error(`Error refreshing ${provider} token:`, error);
        return null;
    }
}
