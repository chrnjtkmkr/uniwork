export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    size?: number;
    thumbnailLink?: string;
    webContentLink?: string;
    modifiedTime: string;
}

/**
 * List files from Google Drive
 */
export async function listGoogleDriveFiles(accessToken: string, folderId: string = 'root') {
    try {
        const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id,name,mimeType,size,thumbnailLink,webContentLink,modifiedTime)`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Failed to list Google Drive files");

        return data.files as DriveFile[];
    } catch (error) {
        console.error("Google Drive API Error:", error);
        return [];
    }
}

/**
 * Search files in Google Drive
 */
export async function searchGoogleDriveFiles(accessToken: string, query: string) {
    try {
        const url = `https://www.googleapis.com/drive/v3/files?q=name+contains+'${query}'+and+trashed=false&fields=files(id,name,mimeType,size,thumbnailLink,webContentLink,modifiedTime)`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const data = await response.json();
        return data.files as DriveFile[];
    } catch (error) {
        return [];
    }
}

/**
 * Download file content (or get download URL)
 */
export async function getGoogleDriveDownloadUrl(accessToken: string, fileId: string) {
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
}
