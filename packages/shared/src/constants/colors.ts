/**
 * Enterprise color palette - professional dark theme only
 * No rainbow/pink themes allowed
 */
export const COLORS = {
    // Backgrounds
    BACKGROUND: '#0F172A',      // Near-black
    SURFACE: '#1E293B',          // Slate

    // Primary
    PRIMARY: '#0369A1',          // Blue
    PRIMARY_HOVER: '#0284C7',    // Lighter blue

    // Text
    TEXT: '#F8FAFC',             // Off-white
    MUTED: '#64748B',            // Muted gray

    // Status
    SUCCESS: '#16A34A',          // Green
    DANGER: '#DC2626',           // Red
    WARNING: '#F59E0B',          // Amber
    INFO: '#0369A1',             // Blue

    // UI Elements
    BORDER: '#334155',           // Slate-700
    FOCUS: '#0369A1',            // Primary blue
    DISABLED: '#475569',         // Slate-600
} as const;

export type ColorName = keyof typeof COLORS;
