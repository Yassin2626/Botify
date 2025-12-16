/**
 * Permission tiers for bot and dashboard access control
 * Hierarchy: Owner > Admin > Mod > Member
 */
export enum PermissionTier {
    OWNER = 'owner',
    ADMIN = 'admin',
    MOD = 'mod',
    MEMBER = 'member',
}

/**
 * Module access requirements by permission tier
 */
export const MODULE_ACCESS = {
    // Owner only
    'core-settings': [PermissionTier.OWNER],
    'custom-commands': [PermissionTier.OWNER],

    // Owner + Admin
    'overview': [PermissionTier.OWNER, PermissionTier.ADMIN],
    'automod': [PermissionTier.OWNER, PermissionTier.ADMIN],
    'logging': [PermissionTier.OWNER, PermissionTier.ADMIN],
    'reaction-roles': [PermissionTier.OWNER, PermissionTier.ADMIN],
    'welcome': [PermissionTier.OWNER, PermissionTier.ADMIN],
    'leveling': [PermissionTier.OWNER, PermissionTier.ADMIN],
    'music': [PermissionTier.OWNER, PermissionTier.ADMIN],
    'autoresponder': [PermissionTier.OWNER, PermissionTier.ADMIN],
    'birthdays': [PermissionTier.OWNER, PermissionTier.ADMIN],
    'starboard': [PermissionTier.OWNER, PermissionTier.ADMIN],
    'counting': [PermissionTier.OWNER, PermissionTier.ADMIN],
    'fun': [PermissionTier.OWNER, PermissionTier.ADMIN],

    // Owner + Admin + Mod
    'moderation': [PermissionTier.OWNER, PermissionTier.ADMIN, PermissionTier.MOD],
    'tickets': [PermissionTier.OWNER, PermissionTier.ADMIN, PermissionTier.MOD],
    'giveaways': [PermissionTier.OWNER, PermissionTier.ADMIN, PermissionTier.MOD],
    'suggestions': [PermissionTier.OWNER, PermissionTier.ADMIN, PermissionTier.MOD],

    // All tiers (read-only for members)
    'leaderboard': [PermissionTier.OWNER, PermissionTier.ADMIN, PermissionTier.MOD, PermissionTier.MEMBER],
    'shop': [PermissionTier.OWNER, PermissionTier.ADMIN, PermissionTier.MOD, PermissionTier.MEMBER],
} as const;

export type ModuleName = keyof typeof MODULE_ACCESS;

/**
 * Check if a user has access to a module
 */
export function hasModuleAccess(userTier: PermissionTier, module: ModuleName): boolean {
    const allowedTiers = MODULE_ACCESS[module];
    return allowedTiers.includes(userTier);
}

/**
 * Get all accessible modules for a permission tier
 */
export function getAccessibleModules(userTier: PermissionTier): ModuleName[] {
    return (Object.keys(MODULE_ACCESS) as ModuleName[]).filter(module =>
        hasModuleAccess(userTier, module)
    );
}
