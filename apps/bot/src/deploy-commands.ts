import { REST, Routes } from 'discord.js';
import { prisma } from '@botify/database';

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
];

async function deploy() {
    // 1. Get Token
    let token = process.env.DISCORD_TOKEN;
    if (!token) {
        const config = await prisma.systemConfig.findUnique({
            where: { key: 'bot_token' }
        });
        token = config?.value;
    }

    if (!token) {
        console.error('No token found. Cannot deploy commands.');
        process.exit(1);
    }

    // 2. Extract Client ID
    // Token structure: ID.Secret.Sig (base64)
    const clientId = Buffer.from(token.split('.')[0], 'base64').toString('utf-8');

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

deploy();
