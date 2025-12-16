import { z } from 'zod';
import { snowflakeSchema } from '../utils/snowflake';

/**
 * Ban command schema
 */
export const banCommandSchema = z.object({
    userId: snowflakeSchema,
    reason: z.string().max(512).optional(),
    deleteMessageDays: z.number().int().min(0).max(7).default(0),
});

/**
 * Kick command schema
 */
export const kickCommandSchema = z.object({
    userId: snowflakeSchema,
    reason: z.string().max(512).optional(),
});

/**
 * Timeout command schema
 */
export const timeoutCommandSchema = z.object({
    userId: snowflakeSchema,
    duration: z.number().int().min(60).max(2419200), // 1 min to 28 days in seconds
    reason: z.string().max(512).optional(),
});

/**
 * Guild config update schema
 */
export const guildConfigSchema = z.object({
    prefix: z.string().min(1).max(5).optional(),
    language: z.enum(['en', 'es', 'fr', 'de', 'ja']).optional(),
    timezone: z.string().optional(),
});

export type BanCommand = z.infer<typeof banCommandSchema>;
export type KickCommand = z.infer<typeof kickCommandSchema>;
export type TimeoutCommand = z.infer<typeof timeoutCommandSchema>;
export type GuildConfig = z.infer<typeof guildConfigSchema>;
