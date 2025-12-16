import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { BotCommand } from '@botify/shared/types/command';
import { prisma } from '@botify/database';
import { emitToGuild } from '../../../websocket/server';

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('delete_days')
                .setDescription('Days of messages to delete (0-7)')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    metadata: {
        category: 'moderation',
        description: 'Ban a user from the server',
        cooldown: 3,
        examples: [
            '/ban @user Spamming',
            '/ban @user delete_days:7 Raid participation',
        ],
        dashboardIcon: 'BanIcon',
        permissions: ['BanMembers'],
    },

    async execute(interaction) {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const deleteDays = interaction.options.getInteger('delete_days') || 0;

        try {
            await interaction.guild?.members.ban(user, {
                reason: `${reason} | Banned by ${interaction.user.tag}`,
                deleteMessageSeconds: deleteDays * 24 * 60 * 60,
            });

            // Log to database
            await prisma.auditLog.create({
                data: {
                    guildId: interaction.guildId!,
                    userId: interaction.user.id,
                    action: 'ban',
                    target: user.id,
                    details: JSON.stringify({ reason, deleteDays }),
                    source: 'discord',
                },
            });

            // Emit to dashboard
            emitToGuild(interaction.guildId!, 'bot:ban', {
                userId: user.id,
                userTag: user.tag,
                moderator: interaction.user.tag,
                reason,
                timestamp: Date.now(),
            });

            await interaction.reply({
                content: `✅ **${user.tag}** has been banned.\n**Reason:** ${reason}`,
                ephemeral: true,
            });
        } catch (error: any) {
            await interaction.reply({
                content: `❌ Failed to ban user: ${error.message}`,
                ephemeral: true,
            });
        }
    },

    async executeDashboard(guildId, options) {
        const { userId, reason = 'No reason provided', deleteDays = 0, moderatorId } = options;

        // Import bot client dynamically to avoid circular deps
        const { client } = await import('../../../index');
        const guild = await client.guilds.fetch(guildId);

        if (!guild) {
            throw new Error('Guild not found');
        }

        // Execute ban
        await guild.members.ban(userId, {
            reason: `${reason} | Banned from dashboard by ${moderatorId}`,
            deleteMessageSeconds: deleteDays * 24 * 60 * 60,
        });

        // Log to database
        await prisma.auditLog.create({
            data: {
                guildId,
                userId: moderatorId,
                action: 'ban',
                target: userId,
                details: JSON.stringify({ reason, deleteDays }),
                source: 'dashboard',
            },
        });

        // Emit to all dashboard clients
        emitToGuild(guildId, 'bot:ban', {
            userId,
            moderator: moderatorId,
            reason,
            timestamp: Date.now(),
        });

        return {
            success: true,
            userId,
            reason,
            timestamp: Date.now(),
        };
    },
} satisfies BotCommand;
