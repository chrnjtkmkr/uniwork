export interface User {
    id: string;
    supabaseId: string;
    email: string;
    name: string | null;
    avatar: string | null;
    bio: string | null;
    role: string;
    position: string | null;
    designation: string | null;
    tags: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Workspace {
    id: string;
    name: string;
    type: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Channel {
    id: string;
    name: string;
    description: string | null;
    workspaceId: string;
    createdAt: Date;
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    category: string;
    status: string;
    priority: string;
    dueDate: Date | null;
    completedAt: Date | null;
    tags: string | null;
    workspaceId: string;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Document {
    id: string;
    title: string;
    content: string | null;
    folder: string | null;
    workspaceId: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface File {
    id: string;
    name: string;
    size: number;
    type: string;
    drive: string;
    workspaceId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Message {
    id: string;
    content: string;
    userId: string;
    channelId: string;
    type: string;
    createdAt: Date;
    user?: User;
}
