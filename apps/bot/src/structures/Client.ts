import { Client, Collection, GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
import { prisma } from '@botify/database';

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
];

export class BotClient extends Client {
    // public commands: Collection<string, any>; // TODO: Type this properly when we have command structure

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction],
        });

        // this.commands = new Collection();
    }

    async start() {
        this.on('ready', async () => {
            console.log(`Logged in as ${this.user?.tag}!`);
            await this.registerCommands();
        });

        this.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === 'ping') {
                await interaction.reply('Pong!');
            }
        });

        await this.loginWithRetry();
    }

    private async registerCommands() {
        if (!this.user) return;
        const rest = new REST({ version: '10' }).setToken(this.token!);

        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands(this.user.id),
                { body: commands },
            );
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error('Failed to reload application (/) commands:', error);
        }
    }

    private async loginWithRetry() {
        const token = await this.getToken();

        if (!token) {
            console.log('No token found. Waiting for setup in Dashboard...');
            setTimeout(() => this.loginWithRetry(), 5000); // Retry every 5 seconds
            return;
        }

        try {
            await this.login(token);
        } catch (error) {
            console.error('Failed to login:', error);
            // If login fails (e.g. invalid token), retry logic might be dangerous if it spams API. 
            // But if it's just "start setup again", maybe wait longer.
            setTimeout(() => this.loginWithRetry(), 10000);
        }
    }

    private async getToken(): Promise<string | null> {
        // 1. Check Env
        if (process.env.DISCORD_TOKEN) return process.env.DISCORD_TOKEN;

        // 2. Check Database
        try {
            // We need to ensure connection is ready, but prisma client handles lazy connect
            const config = await prisma.systemConfig.findUnique({
                where: { key: 'bot_token' }
            });
            return config?.value || null;
        } catch (error) {
            console.error('Error fetching token from DB:', error);
            return null;
        }
    }
}
