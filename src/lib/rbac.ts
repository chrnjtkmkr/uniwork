export type UserRole = "owner" | "admin" | "manager" | "member" | "viewer";

export interface PermissionSchema {
    [key: string]: UserRole[];
}

export const PERMISSIONS: PermissionSchema = {
    // Workspace Management
    "workspace:delete": ["owner"],
    "workspace:update": ["owner", "admin"],
    "workspace:invite": ["owner", "admin"],
    "workspace:manage_roles": ["owner", "admin"],

    // Integrations
    "integration:manage": ["owner", "admin"],

    // Tasks
    "task:create": ["owner", "admin", "manager", "member"],
    "task:assign": ["owner", "admin", "manager"],
    "task:delete": ["owner", "admin"],
    "task:status_all": ["owner", "admin", "manager"], // Managers can change any task status

    // Documents
    "doc:create": ["owner", "admin", "manager", "member"],
    "doc:delete": ["owner", "admin"],

    // Files
    "file:upload": ["owner", "admin", "manager", "member"],
    "file:delete": ["owner", "admin"],
    "file:connect_drive": ["owner", "admin"],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: string, action: keyof typeof PERMISSIONS): boolean {
    const allowedRoles = PERMISSIONS[action];
    if (!allowedRoles) return false;
    return allowedRoles.includes(role as UserRole);
}

/**
 * Compare two roles to see if one is higher or equal to another in hierarchy
 * Hierarchy: owner > admin > manager > member > viewer
 */
export function isRoleHigherOrEqual(role: string, targetRole: string): boolean {
    const hierarchy: UserRole[] = ["viewer", "member", "manager", "admin", "owner"];
    const roleIdx = hierarchy.indexOf(role as UserRole);
    const targetIdx = hierarchy.indexOf(targetRole as UserRole);

    if (roleIdx === -1 || targetIdx === -1) return false;
    return roleIdx >= targetIdx;
}
