export interface DropboxFile {
    ".tag": string;
    name: string;
    path_display: string;
    id: string;
    client_modified: string;
    size?: number;
}

/**
 * List files from Dropbox
 */
export async function listDropboxFiles(accessToken: string, path: string = "") {
    try {
        const url = "https://api.dropboxapi.com/2/files/list_folder";

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path,
                recursive: false,
                include_media_info: true,
                include_deleted: false,
                include_has_explicit_shared_members: false,
                include_mounted_folders: true
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error_summary || "Failed to list Dropbox files");

        return data.entries as DropboxFile[];
    } catch (error) {
        console.error("Dropbox API Error:", error);
        return [];
    }
}

/**
 * Get download link for a Dropbox file
 */
export async function getDropboxDownloadLink(accessToken: string, path: string) {
    try {
        const url = "https://api.dropboxapi.com/2/files/get_temporary_link";
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path })
        });
        const data = await response.json();
        return data.link as string;
    } catch (error) {
        return null;
    }
}
