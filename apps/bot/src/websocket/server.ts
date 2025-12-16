import { Server } from 'socket.io';
import { createServer } from 'http';
import type { BotClient } from '../structures/Client';

let io: Server | null = null;

export function initializeSocketIO(port: number, botClient: BotClient) {
    const httpServer = createServer();

    io = new Server(httpServer, {
        cors: {
            origin: process.env.DASHBOARD_URL || 'http://localhost:3000',
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`[Socket.IO] Client connected: ${socket.id}`);

        // Join guild-specific rooms
        socket.on('join:guild', (guildId: string) => {
            socket.join(`guild:${guildId}`);
            console.log(`[Socket.IO] Socket ${socket.id} joined guild:${guildId}`);
        });

        // Handle dashboard commands
        socket.on('dashboard:command', async (data) => {
            const { commandName, guildId, options, userId } = data;

            try {
                // Get command from bot's command collection
                const command = botClient.commands.get(commandName);

                if (!command) {
                    socket.emit('command:error', { error: 'Command not found' });
                    return;
                }

                // Execute dashboard version of command
                const result = await command.executeDashboard(guildId, options);

                // Emit success back to dashboard
                socket.emit('command:success', { commandName, result });

                // Broadcast to all clients in guild room
                io?.to(`guild:${guildId}`).emit('bot:update', {
                    type: commandName,
                    data: result,
                    timestamp: Date.now(),
                });
            } catch (error: any) {
                console.error(`[Socket.IO] Command error:`, error);
                socket.emit('command:error', {
                    commandName,
                    error: error.message
                });
            }
        });

        socket.on('disconnect', () => {
            console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
        });
    });

    httpServer.listen(port, () => {
        console.log(`[Socket.IO] Server listening on port ${port}`);
    });

    return io;
}

export function getSocketIO(): Server | null {
    return io;
}

// Emit event to all clients in a guild
export function emitToGuild(guildId: string, event: string, data: any) {
    if (io) {
        io.to(`guild:${guildId}`).emit(event, data);
    }
}
