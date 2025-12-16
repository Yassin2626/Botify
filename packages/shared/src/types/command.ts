import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export interface CommandMetadata {
    category: string;
    description: string;
    cooldown?: number;
    examples?: string[];
    dashboardIcon?: string;
    permissions?: string[];
}

export interface BotCommand {
    data: SlashCommandBuilder;
    metadata: CommandMetadata;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    executeDashboard: (guildId: string, options: any) => Promise<any>;
}
