import { z } from 'zod';

/**
 * Discord Snowflake ID validation
 * Snowflakes are 64-bit unsigned integers represented as strings
 */
export const snowflakeSchema = z.string().regex(/^\d{17,19}$/, 'Invalid Discord ID');

/**
 * Validation schemas for common Discord entities
 */
export const discordSchemas = {
    userId: snowflakeSchema,
    guildId: snowflakeSchema,
    channelId: snowflakeSchema,
    roleId: snowflakeSchema,
    messageId: snowflakeSchema,
};

/**
 * Validate a Discord snowflake ID
 */
export function isValidSnowflake(id: string): boolean {
    return snowflakeSchema.safeParse(id).success;
}
